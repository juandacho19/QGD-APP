<?php
/**
 * API REST para CRUD de Productos
 * Endpoints disponibles:
 * - GET    /productos.php           -> Obtener todos los productos
 * - GET    /productos.php?id=1      -> Obtener un producto específico
 * - POST   /productos.php           -> Crear nuevo producto
 * - PUT    /productos.php           -> Actualizar producto
 * - DELETE /productos.php           -> Eliminar producto
 */

require_once 'configuracion.php';

// Crear instancia de la base de datos
$database = new Database();
$db = $database->getConnection();

// Verificar conexión
if (!$db) {
    http_response_code(503);
    echo json_encode([
        "success" => false,
        "message" => "No se pudo conectar a la base de datos"
    ]);
    exit;
}

// Obtener método HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Obtener datos de entrada (para POST, PUT, DELETE)
$input = json_decode(file_get_contents('php://input'), true);

// Enrutamiento según método HTTP
switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            obtenerProducto($db, $_GET['id']);
        } else {
            obtenerProductos($db);
        }
        break;
        
    case 'POST':
        crearProducto($db, $input);
        break;
        
    case 'PUT':
        actualizarProducto($db, $input);
        break;
        
    case 'DELETE':
        eliminarProducto($db, $input);
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Método no permitido"
        ]);
        break;
}

/**
 * Obtener todos los productos con paginación opcional
 */
function obtenerProductos($db) {
    try {
        // Parámetros de paginación
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
        $offset = ($page - 1) * $limit;
        
        // Búsqueda opcional
        $search = isset($_GET['search']) ? $_GET['search'] : '';
        
        // Filtro de disponibilidad
        $disponible = isset($_GET['disponible']) ? $_GET['disponible'] : '';
        
        // Construir query
        $query = "SELECT * FROM productos WHERE 1=1";
        
        if (!empty($search)) {
            $query .= " AND (nombre LIKE :search OR descripcion LIKE :search)";
        }
        
        if ($disponible !== '') {
            $query .= " AND disponible = :disponible";
        }
        
        // Contar total de registros
        $countStmt = $db->prepare("SELECT COUNT(*) as total FROM productos WHERE 1=1" . 
            (!empty($search) ? " AND (nombre LIKE :search OR descripcion LIKE :search)" : "") .
            ($disponible !== '' ? " AND disponible = :disponible" : ""));
        
        if (!empty($search)) {
            $searchParam = "%{$search}%";
            $countStmt->bindParam(":search", $searchParam);
        }
        if ($disponible !== '') {
            $countStmt->bindParam(":disponible", $disponible);
        }
        
        $countStmt->execute();
        $totalRegistros = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Query principal con paginación
        $query .= " ORDER BY id DESC LIMIT :limit OFFSET :offset";
        $stmt = $db->prepare($query);
        
        if (!empty($search)) {
            $searchParam = "%{$search}%";
            $stmt->bindParam(":search", $searchParam);
        }
        if ($disponible !== '') {
            $stmt->bindParam(":disponible", $disponible);
        }
        
        $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindParam(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Formatear precios
        foreach ($productos as &$producto) {
            $producto['precio'] = number_format($producto['precio'], 2, '.', '');
        }
        
        echo json_encode([
            "success" => true,
            "data" => $productos,
            "pagination" => [
                "total" => (int)$totalRegistros,
                "page" => $page,
                "limit" => $limit,
                "pages" => ceil($totalRegistros / $limit)
            ]
        ], JSON_UNESCAPED_UNICODE);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al obtener productos: " . $e->getMessage()
        ]);
    }
}

/**
 * Obtener un producto específico por ID
 */
function obtenerProducto($db, $id) {
    try {
        // Validar ID
        if (!is_numeric($id) || $id <= 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "ID inválido"
            ]);
            return;
        }
        
        $query = "SELECT * FROM productos WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        
        $producto = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($producto) {
            $producto['precio'] = number_format($producto['precio'], 2, '.', '');
            
            echo json_encode([
                "success" => true,
                "data" => $producto
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Producto no encontrado"
            ]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al obtener producto: " . $e->getMessage()
        ]);
    }
}

/**
 * Crear un nuevo producto
 */
