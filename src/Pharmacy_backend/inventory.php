<?php
require_once 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; 
}

$pdo = DB::getConnection();


$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = json_decode(file_get_contents("php://input"), true);

switch ($action) {
    case 'fetch':
        $stmt = $pdo->query("SELECT * FROM medicines ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        break;
    
    case 'getCategories':
    $stmt = $pdo->query("SELECT DISTINCT category FROM medicines ORDER BY category ASC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC)); 
    break;



   case 'add':
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode(['error' => 'No data received']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO medicines (name, batch, category, qty, mfg, exp, cost, price, supplier)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['name'],
        $data['batch'],
        $data['category'],
        $data['qty'],
        $data['mfg'],
        $data['exp'],
        $data['cost'],
        $data['price'],
        $data['supplier']
    ]);

    $data['id'] = $pdo->lastInsertId();
    echo json_encode($data);
    break;

    case 'update':
        if (!$data || !isset($data['id'])) {
            echo json_encode(['error' => 'Invalid data']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE medicines SET name=?, batch=?, category=?, qty=?, mfg=?, exp=?, cost=?, price=?, supplier=? WHERE id=?");
        $stmt->execute([
            $data['name'],
            $data['batch'],
            $data['category'],
            $data['qty'],
            $data['mfg'],
            $data['exp'],
            $data['cost'],
            $data['price'],
            $data['supplier'],
            $data['id']
        ]);

        echo json_encode(['success' => true]);
        break;

    case 'delete':
        if (!$data || !isset($data['id'])) {
            echo json_encode(['error' => 'Invalid ID']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM medicines WHERE id=?");
        $stmt->execute([$data['id']]);

        echo json_encode(['success' => true]);
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
}
?>
