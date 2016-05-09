var path = require('path');
var express = require('express');
var router = express.Router();
var db = require('../database/neo4j');

router.get('/',
function(req, res){
    res.sendFile(path.join(__dirname, '../views', 'npu.html'));
});

router.post('/',
function(req, res){
    var name = req.body.firstname;
    var lastname = req.body.lastname;
    db.insertN({
        name: name,
        company: lastname,
    },
    "Person",
    function (err, node) {
        if (err) {
            return console.log(err);
        }
        // Output node data.
        console.log(node);
    });
});

module.exports = router;
