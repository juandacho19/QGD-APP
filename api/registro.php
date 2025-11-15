<?php
require_once 'config.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Método no permitido');
}


$input = json_decode(file_get_contents('php://input'), true);


$required = ['email', 'password', 'nombre', 'apellido', 'telefono', 'tipo'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        sendResponse(false, "El campo {$field} es requerido");
    }
}

$email = filter_var($input['email'], FILTER_VALIDATE_EMAIL);
if (!$email) {
    sendResponse(false, 'Email inválido');
}

$password = $input['password'];
$nombre = trim($input['nombre']);
$apellido = trim($input['apellido']);
$telefono = trim($input['telefono']);
$tipo = $input['tipo'];


$tiposPermitidos = ['cliente', 'negocio', 'admin'];
if (!in_array($tipo, $tiposPermitidos)) {
    sendResponse(false, 'Tipo de usuario inválido');
}


if (strlen($password) < 6) {
    sendResponse(false, 'La contraseña debe tener al menos 6 caracteres');
}

try {
    $pdo = getDBConnection();
    if (!$pdo) {
        sendResponse(false, 'Error de conexión a la base de datos');
    }

   
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        sendResponse(false, 'Este correo ya está registrado');
    }

    
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

   
    $sql = "INSERT INTO usuarios (email, password, nombre, apellido, tipo, telefono, fecha_registro, activo) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)";
    
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([$email, $passwordHash, $nombre, $apellido, $tipo, $telefono]);

    if ($result) {
        $userId = $pdo->lastInsertId();
        sendResponse(true, 'Usuario registrado exitosamente', [
            'id' => $userId,
            'email' => $email,
            'nombre' => $nombre,
            'tipo' => $tipo
        ]);
    } else {
        sendResponse(false, 'Error al registrar usuario');
    }

} catch (PDOException $e) {
    error_log("Error en registro: " . $e->getMessage());
    sendResponse(false, 'Error en el servidor');
}
?>