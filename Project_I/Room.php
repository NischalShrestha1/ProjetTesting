<?php

include 'config.php';
session_start();

$usermail="";
$usermail=$_SESSION['usermail'];
if($usermail == true){

}else{
  header("location: Login.php");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jhigu Hotel</title>
    <link rel="Stylesheet" href="Css/Room.css">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
</head>
<body>
    <header>
    <nav>
        <a href="Home.php" class="logo">Jhigu Hotel</a>
        <ul>
        <li><a href="Home.php">Home</a></li>
        <li><a href="Room.php">Rooms</a></li>
        <li><a href="Team.html">Team</a></li>
        <li><a href="Gallery.html">Gallery</a></li>
        <li><a href="Contacts.html">Contact Us</a></li>
        </ul>
        <div class="logout">
          <a href="Logout.php">Log Out</a>
      </div>
    </nav>
    </header>

    <section id="firstsection">
      <div id="guestdetailpanel">
        <form action="" method="POST" class="guestdetailpanelform">
            <div class="head">
                <h3>RESERVATION</h3>
                <i class="fa-solid fa-circle-xmark" onclick="closebox()"></i>
            </div>
            <div class="middle">
                <div class="guestinfo">
                    <h4>Guest information</h4>
                    <input type="text" name="Name" placeholder="Enter Full name">
                    <input type="email" name="Email" placeholder="Enter Email">

                    <?php
                    $countries = array("Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe");
                    ?>

                    <select name="Country" class="selectinput">
						<option value selected >Select your country</option>
                        <?php
							foreach($countries as $key => $value):
							echo '<option value="'.$value.'">'.$value.'</option>';
							endforeach;
						?>
                    </select>
                    <input type="text" name="Phone" placeholder="Enter Phoneno">
                </div>

                <div class="line"></div>

                <div class="reservationinfo">
                    <h4>Reservation information</h4>
                    <select id="RoomType" name="RoomType" class="selectinput">
						<option value selected >Type Of Room</option>
                        <option value="Superior Room">SUPERIOR ROOM</option>
                        <option value="Deluxe Room">DELUXE ROOM</option>
						<option value="Guest House">GUEST HOUSE</option>
						<option value="Single Room">SINGLE ROOM</option>
                    </select>
                    <select id="Bed" name="Bed" class="selectinput">
						<option value selected >Bedding Type</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
						<option value="Triple">Triple</option>
                        <option value="Quad">Quad</option>
						<option value="None">None</option>
                    </select>
                    <select name="NoofRoom" class="selectinput">
						<option value selected >No of Room</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <select id="Meal" name="Meal" class="selectinput">
						<option value selected >Meal</option>
                        <option value="Room only">Room only</option>
                        <option value="Breakfast">Breakfast</option>
						<option value="Half Board">Half Board</option>
						<option value="Full Board">Full Board</option>
					</select>
                    <div class="datesection">
    <span>
        <label for="cin"> Check-In</label>
        <input id="checkInDate" name="cin" type="date" min="<?= date('Y-m-d'); ?>">
    </span>
    <span>
        <label for="cout"> Check-Out</label>
        <input id="checkOutDate" name="cout" type="date" min="<?= date('Y-m-d'); ?>">
    </span>
</div>
                    <p id="totalPrice">Total Price: Rs.0</p>
                </div>
            </div>
            <div class="footer">
                <button class="subbtn" name="guestdetailsubmit">Submit</button>
            </div>
        </form>

        <?php       
        // <!-- room availablity start-->

        $rsql ="select * from room";
        $rre= mysqli_query($conn,$rsql);
        $r = 0;
        $sc = 0;
        $gh = 0;
        $sr = 0;
        $dr = 0;

        while($rrow=mysqli_fetch_array($rre))
        {
            $r = $r + 1;
            $s = $rrow['type'];
            if($s=="Superior Room")
            {
                $sc = $sc+ 1;
            }
            if($s=="Guest House")
            {
                $gh = $gh + 1;
            }
            if($s=="Single Room" )
            {
                $sr = $sr + 1;
            }
            if($s=="Deluxe Room" )
            {
                $dr = $dr + 1;
            }
        }

        $csql ="select * from payment";
        $cre= mysqli_query($conn,$csql);
        $cr =0 ;
        $csc =0;
        $cgh = 0;
        $csr = 0;
        $cdr = 0;
        while($crow=mysqli_fetch_array($cre))
        {
            $cr = $cr + 1;
            $cs = $crow['RoomType'];
                        
            if($cs=="Superior Room")
            {
                $csc = $csc + 1;
            }
                        
            if($cs=="Guest House" )
            {
                $cgh = $cgh + 1;
            }
            if($cs=="Single Room")
            {
                $csr = $csr + 1;
            }
            if($cs=="Deluxe Room")
            {
                $cdr = $cdr + 1;
            }
        }
        // room availablity
        // Superior Room =>
        $f1 =$sc - $csc;
        if($f1 <=0 )
        {	
            $f1 = "NO";
        }
        // Guest House =>
        $f2 =  $gh -$cgh;
        if($f2 <=0 )
        {	
            $f2 = "NO";
        }
        // Single Room =>
        $f3 =$sr - $csr;
        if($f3 <=0 )
        {	
            $f3 = "NO";
        }
        // Deluxe Room =>
        $f4 =$dr - $cdr; 
        if($f4 <=0 )
        {	
            $f4 = "NO";
        }
        //total available room =>
        $f5 =$r-$cr; 
        if($f5 <=0 )
        {
            $f5 = "NO";
        }
        ?>

        <?php       
           if (isset($_POST['guestdetailsubmit'])) {
            $Name = $_POST['Name'];
            $Email = $_POST['Email'];
            $Country = $_POST['Country'];
            $Phone = $_POST['Phone'];
            $RoomType = $_POST['RoomType'];
            $Bed = $_POST['Bed'];
            $NoofRoom = $_POST['NoofRoom'];
            $Meal = $_POST['Meal'];
            $cin = $_POST['cin'];
            $cout = $_POST['cout'];
        
            if (empty($Name) || empty($Email) || empty($Country)) {
                echo "<script>swal({
                    title: 'Fill the proper details',
                    icon: 'error',
                });
                </script>";
            } else {
                // Check for duplicate booking
                $duplicateCheckQuery = "SELECT * FROM roombook WHERE 
                    Name = '$Name' AND 
                    Email = '$Email' AND 
                    RoomType = '$RoomType' AND 
                    cin = '$cin' AND 
                    cout = '$cout'";
                $duplicateCheckResult = mysqli_query($conn, $duplicateCheckQuery);
        
                if (mysqli_num_rows($duplicateCheckResult) > 0) {
                    // Duplicate booking found
                    echo "<script>swal({
                        title: 'Duplicate booking found',
                        text: 'You have already made a reservation with the same details.',
                        icon: 'warning',
                    });
                    </script>";
                } else {
                    // Proceed with availability check and booking
                    $roomCheckQuery = "SELECT * FROM room WHERE type = '$RoomType' AND bedding = '$Bed'";
                    $roomCheckResult = mysqli_query($conn, $roomCheckQuery);
                    $availableRooms = mysqli_num_rows($roomCheckResult);
        
                    $bookingCheckQuery = "SELECT * FROM roombook WHERE RoomType = '$RoomType' AND Bed = '$Bed' AND 
                                          (cin <= '$cout' AND cout >= '$cin')";
                    $bookingCheckResult = mysqli_query($conn, $bookingCheckQuery);
                    $bookedRooms = mysqli_num_rows($bookingCheckResult);
        
                    $roomsLeft = $availableRooms - $bookedRooms;
        
                    if ($roomsLeft >= $NoofRoom) {
                        $sta = "NotConfirm";
                        $sql = "INSERT INTO roombook(Name, Email, Country, Phone, RoomType, Bed, NoofRoom, Meal, cin, cout, stat, nodays) 
                                VALUES ('$Name', '$Email', '$Country', '$Phone', '$RoomType', '$Bed', '$NoofRoom', '$Meal', '$cin', '$cout', '$sta', datediff('$cout','$cin'))";
                        $result = mysqli_query($conn, $sql);
        
                        if ($result) {
                            echo "<script>swal({
                                title: 'Reservation successful',
                                icon: 'success',
                            });
                            </script>";
                        } else {
                            echo "<script>swal({
                                title: 'Something went wrong',
                                icon: 'error',
                            });
                            </script>";
                        }
                    } else {
                        echo "<script>swal({
                            title: 'Not enough rooms available',
                            icon: 'warning',
                        });
                        </script>";
                    }
                }
            }
        }
        
        ?>
          </div>
    </div>
  </section>

    <section id="secondsection"> 
        <img src="./image/homeanimatebg.svg">
        <div class="ourroom">
          <h1 class="head"> Our room </h1>
          <div class="roomselect">
          <div class="roombox">
    <div class="hotelphoto h1"></div>
    <div class="roomdata">
        <h2>Superior Room</h2>
        <div class="services">
            <i class="fa-solid fa-wifi"></i>
            <i class="fa-solid fa-burger"></i>
            <i class="fa-solid fa-spa"></i>
            <i class="fa-solid fa-dumbbell"></i>
            <i class="fa-solid fa-person-swimming"></i>
        </div>
        <button onclick="openbookbox('Superior Room')">Book</button>
    </div>
