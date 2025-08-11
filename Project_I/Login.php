<?php

include 'config.php';
session_start();

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jhigu Hotel</title>
  <link rel="stylesheet" href="Css/Login.css">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
</head>
<body>
  <div class="wrapper">
  <h1>Login</h1>
  <div class="role_btn">
                    <a href="Login.php" class="btns active">User</a>
                    <a href="emplogin.php" class="btns">Staff</a>
                </div>

  <?php 
    if (isset($_POST['user_login_submit'])) {
      $Email = $_POST['Email'];
      $Password = $_POST['Password'];

      $sql = "SELECT * FROM signup WHERE Email = '$Email' ";
      $result = mysqli_query($conn, $sql);

  if ($result->num_rows > 0) {
      $_SESSION['usermail']=$Email;
      $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
      $HPassword = $row['Password'];
      if(password_verify($Password, $HPassword)){
      header("Location: Home.php");
      }
      else {
        echo "<script>swal({
        title: 'Something went wrong',
        icon: 'error',
        });
        </script>";
        }
      }
    else {
        echo "<script>swal({
        title: 'Something went wrong',
        icon: 'error',
        });
        </script>";
        }
    }
?>
    <form class="user_login authsection active" id="userlogin" action="" method="POST">
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
      <button type="submit" name="user_login_submit" class="btn">Login</button>
      <div class="register-link">
        <p>Don't have an account? <a href="Register.php">Sign Up</a></p>
      </div>
    </form>
  </div>
</body>
<script src="./Js/index.js"></script>
</html>