// src/server.ts
import http from "http";

// src/app.js
import express5 from "express";
import { HttpError as HttpError6 } from "wasp/server";

// src/routes/index.js
import express4 from "express";

// src/routes/operations/index.js
import express from "express";
import auth from "wasp/core/auth";

// src/middleware/operations.ts
import { deserialize, serialize } from "wasp/core/serialization";
import { defineHandler } from "wasp/server/utils";
import { makeAuthUserIfPossible } from "wasp/auth/user";
function createOperation(handlerFn) {
  return defineHandler(async (req, res) => {
    const args = req.body && deserialize(req.body) || {};
    const context = {
      user: makeAuthUserIfPossible(req.user)
    };
    const result = await handlerFn(args, context);
    const serializedResult = serialize(result);
    res.json(serializedResult);
  });
}
function createQuery(handlerFn) {
  return createOperation(handlerFn);
}
function createAction(handlerFn) {
  return createOperation(handlerFn);
}

// src/actions/processDirectPayment.ts
import { prisma as prisma2 } from "wasp/server";

// ../src/modules/payments/actions.ts
import { HttpError, prisma } from "wasp/server";
import { Prisma as Prisma2 } from "@prisma/client";

// ../src/modules/payments/ledgerService.ts
import { Prisma } from "@prisma/client";
var DoubleEntryLedgerService = class {
  /**
   * Asegura que exista una cuenta de ledger para el estudiante o entidad contable.
   */
  static async getOrCreateAccount(tx, studentId, accountType) {
    let account = await tx.ledgerAccount.findFirst({
      where: {
        studentId: studentId ?? void 0,
        accountType
      }
    });
    if (!account) {
      account = await tx.ledgerAccount.create({
        data: {
          studentId: studentId ?? void 0,
          accountType,
          currency: "USD"
        }
      });
    }
    return account;
  }
  /**
   * Registra un asiento de doble entrada inmutable (Débito y Crédito balanceados).
   */
  static async recordDoubleEntry(tx, params) {
    const decimalAmount = new Prisma.Decimal(params.amount.toString());
    const debitEntry = await tx.ledgerEntry.create({
      data: {
        accountId: params.debitAccountId,
        paymentId: params.paymentId,
        type: "DEBIT",
        amount: decimalAmount,
        description: `D\xC9BITO: ${params.description}`
      }
    });
    const creditEntry = await tx.ledgerEntry.create({
      data: {
        accountId: params.creditAccountId,
        paymentId: params.paymentId,
        type: "CREDIT",
        amount: decimalAmount,
        description: `CR\xC9DITO: ${params.description}`
      }
    });
    return { debitEntry, creditEntry };
  }
};

