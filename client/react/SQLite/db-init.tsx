import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';


export const init = async (db: SQLiteDatabase) => {
    // create table if not exists
    let query;
    // 联合主键 userId, friendId; user 对 friend 免打扰 muted = 1 0
    query = `CREATE TABLE IF NOT EXISTS mute_friend  (
        user_id VARCHAR(255),
        friend_id VARCHAR(255),
        PRIMARY KEY (user_id, friend_id));`
    await db.executeSql(query);

    // 联合主键 userId, groupId; user 对 group 免打扰 muted = 1 0
    query = `CREATE TABLE IF NOT EXISTS mute_group   (
        user_id VARCHAR(255),
        group_id VARCHAR(255),
        PRIMARY KEY (user_id, group_id));`
    await db.executeSql(query);

    query = `CREATE TABLE IF NOT EXISTS messages  (
             id varchar(200) NOT NULL,
             sender_id varchar(50) NOT NULL,
             receiver_id varchar(50) DEFAULT NULL,
             group_id varchar(50) DEFAULT NULL,
             content blob,
             file_url varchar(400) DEFAULT NULL,
             message_type VARCHAR(20) NOT NULL DEFAULT 'text',
             status VARCHAR(20) DEFAULT 'unread',
             created_at timestamp DEFAULT CURRENT_TIMESTAMP,
             PRIMARY KEY (id)
            );`// 'text','image','video','file','voice'
    await db.executeSql(query);


    query = `CREATE TABLE IF NOT EXISTS chats  (
                user_id varchar(50) NOT NULL,
                another_id varchar(50) NOT NULL,
                type VARCHAR(20) NOT NULL,
                last_message_id varchar(200) DEFAULT NULL,
                updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, another_id)
                );` // 'friend','group'
    await db.executeSql(query);


};