</div>
<div class="roombox">
    <div class="hotelphoto h2"></div>
    <div class="roomdata">
        <h2>Deluxe Room</h2>
        <div class="services">
            <i class="fa-solid fa-wifi"></i>
            <i class="fa-solid fa-burger"></i>
            <i class="fa-solid fa-spa"></i>
            <i class="fa-solid fa-dumbbell"></i>
        </div>
        <button onclick="openbookbox('Deluxe Room')">Book</button>
    </div>
</div>
<div class="roombox">
    <div class="hotelphoto h3"></div>
    <div class="roomdata">
        <h2>Guest Room</h2>
        <div class="services">
            <i class="fa-solid fa-wifi"></i>
            <i class="fa-solid fa-burger"></i>
            <i class="fa-solid fa-spa"></i>
        </div>
        <button onclick="openbookbox('Guest House')">Book</button>
    </div>
</div>
<div class="roombox">
    <div class="hotelphoto h4"></div>
    <div class="roomdata">
        <h2>Single Room</h2>
        <div class="services">
            <i class="fa-solid fa-wifi"></i>
            <i class="fa-solid fa-burger"></i>
        </div>
        <button onclick="openbookbox('Single Room')">Book</button>
    </div>
</div>
          </div>
        </div>
      </section>

    <footer class="footer">
        <div class="footerContainer">
           <div class="socialIcons">
            <a href=""><i class="fa-brands fa-facebook"></i></a>
            <a href=""><i class="fa-brands fa-instagram"></i></a>
            <a href=""><i class="fa-brands fa-twitter"></i></a>
            <a href=""><i class="fa-brands fa-google-plus"></i></a>
            <a href=""><i class="fa-brands fa-youtube"></i></a>
           </div>
        </div>
            <div class="footer-bottom">
                <p>Contact info: +9779812012012  Email: info@jhiguhotel.com</p>
                <p>Madhyapur Thimi-7, Bhaktapur</p>
            </div>
          </footer>
