<?php
class DB {
    private static $host;
    private static $dbname;
    private static $username;
    private static $password;
    private static $port;
    private static $charset = "utf8mb4";

    public static function getConnection() {
        self::$host = getenv("DB_HOST") ?: "127.0.0.1";
        self::$dbname = getenv("DB_NAME") ?: "pharmacy_db";
        self::$username = getenv("DB_USER") ?: "root";
        self::$password = getenv("DB_PASS") ?: "root";   
        self::$port = getenv("DB_PORT") ?: "3306";

        try {
            $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . self::$dbname . ";charset=" . self::$charset;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            return new PDO($dsn, self::$username, self::$password, $options);
        } catch (PDOException $e) {
            die("❌ Connection failed: " . $e->getMessage());
        }
    }
}
?>
