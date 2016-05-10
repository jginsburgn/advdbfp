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
        default:
            console.log("Unrecognized action for batch raw products handler post:" + action);
            res.redirect(res.get('referer'));
    }
}

function showBatches(req, res) {
    db.getBRPs(req.body.id, function(err, result){
        if(err) throw err;
        res.render('batchrawproducts', { brps: result.data, titlename:req.body.pname });
    });
}

module.exports = router;
