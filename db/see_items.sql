SELECT users.firstname, items.id, name, items.user_email
FROM items
JOIN users 
ON users.email = items.user_email
JOIN friends
ON friends.friend_email = items.user_email
WHERE friends.user_email = $1
ORDER BY id DESC; 