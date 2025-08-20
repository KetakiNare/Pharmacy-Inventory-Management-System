<?php
require_once "DB.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$type = $_GET['type'] ?? 'sales';
$from = $_GET['from'] ?? null;
$to   = $_GET['to'] ?? null;

$conn = DB::getConnection();

try {
    if ($type === "sales") {
    $sql = "SELECT s.sale_date AS date, si.name AS medicine, si.quantity, si.total AS amount
            FROM sales s
            JOIN sale_items si ON s.id = si.sale_id
            WHERE 1=1";
    
    $params = [];

    if (!empty($from)) {
        $sql .= " AND s.sale_date >= :from";
        $params['from'] = $from;
    }
    if (!empty($to)) {
        $sql .= " AND s.sale_date <= :to";
        $params['to'] = $to;
    }

    $sql .= " ORDER BY s.sale_date DESC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
} elseif ($type === "inventory") {
        $sql = "SELECT name, batch, qty, cost, price, supplier, exp
                FROM medicines
                ORDER BY name ASC";
        $stmt = $conn->query($sql);
        $rows = $stmt->fetchAll();
    } elseif ($type === "expiry") {
        $sql = "SELECT name, batch, qty, exp
                FROM medicines
                WHERE exp <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
                ORDER BY exp ASC";
        $stmt = $conn->query($sql);
        $rows = $stmt->fetchAll();
    } elseif ($type === "lowstock") {
        $sql = "SELECT name, batch, qty
                FROM medicines
                WHERE qty < 20
                ORDER BY qty ASC";
        $stmt = $conn->query($sql);
        $rows = $stmt->fetchAll();
    }

    echo json_encode(["success" => true, "data" => $rows]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
