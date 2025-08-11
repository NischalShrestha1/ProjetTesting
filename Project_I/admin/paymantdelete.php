<?php

include '../config.php';

$id = intval($_GET['id']); // Ensure the id is an integer to prevent SQL injection

// Step 1: Delete the record
$deletesql = "DELETE FROM payment WHERE id = $id";
$result = mysqli_query($conn, $deletesql);

if ($result) {
    // Step 2: Reorder the IDs
    $reorderSQL = "SET @count = 0; 
                   UPDATE payment SET id = (@count := @count + 1); 
                   ALTER TABLE payment AUTO_INCREMENT = 1;";
    mysqli_multi_query($conn, $reorderSQL);

    // Redirect after processing
    header("Location: payment.php");
} else {
    echo "Error deleting record: " . mysqli_error($conn);
}
header("Location: payment.php");

?>
