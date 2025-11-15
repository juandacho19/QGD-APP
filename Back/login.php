<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Manejar preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Configuración de errores para debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

// Clave secreta consistente
const JWT_SECRET_KEY = 'QuibdoGuiaDorada_2024_)X:2i=jeclHakN:OVPT[XK.i!6W*SP2OVm!6$AZ;$Z%Q#@0';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quibdo_guia_dorada";

// Log de inicio para debugging
error_log("=== INICIO LOGIN DEBUG ===");
error_log("Método: " . $_SERVER['REQUEST_METHOD']);

$conn = new mysqli($servername, $username, $password, $dbname);

// Establecer charset UTF-8
$conn->set_charset("utf8");

if ($conn->connect_error) {
    error_log("Error de conexión: " . $conn->connect_error);
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos",
        "debug" => $conn->connect_error
    ]);
    exit();
}

error_log("Conexión a BD exitosa");

// Verificar que sea POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("Método no permitido: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Método no permitido"
    ]);
    exit();
}

$input = file_get_contents("php://input");
error_log("Input recibido: " . $input);

$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("Error JSON: " . json_last_error_msg());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "JSON inválido",
        "debug" => json_last_error_msg()
    ]);
    exit();
}

$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

error_log("Email recibido: " . $email);
error_log("Password length: " . strlen($password));

// Validaciones de entrada
if (empty($email) || empty($password)) {
    error_log("Campos vacíos - Email: " . ($email ? "OK" : "VACÍO") . ", Password: " . ($password ? "OK" : "VACÍO"));
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Correo y contraseña son obligatorios"
    ]);
    exit();
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error_log("Email con formato inválido: " . $email);
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Formato de correo electrónico inválido"
    ]);
    exit();
}

try {
    // Primero verificar si el usuario existe
    $checkStmt = $conn->prepare("SELECT COUNT(*) as count FROM usuarios WHERE email = ?");
    if (!$checkStmt) {
        throw new Exception("Error en preparación de consulta de verificación: " . $conn->error);
    }
    
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $userCount = $checkResult->fetch_assoc()['count'];
    $checkStmt->close();
    
    error_log("Usuarios encontrados con email " . $email . ": " . $userCount);
    
    if ($userCount == 0) {
        error_log("Usuario no encontrado: " . $email);
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error" => "Usuario no registrado. Por favor regístrese primero.",
            "debug" => "No user found with email: " . $email
        ]);
        exit();
    }

    // Obtener datos del usuario
    $stmt = $conn->prepare("SELECT id, nombres, apellidos, email, password, rol, activo FROM usuarios WHERE email = ?");
    
    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta: " . $conn->error);
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        error_log("Usuario encontrado - ID: " . $user['id'] . ", Activo: " . $user['activo']);

        // Verificar si el usuario está activo
        if (!$user['activo']) {
            error_log("Usuario desactivado: " . $email);
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "error" => "Cuenta desactivada. Contacte al administrador.",
                "debug" => "usuario inactivo"
            ]);
            $stmt->close();
            exit();
        }

        // Verificar contraseña
        error_log("Verificando contraseña...");
        $passwordVerified = password_verify($password, $user['password']);
        error_log("Password verificado: " . ($passwordVerified ? "SÍ" : "NO"));
        
        if ($passwordVerified) {
            // Generar JWT token
            $token = generateJWT($user['id'], $user['email'], $user['rol']);
            
            // Guardar sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nombres'];
            $_SESSION['user_last_name'] = $user['apellidos'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION ['user_role'] = $user['rol'];
            
            // Actualizar último login
            $updateStmt = $conn->prepare("UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?");
            if ($updateStmt) {
                $updateStmt->bind_param("i", $user['id']);
                $updateStmt->execute();
                $updateStmt->close();
            }
            
            error_log("Login exitoso para usuario: " . $user['email']);
            
            echo json_encode([
                "success" => true,
                "message" => "Bienvenido a Quibdó Guía Dorada",
                "token" => $token,
                "user" => [
                    "id"        => (int) $user['id'],
                    "nombres"   => $user['nombres'],
                    "apellidos" => $user['apellidos'],
                    "email"     => $user['email'],
                    "rol" => (int) $user['rol']
                ]
            ]);
        } else {
            error_log("Contraseña incorrecta para usuario: " . $email);
            
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "error" => "Contraseña incorrecta. Verifique sus credenciales.",
                "debug" => "Password verification failed"
            ]);
        }
    } else {
        error_log("Usuario no encontrado en consulta principal: " . $email);
        
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error" => "Usuario no encontrado",
            "debug" => "User not found in main query"
        ]);
    }
    
    $stmt->close();
} catch (Exception $e) {
    error_log("Excepción en login.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error interno del servidor",
        "debug" => $e->getMessage()
    ]);
}

function generateJWT($user_id, $email, $rol) {
    $header = json_encode([
        'typ' => 'JWT', 
        'alg' => 'HS256'
    ]);
    
    $payload = json_encode([
        'user_id' => (int) $user_id,
        'email' => $email,
        'rol' => (int) $rol,
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // 24 horas
    ]);
    
    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
    
    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET_KEY, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    
    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

$conn->close();
error_log("=== FIN LOGIN DEBUG ===");
?>