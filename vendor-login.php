<?php
if (session_status() === PHP_SESSION_NONE) session_start();

/* ====== DB SETTINGS (match with your XAMPP) ====== */
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'project');        // your database name
define('DB_USER', 'root');
define('DB_PASS', '');               // XAMPP default

define('AFTER_LOGIN', 'dashboard(v).html');

/* ====== CONNECT TO DATABASE ====== */
try {
  $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
  $pdo = new PDO($dsn, DB_USER, DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (Throwable $e) {
  die('Database connection failed: ' . $e->getMessage());
}

/* ====== HANDLE LOGIN FORM ====== */
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = strtolower(trim($_POST['email'] ?? ''));
  $password = $_POST['password'] ?? '';

  if ($email === '' || $password === '') {
    $error = 'Email and password are required.';
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error = 'Invalid email format.';
  } else {
    // Find vendor by email and role
    $stmt = $pdo->prepare("SELECT id, username, email, password, role FROM users WHERE email = ? AND role = 'vendor' LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
      $error = 'Incorrect vendor email or password.';
    } else {
      // Login success: store in session
      $_SESSION['user'] = [
        'id'       => $user['id'],
        'username' => $user['username'],
        'email'    => $user['email'],
        'role'     => $user['role']
      ];

      header('Location: ' . AFTER_LOGIN);
      exit;
    }
  }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>LocalRoots – Vendor Login</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="login-wrap">
    <div class="login-card">
      <!-- Branding / Art side -->
      <div class="login-art">
        <img src="localroots logo.png" alt="LocalRoots logo" style="width:64px;height:64px">
        <h1>Welcome Back Vendor</h1>
        <p class="small">Log in to manage your products, check orders, update stock and grow your business with LocalRoots.</p>
      </div>

      <!-- Form side -->
      <div class="login-form">
        <div class="brand" style="padding:0">
          <div>
            <div class="brand-title">Vendor Login</div>
            <div class="brand-sub">Sign in to your vendor account</div>
          </div>
        </div>

        <?php if ($error): ?>
          <p class="small" style="color:crimson;"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>

        <form method="post" action="vendor-login.php">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" class="input" required
                 value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
                 placeholder="you@email.com"/>

          <label for="password">Password</label>
          <input id="password" name="password" type="password" class="input" required placeholder="••••••••"/>

          <button class="btn btn-primary" type="submit" style="width:100%">Log In</button>

          <p class="small" style="text-align:center">
            Don’t have a vendor account? <a href="vendor-register.php">Create one</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</body>
</html>