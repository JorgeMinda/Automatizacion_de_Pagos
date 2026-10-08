import { type _Payment, type _Student, type _MealPackage, type _LedgerAccount, type _LedgerEntry, type _AuditLog, type _StudentAllergy, type _User, type _DeliveryRecord, type _MenuItemRecipe, type AuthenticatedActionDefinition, type Payload } from '../../_types/index.js';
export type ProcessDirectPayment<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedActionDefinition<[
    _Payment,
    _Student,
    _MealPackage,
    _LedgerAccount,
    _LedgerEntry,
    _AuditLog
], Input, Output>;
export type RegisterStudentForParent<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedActionDefinition<[
    _Student,
    _StudentAllergy
], Input, Output>;
export type SetUserRole<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedActionDefinition<[
    _User
], Input, Output>;
export type DispatchMealConsumption<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedActionDefinition<[
    _DeliveryRecord,
    _Student,
    _MealPackage,
    _MenuItemRecipe,
    _LedgerAccount,
    _LedgerEntry,
    _AuditLog
], Input, Output>;
export type SyncOfflineBatchDeliveries<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedActionDefinition<[
    _DeliveryRecord,
    _Student,
    _MealPackage,
    _MenuItemRecipe,
    _LedgerAccount,
    _LedgerEntry,
    _AuditLog
], Input, Output>;
export type CreateMenuItemRecipe<Input extends Payload = never, Output extends Payload = Payload> = AuthenticatedActionDefinition<[
    _MenuItemRecipe
], Input, Output>;
//# sourceMappingURL=types.d.ts.map