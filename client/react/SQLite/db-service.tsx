import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Message, MessageOrigin } from '../models/Message';
import { Chat } from '../models/Chat';
import { Base64 } from 'js-base64';

const DbName = 'ChatApp.db';

enablePromise(true);

export const getDBConnection = async () => {
    return openDatabase({ name: DbName, location: 'default' });
};

export const getChatBy2Id = async (db: SQLiteDatabase, user_id: string, another_id: string): Promise<Chat> => {
    const query = `SELECT * FROM chats WHERE user_id = ? AND another_id = ?`;
    return (await db.executeSql(query, [user_id, another_id]))[0].rows.item(0) as Chat;
}

export const getMyChats = async (db: SQLiteDatabase, user_id: string): Promise<Chat[]> => {
    const query = `SELECT * FROM chats WHERE user_id = ?`;
    const result = (await db.executeSql(query, [user_id]))[0].rows.raw() as Chat[];
    console.log(result);
    db.close();
    return result;
}


export const getFriendMessages = async (db: SQLiteDatabase, senderId: string, receiverId: string): Promise<Message[]> => {
    const query = `
    SELECT * FROM messages where
    (sender_id = '${senderId}' and receiver_id = '${receiverId}') or
    (sender_id = '${receiverId}' and receiver_id = '${senderId}')`;
    const messageOrigin: MessageOrigin[] = (await db.executeSql(query))[0].rows.raw() as MessageOrigin[]

    const messages: Message[] = []
    messageOrigin.forEach(i => {
        messages.push({
            ...i,
            content: i.content?.toString() ?? ''
        })
    });
    return messages
}



export const getGroupMessages = async (db: SQLiteDatabase, senderId: string, groupId: string): Promise<Message[]> => {
    const query = `
    SELECT * FROM messages where group_id = '${groupId}'`;
    const messageOrigin: MessageOrigin[] = (await db.executeSql(query))[0].rows.raw() as MessageOrigin[]

    const messages: Message[] = []
    messageOrigin.forEach(i => {
        messages.push({
            ...i,
            content: i.content?.toString() ?? ''
        })
    });
    return messages

}

export const getMessage = async (db: SQLiteDatabase, id: string): Promise<Message> => {
    const query = `SELECT * FROM messages WHERE id = ? 
    ORDER BY created_at DESC LIMIT 1`;
    return (await db.executeSql(query, [id]))[0].rows.item(0) as Message;
}

export const getLatestMessage = async (db: SQLiteDatabase, senderId: string, receiverId: string): Promise<Message> => {
    const query = `SELECT * FROM messages WHERE sender_id = ? AND receiver_id = ? 
    ORDER BY created_at DESC LIMIT 1`;
    return (await db.executeSql(query, [senderId, receiverId]))[0].rows.item(0) as Message;
}

export const getFriendChatUnreadCount = async (db: SQLiteDatabase, user_id: string, friend_id: string): Promise<number> => {
    const query = `SELECT COUNT(id) AS unread_count FROM messages WHERE sender_id = ? AND receiver_id = ? AND status = 'unread'`;
    return (await db.executeSql(query, [user_id, friend_id]))[0].rows.item(0)['unread_count'] as number;
}

export const getGroupChatUnreadCount = async (db: SQLiteDatabase, user_id: string, group_id: string): Promise<number> => {
    const query = `SELECT COUNT(id) AS unread_count FROM messages WHERE sender_id = ? AND group_id = ? AND status = 'unread'`;
    return (await db.executeSql(query, [user_id, group_id]))[0].rows.item(0)['unread_count'] as number;
}

export const createChat = async (db: SQLiteDatabase, chat: Chat) => {
    const query = `INSERT INTO chats (user_id, another_id, type, last_message_id, updated_at) VALUES (?, ?, ?, ?, ?)`;
    await db.executeSql(query, [chat.user_id, chat.another_id, chat.type, chat.last_message_id, Date.now()]);
}

export const readMessage = async (db: SQLiteDatabase, messageIds: string[]) => {
    const query = `UPDATE messages SET status = 'read' WHERE id = ?`;
    for (const messageId of messageIds) {
        await db.executeSql(query, [messageId]);
    }
}

export const insertMessage = async (db: SQLiteDatabase, message: Message) => {
    const query = `INSERT INTO messages (id, sender_id, receiver_id, group_id, content, file_url, message_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const rid = message.receiver_id ?? message.group_id

    const query1 = `UPDATE chats SET last_message_id = '${message.id}' 
    WHERE ('chats'.'user_id' = '${message.sender_id}' AND 'chats'.'another_id' = '${rid}')
    OR ('chats'.'user_id' = '${rid}' AND 'chats'.'another_id' = '${message.sender_id}')`

    await db.executeSql(query, [message.id, message.sender_id, message.receiver_id, message.group_id, Buffer.from(message.content ?? '').toString(), message.file_url, message.message_type, message.status]);
    await db.executeSql(query1)
}

export const addMuteFriend = async (db: SQLiteDatabase, userId: string, friendId: string) => {
    const query = `INSERT INTO mute_friend (user_id, friend_id) VALUES (?, ?)`;
    await db.executeSql(query, [userId, friendId]);
}

export const addMuteGroup = async (db: SQLiteDatabase, userId: string, groupId: string) => {
    const query = `INSERT INTO mute_group (user_id, group_id) VALUES (?, ?)`;
    await db.executeSql(query, [userId, groupId]);
}

export const deleteMuteFriend = async (db: SQLiteDatabase, userId: string, friendId: string) => {
    const query = `DELETE FROM mute_friend WHERE user_id = ? AND friend_id = ?`;
    await db.executeSql(query, [userId, friendId]);
}

export const deleteMuteGroup = async (db: SQLiteDatabase, userId: string, friendId: string) => {
    const query = `DELETE FROM mute_friend WHERE user_id = ? AND group_id = ?`;
    await db.executeSql(query, [userId, friendId]);
}

export const isFriendMuted = async (db: SQLiteDatabase, userId: string, friendId: string): Promise<boolean> => {
    const query = `SELECT * from mute_friend WHERE user_id = ? AND friend_id = ?`;
    return (await db.executeSql(query, [userId, friendId]))[0].rows.raw().length > 0
}

export const isGroupMuted = async (db: SQLiteDatabase, userId: string, groupId: string): Promise<boolean> => {
    const query = `SELECT * from mute_group WHERE user_id = ? AND group_id = ?`;
    return (await db.executeSql(query, [userId, groupId]))[0].rows.raw().length > 0
}

export const setUser = async (db: SQLiteDatabase, id: string, password: string, token: string) => {
    const query = `INSERT INTO users (id, password, token) VALUES (?, ?, ?)`;
    await db.executeSql(query, [id, password, token]);
}

export const getUser = async (db: SQLiteDatabase, id: string): Promise<{ id: string, password: string, token: string }> => {
    const query = `SELECT * FROM users WHERE id = ?`;
    return (await db.executeSql(query, [id]))[0].rows.item(0) as { id: string, password: string, token: string };
}

