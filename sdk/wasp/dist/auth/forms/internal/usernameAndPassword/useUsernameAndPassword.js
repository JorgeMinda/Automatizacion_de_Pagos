import { login, signup } from '../../../username/index.js';
// PRIVATE API
export function useUsernameAndPassword({ onError, onSuccess, isLogin, }) {
    async function handleSubmit(data) {
        try {
            if (!isLogin) {
                await signup(data);
            }
            await login(data);
            onSuccess();
        }
        catch (err) {
            onError(err);
        }
    }
    return {
        handleSubmit,
    };
}
//# sourceMappingURL=useUsernameAndPassword.js.map