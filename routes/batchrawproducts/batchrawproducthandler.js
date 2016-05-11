var path = require('path');
var express = require('express');
var router = express.Router();
var db = require('../../database/neo4j');

router.get('/', runGet);

function runGet(req, res){
    res.redirect('editrawproduct');
}

router.post(
    '/',
    function(req, res){
        runPost(req.body.action, req, res);
    }
);

function runPost(action, req, res){
    switch (action) {
        case "show":
            showBatches(req, res);
            break;
        case "add":
            addBatch(req, res);
            break;
        case "commitadd":
            commitAdd(req, res);
            break;
        case "edit":
            editBatch(req, res);
            break;
        case "commitedit":
            commitEdit(req, res);
            break;
        case "delete":
            commitDelete(req, res);
            break;
        default:
            console.log("Unrecognized action for batch raw products handler post:" + action);
            res.redirect(res.get('referer'));
    }
}

function commitDelete(req, res){
    db.forceRemoval(req.body.id, function(error, result, other){
        db.getBRPs(req.body.productid, function(err, result){
            if(err) throw err;
            res.render('batchrawproducts', {
                productid:req.body.productid,
                brps: result.data,
                titlename:req.body.productname,
                unit: req.body.unit
            });
        });
    });
}

function editBatch(req, res){
    res.render('batchrawproduct', {
        productid: req.body.productid,
        productname: req.body.productname,
        amount: req.body.amount,
        expd: req.body.expd,
        expm: req.body.expm,
        expy: req.body.expy,
        brpid: req.body.id,
        verb: "Edit",
        action: "commitedit",
        title: "Editing Batch for: " + req.body.productname,
        unit: req.body.unit
    });
}

function commitEdit(req, res){
    var amount = req.body.amount;
    var expd = req.body.expd;
    var expm = req.body.expm;
    var expy = req.body.expy;
    var newNode = {amount: amount, expD: expd, expM: expm, expY: expy};
    db.editN(
        req.body.brpid,
        newNode,
        function(err, node){
            if(err) throw err;
            if(node === true){
                db.getBRPs(req.body.pid, function(err, result){
                    if(err) throw err;
                    res.render('batchrawproducts', {
                        productid:req.body.pid,
                        brps: result.data,
                        titlename:req.body.pname,
                        unit: req.body.unit
                    });
                });
            } else {
                // node not found, hence not updated
            }
        }
    );
}

function showBatches(req, res) {
    db.getBRPs(req.body.id, function(err, result){
        if(err) throw err;
        res.render('batchrawproducts', {
            productid:req.body.id,
            brps: result.data,
            titlename:req.body.pname,
            unit: req.body.unit
        });
    });
}

function addBatch(req, res){
    res.render('batchrawproduct', {
        productid: req.body.productid,
        productname: req.body.productname,
        verb: "Add",
        action: "commitadd",
        title: "Adding Batch for: " + req.body.productname,
        unit: req.body.unit
    });
}

function commitAdd(req, res){
    db.addBRP(req.body.pid, req.body.amount, req.body.expd, req.body.expm, req.body.expy, function(err, result) {
        db.getBRPs(req.body.pid, function(err, result){
            if(err) throw err;
            res.render('batchrawproducts', {
                productid:req.body.pid,
                brps: result.data,
                titlename:req.body.pname,
                unit: req.body.unit
            });
        });
    });
}

module.exports = router;
