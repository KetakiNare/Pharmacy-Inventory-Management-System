<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "DB.php";

$data = json_decode(file_get_contents("php://input"), true);


if (!isset($data['username'], $data['email'], $data['password'], $data['role'])) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$username = $data['username'];
$email = $data['email'];
$password_hash = $data['password'];
$role = $data['role'];

try {
    $conn = DB::getConnection();

   
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Username or email already exists"]);
        exit;
    }

    
    $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $email, $password_hash, $role]);

    echo json_encode(["success" => true, "message" => "Signup successful"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
