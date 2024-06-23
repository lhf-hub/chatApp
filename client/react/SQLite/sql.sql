CREATE TABLE IF NOT EXISTS mute_friend (
    user_id VARCHAR(255),
    friend_id VARCHAR(255),
    PRIMARY KEY (user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS mute_group (
    user_id VARCHAR(255),
    group_id VARCHAR(255),
    PRIMARY KEY (user_id, group_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(200) NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) DEFAULT NULL,
    group_id VARCHAR(50) DEFAULT NULL,
    content BLOB,
    file_url VARCHAR(400) DEFAULT NULL,
    message_type VARCHAR(20) NOT NULL DEFAULT 'text',
    status VARCHAR(20) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS chats (
    user_id VARCHAR(50) NOT NULL,
    another_id VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    last_message_id VARCHAR(200) DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, another_id)
);