<?php
if (session_status() === PHP_SESSION_NONE) session_start();

/* ====== DB SETTINGS ====== */
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'project');
define('DB_USER', 'root');
define('DB_PASS', '');

/* After successful registration, go to combined login page in vendor mode */
define('AFTER_REGISTER', 'combined-login.php?role=vendor');

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

/* ====== HANDLE REGISTRATION ====== */
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username         = trim($_POST['username'] ?? '');
  $email            = strtolower(trim($_POST['email'] ?? ''));
  $password         = $_POST['password'] ?? '';
  $confirmPassword  = $_POST['confirm_password'] ?? '';
  $businessName     = trim($_POST['business_name'] ?? '');
  $phone            = trim($_POST['phone'] ?? '');
  $address          = trim($_POST['address'] ?? '');
  $description      = trim($_POST['description'] ?? '');
  $role             = 'vendor';

  if (
    $username === '' || $email === '' || $password === '' || $confirmPassword === '' ||
    $businessName === '' || $phone === '' || $address === ''
  ) {
    $error = 'Please fill in all required fields.';
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error = 'Please enter a valid email address.';
  } elseif (strlen($password) < 6) {
    $error = 'Password must be at least 6 characters.';
  } elseif ($password !== $confirmPassword) {
    $error = 'Passwords do not match.';
  }

  if (!$error) {
    try {
      $check = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
      $check->execute([$email]);

      if ($check->fetch()) {
        $error = 'This email is already registered. Please log in instead.';
      } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $pdo->beginTransaction();

        /* Insert into users table */
        $stmt = $pdo->prepare(
          'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$username, $email, $hash, $role]);

        $userId = $pdo->lastInsertId();

        /* Insert vendor-specific details */
        $vendorStmt = $pdo->prepare(
          'INSERT INTO vendor_details (user_id, business_name, phone, address, description)
           VALUES (?, ?, ?, ?, ?)'
        );
        $vendorStmt->execute([$userId, $businessName, $phone, $address, $description]);

        $pdo->commit();

        header('Location: ' . AFTER_REGISTER);
        exit;
      }
    } catch (Throwable $e) {
      if ($pdo->inTransaction()) {
        $pdo->rollBack();
      }
      $error = 'Registration failed: ' . $e->getMessage();
    }
  }
}
?>
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>LocalRoots – Vendor Register</title>
  <link rel="stylesheet" href="style.css"/>
  <style>
    .register-note{
      margin: 10px 0 0;
      color: var(--muted);
      font-size: .92rem;
      line-height: 1.5;
    }
    .form-grid-2{
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
    }
    .form-section-title{
      margin:18px 0 10px;
      font-size:1rem;
      font-weight:800;
      color:#1e4620;
    }
    .error-box{
      margin: 0 0 14px;
      padding: 12px 14px;
      border-radius: 12px;
      background: #fff1f2;
      border: 1px solid #fecdd3;
      color: #be123c;
      font-size: .92rem;
    }
    .success-hint{
      margin-top: 8px;
      font-size: .84rem;
      color: var(--muted);
    }
    textarea.input{
      min-height: 110px;
      resize: vertical;
    }
    @media (max-width: 860px){
      .form-grid-2{
        grid-template-columns:1fr;
      }
    }
  </style>
</head>
<body>
  <div class="login-wrap">
    <div class="login-card">
      <!-- Branding side -->
      <div class="login-art">
        <img src="./localroots logo.png" alt="LocalRoots logo" style="width:64px;height:64px">
        <h1>Join as a Vendor</h1>
        <p class="small">
          Create your vendor account and start selling fresh, local products through LocalRoots.
        </p>

        <ul class="small">
          <li>Reach more nearby customers</li>
          <li>Manage products and orders online</li>
          <li>Grow your local farm or business 🌱</li>
        </ul>

        <p class="register-note">
          This registration is for sellers, growers, and farm businesses who want to list products on LocalRoots.
        </p>
      </div>

      <!-- Form side -->
      <div class="login-form">
        <div class="brand" style="padding:0">
          <div>
            <div class="brand-title">Vendor Register</div>
            <div class="brand-sub">Create your LocalRoots vendor account</div>
          </div>
        </div>

        <p class="small" style="margin-top:0">
          Want to register as a customer?
          <a href="register-choice.html">Go back and choose customer</a>
        </p>

        <?php if ($error): ?>
          <div class="error-box"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="post" action="vendor-register.php" autocomplete="on">
          <div class="form-section-title">Personal Details</div>

          <label for="username">Full Name</label>
          <input
            id="username"
            name="username"
            class="input"
            required
            placeholder="Your full name"
            value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"
          />

          <div class="form-grid-2">
            <div>
              <label for="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                class="input"
                required
                placeholder="you@email.com"
                value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
              />
            </div>

            <div>
              <label for="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                class="input"
                required
                placeholder="04xx xxx xxx"
                value="<?= htmlspecialchars($_POST['phone'] ?? '') ?>"
              />
            </div>
          </div>

          <div class="form-section-title">Business Details</div>

          <label for="business_name">Farm / Business Name</label>
          <input
            id="business_name"
            name="business_name"
            class="input"
            required
            placeholder="Your farm or business name"
            value="<?= htmlspecialchars($_POST['business_name'] ?? '') ?>"
          />

          <label for="address">Business Address</label>
          <input
            id="address"
            name="address"
            class="input"
            required
            placeholder="Business or farm address"
            value="<?= htmlspecialchars($_POST['address'] ?? '') ?>"
          />

          <label for="description">What do you sell?</label>
          <textarea
            id="description"
            name="description"
            class="input"
            placeholder="Example: Fresh vegetables, seasonal fruits, dairy, herbs, honey..."
          ><?= htmlspecialchars($_POST['description'] ?? '') ?></textarea>

          <div class="form-section-title">Account Security</div>

          <div class="form-grid-2">
            <div>
              <label for="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                class="input"
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <label for="confirm_password">Confirm Password</label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                class="input"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <p class="success-hint">Use at least 6 characters for your password.</p>

          <button class="btn btn-primary" type="submit" style="width:100%; margin-top:14px;">
            Create Vendor Account
          </button>

          <p class="small" style="text-align:center; margin-top:14px;">
            Already have a vendor account?
            <a href="combined-login.php?role=vendor">Log in here</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</body>
</html>
