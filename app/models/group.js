class Group{
    constructor(){
        this.id;
        this.name;
        this.slug;
    }


    createOrUpdate(data)
    {
        this.name = data.name;
        this.slug = this.slugfy(data.name);
    }

    insertData(data)
    {
        this.name = data.name;
        this.slug = data.slug;
        this.id = data.id;
    }

    slugfy(name)
    {
        return String(name).toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'');
    }

}

module.exports = Group;