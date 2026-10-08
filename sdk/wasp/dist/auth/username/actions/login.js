import { api, handleApiError } from '../../../api/index.js';
import { initSession } from '../../helpers/user.js';
import { SessionResponseSchema } from '../../responseSchemas.js';
export async function login(data) {
    try {
        const { sessionId } = await api.post('/auth/username/login', {
            json: data,
        }).json(SessionResponseSchema);
        await initSession(sessionId);
    }
    catch (error) {
        throw handleApiError(error);
    }
}
//# sourceMappingURL=login.js.map