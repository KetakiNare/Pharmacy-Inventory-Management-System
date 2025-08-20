<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


require_once __DIR__ . '/DB.php';

try {
    $pdo = DB::getConnection();

    $action = $_GET['action'] ?? '';

    if ($action === 'alldata') {
        $stmt = $pdo->query("SELECT COUNT(*) AS total FROM medicines");
        $total_medicines = (int)$stmt->fetch()['total'];

        // 2. Expiring soon
        $stmt = $pdo->prepare("
            SELECT COUNT(*) AS expiring 
            FROM medicines 
            WHERE exp <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
        ");
        $stmt->execute();
        $expiring_soon = (int)$stmt->fetch()['expiring'];

        // 3. Low stock
        $stmt = $pdo->prepare("SELECT COUNT(*) AS low FROM medicines WHERE qty <= 10");
        $stmt->execute();
        $low_stock = (int)$stmt->fetch()['low'];

        // 4. Monthly sales 
        $stmt = $pdo->prepare("
            SELECT IFNULL(SUM(subtotal), 0) AS monthly_sales 
            FROM sales 
            WHERE MONTH(sale_date) = MONTH(CURDATE()) 
              AND YEAR(sale_date) = YEAR(CURDATE())
        ");
        $stmt->execute();
        $monthly_sales = (float)$stmt->fetch()['monthly_sales'];

        // 5. Stock distribution by category
        $stmt = $pdo->query("
            SELECT category AS name, COUNT(*) AS value 
            FROM medicines 
            GROUP BY category
        ");
        $stock_distribution = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // 6. Monthly sales vs stock (last 6 months)
        $stmt = $pdo->query("
            SELECT 
                DATE_FORMAT(s.sale_date, '%Y-%m') AS month,
                SUM(si.quantity) AS total_quantity,
                SUM(si.quantity * si.price) AS total_amount
            FROM sales s
            JOIN sale_items si ON s.id = si.sale_id
            GROUP BY month
            ORDER BY month DESC
            LIMIT 6
        ");
        $monthly_sales_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
// 7. Daily, Monthly, and Yearly Sales Data
$stmt = $pdo->query("
    SELECT 
        DATE(sale_date) AS date,
        SUM(subtotal) AS daily_sales
    FROM sales
    GROUP BY date
    ORDER BY date DESC
    LIMIT 30
");
$daily_sales_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->query("
    SELECT 
        DATE_FORMAT(sale_date, '%Y-%m') AS month,
        SUM(subtotal) AS monthly_sales
    FROM sales
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
");
$monthly_sales_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->query("
    SELECT 
        YEAR(sale_date) AS year,
        SUM(subtotal) AS yearly_sales
    FROM sales
    GROUP BY year
    ORDER BY year DESC
    LIMIT 5
");
$yearly_sales_data = $stmt->fetchAll(PDO::FETCH_ASSOC);


echo json_encode([
    "total_medicines"      => $total_medicines,
    "expiring_soon"        => $expiring_soon,
    "low_stock"            => $low_stock,
    "monthly_sales"        => $monthly_sales,
    "stock_distribution"   => $stock_distribution,
    "monthly_sales_data"   => $monthly_sales_data,
    "daily_sales_data"     => $daily_sales_data,
    "monthly_sales_data"   => $monthly_sales_data,
    "yearly_sales_data"    => $yearly_sales_data
]);

    } else {
        echo json_encode(["error" => "Invalid action"]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
