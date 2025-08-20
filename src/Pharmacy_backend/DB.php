<?php
class DB {
    private static $host = "localhost";
    private static $dbname = "pharmacy_db"; 
    private static $username = "root";      
    private static $password = "root";          
    private static $charset = "utf8mb4";

    public static function getConnection() {
        try {
            $dsn = "mysql:host=" . self::$host . ";dbname=" . self::$dbname . ";charset=" . self::$charset;
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
