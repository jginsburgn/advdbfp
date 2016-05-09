var path = require('path');
var express = require('express');
var router = express.Router();
var db = require('../../database/neo4j');

router.get('/',
function(req, res){
    var queryr = db.getN("RawProduct", function(err, result){
        if(err) throw err;
        console.log(result.data);
        res.render('editrawproduct', { products: result.data });
    });
});

router.post('/',
function(req, res){
    var action = req.body.action;
    switch (action) {
        case "commitchange":
            var name = req.body.name;
            var unit = req.body.unit;
            var amount = req.body.amount;
            var kind = req.body.kind;
            var description = req.body.description;
            var newNode = {name: name, unit: unit, amount: amount, kind: kind, description: description};
            db.editN(
                req.body.id,
                newNode,
                function(err, node){
                    if(err) throw err;

                    if(node === true){
                        res.redirect(req.get('referer'));
                    } else {
                        // node not found, hence not updated
                    }
                }
            );
            break;
        case "edit":
            db.getNID(req.body.id,
                function(err, node){
                    if(err) throw err;
                    res.render('productdetails', { product: node });
                    // // Output node properties.
                    // console.log(node.data);
                    //
                    // // Output node id.
                    // console.log(node._id);
                });
            break;
        case "delete":
            var diddelete = deleteRawProduct(req.body.id);
            if (diddelete) res.redirect(req.get('referer'));
            break;
        default:
            res.redirect("/");
    }
});

function deleteRawProduct(id){
    db.removeN(id, function(err, node){
        if(err) throw err;
        if(node === true){
            // node deleted
        } else {
            // node not deleted because not found or because of existing relationships
        }
    });
    return true;
}

module.exports = router;
