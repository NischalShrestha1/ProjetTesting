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
  <link rel="stylesheet" href="Css/emplogin.css">
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
</head>
<body>
  <div class="wrapper">
  <h1>Login</h1>
  <div class="role_btn">
                    <a href="Login.php" class="btns">User</a>
                    <a href="emplogin.php" class="btns active">Staff</a>
                </div>
                <?php              
                    if (isset($_POST['Emp_login_submit'])) {
                        $Email = $_POST['Emp_Email'];
                        $Password = $_POST['Emp_Password'];

                        $sql = "SELECT * FROM emp_login WHERE Emp_Email = '$Email' AND Emp_Password = BINARY'$Password'";
                        $result = mysqli_query($conn, $sql);

                        if ($result->num_rows > 0) {
                            $_SESSION['usermail']=$Email;
                            $Email = "";
                            $Password = "";
                            header("Location: admin/admin.php");
                        } else {
                            echo "<script>swal({
                                title: 'Something went wrong',
                                icon: 'error',
                            });
                            </script>";
                        }
                    }
                ?> 
                <form class="employee_login authsection" id="employeelogin" action="" method="POST">
                    <div class="input-box">
                        <input type="email" id="Email"name="Emp_Email" placeholder="Email">
                        <i class='bx bxs-envelope'></i>
                    </div>
                    <div class="input-box">
                        <input type="password" id="Password" name="Emp_Password" placeholder="Password">
                        <i class='bx bxs-lock-alt'></i>
                    </div>
                    <button type="submit" name="Emp_login_submit" class="btn">Login</button>
                </form>
  </div>
</body>
<script src="./Js/index.js"></script>
</html>