const User = require('../../models/user');

module.exports = class UserServices{
    mapUsers(rows)
    {
        let users = [];
        rows.map(function(row) {
            let usr = new User();
            usr.insertData(row);
            users.push(usr);
        });

        return users;
    }
}