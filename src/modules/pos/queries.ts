import { HttpError } from 'wasp/server';
import type { ValidateStudentForPOS, GetDailyPOSSummary } from 'wasp/server/operations';
import { startOfDay, endOfDay } from 'date-fns';

export const validateStudentForPOS: ValidateStudentForPOS<{ identifier: string }, any> = async (args, context) => {
  if (!context.user || (context.user.role !== 'CAJERO' && context.user.role !== 'ADMIN')) {
    throw new HttpError(403, 'Acceso restringido a operadores de punto de venta.');
  }

  const { identifier } = args;
  if (!identifier || identifier.trim().length === 0) {
    return { student: null, activePackageUnits: 0, walletBalance: 0, hasCriticalAllergy: false };
  }

  const cleanIdentifier = identifier.trim().toUpperCase();

  // Búsqueda por código estático numérico o semilla QR
  const student = await context.entities.Student.findFirst({
    where: {
      OR: [
        { staticCode: cleanIdentifier },
        { qrSeed: cleanIdentifier }
      ]
    },
    include: {
      allergies: true,
      packages: {
        where: { availableUnits: { gt: 0 } },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!student) {
    return { student: null, activePackageUnits: 0, walletBalance: 0, hasCriticalAllergy: false };
  }

  const activePackageUnits = student.packages.reduce((acc, p) => acc + p.availableUnits, 0);
  const hasCriticalAllergy = student.allergies.some((a) => a.severity === 'CRITICO');

  return {
    student: {
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      gradeSection: student.gradeSection,
      photoUrl: student.photoUrl,
      staticCode: student.staticCode,
      walletBalance: Number(student.walletBalance),
      allergies: student.allergies
    },
    activePackageUnits,
    walletBalance: Number(student.walletBalance),
    hasCriticalAllergy
  };
};

export const getDailyPOSSummary: GetDailyPOSSummary<void, any> = async (_args, context) => {
  if (!context.user || (context.user.role !== 'CAJERO' && context.user.role !== 'ADMIN')) {
    throw new HttpError(403, 'Acceso restringido.');
  }

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  // 1. Total entregados hoy
  const deliveriesTodayCount = await context.entities.DeliveryRecord.count({
    where: {
      deliveredAt: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });

  // 2. Total paquetes vigentes
  const activePackages = await context.entities.MealPackage.findMany({
    where: {
      availableUnits: { gt: 0 }
    },
    select: { availableUnits: true }
  });

  const totalPendingUnits = activePackages.reduce((sum, p) => sum + p.availableUnits, 0);

  return {
    totalScheduled: deliveriesTodayCount + totalPendingUnits,
    totalDelivered: deliveriesTodayCount,
    totalPending: totalPendingUnits
  };
};
