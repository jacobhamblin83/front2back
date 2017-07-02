SELECT firstname, friends.id, users.email
FROM friends
JOIN users 
ON users.email = friends.friend_email
WHERE friends.user_email = $1