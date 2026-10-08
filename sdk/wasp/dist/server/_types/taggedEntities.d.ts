import { type Entity, type EntityName, type User, type Student, type StudentAllergy, type Payment, type MealPackage, type MenuItemRecipe, type DeliveryRecord, type LedgerAccount, type LedgerEntry, type AuditLog } from '../../entities/index.js';
export type _User = WithName<User, "User">;
export type _Student = WithName<Student, "Student">;
export type _StudentAllergy = WithName<StudentAllergy, "StudentAllergy">;
export type _Payment = WithName<Payment, "Payment">;
export type _MealPackage = WithName<MealPackage, "MealPackage">;
export type _MenuItemRecipe = WithName<MenuItemRecipe, "MenuItemRecipe">;
export type _DeliveryRecord = WithName<DeliveryRecord, "DeliveryRecord">;
export type _LedgerAccount = WithName<LedgerAccount, "LedgerAccount">;
export type _LedgerEntry = WithName<LedgerEntry, "LedgerEntry">;
export type _AuditLog = WithName<AuditLog, "AuditLog">;
export type _Entity = _User | _Student | _StudentAllergy | _Payment | _MealPackage | _MenuItemRecipe | _DeliveryRecord | _LedgerAccount | _LedgerEntry | _AuditLog | never;
type WithName<E extends Entity, Name extends EntityName> = E & {
    _entityName: Name;
};
export {};
//# sourceMappingURL=taggedEntities.d.ts.map