<?php

include '../config.php';

$id = $_GET['id'];

// Delete the record
$deletesql = "DELETE FROM roombook WHERE id = $id";
if (mysqli_query($conn, $deletesql)) {
    // Reindex the IDs to fill the gap
    $updatesql = "SET @count = 0;";
    mysqli_query($conn, $updatesql);
    
    $updatesql = "UPDATE roombook SET id = @count := @count + 1 ORDER BY id ASC;";
    mysqli_query($conn, $updatesql);

    // Get the maximum id value to reset auto-increment
    $maxIdSql = "SELECT MAX(id) AS max_id FROM roombook";
    $result = mysqli_query($conn, $maxIdSql);
    $row = mysqli_fetch_assoc($result);
    $maxId = $row['max_id'];

    // If there are no records, set auto-increment to 1
    if ($maxId === null) {
        $maxId = 0;
    }
    $resetsql = "ALTER TABLE roombook AUTO_INCREMENT = " . ($maxId + 1);
    mysqli_query($conn, $resetsql);
}

header("Location: roombook.php");

?>
