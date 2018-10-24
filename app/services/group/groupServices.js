const Group = require('../../models/group.js');

module.exports = class GroupServices{
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

}