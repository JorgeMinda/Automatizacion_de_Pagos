import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function seedDatabase() {
    console.log('🌱 Inicializando datos semilla para Comedor Escolar...');
    // 1. Usuarios (Admin, Cajero, Padre)
    const parentUser = await prisma.user.upsert({
        where: { email: 'padre@colegio.edu.ec' },
        update: {},
        create: {
            email: 'padre@colegio.edu.ec',
            fullName: 'Carlos Mendoza',
            password: 'password123', // En producción: hash bcrypt
            role: 'PADRE'
        }
    });
    const cashierUser = await prisma.user.upsert({
        where: { email: 'cajero@colegio.edu.ec' },
        update: {},
        create: {
            email: 'cajero@colegio.edu.ec',
            fullName: 'María Gómez (Caja 01)',
            password: 'password123',
            role: 'CAJERO'
        }
    });
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@colegio.edu.ec' },
        update: {},
        create: {
            email: 'admin@colegio.edu.ec',
            fullName: 'Administrador General',
            password: 'adminpassword',
            role: 'ADMIN'
        }
    });
    // 2. Estudiantes
    const student1 = await prisma.student.upsert({
        where: { staticCode: 'EST-101' },
        update: {},
        create: {
            parentId: parentUser.id,
            firstName: 'Juan',
            lastName: 'Mendoza',
            gradeSection: '5º EGB - Paralelo B',
            staticCode: 'EST-101',
            qrSeed: 'seed_juan_mendoza_2026',
            walletBalance: 15.50
        }
    });
    const student2 = await prisma.student.upsert({
        where: { staticCode: 'EST-102' },
        update: {},
        create: {
            parentId: parentUser.id,
            firstName: 'Sofía',
            lastName: 'Mendoza',
            gradeSection: '3º BGU - Paralelo A',
            staticCode: 'EST-102',
            qrSeed: 'seed_sofia_mendoza_2026',
            walletBalance: 5.00
        }
    });
    // 3. Alergias Críticas
    await prisma.studentAllergy.createMany({
        data: [
            {
                studentId: student1.id,
                allergen: 'Maní / Frutos Secos',
                description: 'Reacción anafiláctica severa',
                severity: 'CRITICO'
            },
            {
                studentId: student2.id,
                allergen: 'Lactosa',
                description: 'Intolerancia digestiva moderada',
                severity: 'MODERADO'
            }
        ],
        skipDuplicates: true
    });
    // 4. Catálogo de Recetas e Insumos (ERP Pontífico BOM)
    await prisma.menuItemRecipe.upsert({
        where: { skuPontifico: 'PROD-ALM-EJECUTIVO' },
        update: {},
        create: {
            skuPontifico: 'PROD-ALM-EJECUTIVO',
            name: 'Almuerzo Ejecutivo Estándar',
            type: 'PRODUCIDO',
            price: 3.50,
            active: true,
            recipeBOM: [
                { rawMaterialSku: 'RAW-PROTEIN-CHICKEN', quantity: 0.15, unit: 'KG' },
                { rawMaterialSku: 'RAW-GRAIN-RICE', quantity: 0.08, unit: 'KG' },
                { rawMaterialSku: 'RAW-VEG-SALAD', quantity: 0.1, unit: 'KG' }
            ]
        }
    });
    await prisma.menuItemRecipe.upsert({
        where: { skuPontifico: 'PROD-ALM-DIETA' },
        update: {},
        create: {
            skuPontifico: 'PROD-ALM-DIETA',
            name: 'Almuerzo Dieta Hipoalergénico',
            type: 'PRODUCIDO',
            price: 3.50,
            active: true,
            recipeBOM: [
                { rawMaterialSku: 'RAW-PROTEIN-FISH', quantity: 0.15, unit: 'KG' },
                { rawMaterialSku: 'RAW-GRAIN-QUINOA', quantity: 0.08, unit: 'KG' },
                { rawMaterialSku: 'RAW-VEG-STEAMED', quantity: 0.12, unit: 'KG' }
            ]
        }
    });
    await prisma.menuItemRecipe.upsert({
        where: { skuPontifico: 'SIMP-JUGO-NATURAL' },
        update: {},
        create: {
            skuPontifico: 'SIMP-JUGO-NATURAL',
            name: 'Jugo Natural de Naranja 300ml',
            type: 'SIMPLE',
            price: 1.00,
            active: true
        }
    });
    console.log('✅ Base de datos inicializada correctamente con datos de prueba.');
}
if (require.main === module) {
    seedDatabase()
        .catch((e) => {
        console.error(e);
        process.exit(1);
    })
        .finally(async () => {
        await prisma.$disconnect();
    });
}
//# sourceMappingURL=seed.js.map