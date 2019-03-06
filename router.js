//importing required modules to the main router module

var router = require("express").Router(),
    routes = require("./Tools/routes.js"),
    cookie = require("cookie"),
    jwt = require("jsonwebtoken"),
    secret = "sefdsmjafnatdfkjbnfwbafbb485y3y7y43birajbajbe44ry4ru98yhafnajafhiwleh3288497y2hsfharhi84yhor",
    users = require("./Model/userModel.js"),
    apis = require("./Model/apiModel.js"),
    {loginValidation, signupValidation} = require("./Tools/validations.js")



//create token for authentication
function makeToken(data, exp = '4h') {
    return String(jwt.sign({
        id: data._id,
        name: data.name,
        email: data.email
    }, secret, {
        expiresIn: exp
    }))
}

//get  user details from the request header

function getDetails(headers) {
    var cooki = cookie.parse(headers.cookie || "")
    if (cooki.token) {
        var decode = jwt.decode(cooki.token, secret)
        return {
            id: decode.id,
            name: decode.name
        }
    } else
        return null
}


//authentication middleware
function auth(req, res, next) {
    var cooki = cookie.parse(req.headers.cookie || "")
    if (cooki.token) {
        var decode = jwt.verify(cooki.token, secret)
        //    console.log(decode)
        if (decode) return next()
        else res.redirect(routes.login)
    } else res.redirect(routes.login)
}

//using auth middleware
router.use("/dashboard", auth)


// Routes for the user
router.get(routes.home, function (req, res) {
    var ck = cookie.parse(req.headers.cookie || "")
    if (ck.token) {
        var decode = jwt.verify(ck.token, secret)
        if (decode.id) res.redirect(routes.dashboard)
        else res.redirect(routes.login)
    } else {
        res.redirect(routes.login)
    }
})

//user login handler
router.route(routes.login)
    .get(function (req, res) {
        res.render("login.pug")
    })
    .post(function (req, res) {
    var details = req.body
    var error = signupValidation(details)
    if (error) {
        res.render("login.pug", { error })
       } else { 
        var {name, password } = details 
         users.findOne({
            name: name,
            password: password
        }, (err, found) => {
            if (found) {
                apis.find({
                    user: found._id
                }).populate("user").exec(function (err, user_apis) {
                    var token = makeToken(found)
                    res.setHeader("Set-Cookie", cookie.serialize('token', token))
                    res.redirect("/dashboard/home")
                })
            } else {
                res.render("login.pug", {
                    error: "Sorry, the information you entered seems to be incorrect"
                })
            }
        })

			}
    })


//creating a new account
router.get(routes.signup, function (req, res) {
    res.render("signup.pug")
})

router.post(routes.signup, function (req, res) {
    var details = req.body
    var error = signupValidation(details)
    if (error) {
        res.render("signup.pug", { error })
    } else {
        var new_user = new users(details)
        new_user.save((err, data) => {
            err && res.status(500).render("signup.pug", {
                error: "could not signup successfully "
            })
            if (data) {
                var token = makeToken(data)
                res.setHeader("Set-Cookie", cookie.serialize("token", token))
                res.redirect(routes.dashboard)
            }

        })
    }
})

//Logout Route
router.get(routes.logout, function (req, res) {
    res.redirect(routes.login)
})


router

//Main dashboard route handler
router.get(routes.dashboard, function (req, res) {
    //console.log(req.headers.cookie)
    var user_data = getDetails(req.headers)
    apis.find({
        user: user_data.id
    }).populate({
        path: 'user',
        model: "user"
    }).exec(function (err, apis_found) {
        if (err) res.redirect(routes.dashboard)
        var view = req.params.view
        //		console.log(apis_found)
        var apis = apis_found
        apis[0].user.password = view != "account" ? null : apis[0].user.password
        res.render("dashboard", {
            view: view,
            apis,
            api: apis.filter(api => api.id === cookie.parse(req.headers.cookie || "").apiID)[0],
            user: apis[0].user
        })
    })
})


router.get(routes.account, function(req,res) {
	users.findByIdAndUpdate(req.body.id, req.body, { new : true }, function(err, updated) {
		if (err) {
			 console.log(err.message)
			 res.send("<h2> <font color=red> Error!, could not update your details </font> </h2")
				}
		else if (updated) res.redirect(routes.dashboard) 
	
		})

	})


//Routes for the API Information
router.post(routes.add, function (req, res) {
    var api = req.body
    var user_data = getDetails(req.headers)
    api.user = user_data.id
    api.date = new Date()
    var new_api = new apis(api)
    new_api.save(function (err, saved) {
        if (err) res.render("dashboard.pug", {
            view: "add",
            errormessage: "An error occured while trying to save api information"
        })
        if (saved) {
            console.log(saved)
            res.redirect(routes.dashboard)
        }
    })

})

// Route for editing an API entry
router.route(routes.edit)
    .get(function (req, res) {
        res.setHeader("Set-Cookie", cookie.serialize("apiID", req.params.id))
        res.redirect("/dashboard/edit")
    })
    .post(function (req, res) {
        apis.findByIdAndUpdate(
            req.params.id, req.body, {
            new: true
        }, function (err, updated) {
            if (err){ 
                res.send("<h2> <font color=red> Could not update !!! </font> </h2> ")
                console.log(err.message)
                }
            else res.redirect(routes.dashboard)
        })
    })

// Route for deleting an API entry
router.get(routes.delete, function (req, res) {
    console.log(req.params.id)
    apis.findByIdAndRemove(req.params.id, function(err, deleted){
        if(err) {
            console.log(err.message)
            res.send("<h2> <font color=red> Error deleting entry !!! </font> </h2>")
        }
        else res.redirect(routes.dashboard)
    })
})


//this wan no be part of the application ni ooh 
router.get("/packam", async function(req,res) {
	var all =  await apis.find()
	console.log("a request just recieved")
	if(all) res.json(all)
	else res.json({error:"no fit extract from db ooh"})
	
	})
	
module.exports = router
