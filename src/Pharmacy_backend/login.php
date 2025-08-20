<?php
require_once __DIR__ . '/DB.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$role = strtolower(trim($input['role'] ?? ''));

if (!$email || !$password || !$role) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing email, password or role.']);
    exit;
}

try {
    $pdo = DB::getConnection();

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND role = :role LIMIT 1");
    $stmt->execute(['email' => $email, 'role' => $role]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials (user not found).']);
        exit;
    }

  
    if ($password === $user['password_hash']) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid password.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
