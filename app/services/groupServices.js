const conn = require('../database/mysql.js');
const Group = require('../models/group.js');
const UserServices = require('./userServices');

var userServices = new UserServices();
const ErrorMessage = {
    create: 'Not users enough'
}

class GroupServices {
    
    list() {
        return new Promise((res, rej) => {
            conn.query("SELECT * FROM groups ORDER BY id DESC", (err, rows) => {
                if(err) rej(err);
                
                res(this.mapGroups(rows));
            }); 
        });
    }

    create(values){
        let userServices = new UserServices();
        let group = new Group();
        group.createOrUpdate(values);
        return new Promise((res, rej) => {
            userServices.canCreateGroup()
            .then(result => {
                if(!result.can)
                    return rej(result);
                else
                {
                    let groupId;
                    conn.query("INSERT INTO groups (name, slug) values (?,?)", 
                    [group.name, group.slug], (err, rows) => {
                        if(err) return rej(err);
                        try{
                            groupId = rows.insertId;
                            conn.query("INSERT INTO user_groups (user_id, group_id) values(?, ?)", [values.userId, groupId], (err, rows) => {
                                if(err) return rej(err);
                                res({id: rows.insertId});
                            })
                        }catch(e){
                            rej(e);  
                        }
                    }); 
                }
                
            })
            
        });
    }

    update(id, values){
        let group = new Group();
        group.createOrUpdate(values);

        return new Promise((res, rej) => {
            conn.query("UPDATE groups SET name = ?, slug = ? WHERE id = ?", 
            [group.name, group.slug, id], (err, rows) => {
                if(err) rej(err);

                try{
                    res({groupId : id});
                }catch(e){
                    rej(e);  
                }
            }); 
        });
    }

    getById(id)
    {
        return new Promise((res, rej) => {
            conn.query("SELECT * FROM groups WHERE id = ?", id, (err, rows) => {
                if(err) rej(err);

                try{
                    res({group : rows[0]});
                }catch(e){
                    rej(e);  
                }
            })
        })
    }

    delete(id)
    {
        return new Promise((res, rej) => {
            conn.query("DELETE FROM groups WHERE id = ?", 
            id, (err, rows) => {
                if(err) rej(err);
                if(rows.affectedRows > 0)
                    res({groupId: id});
                rej({message: 'Not found'});
            });
        })
    }

    listUsers(groupId)
    {
        return new Promise((res, rej) => {
            conn.query("SELECT users.* FROM user_groups INNER JOIN users on users.id = user_groups.user_id WHERE group_id = ?", groupId, (err, rows) => {
                if(err) rej(err);
                
                let users = userServices.mapUsers(rows);
                res({users: users});
            }); 
        });
    }

    addUserToGroup(id, body)
    {
        return new Promise((res, rej) => {
            conn.query("INSERT INTO user_groups (user_id, group_id) values (?, ?)", [body.userId, id], (err, rows) => {
                if(err) rej(err);
                
                res({id: rows.insertId});
            }); 
        });
    }

    removeUserFromGroup(id,  body)
    {
        return new Promise((res, rej) => {
            this.hasToDeleteGroup(id)
            .then(response => {
                conn.query("DELETE FROM user_groups WHERE user_id = ? AND group_id = ?", [body.userId, id], (err, rows) => {
                    if(err) rej(err);
                    if(response.hasToDelete == true && rows.affectedRows > 0)
                    {
                        this.delete(id)
                        .then(save => res(save))
                        .catch(e => rej(e));
                    }
                    else{
                        res(rows);
                    }
                }); 
            })
            .catch(e => rej(e))

        });
    }

    mapGroups(rows)
    {
        let groups = [];
        rows.map(function(row) {
            let grp = new Group();
            grp.insertData(row);
            groups.push(grp);
        });

        return groups;
    }

    hasToDeleteGroup(id)
    {
        return new Promise((res, rej) => {
            conn.query("SELECT COUNT(id) as total from user_groups WHERE group_id = ?", id, (err, rows) => {
                if(err) rej(err);
                if(rows[0].total == 1)
                {
                    res({hasToDelete: true});                    
                } else {
                    res({hasToDelete: false});   
                }
            }); 
        });
    }
}

module.exports = GroupServices;
