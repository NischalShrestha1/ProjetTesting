<?php

include 'config.php';
session_start();

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
		.error{
			font-size: 13px;
		}
	</style>
  <title>Jhigu Hotel</title>
  <link rel="stylesheet" href="Css/Register.css">
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <script src="Assets/js/jquery.js"></script>
	<script src="Assets/js/jquery-validate.js"></script>
	<script src="Assets/js/Custom.js"></script>
</head>
<body>
  <div class="wrapper">
  <?php       
                if (isset($_POST['user_signup_submit'])) {
                    $Username = $_POST['Username'];
                    $Email = $_POST['Email'];
                    $Password = $_POST['Password'];
                    $CPassword = $_POST['CPassword'];

                    if($Username == "" || $Email == "" || $Password == ""){
                        echo "<script>swal({
                            title: 'Fill the proper details',
                            icon: 'error',
                        });
                        </script>";
                    }
                    else{
                        if ($Password == $CPassword) {
                            $sql = "SELECT * FROM signup WHERE Email = '$Email'";
                            $result = mysqli_query($conn, $sql);
    
                            if ($result->num_rows > 0) {
                                echo "<script>swal({
                                    title: 'Email already exits',
                                    icon: 'error',
                                });
                                </script>";
                            } else {
                                $HPassword = password_hash("$Password", PASSWORD_BCRYPT);
                                $sql = "INSERT INTO signup (Username,Email,Password) VALUES ('$Username', '$Email', '$HPassword')";
                                $result = mysqli_query($conn, $sql);
    
                                if ($result) {
                                    $_SESSION['usermail']=$Email;
                                    $Username = "";
                                    $Email = "";
                                    $Password = "";
                                    $CPassword = "";
                                    header("Location: Login.php");
                                } else {
                                    echo "<script>swal({
                                        title: 'Something went wrong',
                                        icon: 'error',
                                    });
                                    </script>";
                                }
                            }
                        } else {
                            echo "<script>swal({
                                title: 'Password does not matched',
                                icon: 'error',
                            });
                            </script>";
                        }
                    }
                    
                }
            ?>
    <form class="user-register" id="form" action="" method="POST">
      <h1>Sign Up</h1>
      <div class="input-box">
        <input type="text" id="Username" name="Username" placeholder="Username" required>
        <i class='bx bxs-user'></i>
        
      </div>
      <div class="input-box">
        <input type="text" id="Email" name="Email" placeholder="Email" required>
        <i class='bx bxs-envelope'></i>
        
      </div>
      <div class="input-box">
        <input type="password" id="Password" name="Password" placeholder="Password" required>
        <i class='bx bxs-lock-alt' ></i>
        
      </div>
      <div class="input-box">
        <input type="password" id="CPassword" name="CPassword" placeholder="Confirm Password" required>
        <i class='bx bxs-lock-alt' ></i>
        
      </div>
      <div class="remember-terms">
        <label><input id="agree" name="agree" type="checkbox">I agree to these <a href="#">Terms & Conditions</a></label>
        <div class="error"></div>
      </div>
      <button type="submit" name="user_signup_submit" id="submit" class="btn">Sign Up</button>
      <div class="register-link">
        <p>Already a member? <a href="Login.php">Login Here</a></p>
      </div>
    </form>
  </div>
</body>
<script src="./Js/index.js"></script>
</html>