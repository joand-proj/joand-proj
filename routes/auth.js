const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const loginCheck = require('../utils/loginCheck');
const Collection = require('../models/Collection')




router.get('/signup', (req, res, next) => {
     res.render('signup')
});


router.post("/signup", (req,res,next) => {
	const { username, password, coordinates } = req.body
    if (username.length === 0) {
		res.render('signup', { message: 'Your username cannot be empty', auth: req.isAuthenticated() })
		return
	}
	if (password.length < 6) {        
		res.render('signup', { message: 'Your password needs to be min 6 characters', auth: req.isAuthenticated() })
		return
	}	
	if (coordinates.length === 0) {
		res.render('signup', { message: 'Please choose your location on the map', auth: req.isAuthenticated() })
		return	
	}


	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB !== null) {
				res.render('signup', { message: 'Username is alredy taken', auth: req.isAuthenticated() })
			} else {
				const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(password, salt)
				// create the user
				User.create({ username, password: hash, coordinates })
					.then(createdUser => {
						const name = 'Colection 0'
						const description = 'Please add collection description'
						Collection.create({name, description })
						.then((createdCollection) => {
							User.findByIdAndUpdate(createdUser._id, { $push: {collections: createdCollection }})
							.then(()=> {
								console.log(createdUser)
								res.redirect('/login')
							})
						})
						
					})
					.catch(err => next(err))
			}
		})
});




router.get("/login", (req,res,next) => {        
    res.render("login", {auth: req.isAuthenticated()})
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login' ,    
}));



router.get("/profile", loginCheck(), (req,res,next) => {
    const loggedUser = req.user    
    res.render('profile', {user : loggedUser, auth: req.isAuthenticated()})
})

router.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/')    
       
});


router.get('/test', loginCheck(), (req, res, next) => {
    res.render('test', {auth: req.isAuthenticated()})
});


module.exports = router;