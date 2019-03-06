exports. loginValidation = function(body){
var {name, password } = body
 if(name == ""){
	return "Username field was empty"
 }  
 else if(password == "") {
 	return "Password field was empty"
 }
 else return null
 
}

exports.signupValidation = function(body) {
var {name, password, email } = body
 if(name == ""){
	return "Username field was empty"
 }  
 else if(password == "") {
 	return "Password field was empty"
 }
 else if(password.length < 5 ) {
 	return "Password too short !!!"
 }
 else if(email == "") {
 return "Email field was empty"
 }
 else return null

}
