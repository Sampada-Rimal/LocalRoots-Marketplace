document.addEventListener("DOMContentLoaded", function () {
  const defaultVendors = [
    {
      farmName: "Diddly Farm",
      category: "Vegetables",
      location: "Melbourne",
      status: "Pending"
    },
    {
      farmName: "Tony's Family Farm",
      category: "Mixed Produce",
      location: "Geelong",
      status: "Pending"
    },
    {
      farmName: "Farmer's Market",
      category: "Fresh Produce",
      location: "Ballarat",
      status: "Pending"
    },
    {
      farmName: "Sampadas Farm",
      category: "Mixed Produce",
      location: "Epping",
      status: "Pending"
    },
    {
      farmName: "Dina's Garden",
      category: "Herbs",
      location: "Melbourne",
      status: "Approved"
    }
  ];

  const defaultCustomers = [
    {
      id: "C001",
      name: "Olivia Smith",
      email: "olivia@email.com",
      phone: "0412345678",
      address: "Melbourne",
      totalOrders: 8,
      status: "Active"
    },
    {
      id: "C002",
      name: "James Parker",
      email: "james@email.com",
      phone: "0411122233",
      address: "Geelong",
      totalOrders: 5,
      status: "Active"
    },
    {
      id: "C003",
      name: "Liam Johnson",
      email: "liam@email.com",
      phone: "0433344455",
      address: "Ballarat",
      totalOrders: 2,
      status: "Suspended"
    },
    {
      id: "C004",
      name: "Emma Wilson",
      email: "emma@email.com",
      phone: "0444455566",
      address: "Melbourne",
      totalOrders: 11,
      status: "Active"
    }
  ];

  const defaultProducts = [
    {
      id: "P001",
      name: "Tomatoes",
      category: "Vegetables",
      vendor: "Diddly Farm",
      price: 3.20,
      stock: 5,
      tempStock: 5
    },
    {
      id: "P002",
      name: "Fresh Basil",
      category: "Herbs",
      vendor: "Diddly Farm",
      price: 2.50,
      stock: 3,
      tempStock: 3
    },
    {
      id: "P003",
      name: "Raw Honey",
      category: "Honey",
      vendor: "Farmer's Market",
      price: 9.00,
      stock: 20,
      tempStock: 20
    },
    {
      id: "P004",
      name: "Carrots",
      category: "Vegetables",
      vendor: "Tony's Family Farm",
      price: 4.00,
      stock: 7,
      tempStock: 7
    },
    {
      id: "P005",
      name: "Lettuce",
      category: "Vegetables",
      vendor: "Dina's Garden",
      price: 3.80,
      stock: 15,
      tempStock: 15
    }
  ];

  const defaultOrders = [
    {
      id: "LR1021",
      customerName: "James Parker",
      vendorName: "Diddly Farm",
      orderDate: "2026-04-07",
      total: 54.00,
      deliveryStatus: "Completed",
      paymentStatus: "Paid"
    },
    {
      id: "LR1022",
      customerName: "Olivia Smith",
      vendorName: "Tony's Family Farm",
      orderDate: "2026-04-07",
      total: 31.50,
      deliveryStatus: "Completed",
      paymentStatus: "Paid"
    },
    {
      id: "LR1023",
      customerName: "Liam Johnson",
      vendorName: "Dina's Garden",
      orderDate: "2026-04-06",
      total: 76.20,
      deliveryStatus: "Cancelled",
      paymentStatus: "Pending"
    },
    {
      id: "LR1024",
      customerName: "Emma Wilson",
      vendorName: "Farmer's Market",
      orderDate: "2026-04-05",
      total: 18.00,
      deliveryStatus: "Completed",
      paymentStatus: "Paid"
    },
    {
      id: "LR1025",
      customerName: "Noah Brown",
      vendorName: "Diddly Farm",
      orderDate: "2026-04-07",
      total: 22.00,
      deliveryStatus: "Completed",
      paymentStatus: "Paid"
    }
  ];

  function getStoredArray(key, fallbackArray) {
    const raw = localStorage.getItem(key);

    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallbackArray));
      return fallbackArray;
    }

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      localStorage.setItem(key, JSON.stringify(fallbackArray));
      return fallbackArray;
    } catch (error) {
      localStorage.setItem(key, JSON.stringify(fallbackArray));
      return fallbackArray;
    }
  }

  const vendors = getStoredArray("vendors", defaultVendors);
  const customers = getStoredArray("customers", defaultCustomers);
  const products = getStoredArray("products", defaultProducts);
  const orders = getStoredArray("orders", defaultOrders);

  const totalVendorsEl = document.getElementById("totalVendors");
  const totalCustomersEl = document.getElementById("totalCustomers");
  const totalProductsEl = document.getElementById("totalProducts");
  const totalOrdersEl = document.getElementById("totalOrders");
  const pendingVendorsTextEl = document.getElementById("pendingVendorsText");
  const lowStockCountTextEl = document.getElementById("lowStockCountText");
  const completedTodayTextEl = document.getElementById("completedTodayText");
  const pendingVendorTableBody = document.getElementById("pendingVendorTableBody");
  const recentOrdersTableBody = document.getElementById("recentOrdersTableBody");
  const lowStockList = document.getElementById("lowStockList");
  const recentActivityList = document.getElementById("recentActivityList");

  function isToday(dateString) {
    if (!dateString) return false;

    const today = new Date();
    const date = new Date(dateString);

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  function renderStats() {
    const pendingVendors = vendors.filter(function (vendor) {
      return vendor.status === "Pending";
    });

    const lowStockProducts = products.filter(function (product) {
      return Number(product.stock) <= 7;
    });

    const completedToday = orders.filter(function (order) {
      return order.deliveryStatus === "Completed" && isToday(order.orderDate);
    });

    totalVendorsEl.textContent = vendors.length;
    totalCustomersEl.textContent = customers.length;
    totalProductsEl.textContent = products.length;
    totalOrdersEl.textContent = orders.length;

    pendingVendorsTextEl.textContent = pendingVendors.length + " pending approval";
    lowStockCountTextEl.textContent = lowStockProducts.length + " low stock";
    completedTodayTextEl.textContent = completedToday.length + " completed today";
  }

  function renderPendingVendors() {
    pendingVendorTableBody.innerHTML = "";

    const pendingVendors = vendors.filter(function (vendor) {
      return vendor.status === "Pending";
    });

    if (pendingVendors.length === 0) {
      pendingVendorTableBody.innerHTML = `
        <tr>
          <td colspan="4">No pending vendors</td>
        </tr>
      `;
      return;
    }

    pendingVendors.slice(0, 4).forEach(function (vendor) {
      pendingVendorTableBody.innerHTML += `
        <tr>
          <td>${vendor.farmName || vendor.name || "-"}</td>
          <td>${vendor.category || "-"}</td>
          <td>${vendor.location || "-"}</td>
          <td><span class="status pending">${vendor.status}</span></td>
        </tr>
      `;
    });
  }

  function renderRecentOrders() {
    recentOrdersTableBody.innerHTML = "";

    if (orders.length === 0) {
      recentOrdersTableBody.innerHTML = `
        <tr>
          <td colspan="5">No recent orders</td>
        </tr>
      `;
      return;
    }

    const recentOrders = orders.slice(-3).reverse();

    recentOrders.forEach(function (order) {
      let statusClass = "processing";

      if (order.deliveryStatus === "Completed") {
        statusClass = "completed";
      } else if (order.deliveryStatus === "Cancelled") {
        statusClass = "cancelled";
      }

      recentOrdersTableBody.innerHTML += `
        <tr>
          <td>${order.id}</td>
          <td>${order.customerName}</td>
          <td>${order.vendorName}</td>
          <td>$${Number(order.total).toFixed(2)}</td>
          <td><span class="status ${statusClass}">${order.deliveryStatus}</span></td>
        </tr>
      `;
    });
  }

  function renderLowStockProducts() {
    lowStockList.innerHTML = "";

    const lowStockProducts = products.filter(function (product) {
      return Number(product.stock) <= 7;
    });

    if (lowStockProducts.length === 0) {
      lowStockList.innerHTML = `
        <li><span>No low stock products</span></li>
      `;
      return;
    }

    lowStockProducts.forEach(function (product) {
      lowStockList.innerHTML += `
        <li>
          <span>${product.name}</span>
          <strong>${product.stock} left</strong>
        </li>
      `;
    });
  }

  function renderRecentActivity() {
    recentActivityList.innerHTML = "";

    const activities = [];

    const latestCompletedOrder = orders.find(function (order) {
      return order.deliveryStatus === "Completed";
    });

    if (latestCompletedOrder) {
      activities.push("Order " + latestCompletedOrder.id + " marked as completed");
    }

    const lowStockProducts = products.filter(function (product) {
      return Number(product.stock) <= 7;
    });

    if (lowStockProducts.length > 0) {
      activities.push("Stock updated for " + lowStockProducts[0].name);
    }

    if (vendors.length > 0) {
      activities.push((vendors[0].farmName || vendors[0].name) + " submitted vendor details");
    }

    if (products.length > 1) {
      activities.push(products[1].vendor + " added new products");
    }

    if (orders.length > 1) {
      activities.push(orders[1].vendorName + " received a new order");
    }

    if (activities.length === 0) {
      recentActivityList.innerHTML = `
        <li>No recent activity</li>
      `;
      return;
    }

    activities.slice(0, 5).forEach(function (activity) {
      recentActivityList.innerHTML += `<li>${activity}</li>`;
    });
  }

  renderStats();
  renderPendingVendors();
  renderRecentOrders();
  renderLowStockProducts();
  renderRecentActivity();
});