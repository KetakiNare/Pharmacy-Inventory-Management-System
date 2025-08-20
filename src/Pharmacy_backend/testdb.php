<?php
require_once "DB.php";

try {
    $conn = DB::getConnection();

    // Detect environment
    $environment = getenv("RAILWAY_ENVIRONMENT") ? "🚄 Railway" : "💻 Localhost";

    // Get DB info
    $stmt = $conn->query("SELECT USER() as user, DATABASE() as db, VERSION() as version");
    $row = $stmt->fetch();

    echo "✅ Connected successfully to Database!<br>";
    echo "🌍 Environment: <b>" . $environment . "</b><br>";
    echo "📌 Database: " . $row['db'] . "<br>";
    echo "👤 User: " . $row['user'] . "<br>";
    echo "🛠 MySQL Version: " . $row['version'] . "<br>";

} catch (PDOException $e) {
    die("❌ Connection failed: " . $e->getMessage());
}
?>
