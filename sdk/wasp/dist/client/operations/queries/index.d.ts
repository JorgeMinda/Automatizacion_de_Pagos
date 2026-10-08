import { type QueryFor } from './core';
import type { GetParentStudentsBalance_ext } from '../../../server/operations/queries/index.js';
import type { ValidateStudentForPOS_ext } from '../../../server/operations/queries/index.js';
import type { GetDailyPOSSummary_ext } from '../../../server/operations/queries/index.js';
import type { GetMenuItemsCatalog_ext } from '../../../server/operations/queries/index.js';
import type { GetAdminLedgerAudit_ext } from '../../../server/operations/queries/index.js';
export declare const getParentStudentsBalance: QueryFor<GetParentStudentsBalance_ext>;
export declare const validateStudentForPOS: QueryFor<ValidateStudentForPOS_ext>;
export declare const getDailyPOSSummary: QueryFor<GetDailyPOSSummary_ext>;
export declare const getMenuItemsCatalog: QueryFor<GetMenuItemsCatalog_ext>;
export declare const getAdminLedgerAudit: QueryFor<GetAdminLedgerAudit_ext>;
export { buildAndRegisterQuery } from './core';
//# sourceMappingURL=index.d.ts.map