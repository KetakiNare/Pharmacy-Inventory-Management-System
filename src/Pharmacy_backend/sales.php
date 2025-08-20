<?php
require_once 'db.php'; 


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

class Sales {
    private $conn;

    public function __construct() {
        $this->conn = DB::getConnection(); 
    }

    
    public function getCategories() {
        try {
            $stmt = $this->conn->prepare("SELECT DISTINCT category FROM medicines ORDER BY category");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_COLUMN);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    
    public function getMedicinesByCategory($category) {
        try {
            $stmt = $this->conn->prepare("SELECT id, name FROM medicines WHERE category = :category");
            $stmt->bindParam(':category', $category);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    
    public function getMedicineDetails($medicineId) {
        try {
            $stmt = $this->conn->prepare("
                SELECT id, name, batch, price, exp, qty
                FROM medicines
                WHERE id = :id
            ");
            $stmt->bindParam(':id', $medicineId, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    
    public function saveSale($data) {
        try {
            $this->conn->beginTransaction();

            
            $stmt = $this->conn->prepare("
                INSERT INTO sales (customer_name, sale_date, payment_mode, subtotal)
                VALUES (:customer_name, :sale_date, :payment_mode, :subtotal)
            ");
            $stmt->execute([
                ':customer_name' => $data['customerName'],
                ':sale_date'     => $data['saleDate'],
                ':payment_mode'  => $data['paymentMode'],
                ':subtotal'      => $data['subtotal']
            ]);

            $saleId = $this->conn->lastInsertId();

            
            foreach ($data['cartItems'] as $item) {
                
                $stmtItem = $this->conn->prepare("
                    INSERT INTO sale_items (sale_id, medicine_id, name, batch_no, price, quantity, total)
                    VALUES (:sale_id, :medicine_id, :name, :batch_no, :price, :quantity, :total)
                ");
                $stmtItem->execute([
                    ':sale_id'     => $saleId,
                    ':medicine_id' => $item['id'], 
                    ':name'        => $item['name'],
                    ':batch_no'    => $item['batchNo'],
                    ':price'       => $item['price'],
                    ':quantity'    => $item['quantity'],
                    ':total'       => $item['total']
                ]);

                
                $stmtUpdate = $this->conn->prepare("
                    UPDATE medicines
                    SET qty = qty - :quantity
                    WHERE id = :medicine_id
                ");
                $stmtUpdate->execute([
                    ':quantity'    => $item['quantity'],
                    ':medicine_id' => $item['id']
                ]);
            }

            $this->conn->commit();
            return ['success' => true];

        } catch (PDOException $e) {
            $this->conn->rollBack();
            return ['error' => $e->getMessage()];
        }
    }

   
    public function handleRequest() {
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            if (isset($_GET['action'])) {
                switch ($_GET['action']) {
                    case 'categories':
                        echo json_encode($this->getCategories());
                        break;

                    case 'medicines':
                        if (isset($_GET['category'])) {
                            echo json_encode($this->getMedicinesByCategory($_GET['category']));
                        } else {
                            echo json_encode(['error' => 'Category parameter missing']);
                        }
                        break;

                    case 'medicineDetails':
                        if (isset($_GET['id'])) {
                            echo json_encode($this->getMedicineDetails($_GET['id']));
                        } else {
                            echo json_encode(['error' => 'Medicine ID parameter missing']);
                        }
                        break;

                    default:
                        echo json_encode(['error' => 'Invalid action']);
                }
            } else {
                echo json_encode(['error' => 'No action specified']);
            }
        }
        elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (isset($_GET['action']) && $_GET['action'] === 'saveSale') {
                $data = json_decode(file_get_contents("php://input"), true);
                echo json_encode($this->saveSale($data));
                exit;
            } else {
                echo json_encode(['error' => 'Invalid POST action']);
            }
        }
        else {
            echo json_encode(['error' => 'Invalid request method']);
        }
    }
}

$api = new Sales();
$api->handleRequest();
?>
