<?php
session_start();

/* ===== DB SETTINGS ===== */
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'project');
define('DB_USER', 'root');
define('DB_PASS', '');

/* ===== CONNECT TO DATABASE ===== */
$error = '';

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Throwable $e) {
    die("Database connection failed: " . $e->getMessage());
}

/* ===== HANDLE ADMIN LOGIN ===== */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '' || $password === '') {
        $error = "Email and password are required.";
    } else {
        $stmt = $pdo->prepare("SELECT id, username, email, password, role FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            $error = "Admin account not found.";
        } elseif ($user['role'] !== 'admin') {
            $error = "This account is not an admin account.";
        } elseif (!password_verify($password, $user['password'])) {
            $error = "Incorrect password.";
        } else {
            $_SESSION['admin'] = [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ];

            header("Location: admin-dashboard.php");
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LocalRoots Admin Login</title>
  <link rel="stylesheet" href="admin.css">
</head>
<body class="login-page">

  <div class="login-container">
    <div class="login-left">
      <h1>LocalRoots</h1>
      <p class="subtext">Sustainable Farmers Marketplace</p>

      <div class="info-box">
        <h2>Admin Portal</h2>
        <p>Log in to manage vendors, customers, products, orders, reports and settings.</p>
        <ul>
          <li>Approve and manage vendor accounts</li>
          <li>View customer details and order activity</li>
          <li>Manage products and low stock items</li>
          <li>Track orders and sales reports</li>
        </ul>
      </div>
    </div>

    <div class="login-right">
      <form class="login-form" method="POST" action="">
        <h2>Admin Login</h2>
        <p class="welcome-text">Enter your admin details</p>

        <?php if (!empty($error)): ?>
          <p style="color:red; margin-bottom:12px;"><?php echo htmlspecialchars($error); ?></p>
        <?php endif; ?>

        <label for="adminEmail">Email</label>
        <input
          type="email"
          id="adminEmail"
          name="email"
          placeholder="admin@localroots.com"
          required
        >

        <label for="adminPassword">Password</label>
        <input
          type="password"
          id="adminPassword"
          name="password"
          placeholder="Enter password"
          required
        >

        <div class="options">
          <label class="remember-me">
            <input type="checkbox">
            <span>Keep me signed in</span>
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit">Log In</button>
      </form>
    </div>
  </div>

</body>
</html>