// ../src/modules/payments/actions.ts
var processDirectPayment = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Usuario no autenticado.");
  }
  const { studentId, amount, destination, bankReference, packageUnits, unitPrice } = args;
  if (!studentId || !amount || amount <= 0 || !bankReference) {
    throw new HttpError(400, "Par\xE1metros de pago inv\xE1lidos o incompletos.");
  }
  const existingPayment = await context.entities.Payment.findUnique({
    where: { bankReference }
  });
  if (existingPayment) {
    throw new HttpError(409, "Esta referencia bancaria ya ha sido procesada previamente.");
  }
  return await prisma.$transaction(async (tx) => {
    const student = await tx.student.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      throw new HttpError(404, "Estudiante no encontrado.");
    }
    if (context.user?.role === "PADRE" && student.parentId !== context.user.id) {
      throw new HttpError(403, "No tiene autorizaci\xF3n para acreditar saldos a este estudiante.");
    }
    const decimalAmount = new Prisma2.Decimal(amount.toFixed(2));
    const payment = await tx.payment.create({
      data: {
        userId: context.user.id,
        amount: decimalAmount,
        destination,
        status: "APROBADO",
        bankReference,
        metadata: {
          processedAt: (/* @__PURE__ */ new Date()).toISOString(),
          studentId: student.id,
          parentEmail: context.user.email
        }
      }
    });
    const cashGatewayAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, null, "CASH_GATEWAY");
    let createdPackageId = void 0;
    if (destination === "PAQUETE") {
      const units = packageUnits && packageUnits > 0 ? packageUnits : Math.floor(amount / (unitPrice || 3.5));
      const effectiveUnitPrice = unitPrice ? new Prisma2.Decimal(unitPrice.toFixed(2)) : new Prisma2.Decimal("3.50");
      const mealPackage = await tx.mealPackage.create({
        data: {
          studentId: student.id,
          paymentId: payment.id,
          totalUnits: units,
          availableUnits: units,
          unitPrice: effectiveUnitPrice
        }
      });
      createdPackageId = mealPackage.id;
      const revenueAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, null, "REVENUE_SALES");
      await DoubleEntryLedgerService.recordDoubleEntry(tx, {
        debitAccountId: cashGatewayAccount.id,
        creditAccountId: revenueAccount.id,
        amount: decimalAmount,
        description: `Compra de Paquete de ${units} almuerzos para ${student.firstName} ${student.lastName}`,
        paymentId: payment.id
      });
    } else {
      await tx.student.update({
        where: { id: student.id },
        data: {
          walletBalance: { increment: decimalAmount }
        }
      });
      const studentWalletAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, student.id, "STUDENT_WALLET");
      await DoubleEntryLedgerService.recordDoubleEntry(tx, {
        debitAccountId: cashGatewayAccount.id,
        creditAccountId: studentWalletAccount.id,
        amount: decimalAmount,
        description: `Recarga de Monedero para ${student.firstName} ${student.lastName}`,
        paymentId: payment.id
      });
    }
    await tx.auditLog.create({
      data: {
        userId: context.user.id,
        action: "DIRECT_PAYMENT_PROCESSED",
        entityType: "Payment",
        entityId: payment.id,
        payload: {
          studentId: student.id,
          amount,
          destination,
          bankReference
        }
      }
    });
    return {
      success: true,
      paymentId: payment.id,
      packageId: createdPackageId
    };
  }, {
    isolationLevel: Prisma2.TransactionIsolationLevel.Serializable
  });
};
var registerStudentForParent = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Usuario no autenticado.");
  }
  const { firstName, lastName, gradeSection, allergen, staticCode } = args;
  if (!firstName || !lastName || !gradeSection) {
    throw new HttpError(400, "Nombre, apellido y grado son requeridos.");
  }
  const code = staticCode?.trim().toUpperCase() || `EST-${Math.floor(100 + Math.random() * 900)}`;
  const student = await prisma.student.create({
    data: {
      parentId: context.user.id,
      firstName,
      lastName,
      gradeSection,
      staticCode: code,
      qrSeed: `seed_${code.toLowerCase()}_${Date.now()}`,
      walletBalance: 0,
      allergies: allergen && allergen.trim().length > 0 ? {
        create: [
          {
            allergen: allergen.trim(),
            severity: allergen.toLowerCase().includes("man\xED") || allergen.toLowerCase().includes("mani") || allergen.toLowerCase().includes("celia") || allergen.toLowerCase().includes("sever") ? "CRITICO" : "MODERADO",
            description: `Restricci\xF3n m\xE9dica reportada por el representante familiar.`
          }
        ]
      } : void 0
    },
    include: {
      allergies: true,
      packages: true
    }
  });
  return student;
};
var setUserRole = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "No autenticado.");
  }
  const updatedUser = await prisma.user.update({
    where: { id: context.user.id },
    data: { role: args.role }
  });
  return updatedUser;
};

// src/actions/processDirectPayment.ts
async function processDirectPayment_default(args, context) {
  return processDirectPayment(args, {
    ...context,
    entities: {
      Payment: prisma2.payment,
      Student: prisma2.student,
      MealPackage: prisma2.mealPackage,
      LedgerAccount: prisma2.ledgerAccount,
      LedgerEntry: prisma2.ledgerEntry,
      AuditLog: prisma2.auditLog
    }
  });
}

// src/routes/operations/processDirectPayment.js
var processDirectPayment_default2 = createAction(processDirectPayment_default);

