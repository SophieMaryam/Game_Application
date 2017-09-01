const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', bodyParser.urlencoded({extended:true}));

// Setting up Pug
app.set('views',__dirname + '/src/views');
app.set('view engine', 'pug');

// Home page
app.get('/',(req,res) => {
	res.render('homepage')
});

// Game 
app.get('/game', function(req, res) {
    res.render('index');
});


// Server
app.listen(8080, () => {
	console.log("Listening");
	console.log(__dirname);
});


