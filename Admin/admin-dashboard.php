<?php
session_start();

if (!isset($_SESSION['admin']) || $_SESSION['admin']['role'] !== 'admin') {
    header("Location: admin-login.php");
    exit;
}

$adminName = $_SESSION['admin']['username'];
$adminEmail = $_SESSION['admin']['email'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LocalRoots Admin Dashboard</title>
  <link rel="stylesheet" href="admin.css">
</head>
<body>

<div class="dashboard">
  <aside class="sidebar">
    <div>
      <div class="brand">
        <h2>LocalRoots</h2>
        <p>Admin Panel</p>
      </div>

      <nav class="menu">
        <a href="admin-dashboard.php" class="active">Dashboard</a>
        <a href="admin-vendors.html">Vendors</a>
        <a href="admin-customers.html">Customers</a>
        <a href="admin-products.html">Products</a>
        <a href="admin-orders.html">Orders</a>
        <a href="admin-reports.html">Reports</a>
        <a href="admin-settings.html">Settings</a>
      </nav>
    </div>
  </aside>

  <main class="main-content">
    <header class="topbar">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, <?php echo htmlspecialchars($adminName); ?></p>
      </div>

      <div class="topbar-right">
        <input type="text" placeholder="Search vendors, customers, products">
        <a href="admin-login.php" class="logout-btn-top">Logout</a>

      

        
      </div>
    </header>

    <section class="stats">
      <div class="stat-card">
        <h3>Total Vendors</h3>
        <h2 id="totalVendors">0</h2>
        <p id="pendingVendorsText">0 pending approval</p>
      </div>
      <div class="stat-card">
        <h3>Total Customers</h3>
        <h2 id="totalCustomers">0</h2>
        <p>Customer records</p>
      </div>
      <div class="stat-card">
        <h3>Total Products</h3>
        <h2 id="totalProducts">0</h2>
        <p id="lowStockCountText">0 low stock</p>
      </div>
      <div class="stat-card">
        <h3>Total Orders</h3>
        <h2 id="totalOrders">0</h2>
        <p id="completedTodayText">0 completed today</p>
      </div>
    </section>

    <section class="content-grid">
      <div class="left-column">
        <div class="card">
          <div class="card-header">
            <h2>Pending Vendor Approvals</h2>
            <a href="admin-vendors.html" class="small-btn">View All</a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="pendingVendorTableBody"></tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Recent Orders</h2>
            <a href="admin-orders.html" class="small-btn">View All</a>
          </div>

          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Vendor</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="recentOrdersTableBody"></tbody>
          </table>
        </div>
      </div>

      <div class="right-column">
        <div class="card">
          <div class="card-header">
            <h2>Low Stock Products</h2>
          </div>
          <ul class="stock-list" id="lowStockList"></ul>
        </div>

        <div class="card">
          <div class="card-header">
            <h2>Recent Activity</h2>
          </div>
          <ul class="activity-list" id="recentActivityList"></ul>
        </div>
      </div>
    </section>
  </main>
</div>

<script src="admin-dashboard.js"></script>
</body>
</html>