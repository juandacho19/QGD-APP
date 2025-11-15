<?php
// Permitir solicitudes desde cualquier origen
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar la solicitud OPTIONS para preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 1. Configuración de la Base de Datos
$servername = "localhost";
$username = "root"; // ⚠️ Cambia por tu usuario de MySQL
$password = "";     // ⚠️ Cambia por tu contraseña de MySQL
$dbname = "quibdo_guia_dorada"; // ⚠️ Cambia por el nombre de tu base de datos

// 2. Conexión a la Base de Datos
$conn = new mysqli($servername, $username, $password, $dbname);

// Establecer charset UTF-8
$conn->set_charset("utf8");

// 3. Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos: " . $conn->connect_error]);
    exit();
}

// 4. Recepción y validación de datos
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (
    !isset($data['nombres']) ||
    !isset($data['apellidos']) ||
    !isset($data['cedula']) ||
    !isset($data['email']) ||
    !isset($data['telefono']) ||
    !isset($data['areaInteres']) ||
    !isset($data['experiencia']) ||
    !isset($data['password'])
) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Faltan campos obligatorios"]);
    $conn->close();
    exit();
}

// Sanitizar y escapar datos para prevenir inyección SQL
$nombres = $conn->real_escape_string(trim($data['nombres']));
$apellidos = $conn->real_escape_string(trim($data['apellidos']));
$cedula = $conn->real_escape_string(trim($data['cedula']));
$email = $conn->real_escape_string(trim($data['email']));
$telefono = $conn->real_escape_string(trim($data['telefono']));
$areaInteres = $conn->real_escape_string(trim($data['areaInteres']));
$experiencia = $conn->real_escape_string(trim($data['experiencia']));
$password = $data['password'];

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Formato de correo electrónico inválido"]);
    $conn->close();
    exit();
}

// Validar que la cédula sea numérica
if (!is_numeric($cedula)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "La cédula debe contener solo números"]);
    $conn->close();
    exit();
}

// Validar que la experiencia sea numérica
if (!is_numeric($experiencia)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Los años de experiencia deben ser un número"]);
    $conn->close();
    exit();
}

// 5. Verificación de duplicados (email y cédula)
$sql_check = "SELECT id FROM usuarios WHERE email = ? OR cedula = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("ss", $email, $cedula);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    http_response_code(409); // Código de conflicto
    echo json_encode(["success" => false, "error" => "El correo o la cédula ya están registrados."]);
    $stmt_check->close();
    $conn->close();
    exit();
}
$stmt_check->close();

// 6. Hashear la contraseña por seguridad
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 7. Inserción de datos en la base de datos
$sql_insert = "INSERT INTO usuarios (nombres, apellidos, cedula, email, telefono, area_interes, experiencia, password, fecha_registro, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(),1)";
$stmt_insert = $conn->prepare($sql_insert);
$stmt_insert->bind_param("ssssssss", $nombres, $apellidos, $cedula, $email, $telefono, $areaInteres, $experiencia, $hashed_password );

if ($stmt_insert->execute()) {
    http_response_code(201); // Código de creado
    echo json_encode([
        "success" => true, 
        "message" => "¡Registro exitoso! Ahora puedes iniciar sesión y explorar oportunidades laborales."
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error al registrar el usuario: " . $conn->error]);
}

$stmt_insert->close();
$conn->close();
?>