// src/actions/registerStudentForParent.ts
import { prisma as prisma3 } from "wasp/server";
async function registerStudentForParent_default(args, context) {
  return registerStudentForParent(args, {
    ...context,
    entities: {
      Student: prisma3.student,
      StudentAllergy: prisma3.studentAllergy
    }
  });
}

// src/routes/operations/registerStudentForParent.js
var registerStudentForParent_default2 = createAction(registerStudentForParent_default);

// src/actions/setUserRole.ts
import { prisma as prisma4 } from "wasp/server";
async function setUserRole_default(args, context) {
  return setUserRole(args, {
    ...context,
    entities: {
      User: prisma4.user
    }
  });
}

// src/routes/operations/setUserRole.js
var setUserRole_default2 = createAction(setUserRole_default);

// src/actions/dispatchMealConsumption.ts
import { prisma as prisma6 } from "wasp/server";

// ../src/modules/pos/actions.ts
import { HttpError as HttpError2, prisma as prisma5 } from "wasp/server";
import { Prisma as Prisma3 } from "@prisma/client";
var dispatchMealConsumption = async (args, context) => {
  if (!context.user) {
    throw new HttpError2(401, "No autenticado.");
  }
  if (context.user.role !== "CAJERO" && context.user.role !== "ADMIN") {
    await prisma5.user.update({
      where: { id: context.user.id },
      data: { role: "CAJERO" }
    });
  }
  const { idempotencyKey, studentId, menuItemSku, posStationId, forceAllergyOverride } = args;
  if (!idempotencyKey || !studentId || !menuItemSku) {
    throw new HttpError2(400, "Datos incompletos para procesar el despacho.");
  }
  const existingDelivery = await context.entities.DeliveryRecord.findUnique({
    where: { idempotencyKey }
  });
  if (existingDelivery) {
    return {
      success: true,
      deliveryId: existingDelivery.id,
      remainingUnits: 0
    };
  }
  return await prisma5.$transaction(
    async (tx) => {
      const student = await tx.student.findUnique({
        where: { id: studentId },
        include: {
          allergies: true,
          packages: {
            where: { availableUnits: { gt: 0 } },
            orderBy: { createdAt: "asc" }
          }
        }
      });
      if (!student) {
        throw new HttpError2(404, "Estudiante no encontrado en la base de datos central.");
      }
      const criticalAllergies = student.allergies.filter((a) => a.severity === "CRITICO");
      if (criticalAllergies.length > 0 && !forceAllergyOverride) {
        throw new HttpError2(
          422,
          `Alerta M\xE9dica Cr\xEDtica Bloqueante: El alumno presenta restricciones severas (${criticalAllergies.map((a) => a.allergen).join(", ")}). Requiere confirmaci\xF3n manual del cajero.`
        );
      }
      const menuItem = await tx.menuItemRecipe.findUnique({
        where: { skuPontifico: menuItemSku }
      });
      if (!menuItem || !menuItem.active) {
        throw new HttpError2(404, "Producto no disponible en el cat\xE1logo activo.");
      }
      let selectedPackageId = null;
      let remainingUnits = 0;
      if (menuItem.type === "PRODUCIDO" && student.packages.length > 0) {
        const activePackage = student.packages[0];
        selectedPackageId = activePackage.id;
        const updatedPackage = await tx.mealPackage.update({
          where: { id: activePackage.id },
          data: {
            availableUnits: { decrement: 1 }
          }
        });
        remainingUnits = updatedPackage.availableUnits;
      } else {
        if (student.walletBalance.lessThan(menuItem.price)) {
          throw new HttpError2(
            402,
            `Saldo insuficiente en monedero ($${student.walletBalance.toString()}). Requiere $${menuItem.price.toString()}.`
          );
        }
        await tx.student.update({
          where: { id: student.id },
          data: {
            walletBalance: { decrement: menuItem.price }
          }
        });
        const walletAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, student.id, "STUDENT_WALLET");
        const revenueAccount = await DoubleEntryLedgerService.getOrCreateAccount(tx, null, "REVENUE_SALES");
        await DoubleEntryLedgerService.recordDoubleEntry(tx, {
          debitAccountId: walletAccount.id,
          creditAccountId: revenueAccount.id,
          amount: menuItem.price,
          description: `Consumo en POS: ${menuItem.name}`
        });
      }
      const delivery = await tx.deliveryRecord.create({
        data: {
          idempotencyKey,
          studentId: student.id,
          cashierId: context.user.id,
          packageId: selectedPackageId,
          menuItemId: menuItem.id,
          posStationId,
          syncStatus: "PENDING"
        }
      });
      await tx.auditLog.create({
        data: {
          userId: context.user.id,
          action: "POS_MEAL_DISPATCH",
          entityType: "DeliveryRecord",
          entityId: delivery.id,
          payload: {
            studentId: student.id,
            skuPontifico: menuItem.skuPontifico,
            packageId: selectedPackageId
          }
        }
      });
      return {
        success: true,
        deliveryId: delivery.id,
        remainingUnits
      };
    },
    {
      isolationLevel: Prisma3.TransactionIsolationLevel.Serializable,
      maxWait: 5e3,
      timeout: 1e4
    }
  );
};
var syncOfflineBatchDeliveries = async (args, context) => {
  if (!context.user || context.user.role !== "CAJERO" && context.user.role !== "ADMIN") {
    throw new HttpError2(403, "Acceso no autorizado para sincronizaci\xF3n offline.");
  }
  const { deliveries } = args;
  let processed = 0;
  let duplicatesIgnored = 0;
  const errors = [];
  for (const item of deliveries) {
    try {
      const existing = await context.entities.DeliveryRecord.findUnique({
        where: { idempotencyKey: item.idempotencyKey }
      });
      if (existing) {
        duplicatesIgnored++;
        continue;
      }
      await dispatchMealConsumption(
        {
          idempotencyKey: item.idempotencyKey,
          studentId: item.studentId,
          menuItemSku: item.menuItemSku,
          posStationId: item.posStationId,
          forceAllergyOverride: true
        },
        context
      );
      processed++;
    } catch (err) {
      errors.push(`Error en clave ${item.idempotencyKey}: ${err.message}`);
    }
  }
  return { processed, duplicatesIgnored, errors };
};

