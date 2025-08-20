<?php
require_once "DB.php";


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

header('Content-Type: application/json');

try {
    $pdo = DB::getConnection();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

   
    $sqlExpiring = "
        SELECT name 
        FROM medicines 
        WHERE exp <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ORDER BY exp ASC
    ";
    $stmtExpiring = $pdo->prepare($sqlExpiring);
    $stmtExpiring->execute();
    $expiringMedicines = $stmtExpiring->fetchAll(PDO::FETCH_COLUMN);

    
    $sqlLowStock = "
        SELECT name 
        FROM medicines 
        WHERE qty < 10
        ORDER BY qty ASC
    ";
    $stmtLowStock = $pdo->prepare($sqlLowStock);
    $stmtLowStock->execute();
    $lowStockMedicines = $stmtLowStock->fetchAll(PDO::FETCH_COLUMN);

   
    echo json_encode([
        "status" => "success",
        "expiringSoon" => [
            "count" => count($expiringMedicines),
            "medicines" => $expiringMedicines
        ],
        "lowStock" => [
            "count" => count($lowStockMedicines),
            "medicines" => $lowStockMedicines
        ]
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
