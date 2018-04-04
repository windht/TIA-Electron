var nodemailer = require('nodemailer');
var ejs = require('ejs');

module.exports = function(input,meta,output){
	
	var transporter = nodemailer.createTransport(meta.smtpConfig);

	// {
	// 	host:"smtp.exmail.qq.com",
	// 	// port:"995",
	// 	secure:true,
	// 	port:"465",

	// 	// auth:{
	// 	// 	user:"support@1coe.com",
	// 	// 	pass:"1coe1coe1coe",
	// 	// },
	// 	auth:{
	// 		user:"support@thebuilder.hk",
	// 		pass:"Build88mind",
	// 	}
	// }
	console.log("Email Input,:")
	// console.log(input);
	// console.log(meta);

	var mail;

	
	if (meta.emailSourceFrom=="meta"){
		mail = meta.mail;
	}
	else {
		mail = input.mail;
	}

	// Process Mail Html

	console.log(mail);

	var subject = ejs.render(mail.subject,{input:input});
	var html = ejs.render(mail.html,{input:input});
	mail.subject = subject;
	mail.html = html;

	transporter.sendMail(
		mail
		// {
		// 	from:mail.from,
		// 	to:mail.to,
		// 	subject:mail.subject,
		// 	html:mail.html,
		// }
		, function(err, info){
	    if(err){
	    	console.log(err);
	    }
	    console.log(info);
	    output(mail.to);
	});


}