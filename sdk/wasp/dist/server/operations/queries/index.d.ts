import { type AuthenticatedOperationFor } from '../wrappers.js';
import { getParentStudentsBalance as getParentStudentsBalance_ext } from 'wasp/src/modules/payments/queries';
import { validateStudentForPOS as validateStudentForPOS_ext } from 'wasp/src/modules/pos/queries';
import { getDailyPOSSummary as getDailyPOSSummary_ext } from 'wasp/src/modules/pos/queries';
import { getMenuItemsCatalog as getMenuItemsCatalog_ext } from 'wasp/src/modules/inventory/queries';
import { getAdminLedgerAudit as getAdminLedgerAudit_ext } from 'wasp/src/modules/payments/queries';
export type GetParentStudentsBalance_ext = typeof getParentStudentsBalance_ext;
export declare const getParentStudentsBalance: AuthenticatedOperationFor<GetParentStudentsBalance_ext>;
export type ValidateStudentForPOS_ext = typeof validateStudentForPOS_ext;
export declare const validateStudentForPOS: AuthenticatedOperationFor<ValidateStudentForPOS_ext>;
export type GetDailyPOSSummary_ext = typeof getDailyPOSSummary_ext;
export declare const getDailyPOSSummary: AuthenticatedOperationFor<GetDailyPOSSummary_ext>;
export type GetMenuItemsCatalog_ext = typeof getMenuItemsCatalog_ext;
export declare const getMenuItemsCatalog: AuthenticatedOperationFor<GetMenuItemsCatalog_ext>;
export type GetAdminLedgerAudit_ext = typeof getAdminLedgerAudit_ext;
export declare const getAdminLedgerAudit: AuthenticatedOperationFor<GetAdminLedgerAudit_ext>;
//# sourceMappingURL=index.d.ts.map