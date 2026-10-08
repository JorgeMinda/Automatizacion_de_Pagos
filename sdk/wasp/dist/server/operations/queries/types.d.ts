import { type _Student, type _MealPackage, type _StudentAllergy, type _Payment, type _MenuItemRecipe, type _DeliveryRecord, type _LedgerEntry, type _LedgerAccount, type _AuditLog, type AuthenticatedQueryDefinition, type Payload } from '../../_types/index.js';
export type GetParentStudentsBalance<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Student,
    _MealPackage,
    _StudentAllergy,
    _Payment
], Input, Output>;
export type ValidateStudentForPOS<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _Student,
    _MealPackage,
    _StudentAllergy,
    _MenuItemRecipe
], Input, Output>;
export type GetDailyPOSSummary<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _DeliveryRecord,
    _MealPackage,
    _Student
], Input, Output>;
export type GetMenuItemsCatalog<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _MenuItemRecipe
], Input, Output>;
export type GetAdminLedgerAudit<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedQueryDefinition<[
    _LedgerEntry,
    _LedgerAccount,
    _Payment,
    _AuditLog
], Input, Output>;
//# sourceMappingURL=types.d.ts.map