export interface User {
    id: string
    name: string
    profilePicture: string
    password: string
    createdAt: string
    updatedAt: string
}

export interface UserWithRelation extends User {
    status:
    'self' |
    'accepted' |
    'pendingSend' |
    'pendingReceive' |
    'rejectedSend' |
    'rejectedReceive' |
    'stranger' |
    'blockedSend' |
    'blockedReceive'
}

export interface UserWithRelationCanSelect extends UserWithRelation {
    selected: boolean
}

export interface UserWithGroupRole extends User {
    groupId: string,
    role: 'owner' | 'member',
    joinedAt: string
}