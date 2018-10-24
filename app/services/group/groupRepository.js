const conn = require('../../database/mysql.js');
const Group = require('../../models/group.js');
var UserRepository = require('../user/UserRepository');

UserRepository = new UserRepository();

var userServices = require('../user/userServices.js');
userServices = new userServices();

var services = require('./groupServices.js');
services = new services();


class GroupRepository {
    
    list() {
        return new Promise((res, rej) => {
            conn.query("SELECT * FROM groups ORDER BY id DESC", (err, rows) => {
                if(err) rej(err);
                
                res(services.mapGroups(rows));
            }); 
        });
    }

    create(values){
        let group = new Group();
        group.createOrUpdate(values);
        return new Promise((res, rej) => {
            UserRepository.canCreateGroup()
            .then(result => {
                if(!result.can)
                    return rej({error:result, message:'Minimum users doesnt match'});
                else
                {
                    let groupId;
                    conn.beginTransaction(function(err){
                        try{
                            conn.query("INSERT INTO groups (name, slug) values (?,?)", 
                [group.name, group.slug], (err, rows) => {
                            if(err){
                                conn.rollback();
                                rej({error:err, message:'Could not create Group'});
                            }
                                groupId = rows.insertId;
                                conn.query("INSERT INTO user_groups (user_id, group_id) values(?, ?)", 
                                [values.userId, groupId], (err, rows) => {
                                    if(err){
                                        conn.rollback();
                                        return rej({error:err, message:'Could not create Group'});   
                                    } 
                                    if(rows.insertId > 0)
                                    {
                                        res({id: groupId});
                                        conn.commit(function(err) {
                                            if (err) { 
                                                conn.rollback();
                                                return rej({error:err, message:'Could not create Group'});
                                            }
                                        });
                                    }
                                });
                            });     

                            
                        }catch(e){
                            conn.rollback();
                            rej({error:e, message:'Could not create Group'});  
                        }                            
                    });
                }
                
            }).catch(e => {
                rej(e);
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
                    if(rows.affectedRows > 0)
                        res({groupId : id});
                    rej({error: id, message: 'Group not exists', status:404})
                }catch(e){
                    rej({error: e , message: 'Could not update'});  
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
            conn.query("DELETE FROM user_groups WHERE group_id = ?", id, (err, rows) =>
            {
                if(err) rej(err);
                conn.query("DELETE FROM groups WHERE id = ?", 
                id, (err, rows) => {
                    if(err) rej(err);
                    if(rows.affectedRows > 0)
                        res({groupId: id});
                    rej({message: 'Not found', status:404, error:id});
                });
            })
            
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
                console.log(rows);
                if(typeof rows !== 'undefined' )
                    res({id: rows.insertId});
                rej({error:'not found', status:404, message:'User or group not found'})
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
                        .catch(e => rej({error:e, message:'Could not delete group'}));
                    }
                    else{
                        if(rows.affectedRows > 0)
                            res();
                        rej({status:404, message:'User or group not exists'});
                    }
                }); 
            })
            .catch(e => rej({error:e, message:'Could not check if has to delete group'}))

        });
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

module.exports = GroupRepository;