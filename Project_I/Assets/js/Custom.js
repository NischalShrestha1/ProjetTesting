$(document).ready(function () {

			$("#form").validate({

				// In 'rules' user have to specify all the
			// constraints for respective fields
				rules: {
					Username: {
						required: true,
						minlength: 4 // For length of lastname
					},
					Password: {
						required: true,
						minlength: 5
					},
					CPassword: {
						required: true,
						minlength: 5,
					
						// For checking both passwords are same or not
						equalTo: "#Password"
					},
					Email: {
						required: true,
						email: true
					},
					agree: "required"
				},
				// In 'messages' user have to specify message as per rules
				messages: {
					Username: {
						required: " Please enter a username",
						minlength:" Your username must consist of at least 4 characters"
					},
					Password: {
						required: " Please enter a password",
						minlength:" Your password must be consist of at least 5 characters"
					},
					CPassword: {
						required: " Please enter a password",
						minlength:" Your password must be consist of at least 5 characters",
						equalTo: " Please enter the same password as above"
					},
					agree: "<-Please accept our policy-< "
				},
				submitHandler: function() { 
					form.submit();
					
				}
			});

		});