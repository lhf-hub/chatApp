import { httpRq } from "../axios/configs";
import { User } from "../models/User";

export const user = {
    register: async (id: string, password: string, verificationCode: string) => {
        const res = await httpRq.post('/register', {
            id, // 邮箱
            password,
            verificationCode
        });
        return res;
    },
    login: async (id: string, password: string) => {
        const res = await httpRq.get(`login/${id}/${password}`);
        return res;
    },
    sendVerificationCode: async (id: string) => {
        const res = await httpRq.post(`/sendVerificationCode/${id}`);
        return res;
    },
    updateUser: async (id: string, name: string | null, profilePicture: Array<any> | null, password: string | null) => {
        const res = await httpRq.put(`/user/${id}`, { id, name, profilePicture, password });
        return res;
    },
    deleteUser: async (id: string) => {
        const res = await httpRq.delete(`/user/${id}`);
        return res;
    },
    getUserById: async (id: string) => {
        const res = await httpRq.get(`/user/${id}`);
        return res;
    },
    getUsersByNameOrId: async (id: string, nameOrId: string) => {
        const res = await httpRq.get(`/user/nameOrId/${id}/${nameOrId}`);
        return res;
    }
}
