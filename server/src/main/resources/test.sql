CREATE INDEX idx_users_id ON users (id);
CREATE INDEX idx_users_name ON users (name);


CREATE INDEX idx_friendships_user_id ON friendships (user_id);
CREATE INDEX idx_friendships_friend_id ON friendships (friend_id);
CREATE INDEX idx_friendships_status ON friendships (status);

CREATE INDEX idx_friendships_user_friend ON friendships (user_id, friend_id);
CREATE INDEX idx_friendships_friend_user ON friendships (friend_id, user_id);
CREATE INDEX idx_friendships_user_status ON friendships (user_id, status);
CREATE INDEX idx_friendships_friend_status ON friendships (friend_id, status);

CREATE INDEX idx_friendships_user_friend_status ON friendships (user_id, friend_id, status);


CREATE INDEX idx_group_id ON `groups` (id);
CREATE INDEX idx_group_owner_id ON `groups` (owner_id);

CREATE INDEX idx_group_id_owner_id ON `groups` (id, owner_id);


CREATE INDEX idx_group_members_group_id ON group_members (group_id);
CREATE INDEX idx_group_members_user_id ON group_members (user_id);
CREATE INDEX idx_group_members_role ON group_members (role);

CREATE INDEX idx_group_members_group_user ON group_members (group_id, user_id);
CREATE INDEX idx_group_members_group_role ON group_members (group_id, role);
CREATE INDEX idx_group_members_user_role ON group_members (user_id, role);

CREATE INDEX idx_group_members_group_user_role ON group_members (group_id, user_id, role);



