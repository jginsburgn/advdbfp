var path = require('path');
var express = require('express');
var router = express.Router();
var db = require('../../database/neo4j');

router.get('/', runGet);

function runGet(req, res){
    res.redirect('/');
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
            showRecipes(req, res);
            break;
        case "edit":
            editRecipe(req.body.recipeid, req, res);
            break;
        case "delete":
            db.removeN(req.body.recipeid, function(error, response) {
                showRecipes(req, res);
            })
            break;
        case "create":
            createRecipe(req, res);
            break;
        default:
            console.log("Unrecognized action for recipes handler post: " + action);
            res.redirect(res.get('referer'));
    }
}

function createRecipe(req, res) {
    db.insertN({
        name: ""
    },
    "Recipe",
    function (err, node) {
        editRecipe(node._id, req, res);
    });
}

function editRecipe(recipeid, req, res) {
    switch (req.body.subaction) {
        case "changename":
            var changes = {name:req.body.recipename};
            db.editN(req.body.recipeid, changes, function(error, response){
                reRender(recipeid, req, res);
            });
            break;
        case "deleteing":
            var ingid = req.body.oping;
            db.deleteRel(recipeid, ingid, function (error, response) {
                if (!error) reRender(recipeid, req, res);
            });
            break;
        case "adding":
            var ingid = req.body.oping;
            if (ingid) {
                var ingid = req.body.oping;
                var amount = req.body.amount;
                db.createRel(recipeid, ingid, "Ingredient", "{amount:" + amount + "}", function (error, response) {
                    if (!error) reRender(recipeid, req, res);
                });
            }
            else reRender(recipeid, req, res);
            break;
        case "back":
            showRecipes(req, res);
            break;
        default:
            reRender(recipeid, req, res);
    }
}

// function deleteItem(n, arr) {
//     return arr.splice(n, 1);
// }
//
// function ingredientsDifference(minuend, subtrahend) {
//     for (var i = 0; i < array.length; i++) {
//         array[i]
//     }
// }

function reRender(recipeid, req, res) {
    db.getIngredients(recipeid, function(error, response){
        var currentings = response.data; //array of ings where ing is array of ingrel and rawproduct
        db.getNID(recipeid, function(error, response) {
            var recipename = response.name;
            db.getN("RawProduct", function(error, response) {
                var ings = response.data;
                //-available vars: action, pagetitle, currentings, ings
                //-possible vars: recipeid, recipename (if action is create they are undefined)
                //-return vars: action, currentings
                //-possible return vars: recipeid, recipename, subaction (tells what to do with oping), oping (ingredient to apply subaction)
                var renderobject = {
                    action: "edit",
                    pagetitle: "Editing Recipe",
                    recipeid: recipeid,
                    recipename: recipename,
                    currentings: currentings,
                    ings: ingsDiff(ings, currentings)
                };
                res.render('editrecipe', renderobject);
            });
        });
    });
}

function idBelongs(id, currentings) {
    for (var i = 0; i < currentings.length; i++) {
        if (currentings[i][1]._id==id) {
            return true;
        }
    }
    return false;
}
function ingsDiff(ings, currentings) {
    var retVal = [];
    for (var i = 0; i < ings.length; i++) {
        if (!idBelongs(ings[i]._id, currentings)) retVal.push(ings[i]);
    }
    return retVal;
}

function showRecipes(req, res) {
    db.getN("Recipe", function(error, response) {
        res.render("recipes", {pagetitle:"Recipes", recipes:response.data})
    });
}

module.exports = router;
