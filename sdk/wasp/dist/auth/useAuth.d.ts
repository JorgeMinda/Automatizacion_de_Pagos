import type { Query } from '../client/operations/rpc.js';
import type { AuthUser } from '../server/auth/user.js';
import { UseQueryResult } from '@tanstack/react-query';
export declare const getMe: Query<void, AuthUser | null>;
export default function useAuth(): UseQueryResult<AuthUser | null>;
//# sourceMappingURL=useAuth.d.ts.map