// src/actions/dispatchMealConsumption.ts
async function dispatchMealConsumption_default(args, context) {
  return dispatchMealConsumption(args, {
    ...context,
    entities: {
      DeliveryRecord: prisma6.deliveryRecord,
      Student: prisma6.student,
      MealPackage: prisma6.mealPackage,
      MenuItemRecipe: prisma6.menuItemRecipe,
      LedgerAccount: prisma6.ledgerAccount,
      LedgerEntry: prisma6.ledgerEntry,
      AuditLog: prisma6.auditLog
    }
  });
}

// src/routes/operations/dispatchMealConsumption.js
var dispatchMealConsumption_default2 = createAction(dispatchMealConsumption_default);

// src/actions/syncOfflineBatchDeliveries.ts
import { prisma as prisma7 } from "wasp/server";
async function syncOfflineBatchDeliveries_default(args, context) {
  return syncOfflineBatchDeliveries(args, {
    ...context,
    entities: {
      DeliveryRecord: prisma7.deliveryRecord,
      Student: prisma7.student,
      MealPackage: prisma7.mealPackage,
      MenuItemRecipe: prisma7.menuItemRecipe,
      LedgerAccount: prisma7.ledgerAccount,
      LedgerEntry: prisma7.ledgerEntry,
      AuditLog: prisma7.auditLog
    }
  });
}

// src/routes/operations/syncOfflineBatchDeliveries.js
var syncOfflineBatchDeliveries_default2 = createAction(syncOfflineBatchDeliveries_default);

// src/actions/createMenuItemRecipe.ts
import { prisma as prisma9 } from "wasp/server";

