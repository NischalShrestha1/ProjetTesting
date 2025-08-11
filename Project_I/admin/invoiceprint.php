<?php
ob_start();
include '../config.php';

$id = $_GET['id'];

$sql = "SELECT * FROM payment WHERE id = '$id'";
$re = mysqli_query($conn, $sql);
while ($row = mysqli_fetch_array($re)) {
    $id = $row['id'];
    $Name = $row['Name'];
    $troom = $row['RoomType'];
    $bed = $row['Bed'];
    $nroom = $row['NoofRoom'];
    $cin = $row['cin'];
    $cout = $row['cout'];
    $meal = $row['meal'];
    $ttot = $row['roomtotal'];
    $mepr = $row['mealtotal'];
    $btot = $row['bedtotal'];
    $fintot = $row['finaltotal'];
    $days = $row['noofdays'];
}

// Generate a dynamic invoice number
$invoiceNumber = 'INV-' . str_pad($id, 6, '0', STR_PAD_LEFT); // Example: INV-000001

// Determine room type rate
$type_of_room = 0;
if ($troom == "Superior Room") {
    $type_of_room = 3000;
} else if ($troom == "Deluxe Room") {
    $type_of_room = 2000;
} else if ($troom == "Guest House") {
    $type_of_room = 1500;
} else if ($troom == "Single Room") {
    $type_of_room = 1000;
}

// Determine bed type rate
$type_of_bed = 0;
if ($bed == "Single") {
    $type_of_bed = $type_of_room * 1 / 100;
} else if ($bed == "Double") {
    $type_of_bed = $type_of_room * 2 / 100;
} else if ($bed == "Triple") {
    $type_of_bed = $type_of_room * 3 / 100;
} else if ($bed == "Quad") {
    $type_of_bed = $type_of_room * 4 / 100;
} else if ($bed == "None") {
    $type_of_bed = 0;
}

// Determine meal rate
$type_of_meal = 0;
if ($meal == "Room only") {
    $type_of_meal = 0;
} else if ($meal == "Breakfast") {
    $type_of_meal = $type_of_bed * 2;
} else if ($meal == "Half Board") {
    $type_of_meal = $type_of_bed * 3;
} else if ($meal == "Full Board") {
    $type_of_meal = $type_of_bed * 4;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        /* Add your CSS styling from the earlier example here */
        /* You can include the CSS from your previous version here */
        body {
            font-family: 'Open Sans', sans-serif;
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            padding: 0.5in;
            box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
            background-color: #FFF;
        }

        h1 {
            font: bold 100% sans-serif;
            letter-spacing: 0.5em;
            text-align: center;
            text-transform: uppercase;
            margin-bottom: 20px;
        }

        header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        header img {
            width: 150px;
        }

        address {
            font-size: 0.85em;
            margin-top: 20px;
        }

        table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        th, td {
            padding: 8px;
            border: 1px solid #DDD;
        }

        th {
            background-color: #EEE;
        }

        .meta {
            float: right;
        }

        .inventory th {
            background-color: #F5F5F5;
        }

        .balance th {
            text-align: right;
        }

        .balance td {
            text-align: right;
            font-weight: bold;
        }

        .contact-info {
            text-align: center;
            margin-top: 20px;
        }

        @media print {
            body {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>

    <header>
        <h1>Invoice</h1>
        <address>
            <p>Jhigu Hotel</p>
            <p>+9779812012012</p>
        </address>
        <img src="../image/logo.jpg" alt="Jhigu Hotel">
    </header>

    <article>
        <address>
            <p><?php echo $Name; ?><br></p>
        </address>

        <table class="meta">
            <tr>
                <th><span>Invoice #</span></th>
                <td><span><?php echo $invoiceNumber; ?></span></td>
            </tr>
            <tr>
                <th><span>Date</span></th>
                <td><span><?php echo $cout; ?></span></td>
            </tr>
        </table>

        <table class="inventory">
            <thead>
                <tr>
                    <th><span>Item</span></th>
                    <th><span>No of Days</span></th>
                    <th><span>Rate</span></th>
                    <th><span>Quantity</span></th>
                    <th><span>Price</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><span><?php echo $troom; ?></span></td>
                    <td><span><?php echo $days; ?></span></td>
                    <td><span>Rs. <?php echo $type_of_room; ?></span></td>
                    <td><span><?php echo $nroom; ?></span></td>
                    <td><span>Rs. <?php echo $ttot; ?></span></td>
                </tr>
                <tr>
                    <td><span><?php echo $bed; ?> Bed</span></td>
                    <td><span><?php echo $days; ?></span></td>
                    <td><span>Rs. <?php echo $type_of_bed; ?></span></td>
                    <td><span><?php echo $nroom; ?></span></td>
                    <td><span>Rs. <?php echo $btot; ?></span></td>
                </tr>
                <tr>
                    <td><span><?php echo $meal; ?></span></td>
                    <td><span><?php echo $days; ?></span></td>
                    <td><span>Rs. <?php echo $type_of_meal; ?></span></td>
                    <td><span><?php echo $nroom; ?></span></td>
                    <td><span>Rs. <?php echo $mepr; ?></span></td>
                </tr>
            </tbody>
        </table>

        <table class="balance">
            <tr>
                <th><span>Total</span></th>
                <td><span>Rs. <?php echo $fintot; ?></span></td>
            </tr>
            <tr>
                <th><span>Amount Paid</span></th>
                <td><span>Rs. </span></td>
            </tr>
            <tr>
                <th><span>Balance Due</span></th>
                <td><span>Rs. <?php echo $fintot; ?></span></td>
            </tr>
        </table>
    </article>

    <aside>
        <h1><span>Contact Us</span></h1>
        <p class="contact-info">Email: info@jhiguhotel.com | Web: www.jhiguhotel.com | Phone: +9779812012012</p>
    </aside>

</body>
</html>

<?php
ob_end_flush();
?>
