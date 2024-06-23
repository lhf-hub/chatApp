export interface Message {
    id: string
    sender_id: string
    receiver_id: string | null
    group_id: string | null
    content: string | null
    file_url: string | null
    message_type: 'text' | 'image' | 'video' | 'file' | 'voice'
    status: 'unread' | 'read'
    created_at: string | null
}

export interface MessageOrigin {
    id: string
    sender_id: string
    receiver_id: string | null
    group_id: string | null
    content: Buffer | null
    file_url: string | null
    message_type: 'text' | 'image' | 'video' | 'file' | 'voice'
    status: 'unread' | 'read'
    created_at: string | null
}