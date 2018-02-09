// signin
$("#btn_login").click(function () {
	var loginObj = new Object();
	loginObj.accountNo = $("#inputAccount").val();
	loginObj.pwd = $("#inputPassword").val();
	var loginJson = JSON.stringify(loginObj); //将JSON对象转化为JSON字符  
	$.post('/validateSignin', { "loginObj": loginJson }, function (e) {
		console.log(e);
		if (e.accountMsg) {
			$("#accountDiv").addClass("has-error");
			$("#accountMsg").removeClass("hidden");

			$("#pwdDiv").removeClass("has-error");
			$("#pwdMsg").addClass("hidden");
		} else if (e.pwdMsg) {
			$("#accountDiv").removeClass("has-error");
			$("#accountMsg").addClass("hidden");

			$("#pwdDiv").addClass("has-error");
			$("#pwdMsg").removeClass("hidden");
		} else if (e.user) {
			$("#loginForm").submit();
		}
	});
});

// signup
// $("#btn_register").click(function () {
// 	var signupObj = new Object();
// 	signupObj.nickname = $("#inputAccount").val();
// 	signupObj.email = $("#inputEmail").val();
// 	signupObj.password = $("#inputPassword").val();
// 	signupObj.repassword = $("#inputRePassword").val();
// 	var signupJson = JSON.stringify(signupObj); //将JSON对象转化为JSON字符  
// 	$.post('/validateSignup', { "signupObj": signupJson }, function (e) {
// 		console.log(e);
		
// 	});
// });

