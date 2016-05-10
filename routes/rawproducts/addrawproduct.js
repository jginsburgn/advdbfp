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
    var kind = req.body.kind;
    var cost = req.body.cost;
    db.insertN({
        name: name,
        unit: unit,
        kind: kind,
        cost: cost
    },
    "RawProduct",
    function (err, node) {
        if (err) {
            return console.log(err);
        }
    });
    res.render('addrawproductdone',  {model: {Name: name, Unit: unit, Kind: kind, Cost:cost}});
});

module.exports = router;
