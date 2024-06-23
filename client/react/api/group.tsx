import { httpRq } from "../axios/configs"

export const group = {
    getGroupById: async (id: string) => {
        const res = await httpRq.get(`/group/${id}`);
        return res;
    },
    getGroupsByOwnerId: async (userId: string) => {
        const res = await httpRq.get(`/group/owned/${userId}`);
        return res;
    },
    getGroupsByMemberId: async (userId: string) => {
        const res = await httpRq.get(`/group/joined/${userId}`);
        return res;
    },
    getGroupsByNameOrId: async (id: string, nameOrId: string) => {
        const res = await httpRq.get(`/group/nameOrId/${id}/${nameOrId}`);
        return res;
    },
    createGroup: async (name: string, profilePicture: Array<any>, description: string, ownerId: string) => {
        const res = await httpRq.post(`/group/create`, { name, profilePicture, description, ownerId });
        return res;
    },
    updateGroup: async (id: string, ownerId: string, name: string | null, profilePicture: Array<any> | null, description: string | null) => {
        const res = await httpRq.put(`/group/update`, { id, name, profilePicture, description, ownerId });
        return res;
    },
    deleteGroup: async (groupId: string, ownerId: string) => {
        const res = await httpRq.delete(`/group/delete/${groupId}/${ownerId}`);
        return res;
    },
    exitGroup: async (groupId: string, memberId: string) => {
        const res = await httpRq.put(`/group/member/exit/${groupId}/${memberId}`);
        return res;
    },
    joinGroup: async (groupId: string, userId: string) => {
        const res = await httpRq.post(`/group/member/add`, { groupId, userId, role: "member" });
        return res;
    },
    switchGroupOwner: async (groupId: string, ownerId: string, newOwnerId: string) => {
        const res = await httpRq.put(`/group/owner/${groupId}/${ownerId}/${newOwnerId}`);
        return res;
    },
    getAllGroupMembers: async (groupId: string) => {
        const res = await httpRq.get(`/group/members/${groupId}`);
        return res;
    },
    deleteGroupMember: async (groupId: string, userId: string) => {
        const res = await httpRq.delete(`/group/member/remove/${groupId}/${userId}`);
        return res;
    },
    addGroupMembers: async (toAdd: { groupId: string, userId: string }[]) => {
        const res = await httpRq.post(`/group/member/addMulti`, toAdd);
        return res;
    }
}