function crearProducto($db, $data) {
    try {
        // Validar datos requeridos
        if (empty($data['nombre']) || empty($data['precio'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Nombre y precio son obligatorios"
            ]);
            return;
        }
        
        // Validar precio
        if (!is_numeric($data['precio']) || $data['precio'] < 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "El precio debe ser un número válido"
            ]);
            return;
        }
        
        // Valores por defecto
        $disponible = isset($data['disponible']) ? (int)$data['disponible'] : 1;
        $descripcion = isset($data['descripcion']) ? $data['descripcion'] : '';
        
        $query = "INSERT INTO productos (nombre, precio, disponible, descripcion) 
                  VALUES (:nombre, :precio, :disponible, :descripcion)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(":nombre", $data['nombre']);
        $stmt->bindParam(":precio", $data['precio']);
        $stmt->bindParam(":disponible", $disponible);
        $stmt->bindParam(":descripcion", $descripcion);
        
        if ($stmt->execute()) {
            $nuevoId = $db->lastInsertId();
            
            // Obtener el producto creado
            $queryProducto = "SELECT * FROM productos WHERE id = :id";
            $stmtProducto = $db->prepare($queryProducto);
            $stmtProducto->bindParam(":id", $nuevoId);
            $stmtProducto->execute();
            $producto = $stmtProducto->fetch(PDO::FETCH_ASSOC);
            
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Producto creado exitosamente",
                "data" => $producto
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Error al crear producto"
            ]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error: " . $e->getMessage()
        ]);
    }
}

/**
 * Actualizar un producto existente
 */
function actualizarProducto($db, $data) {
    try {
        // Validar ID
        if (empty($data['id']) || !is_numeric($data['id'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "ID inválido o no proporcionado"
            ]);
            return;
        }
        
        // Verificar que el producto existe
        $queryCheck = "SELECT id FROM productos WHERE id = :id";
        $stmtCheck = $db->prepare($queryCheck);
        $stmtCheck->bindParam(":id", $data['id']);
        $stmtCheck->execute();
        
        if ($stmtCheck->rowCount() === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Producto no encontrado"
            ]);
            return;
        }
        
        // Validar datos
        if (empty($data['nombre']) || empty($data['precio'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Nombre y precio son obligatorios"
            ]);
            return;
        }
        
        if (!is_numeric($data['precio']) || $data['precio'] < 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "El precio debe ser un número válido"
            ]);
            return;
        }
        
        $query = "UPDATE productos 
                  SET nombre = :nombre, 
                      precio = :precio, 
                      disponible = :disponible, 
                      descripcion = :descripcion 
                  WHERE id = :id";
        
        $stmt = $db->prepare($query);
        
        $disponible = isset($data['disponible']) ? (int)$data['disponible'] : 1;
        $descripcion = isset($data['descripcion']) ? $data['descripcion'] : '';
        
        $stmt->bindParam(":id", $data['id']);
        $stmt->bindParam(":nombre", $data['nombre']);
        $stmt->bindParam(":precio", $data['precio']);
        $stmt->bindParam(":disponible", $disponible);
        $stmt->bindParam(":descripcion", $descripcion);
        
        if ($stmt->execute()) {
            // Obtener el producto actualizado
            $queryProducto = "SELECT * FROM productos WHERE id = :id";
            $stmtProducto = $db->prepare($queryProducto);
            $stmtProducto->bindParam(":id", $data['id']);
            $stmtProducto->execute();
            $producto = $stmtProducto->fetch(PDO::FETCH_ASSOC);
            
            echo json_encode([
                "success" => true,
                "message" => "Producto actualizado exitosamente",
                "data" => $producto
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Error al actualizar producto"
            ]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error: " . $e->getMessage()
        ]);
    }
}

/**
 * Eliminar un producto
 */
function eliminarProducto($db, $data) {
    try {
        // Validar ID
        if (empty($data['id']) || !is_numeric($data['id'])) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "ID inválido o no proporcionado"
            ]);
            return;
        }
        
        // Verificar que el producto existe
        $queryCheck = "SELECT nombre FROM productos WHERE id = :id";
        $stmtCheck = $db->prepare($queryCheck);
        $stmtCheck->bindParam(":id", $data['id']);
        $stmtCheck->execute();
        
        $producto = $stmtCheck->fetch(PDO::FETCH_ASSOC);
        
        if (!$producto) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Producto no encontrado"
            ]);
            return;
        }
        
        // Eliminar producto
        $query = "DELETE FROM productos WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $data['id']);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Producto '{$producto['nombre']}' eliminado exitosamente"
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Error al eliminar producto"
            ]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error: " . $e->getMessage()
        ]);
    }
}
?>