<?php
if (session_status() === PHP_SESSION_NONE) session_start();

/* ====== DB SETTINGS (XAMPP defaults) ====== */
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'project');  // your database name
define('DB_USER', 'root');
define('DB_PASS', '');

/* After successful registration, go to login page */
define('AFTER_REGISTER', 'customer login.php');

/* ====== CONNECT TO DATABASE ====== */
try {
  $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4';
  $pdo = new PDO($dsn, DB_USER, DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (Throwable $e) {
  die('Database connection failed: ' . $e->getMessage());
}

/* ====== HANDLE REGISTRATION ====== */
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = trim($_POST['username'] ?? '');
  $email    = strtolower(trim($_POST['email'] ?? ''));
  $password = $_POST['password'] ?? '';

  // Validation
  if ($username === '' || $email === '' || $password === '') {
    $error = 'All fields are required.';
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error = 'Invalid email format.';
  } elseif (strlen($password) < 6) {
    $error = 'Password must be at least 6 characters.';
  }

  if (!$error) {
    try {
      // Check for existing email
      $check = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
      $check->execute([$email]);
      if ($check->fetch()) {
        $error = 'Email already registered. Try logging in.';
      } else {
        // Hash the password before saving
        $hash = password_hash($password, PASSWORD_DEFAULT);

        // Insert user record into database
        $stmt = $pdo->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
        $stmt->execute([$username, $email, $hash]);

        // ✅ Redirect to login page after successful registration
        header('Location: ' . AFTER_REGISTER);
        exit;
      }
    } catch (Throwable $e) {
      $error = 'Registration failed: ' . $e->getMessage();
    }
  }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>LocalRoots – Register</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <div class="login-wrap">
    <div class="login-card">
      <!-- Branding side -->
      <div class="login-art">
        <img src="./localroots logo.png" alt="LocalRoots logo" style="width:64px;height:64px">
        <h1>Create Account</h1>
        <p class="small">Join LocalRoots to shop fresh, sustainable produce directly from local farmers.</p>
        <ul class="small">
          <li>Secure email sign-up</li>
          <li>Easy login later</li>
          <li>Support local farmers 🌱</li>
        </ul>
      </div>

      <!-- Form side -->
      <div class="login-form">
        <div class="brand" style="padding:0">
          <div>
            <div class="brand-title">Register</div>
            <div class="brand-sub">Create your LocalRoots account</div>
          </div>
        </div>

        <?php if ($error): ?>
          <p class="small" style="color:crimson;"><?= htmlspecialchars($error) ?></p>
        <?php endif; ?>

        <form method="post" action="register.php" autocomplete="on">
          <label for="username">Full Name</label>
          <input id="username" name="username" class="input" required placeholder="Your name"
                 value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"/>

          <label for="email">Email</label>
          <input id="email" name="email" type="email" class="input" required placeholder="you@email.com"
                 value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"/>

          <label for="password">Password</label>
          <input id="password" name="password" type="password" class="input" required placeholder="••••••••"/>

          <button class="btn btn-primary" type="submit" style="width:100%">Create Account</button>

          <p class="small">
            Already have an account?
            <a href="customer login.php">Log in here</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