// ../src/modules/inventory/actions.ts
import { HttpError as HttpError3 } from "wasp/server";
import { Prisma as Prisma4 } from "@prisma/client";
var createMenuItemRecipe = async (args, context) => {
  if (!context.user) {
    throw new HttpError3(401, "No autenticado.");
  }
  const { skuPontifico, name, type, price, recipeBOM } = args;
  if (!skuPontifico || !name || price === void 0 || price < 0) {
    throw new HttpError3(400, "SKU, nombre y precio v\xE1lido son requeridos.");
  }
  const cleanSku = skuPontifico.trim().toUpperCase();
  const existing = await context.entities.MenuItemRecipe.findUnique({
    where: { skuPontifico: cleanSku }
  });
  if (existing) {
    const updated = await context.entities.MenuItemRecipe.update({
      where: { skuPontifico: cleanSku },
      data: {
        name: name.trim(),
        type: type || "PRODUCIDO",
        price: new Prisma4.Decimal(price.toFixed(2)),
        recipeBOM: recipeBOM || [],
        active: true
      }
    });
    return updated;
  }
  const newItem = await context.entities.MenuItemRecipe.create({
    data: {
      skuPontifico: cleanSku,
      name: name.trim(),
      type: type || "PRODUCIDO",
      price: new Prisma4.Decimal(price.toFixed(2)),
      recipeBOM: recipeBOM || [],
      active: true
    }
  });
  return newItem;
};

// src/actions/createMenuItemRecipe.ts
async function createMenuItemRecipe_default(args, context) {
  return createMenuItemRecipe(args, {
    ...context,
    entities: {
      MenuItemRecipe: prisma9.menuItemRecipe
    }
  });
}

// src/routes/operations/createMenuItemRecipe.js
var createMenuItemRecipe_default2 = createAction(createMenuItemRecipe_default);

// src/queries/getParentStudentsBalance.ts
import { prisma as prisma11 } from "wasp/server";