</body>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const roomTypePrices = {
        "Superior Room": 3000,
        "Deluxe Room": 2000,
        "Guest House": 1500,
        "Single Room": 1000
    };
    
    const bedTypeMultipliers = {
        "Single": 0.01,
        "Double": 0.02,
        "Triple": 0.03,
        "Quad": 0.04,
        "None": 0.00
    };

    const mealTypeMultipliers = {
        "Room only": 0,
        "Breakfast": 2,
        "Half Board": 3,
        "Full Board": 4
    };

    const roomTypeSelect = document.getElementById('RoomType');
    const bedSelect = document.getElementById('Bed');
    const mealSelect = document.getElementById('Meal');
    const noOfRoomSelect = document.querySelector('select[name="NoofRoom"]');
    const checkInDateInput = document.getElementById('checkInDate');
    const checkOutDateInput = document.getElementById('checkOutDate');
    const totalPriceElement = document.getElementById('totalPrice');

    function calculateDays(checkIn, checkOut) {
        if (!checkIn || !checkOut) return 0;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const differenceInTime = checkOutDate - checkInDate;
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays > 0 ? differenceInDays : 0;
    }

    function updateTotalPrice() {
        const roomType = roomTypeSelect.value;
        const bedType = bedSelect.value;
        const mealType = mealSelect.value;
        const noOfRoom = parseInt(noOfRoomSelect.value) || 1;
        const checkInDate = checkInDateInput.value;
        const checkOutDate = checkOutDateInput.value;

        let typeOfRoom = roomTypePrices[roomType] || 0;
        let typeOfBed = typeOfRoom * (bedTypeMultipliers[bedType] || 0);
        let typeOfMeal = typeOfBed * (mealTypeMultipliers[mealType] || 0);

        let totalPricePerDay = typeOfRoom + typeOfBed + typeOfMeal;
        let numberOfDays = calculateDays(checkInDate, checkOutDate);

        let totalPrice = totalPricePerDay * numberOfDays * noOfRoom;
        totalPriceElement.textContent = `Total Price: Rs.${totalPrice.toFixed(2)}`;
    }

    // Add event listeners
    roomTypeSelect.addEventListener('change', updateTotalPrice);
    bedSelect.addEventListener('change', updateTotalPrice);
    mealSelect.addEventListener('change', updateTotalPrice);
    noOfRoomSelect.addEventListener('change', updateTotalPrice);
    checkInDateInput.addEventListener('change', updateTotalPrice);
    checkOutDateInput.addEventListener('change', updateTotalPrice);

    // Initialize total price on page load
    updateTotalPrice();
});
</script>
<script>
var bookbox = document.getElementById("guestdetailpanel");
var roomTypeSelect = document.getElementById("RoomType");

openbookbox = (roomType) => {
    roomTypeSelect.value = roomType; // Set the selected room type
    bookbox.style.display = "flex";
};

closebox = () => {
    bookbox.style.display = "none";
};
</script>
<script>
    document.getElementById('checkInDate').addEventListener('change', function() {
    const checkInDate = this.value;
    document.getElementById('checkOutDate').setAttribute('min', checkInDate);
});
</script>
</html>