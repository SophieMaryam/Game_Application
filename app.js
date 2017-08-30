const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.set('views',__dirname + '/src/views');
app.set('view engine', 'pug');

// Game 
app.get('/', function(req, res) {
    res.render('index');
});

app.listen(8080, () => {
	console.log("Listening");
	console.log(__dirname);
});




const bodyParser = require('body-parser');
const session = require('express-session');
// const bcrypt = require('bcrypt');

const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = new Sequelize('final_project', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	host: 'localhost',
	dialect: 'postgres',
	storage: './session.postgres',
	define: {
		timestamps: false
	}
});

// Setting up Pug



app.use('/', bodyParser.urlencoded({extended:true}));
app.use(session({
	secret: "This is a secret",
	resave:false,
	saveUninitialized: true,
	store: new SequelizeStore({
		db: sequelize,
		checkExpirationInterval: 30 * 60 * 1000,
		expiration : 24 * 60 * 60 * 1000
	})
}));

// Model Configuration

const User = sequelize.define('user',{
	firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING,
        unique:true
    },
    email: {
        type: Sequelize.STRING,
        unique:true,
    },
    password: {
        type: Sequelize.STRING,
    },
    password_confirmation: {
        type: Sequelize.STRING,
        validate: {
            notEmpty:true
        }
    }
    }); 

sequelize.sync({force:false});

// Home page
app.get('/',(req,res) => {
	var user = req.session.user;
	res.render('index', {user:user})
});


// Register
app.get('/register',(req,res) => {
	var user = req.session.user;
	res.render('register', {user:user})
});

app.post('/register', (req,res) => {
	let password = req.body.inputPassword,
	email = req.body.inputEmail,
	firstname = req.body.inputFirstName,
	lastname = req.body.inputLastName,
	pwconfirmation = req.body.passwordconfirmation;
	console.log('pwconfirmation ' + pwconfirmation);
	console.log('password: ' + password);
	
	if(password !== pwconfirmation){
		throw new Error("Password confirmation doesn't match.")
	} else if (password === pwconfirmation) {
		bcrypt.hash(password, 10, (err, hash) => {
			console.log("the hash" + hash)
			if(err){
				throw err;
			}

		User.create({
			firstname:firstname,
			lastname:lastname,
			email: email,
			password: hash,
			password_confirmation: hash
		})
		.then((user) => {
			req.session.user = user;
			res.redirect(`/profile`);
		})
		.catch((err) => {
			console.log("Error" + err);
		})
	
	})
	}
});

 
// Login 
app.get('/login', (req,res) => {
	var user = req.session.user;
	if(!user){
		res.render('login')
	} else {
		res.redirect(`/profile`)
	}
});


app.post('/login', bodyParser.urlencoded({extended:true}),(req,res) => {
	User.findOne({
	where: {
	  email: req.body.inputEmail
	}
	})
	.then ((user) => {
	console.log('does it reach this??' + user)
	   if(!user){
				res.redirect('/?message=' + encodeURIComponent("Invalid email or password"));
		} else {
			console.log('nnumber 2')
			bcrypt.compare(req.body.inputPassword, user.password, (err, result) => { // first argument is the password the user typed in, and thes second is the one in the database
				if(err){
					console.log(err)
				} else {
					if(result === true){
						req.session.user = user;
						res.redirect(`/profile`)
					} else {
						console.log("Error")
						res.redirect('/?message=' + encodeURIComponent("Invalid password"));
					}
				}
			})
		}
	})
	.catch(function(err){
		console.log("Error" + err)
		res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
	});
}); 

	// log out

app.get('/logout',(req,res) => {
  req.session.destroy((err) => {
    if (err){
      throw (err);
    }
    res.redirect('/?login=' + encodeURIComponent('Logged out successfully'));
  });
});

// Profile 

app.get('/profile',(req,res) => {
  var user = req.session.user;

  if(!user){
		res.redirect('/?message=' + encodeURIComponent("Please log in."));
	} else {
		res.render('profile', {user: user});
	}
});

// Chat

app.get('/chat', (req, res) => {
	var user = req.session.user
	 if(!user){
		res.redirect('/?message=' + encodeURIComponent("Please log in."));
	} else {
		res.render('profile', {user: user});
	}
});


