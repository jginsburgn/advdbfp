var path = require('path');
var express = require('express');
var router = express.Router();
var db = require('../../database/neo4j');

router.get('/',
function(req, res){
    res.sendFile(path.join(__dirname, '../../views/rawproducts', 'addrawproduct.html'));
});

router.post('/',
function(req, res){
    var name = req.body.name;
    var unit = req.body.unit;
    var amount = req.body.amount;
    var kind = req.body.kind;
    var description = req.body.description;
    db.insertN({
        name: name,
        unit: unit,
        amount: amount,
        kind: kind,
        description: description
    },
    "RawProduct",
    function (err, node) {
        if (err) {
            return console.log(err);
        }
        console.log(node);
    });
    res.render('addrawproductdone',  {model: {Name: name, Unit: unit, Amount: amount, Kind: kind, Description: description}});
});

module.exports = router;
