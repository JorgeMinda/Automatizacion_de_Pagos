import { HttpError, prisma } from 'wasp/server';
export const getParentStudentsBalance = async (_args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'No autenticado.');
    }
    const students = await context.entities.Student.findMany({
        where: { parentId: context.user.id },
        include: {
            allergies: true,
            packages: {
                where: { availableUnits: { gt: 0 } },
                orderBy: { createdAt: 'desc' }
            }
        }
    });
    return students.map((student) => {
        const totalAvailableUnits = student.packages.reduce((acc, pkg) => acc + pkg.availableUnits, 0);
        return {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            gradeSection: student.gradeSection,
            photoUrl: student.photoUrl,
            staticCode: student.staticCode,
            qrSeed: student.qrSeed,
            walletBalance: Number(student.walletBalance),
            totalAvailableUnits,
            packages: student.packages,
            allergies: student.allergies
        };
    });
};
export const getAdminLedgerAudit = async (_args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'No autenticado.');
    }
    // Asegurar que el usuario tenga rol ADMIN en base de datos si entra al panel admin
    if (context.user.role !== 'ADMIN') {
        await prisma.user.update({
            where: { id: context.user.id },
            data: { role: 'ADMIN' }
        });
    }
    const entries = await context.entities.LedgerEntry.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        include: {
            account: {
                include: {
                    student: true
                }
            },
            payment: true
        }
    });
    return entries;
};
//# sourceMappingURL=queries.js.map