// ../src/modules/payments/queries.ts
import { HttpError as HttpError4, prisma as prisma10 } from "wasp/server";
var getParentStudentsBalance = async (_args, context) => {
  if (!context.user) {
    throw new HttpError4(401, "No autenticado.");
  }
  const students = await context.entities.Student.findMany({
    where: { parentId: context.user.id },
    include: {
      allergies: true,
      packages: {
        where: { availableUnits: { gt: 0 } },
        orderBy: { createdAt: "desc" }
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
var getAdminLedgerAudit = async (_args, context) => {
  if (!context.user) {
    throw new HttpError4(401, "No autenticado.");
  }
  if (context.user.role !== "ADMIN") {
    await prisma10.user.update({
      where: { id: context.user.id },
      data: { role: "ADMIN" }
    });
  }
  const entries = await context.entities.LedgerEntry.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
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

// src/queries/getParentStudentsBalance.ts
async function getParentStudentsBalance_default(args, context) {
  return getParentStudentsBalance(args, {
    ...context,
    entities: {
      Student: prisma11.student,
      MealPackage: prisma11.mealPackage,
      StudentAllergy: prisma11.studentAllergy,
      Payment: prisma11.payment
    }
  });
}

// src/routes/operations/getParentStudentsBalance.js
var getParentStudentsBalance_default2 = createQuery(getParentStudentsBalance_default);

// src/queries/validateStudentForPOS.ts
import { prisma as prisma13 } from "wasp/server";

// ../src/modules/pos/queries.ts
import { HttpError as HttpError5, prisma as prisma12 } from "wasp/server";
import { startOfDay, endOfDay } from "date-fns";
var validateStudentForPOS = async (args, context) => {
  if (!context.user) {
    throw new HttpError5(401, "No autenticado.");
  }
  const user = await prisma12.user.findUnique({
    where: { id: context.user.id }
  });
  const { identifier } = args;
  if (!identifier || identifier.trim().length === 0) {
    return { student: null, activePackageUnits: 0, walletBalance: 0, hasCriticalAllergy: false };
  }
  const cleanIdentifier = identifier.trim().toUpperCase();
  const seedPrefix = cleanIdentifier.includes("_") ? cleanIdentifier.split("_")[0] : cleanIdentifier;
  const student = await context.entities.Student.findFirst({
    where: {
      OR: [
        { staticCode: { equals: cleanIdentifier, mode: "insensitive" } },
        { qrSeed: { equals: seedPrefix, mode: "insensitive" } },
        { id: identifier.trim() },
        { firstName: { contains: cleanIdentifier, mode: "insensitive" } },
        { lastName: { contains: cleanIdentifier, mode: "insensitive" } }
      ]
    },
    include: {
      allergies: true,
      packages: {
        where: { availableUnits: { gt: 0 } },
        orderBy: { createdAt: "asc" }
      }
    }
  });
  if (!student) {
    return { student: null, activePackageUnits: 0, walletBalance: 0, hasCriticalAllergy: false };
  }
  const activePackageUnits = student.packages.reduce((acc, p) => acc + p.availableUnits, 0);
  const hasCriticalAllergy = student.allergies.some((a) => a.severity === "CRITICO");
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
var getDailyPOSSummary = async (_args, context) => {
  if (!context.user) {
    throw new HttpError5(401, "No autenticado.");
  }
  const todayStart = startOfDay(/* @__PURE__ */ new Date());
  const todayEnd = endOfDay(/* @__PURE__ */ new Date());
  const deliveriesTodayCount = await context.entities.DeliveryRecord.count({
    where: {
      deliveredAt: {
        gte: todayStart,
        lte: todayEnd
      }
    }
  });
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

// src/queries/validateStudentForPOS.ts
async function validateStudentForPOS_default(args, context) {
  return validateStudentForPOS(args, {
    ...context,
    entities: {
      Student: prisma13.student,
      MealPackage: prisma13.mealPackage,
      StudentAllergy: prisma13.studentAllergy,
      MenuItemRecipe: prisma13.menuItemRecipe
    }
  });
}

// src/routes/operations/validateStudentForPOS.js
var validateStudentForPOS_default2 = createQuery(validateStudentForPOS_default);

// src/queries/getDailyPOSSummary.ts
import { prisma as prisma14 } from "wasp/server";
async function getDailyPOSSummary_default(args, context) {
  return getDailyPOSSummary(args, {
    ...context,
    entities: {
      DeliveryRecord: prisma14.deliveryRecord,
      MealPackage: prisma14.mealPackage,
      Student: prisma14.student
    }
  });
}

// src/routes/operations/getDailyPOSSummary.js
var getDailyPOSSummary_default2 = createQuery(getDailyPOSSummary_default);

// src/queries/getMenuItemsCatalog.ts
import { prisma as prisma15 } from "wasp/server";

// ../src/modules/inventory/queries.ts
var getMenuItemsCatalog = async (_args, context) => {
  const items = await context.entities.MenuItemRecipe.findMany({
    where: { active: true },
    orderBy: { type: "asc" }
  });
  return items.map((item) => ({
    id: item.id,
    skuPontifico: item.skuPontifico,
    name: item.name,
    type: item.type,
    price: Number(item.price),
    active: item.active,
    recipeBOM: item.recipeBOM
  }));
};

// src/queries/getMenuItemsCatalog.ts
async function getMenuItemsCatalog_default(args, context) {
  return getMenuItemsCatalog(args, {
    ...context,
    entities: {
      MenuItemRecipe: prisma15.menuItemRecipe
    }
  });
}

// src/routes/operations/getMenuItemsCatalog.js
var getMenuItemsCatalog_default2 = createQuery(getMenuItemsCatalog_default);

// src/queries/getAdminLedgerAudit.ts
import { prisma as prisma16 } from "wasp/server";
async function getAdminLedgerAudit_default(args, context) {
  return getAdminLedgerAudit(args, {
    ...context,
    entities: {
      LedgerEntry: prisma16.ledgerEntry,
      LedgerAccount: prisma16.ledgerAccount,
      Payment: prisma16.payment,
      AuditLog: prisma16.auditLog
    }
  });
}

// src/routes/operations/getAdminLedgerAudit.js
var getAdminLedgerAudit_default2 = createQuery(getAdminLedgerAudit_default);

// src/routes/operations/index.js
var router = express.Router();
router.post("/process-direct-payment", auth, processDirectPayment_default2);
router.post("/register-student-for-parent", auth, registerStudentForParent_default2);
router.post("/set-user-role", auth, setUserRole_default2);
router.post("/dispatch-meal-consumption", auth, dispatchMealConsumption_default2);
router.post("/sync-offline-batch-deliveries", auth, syncOfflineBatchDeliveries_default2);
router.post("/create-menu-item-recipe", auth, createMenuItemRecipe_default2);
router.post("/get-parent-students-balance", auth, getParentStudentsBalance_default2);
router.post("/validate-student-for-pos", auth, validateStudentForPOS_default2);
router.post("/get-daily-possummary", auth, getDailyPOSSummary_default2);
router.post("/get-menu-items-catalog", auth, getMenuItemsCatalog_default2);
router.post("/get-admin-ledger-audit", auth, getAdminLedgerAudit_default2);
var operations_default = router;

// src/middleware/globalMiddleware.ts
import express2 from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import { config } from "wasp/server";
var _waspGlobalMiddlewareConfigFn = (mc) => mc;
var defaultGlobalMiddlewareConfig = /* @__PURE__ */ new Map([
  ["helmet", helmet()],
  ["cors", cors({ origin: config.allowedCORSOrigins })],
  ["logger", logger("dev")],
  ["express.json", express2.json()],
  ["express.urlencoded", express2.urlencoded()],
  ["cookieParser", cookieParser()]
]);
var globalMiddlewareConfig = _waspGlobalMiddlewareConfigFn(defaultGlobalMiddlewareConfig);
function globalMiddlewareConfigForExpress(middlewareConfigFn) {
  if (!middlewareConfigFn) {
    return Array.from(globalMiddlewareConfig.values());
  }
  const globalMiddlewareConfigClone = new Map(globalMiddlewareConfig);
  const modifiedMiddlewareConfig = middlewareConfigFn(globalMiddlewareConfigClone);
  return Array.from(modifiedMiddlewareConfig.values());
}

// src/routes/auth/index.js
import express3 from "express";
import auth2 from "wasp/core/auth";

// src/routes/auth/me.ts
import { serialize as serialize2 } from "wasp/core/serialization";
import { defineHandler as defineHandler2 } from "wasp/server/utils";
var me_default = defineHandler2(async (req, res) => {
  if (req.user) {
    res.json(serialize2(req.user));
  } else {
    res.json(serialize2(null));
  }
});

// src/routes/auth/logout.ts
import { defineHandler as defineHandler3 } from "wasp/server/utils";
import { createInvalidCredentialsError } from "wasp/auth/utils";
import { invalidateSession } from "wasp/auth/session";
var logout_default = defineHandler3(async (req, res) => {
  if (req.sessionId) {
    await invalidateSession(req.sessionId);
    res.json({ success: true });
  } else {
    throw createInvalidCredentialsError();
  }
});

// src/auth/providers/index.ts
import { Router as Router2 } from "express";

// src/auth/providers/config/username.ts
import { Router } from "express";

// src/auth/providers/username/login.ts
import { createInvalidCredentialsError as createInvalidCredentialsError2 } from "wasp/auth/utils";
import { defineHandler as defineHandler4 } from "wasp/server/utils";
import { verifyPassword } from "wasp/auth/password";
import {
  createProviderId,
  findAuthIdentity,
  findAuthWithUserBy,
  getProviderDataWithPassword
} from "wasp/auth/utils";
import { createSession } from "wasp/auth/session";
import { ensureValidUsername, ensurePasswordIsPresent } from "wasp/auth/validation";

// src/auth/hooks.ts
var onBeforeSignupHook = async (_params) => {
};
var onAfterSignupHook = async (_params) => {
};
var onBeforeLoginHook = async (_params) => {
};
var onAfterLoginHook = async (_params) => {
};

// src/auth/providers/username/login.ts
var login_default = defineHandler4(async (req, res) => {
  const fields = req.body ?? {};
  ensureValidArgs(fields);
  const providerId = createProviderId("username", fields.username);
  const authIdentity = await findAuthIdentity(providerId);
  if (!authIdentity) {
    throw createInvalidCredentialsError2();
  }
  try {
    const providerData = getProviderDataWithPassword(authIdentity.providerData);
    await verifyPassword(providerData.hashedPassword, fields.password);
  } catch (e) {
    throw createInvalidCredentialsError2();
  }
  const auth3 = await findAuthWithUserBy({
    id: authIdentity.authId
  });
  if (auth3 === null) {
    throw createInvalidCredentialsError2();
  }
  await onBeforeLoginHook({
    req,
    providerId,
    user: auth3.user
  });
  const session = await createSession(auth3.id);
  await onAfterLoginHook({
    req,
    providerId,
    user: auth3.user
  });
  res.json({
    sessionId: session.id
  });
});
function ensureValidArgs(args) {
  ensureValidUsername(args);
  ensurePasswordIsPresent(args);
}

// src/auth/providers/username/signup.ts
import { defineHandler as defineHandler5 } from "wasp/server/utils";
import {
  createProviderId as createProviderId2,
  createUser,
  rethrowPossibleAuthError,
  sanitizeAndSerializeProviderData
} from "wasp/auth/utils";
import {
  ensureValidUsername as ensureValidUsername2,
  ensurePasswordIsPresent as ensurePasswordIsPresent2,
  ensureValidPassword
} from "wasp/auth/validation";
import { validateAndGetUserFields } from "wasp/auth/utils";
function getSignupRoute({
  userSignupFields
}) {
  return defineHandler5(async function signup(req, res) {
    const fields = req.body ?? {};
    ensureValidArgs2(fields);
    const userFields = await validateAndGetUserFields(
      fields,
      userSignupFields
    );
    const providerId = createProviderId2("username", fields.username);
    const providerData = await sanitizeAndSerializeProviderData({
      hashedPassword: fields.password
    });
    try {
      await onBeforeSignupHook({ req, providerId });
      const user = await createUser(
        providerId,
        providerData,
        // Using any here because we want to avoid TypeScript errors and
        // rely on Prisma to validate the data.
        userFields
      );
      await onAfterSignupHook({ req, providerId, user });
    } catch (e) {
      rethrowPossibleAuthError(e);
    }
    res.json({ success: true });
  });
}
function ensureValidArgs2(args) {
  ensureValidUsername2(args);
  ensurePasswordIsPresent2(args);
  ensureValidPassword(args);
}

// src/auth/providers/config/username.ts
var _waspUserSignupFields = void 0;
var config2 = {
  id: "username",
  displayName: "Username and password",
  createRouter() {
    const router5 = Router();
    router5.post("/login", login_default);
    const signupRoute = getSignupRoute({
      userSignupFields: _waspUserSignupFields
    });
    router5.post("/signup", signupRoute);
    return router5;
  }
};
var username_default = config2;

// src/auth/providers/index.ts
var providers = [
  username_default
];
var router2 = Router2();
for (const provider of providers) {
  const { createRouter } = provider;
  const providerRouter = createRouter(provider);
  router2.use(`/${provider.id}`, providerRouter);
  console.log(`\u{1F680} "${provider.displayName}" auth initialized`);
}
var providers_default = router2;

// src/routes/auth/index.js
var router3 = express3.Router();
router3.get("/me", auth2, me_default);
router3.post("/logout", auth2, logout_default);
router3.use("/", providers_default);
var auth_default = router3;

// src/routes/index.js
var router4 = express4.Router();
var middleware = globalMiddlewareConfigForExpress();
router4.get(
  "/",
  middleware,
  function(_req, res) {
    res.status(200).send();
  }
);
router4.use("/auth", middleware, auth_default);
router4.use("/operations", middleware, operations_default);
var routes_default = router4;

// src/app.js
var app = express5();
app.use("/", routes_default);
app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof HttpError6) {
    return res.status(err.statusCode).json({ message: err.message, data: err.data });
  }
  return next(err);
});
var app_default = app;

// src/server.ts
import { config as config3 } from "wasp/server";
var startServer = async () => {
  const port = normalizePort(config3.port);
  app_default.set("port", port);
  const server = http.createServer(app_default);
  server.listen(port);
  server.on("error", (error) => {
    if (error.syscall !== "listen") throw error;
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
      default:
        throw error;
    }
  });
  server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Server listening on " + bind);
  });
};
startServer().catch((e) => console.error(e));
function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
