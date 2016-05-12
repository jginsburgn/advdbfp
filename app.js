var express = require('express');
var routes = require('./routes/home');
var addrecipe = require('./routes/addrecipe');
var addrawproduct = require('./routes/rawproducts/addrawproduct');
var editrawproduct = require('./routes/rawproducts/editrawproduct');
var brphandler = require('./routes/batchrawproducts/batchrawproducthandler');
var recipehandler = require('./routes/recipes/recipehandler');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.set('views',
    [__dirname + '/views',
    __dirname + '/views/home',
    __dirname + '/views/rawproducts',
    __dirname + '/views/batchrawproduct',
    __dirname + '/views/recipes']);


app.get('/', routes.index);
app.use('/addrecipe', addrecipe);
app.use('/addrawproduct', addrawproduct);
app.use('/editrawproduct', editrawproduct);
app.use('/batchrawproduct', brphandler);
app.use('/recipes', recipehandler);
app.use('*', routes.index);

app.listen(8080, function () {
  console.log('Server listening on port 8080');
});
