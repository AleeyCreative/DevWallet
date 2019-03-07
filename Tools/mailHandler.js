var nodemailer = require('nodemailer')


var message = "was the mail just delivered programmatically,amazing, SUBHANALLAH  !!!"

var to = "justalibaba008@gmail.com"

var transporter = nodemailer.createTransport({
	host : "smtp.gmail.com",
	port :  465,
	secure : true,
	auth : {
		user : "babaali196@gmail.com",
		pass : "alibaba@mail"
		}
 })
 
var options = {
	from : "babaali196@gmail.com",
	to : "justbabaali008@gmail.com",
	subject : "Testing sending mails using nodemailer",
	body : message
	}
	
transporter.sendMail(options, function(err, resp) {
 if(!err) console.log(resp)
 err && console.log(err.message)
	})
	 	
