import { HttpError, prisma } from 'wasp/server';
import { startOfDay, endOfDay } from 'date-fns';
export const validateStudentForPOS = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'No autenticado.');
    }
    // Asegurar que si el usuario tiene nombre o correo de cajero/admin, se actualice el rol
    const user = await prisma.user.findUnique({
        where: { id: context.user.id }
    });
    const { identifier } = args;
    if (!identifier || identifier.trim().length === 0) {
        return { student: null, activePackageUnits: 0, walletBalance: 0, hasCriticalAllergy: false };
    }
    const cleanIdentifier = identifier.trim().toUpperCase();
    const seedPrefix = cleanIdentifier.includes('_') ? cleanIdentifier.split('_')[0] : cleanIdentifier;
    // Búsqueda inteligente por código estático, código QR dinámico, ID o nombre
    const student = await context.entities.Student.findFirst({
        where: {
            OR: [
                { staticCode: { equals: cleanIdentifier, mode: 'insensitive' } },
                { qrSeed: { equals: seedPrefix, mode: 'insensitive' } },
                { id: identifier.trim() },
                { firstName: { contains: cleanIdentifier, mode: 'insensitive' } },
                { lastName: { contains: cleanIdentifier, mode: 'insensitive' } }
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
export const getDailyPOSSummary = async (_args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'No autenticado.');
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
//# sourceMappingURL=queries.js.map