<?php

include '../config.php';

$id = $_GET['id'];

$sql = "SELECT * FROM roombook WHERE id = '$id'";
$re = mysqli_query($conn, $sql);

while ($row = mysqli_fetch_array($re)) {
    $Name = $row['Name'];
    $Email = $row['Email'];
    $Country = $row['Country'];
    $Phone = $row['Phone'];
    $RoomType = $row['RoomType'];
    $Bed = $row['Bed'];
    $NoofRoom = $row['NoofRoom'];
    $Meal = $row['Meal'];
    $cin = $row['cin'];
    $cout = $row['cout'];
    $noofday = $row['nodays'];
    $stat = $row['stat'];
}

if ($stat == "NotConfirm") {
    $st = "Confirm";
    $sql = "UPDATE roombook SET stat = '$st' WHERE id = '$id'";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        $type_of_room = 0;
        if ($RoomType == "Superior Room") {
            $type_of_room = 3000;
        } else if ($RoomType == "Deluxe Room") {
            $type_of_room = 2000;
        } else if ($RoomType == "Guest House") {
            $type_of_room = 1500;
        } else if ($RoomType == "Single Room") {
            $type_of_room = 1000;
        }

        $type_of_bed = 0;
        if ($Bed == "Single") {
            $type_of_bed = $type_of_room * 1 / 100;
        } else if ($Bed == "Double") {
            $type_of_bed = $type_of_room * 2 / 100;
        } else if ($Bed == "Triple") {
            $type_of_bed = $type_of_room * 3 / 100;
        } else if ($Bed == "Quad") {
            $type_of_bed = $type_of_room * 4 / 100;
        }

        $type_of_meal = 0;
        if ($Meal == "Room only") {
            $type_of_meal = $type_of_bed * 0;
        } else if ($Meal == "Breakfast") {
            $type_of_meal = $type_of_bed * 2;
        } else if ($Meal == "Half Board") {
            $type_of_meal = $type_of_bed * 3;
        } else if ($Meal == "Full Board") {
            $type_of_meal = $type_of_bed * 4;
        }

        $ttot = $type_of_room * $noofday * $NoofRoom;
        $mepr = $type_of_meal * $noofday * $NoofRoom;
        $btot = $type_of_bed * $noofday * $NoofRoom;
        $fintot = $ttot + $mepr + $btot;

        // Check if the entry already exists
        $checkSql = "SELECT * FROM payment WHERE id = '$id'";
        $checkResult = mysqli_query($conn, $checkSql);

        if (mysqli_num_rows($checkResult) > 0) {
            // Update existing entry
            $psql = "UPDATE payment SET Name='$Name', Email='$Email', RoomType='$RoomType', Bed='$Bed', NoofRoom='$NoofRoom', cin='$cin', cout='$cout', noofdays='$noofday', roomtotal='$ttot', bedtotal='$btot', meal='$Meal', mealtotal='$mepr', finaltotal='$fintot' WHERE id='$id'";
        } else {
            // Insert new entry
            $psql = "INSERT INTO payment (id, Name, Email, RoomType, Bed, NoofRoom, cin, cout, noofdays, roomtotal, bedtotal, meal, mealtotal, finaltotal) VALUES ('$id', '$Name', '$Email', '$RoomType', '$Bed', '$NoofRoom', '$cin', '$cout', '$noofday', '$ttot', '$btot', '$Meal', '$mepr', '$fintot')";
        }

        mysqli_query($conn, $psql);

        header("Location: roombook.php");
    }
} else {
    // Uncomment if you want to handle the case where the guest is already confirmed
    // echo "<script>alert('Guest Already Confirmed')</script>";
    // header("Location: roombook.php");
}

?>
