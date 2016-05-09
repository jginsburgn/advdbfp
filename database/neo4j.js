var neo4j = require('node-neo4j');
db = new neo4j('http://neo4j:final@localhost:7474');

//public functions
module.exports = {
    editN: function(id, changes, answer){
        db.updateNode(id, changes, answer);
    },
    insertN: function (values, kind, answer) {
        db.insertNode(values, kind, answer);
    },
    removeN: function (id, answer) {
        db.deleteNode(id, answer);
        // db.deleteNode(id, function(err, node){
        //     if(err) throw err;
        //
        //     if(node === true){
        //         // node deleted
        //     } else {
        //         // node not deleted because not found or because of existing relationships
        //     }
        // });
    },
    getN: function (kind, answer) {
        db.cypherQuery("MATCH (n:" + kind + ") return n;", answer);
    },
    getNID: function (id, answer) {
        db.readNode(id, answer);
    }
};

//private functions
var zemba = function () {
}
