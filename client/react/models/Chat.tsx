import { Message } from "./Message"

export interface Chat {
    user_id: string
    another_id: string
    type: 'friend' | 'group'
    last_message_id: string | null
    updated_at: string
}

export interface ChatDetail extends Chat {
    last_message: Message | null
    unread_count: number
    img: string
}