select *
from items
where user_email = $1
order by id desc; 