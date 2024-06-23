import { httpRq } from "../axios/configs"

export const friend = {
    getFirendsById: async (userId: string) => {
        const res = await httpRq.get(`/friend/${userId}`);
        return res;
    },
    getFirendById: async (userId: string, friendId: string) => {
        const res = await httpRq.get(`/friend/${userId}/${friendId}`);
        return res;
    },
    addFriend: async (userId: string, friendId: string) => {
        const res = await httpRq.post(`/friend`, {
            userId,
            friendId
        });
        return res;
    },
    acceptFriend: async (userId: string, friendId: string) => {
        const res = await httpRq.put(`/friend/accept`, {
            userId,
            friendId
        });
        return res;
    },
    rejectFriend: async (userId: string, friendId: string) => {
        const res = await httpRq.put(`/friend/reject`, {
            userId,
            friendId
        });
        return res;
    },
    blockFriend: async (userId: string, friendId: string) => {
        const res = await httpRq.put(`/friend/block`, {
            userId,
            friendId
        });
        return res;
    },
    deleteFriend: async (userId: string, friendId: string) => {
        const res = await httpRq.delete(`/friend/${userId}/${friendId}`);
        return res;
    },
    unblockFriend: async (userId: string, friendId: string) => {
        const res = await httpRq.put(`/friend/unblock`, {
            userId,
            friendId
        });
        return res;
    }
}