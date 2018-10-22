const conn = require('../database/mysql.js');
const User = require('../models/user');
const Group = require('../models/group');

class UserServices {

    canCreateGroup()
    {
        return new Promise((res, rej) => {
            conn.query("SELECT count(id) as total FROM users WHERE deleted_at IS NULL LIMIT 2", (err, rows) => {
                if(err) rej(err);
                res({can: rows[0].total >= 2});
            }); 
        });
    }
    
    list() {
        return new Promise((res, rej) => {
            conn.query("SELECT * FROM users WHERE deleted_at IS NULL ORDER BY id DESC", (err, rows) => {
                if(err) rej(err);
                
                res(this.mapUsers(rows));
            }); 
        });
    }

    create(values){
        let user = new User();
        user.createOrUpdate(values);

        return new Promise((res, rej) => {
            conn.query("INSERT INTO users (name, email, password) values (?, ?, ?)", 
            [user.name, user.email, user.password], (err, rows) => {
                if(err) rej(err);
                try{
                    res({id : rows.insertId});
                }catch(e){
                    rej(e);  
                }
            }); 
        });
    }

    update(id, values){
        let user = new User();
        user.createOrUpdate(values);

        return new Promise((res, rej) => {
            conn.query("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", 
            [user.name, user.email, user.password, id], (err, rows) => {
                if(err) rej(err);

                try{
                    res({userId : id});
                }catch(e){
                    rej(e);  
                }
            }); 
        });
    }

    getById(id)
    {
        return new Promise((res, rej) => {
            conn.query("SELECT * FROM users WHERE id = ?", id, (err, rows) => {
                if(err) rej(err);

                try{
                    res({user : rows[0]});
                }catch(e){
                    rej(e);  
                }
            })
        })
    }

    delete(id)
    {
        return new Promise((res, rej) => {
            conn.query("UPDATE users SET deleted_at = CURRENT_TIMESTAMP() WHERE id = ?", 
            id, (err, rows) => {
                if(err) rej(err);
                if(rows.affectedRows > 0)
                    res({userId: id});
                rej({message: 'Not found'});
            });
        })
    }


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

    listGroups(id)
    {
        return new Promise((res, rej) => {
            try{conn.query(`SELECT groups.* FROM user_groups INNER JOIN groups on groups.id
            = user_groups.group_id WHERE user_id = ?`, 
            id, (err, rows) => {
                if(err) rej(err);
                let groups = [];
                rows.map(function(row) {
                    let grp = new Group();
                    grp.insertData(row);
                    groups.push(grp);
                });
                res({groups: groups});
            });
        }catch(e){console.log(e)}
        })
    }
}

module.exports = UserServices;
