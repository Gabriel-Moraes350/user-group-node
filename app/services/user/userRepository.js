const conn = require('../../database/mysql.js');
const User = require('../../models/user');
var groupServices = require('../group/groupServices.js');
const UserServices = require('./userServices.js');

groupServices = new groupServices();

class UserRepository {

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
                let services = new UserServices();
                res(services.mapUsers(rows));
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
                    rej({error: e, message:'Error create User'});  
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
                    if(rows.affectedRows > 0)
                        res({userId : id});
                    rej({status: 404, error:id, message:'User not exists'});
                }catch(e){
                    rej({error:e, message:'Error on update user'});  
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
                rej({message: 'Not found', status:404, error:id});
            });
        })
    }


    listGroups(id)
    {
        return new Promise((res, rej) => {
            try{conn.query(`SELECT groups.* FROM user_groups INNER JOIN groups on groups.id
            = user_groups.group_id WHERE user_id = ?`, 
            id, (err, rows) => {
                if(err) rej(err);
                res({groups: groupServices.mapGroups(rows)});
            });
        }catch(e){rej({error: e, message:'Error list groups'})}
        })
    }
}

module.exports = UserRepository;
