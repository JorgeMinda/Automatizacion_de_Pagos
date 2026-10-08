import { api, handleApiError } from '../../../api/index.js';
// PUBLIC API
export async function signup(data) {
    try {
        await api.post('/auth/username/signup', {
            json: data,
        });
    }
    catch (error) {
        throw handleApiError(error);
    }
}
//# sourceMappingURL=signup.js.map