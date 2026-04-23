<?php
session_start();
include 'conexion.php';

$error_msg = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['Mail']) && isset($_POST['Password'])) {
        $mail_login = $_POST['Mail'];
        $password_login = $_POST['Password'];

        $sql = "SELECT Nombre, Password FROM Register WHERE Mail = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("s", $mail_login);
            $stmt->execute();
            $resultado = $stmt->get_result();

            if ($usuario = $resultado->fetch_assoc()) {
                if (password_verify($password_login, $usuario['Password'])) {
                    $_SESSION['Nombre'] = $usuario['Nombre'];
                    header("Location: index.html");
                    exit();
                } else {
                    $error_msg = "La contraseña es incorrecta.";
                }
            } else {
                $error_msg = "Este correo no está registrado en AMARA.";
            }
            $stmt->close();
        } else {
            $error_msg = "Error en la base de datos: " . $conn->error;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <title>Iniciar sesión — Amara</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="producto.css">
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="imagenes/amara-logo.jpg" type="image/jpeg">
</head>
<body>

    <header class="header">
        <a href="index.html" id="brand-name">AMARA</a>
        <nav>
            <a href="index.html#thewhy" class="nav-link">Sobre nosotros</a>
            <a href="index.html#labios" class="nav-link">Labios</a>
            <a href="index.html#cabello" class="nav-link">Cabello</a>
            <a href="index.html#piel" class="nav-link">Piel</a>
            <a href="index.html#ojos" class="nav-link">Ojos</a>
        </nav>
        <a href="carrito.html" class="carrito-btn">
            <svg viewBox="0 0 576 512" width="18"><path fill="currentColor" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
            <span class="carrito-count">0</span>
        </a>
    </header>

    <hr>

    <main class="auth-page">
        <div class="auth-card">
            <p class="auth-marca">AMARA</p>
            <h1 class="auth-titulo">Iniciar sesión</h1>
            <p class="auth-subtitulo">Bienvenida de vuelta</p>

            <?php if ($error_msg): ?>
                <div class="auth-error"><?php echo htmlspecialchars($error_msg); ?></div>
            <?php endif; ?>

            <form class="auth-form" method="post" action="login.php">
                <div class="auth-campo">
                    <label for="Mail">Correo electrónico</label>
                    <input type="email" id="Mail" name="Mail" required
                           value="<?php echo isset($_POST['Mail']) ? htmlspecialchars($_POST['Mail']) : ''; ?>">
                </div>
                <div class="auth-campo">
                    <label for="Password">Contraseña</label>
                    <input type="password" id="Password" name="Password" required>
                </div>
                <button type="submit" class="auth-btn">Iniciar sesión</button>
            </form>

            <p class="auth-link">¿No tenés una cuenta? <a href="registrarse.php">Registrate aquí</a></p>
        </div>
    </main>

    <footer class="footer">
        <div class="footer-logo">AMARA</div>
        <div class="footer-social-icons">
            <a href="javascript:void(0)" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="javascript:void(0)" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="javascript:void(0)" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            <a href="javascript:void(0)" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        </div>
        <p class="copy">© 2026 Amara · Belleza natural que dura para siempre.</p>
    </footer>

</body>
</html>
