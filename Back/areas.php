<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Configuración de la Base de Datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quibdo_guia_dorada";

// Conexión a la Base de Datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Establecer charset UTF-8
$conn->set_charset("utf8");

// Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos",
        "debug" => $conn->connect_error
    ]);
    exit();
}

// Verificar que sea GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Método no permitido"
    ]);
    exit();
}

try {
    // Consultar áreas de interés
    $sql = "SELECT id, nombre, codigo, categoria FROM areas_interes ORDER BY categoria, nombre";
    $result = $conn->query($sql);
    
    if ($result) {
        $areas = array();
        
        while ($row = $result->fetch_assoc()) {
            $areas[] = [
                "id" => (int) $row['id'],
                "nombre" => $row['nombre'],
                "codigo" => $row['codigo'],
                "categoria" => $row['categoria']
            ];
        }
        
        echo json_encode([
            "success" => true,
            "areas" => $areas
        ]);
    } else {
        throw new Exception("Error al consultar las áreas: " . $conn->error);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al obtener las áreas de interés",
        "debug" => $e->getMessage()
    ]);
}

$conn->close();
?>