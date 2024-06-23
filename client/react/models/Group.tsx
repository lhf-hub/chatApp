export interface Group {
    id: string
    name: string
    profilePicture: string | null
    ownerId: string
    createdAt: string | undefined
    updatedAt: string | undefined
    description: string | undefined
}