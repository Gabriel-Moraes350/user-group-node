class User{
    constructor(){
        this.id;
        this.name;
        this.email;
        this.password;
        this.token;
        this.created_at;
        this.updated_at;
        this.deleted_at;
    }


    insertData(data)
    {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.token = data.token;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.deleted_at = data.deleted_at;
    }

    createOrUpdate(data)
    {
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
    }

}

module.exports = User;