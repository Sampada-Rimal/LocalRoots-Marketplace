<?php
if (session_status() === PHP_SESSION_NONE) session_start();

/* ====== DB SETTINGS (match with your XAMPP) ====== */
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'project');
define('DB_USER', 'root');
define('DB_PASS', '');

/* ====== ROLE-BASED REDIRECTS ====== */
/* Change vendor destination if your vendor dashboard file uses a different name */
define('AFTER_CUSTOMER_LOGIN', 'dashboard.html');
define('AFTER_VENDOR_LOGIN', 'vendor-dashboard.php');

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

/* ====== HANDLE LOGIN ====== */
$error = '';
$activeRole = $_POST['role'] ?? $_GET['role'] ?? 'customer';
$activeRole = ($activeRole === 'vendor') ? 'vendor' : 'customer';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = strtolower(trim($_POST['email'] ?? ''));
  $password = $_POST['password'] ?? '';

  if ($email === '' || $password === '') {
    $error = 'Email and password are required.';
  } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $error = 'Invalid email format.';
  } else {
    try {
      /* Requires a `role` column in the users table */
      $stmt = $pdo->prepare('SELECT id, username, email, password, role FROM users WHERE email = ? AND role = ? LIMIT 1');
      $stmt->execute([$email, $activeRole]);
      $user = $stmt->fetch();

      if (!$user || !password_verify($password, $user['password'])) {
        $error = 'Incorrect email or password for the selected account type.';
      } else {
        $_SESSION['user'] = [
          'id'       => $user['id'],
          'username' => $user['username'],
          'email'    => $user['email'],
          'role'     => $user['role'],
        ];

        if ($user['role'] === 'vendor') {
          header('Location: ' . AFTER_VENDOR_LOGIN);
        } else {
          header('Location: ' . AFTER_CUSTOMER_LOGIN);
        }
        exit;
      }
    } catch (Throwable $e) {
      $error = 'Login failed: ' . $e->getMessage();
    }
  }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>LocalRoots – Sign In</title>
  <link rel="stylesheet" href="style.css"/>
  <style>
    .login-shell{
      min-height:100vh;
      display:grid;
      place-items:center;
      padding:30px 16px;
      background:
        radial-gradient(circle at top left, rgba(107,191,89,.16), transparent 24%),
        radial-gradient(circle at top right, rgba(46,125,50,.10), transparent 22%),
        linear-gradient(180deg, #f8fcf6 0%, #eef6ec 100%);
    }
    .login-modal{
      width:100%;
      max-width:1020px;
      background:#fff;
      border:1px solid var(--line);
      border-radius:22px;
      overflow:hidden;
      box-shadow:0 18px 50px rgba(29,54,28,.10);
      display:grid;
      grid-template-columns:1fr 1fr;
    }
    .login-side{
      padding:34px 32px;
      background:linear-gradient(135deg,#ebf7ea,#dcefdc);
      border-right:1px solid var(--line);
      display:grid;
      align-content:center;
      gap:16px;
    }
    .login-side h1{
      margin:0;
      font-size:2.25rem;
      line-height:1.05;
    }
    .login-side p{margin:0}
    .login-side ul{
      margin:0;
      padding-left:20px;
      color:var(--muted);
      display:grid;
      gap:8px;
    }
    .login-panel{
      padding:34px 32px;
    }
    .login-panel-top{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      margin-bottom:12px;
    }
    .close-link{
      text-decoration:none;
      color:var(--muted);
      font-size:1.6rem;
      line-height:1;
      font-weight:700;
    }
    .auth-tabs{
      display:grid;
      grid-template-columns:1fr 1fr;
      background:#f1f5ef;
      border-radius:999px;
      padding:5px;
      gap:6px;
      margin:18px 0 20px;
    }
    .auth-tab{
      border:0;
      border-radius:999px;
      padding:12px 14px;
      font-weight:800;
      cursor:pointer;
      background:transparent;
      color:#466046;
      transition:.18s ease;
    }
    .auth-tab.active{
      background:#fff;
      color:var(--brand);
      box-shadow:0 2px 10px rgba(29,54,28,.08);
    }
    .login-title{
      font-size:2rem;
      font-weight:900;
      margin:0 0 8px;
    }
    .login-note{
      margin:0 0 14px;
      color:var(--muted);
    }
    .role-line{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      margin-bottom:16px;
      font-size:.95rem;
    }
    .role-badge{
      display:inline-flex;
      align-items:center;
      gap:8px;
      background:#ecf4ea;
      color:var(--brand);
      border-radius:999px;
      padding:7px 12px;
      font-weight:800;
      white-space:nowrap;
    }
    .password-wrap{
      position:relative;
    }
    .toggle-pass{
      position:absolute;
      top:50%;
      right:12px;
      transform:translateY(-50%);
      border:0;
      background:transparent;
      cursor:pointer;
      color:var(--muted);
      font-weight:700;
    }
    .mini-links{
      display:flex;
      justify-content:space-between;
      gap:12px;
      flex-wrap:wrap;
      margin-top:14px;
    }
    .mini-links a{
      color:var(--brand);
      text-decoration:none;
      font-weight:700;
    }
    .error-box{
      margin-bottom:14px;
      background:#fff1f2;
      border:1px solid #fecdd3;
      color:#be123c;
      padding:12px 14px;
      border-radius:12px;
      font-size:.95rem;
    }
    @media (max-width: 900px){
      .login-modal{grid-template-columns:1fr;}
      .login-side{border-right:0;border-bottom:1px solid var(--line);}
    }
  </style>
</head>
<body>
  <div class="login-shell">
    <div class="login-modal">
      <aside class="login-side">
        <div class="brand" style="padding:0; margin:0;">
          <img src="./localroots logo.png" alt="LocalRoots logo" style="width:64px;height:64px">
          <div>
            <div class="brand-title" style="font-size:1.2rem;">LocalRoots</div>
            <div class="brand-sub">Sustainable Farmers Marketplace</div>
          </div>
        </div>

        <span class="pill">🌱 One login page • Two account types</span>
        <h1 id="sideHeading"><?= $activeRole === 'vendor' ? 'Vendor access made simple' : 'Welcome back to LocalRoots' ?></h1>
        <p class="small" id="sideText">
          <?= $activeRole === 'vendor'
              ? 'Sign in to manage listings, update stock, and keep track of customer orders.'
              : 'Sign in to browse produce, manage your orders, and enjoy fresh food from local farmers.' ?>
        </p>

        <ul class="small" id="sideList">
          <?php if ($activeRole === 'vendor'): ?>
            <li>Manage products and availability</li>
            <li>Track incoming orders</li>
            <li>Grow your reach with LocalRoots</li>
          <?php else: ?>
            <li>Track your deliveries easily</li>
            <li>Manage your account in one place</li>
            <li>Support local farmers and vendors</li>
          <?php endif; ?>
        </ul>
      </aside>

      <section class="login-panel">
        <div class="login-panel-top">
          <div class="brand" style="padding:0; margin:0;">
            <div>
              <div class="brand-title">Sign In</div>
              <div class="brand-sub">Choose your account type below</div>
            </div>
          </div>
          <a class="close-link" href="./landing.html" aria-label="Close login">×</a>
        </div>

        <div class="auth-tabs" role="tablist" aria-label="Choose account type">
          <button type="button" class="auth-tab <?= $activeRole === 'customer' ? 'active' : '' ?>" id="tabCustomer">Customer</button>
          <button type="button" class="auth-tab <?= $activeRole === 'vendor' ? 'active' : '' ?>" id="tabVendor">Vendor</button>
        </div>

        <p class="login-title" id="formHeading"><?= $activeRole === 'vendor' ? 'Vendor Sign In' : 'Customer Sign In' ?></p>
        <p class="login-note" id="formNote">
          <?= $activeRole === 'vendor'
              ? 'Use your vendor account details to access your seller dashboard.'
              : 'Use your customer account details to continue shopping fresh and local.' ?>
        </p>

        

        <?php if ($error): ?>
          <div class="error-box"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="post" action="combined-login.php" autocomplete="on">
          <input type="hidden" name="role" id="role" value="<?= htmlspecialchars($activeRole) ?>">

          <label for="email" id="emailLabel">Email</label>
          <br>
          <input
            id="email"
            name="email"
            type="email"
            class="input"
            required
            value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"
            placeholder="you@email.com"
          />

          <div class="space"></div>

          <label for="password">Password</label>
          <div class="password-wrap">
            <input
              id="password"
              name="password"
              type="password"
              class="input"
              required
              placeholder="••••••••"
            />
            <button type="button" class="toggle-pass" id="togglePass">Show</button>
          </div>

          <button class="btn btn-primary" type="submit" style="width:100%; margin-top:16px;" id="submitBtn">
            <?= $activeRole === 'vendor' ? 'Sign In as Vendor' : 'Sign In as Customer' ?>
          </button>

          <div class="mini-links">
            <a href="#" id="forgotLink">Forgot Password?</a>
            <a href="./register-choice.html" id="createLink">
              <?= $activeRole === 'vendor' ? 'Create vendor account' : 'Create customer account' ?>
            </a>
          </div>
        </form>
      </section>
    </div>
  </div>

  <script>
    const roleInput   = document.getElementById('role');
    const tabCustomer = document.getElementById('tabCustomer');
    const tabVendor   = document.getElementById('tabVendor');
    const roleBadge   = document.getElementById('roleBadge');
    const formHeading = document.getElementById('formHeading');
    const formNote    = document.getElementById('formNote');
    const submitBtn   = document.getElementById('submitBtn');
    const createLink  = document.getElementById('createLink');
    const sideHeading = document.getElementById('sideHeading');
    const sideText    = document.getElementById('sideText');
    const sideList    = document.getElementById('sideList');
    const togglePass  = document.getElementById('togglePass');
    const passwordEl  = document.getElementById('password');

    function setRole(role){
      const isVendor = role === 'vendor';
      roleInput.value = role;

      tabCustomer.classList.toggle('active', !isVendor);
      tabVendor.classList.toggle('active', isVendor);

      roleBadge.textContent = isVendor ? 'Vendor' : 'Customer';
      formHeading.textContent = isVendor ? 'Vendor Sign In' : 'Customer Sign In';
      formNote.textContent = isVendor
        ? 'Use your vendor account details to access your seller dashboard.'
        : 'Use your customer account details to continue shopping fresh and local.';
      submitBtn.textContent = isVendor ? 'Sign In as Vendor' : 'Sign In as Customer';
      createLink.textContent = isVendor ? 'Create vendor account' : 'Create customer account';

      sideHeading.textContent = isVendor ? 'Vendor access made simple' : 'Welcome back to LocalRoots';
      sideText.textContent = isVendor
        ? 'Sign in to manage listings, update stock, and keep track of customer orders.'
        : 'Sign in to browse produce, manage your orders, and enjoy fresh food from local farmers.';
      sideList.innerHTML = isVendor
        ? '<li>Manage products and availability</li><li>Track incoming orders</li><li>Grow your reach with LocalRoots</li>'
        : '<li>Track your deliveries easily</li><li>Manage your account in one place</li><li>Support local farmers and vendors</li>';
    }

    tabCustomer.addEventListener('click', () => setRole('customer'));
    tabVendor.addEventListener('click', () => setRole('vendor'));

    togglePass.addEventListener('click', () => {
      const isPassword = passwordEl.type === 'password';
      passwordEl.type = isPassword ? 'text' : 'password';
      togglePass.textContent = isPassword ? 'Hide' : 'Show';
    });
  </script>
</body>
</html>
