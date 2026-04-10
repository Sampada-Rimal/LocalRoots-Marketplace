function formatCurrency(amount) {
  return "$" + Number(amount).toFixed(2);
}

function parseAmount(value) {
  if (typeof value === "number") {
    return value;
  }
  return Number(String(value).replace("$", "").trim()) || 0;
}

function getOrderDate(order) {
  return order.orderDate || order.date || "";
}

function getVendorName(order) {
  return order.vendorName || order.vendor || "Unknown Vendor";
}

function getDeliveryStatus(order) {
  return order.deliveryStatus || order.status || "";
}

function getPaymentStatus(order) {
  return order.paymentStatus || "";
}

function getProductName(order) {
  return order.productName || order.product || "";
}

function getQuantity(order) {
  return Number(order.quantity) || 1;
}

function isToday(dateString) {
  if (!dateString) return false;

  const today = new Date();
  const date = new Date(dateString);

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isThisWeek(dateString) {
  if (!dateString) return false;

  const today = new Date();
  const date = new Date(dateString);

  const diffTime = today - date;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays >= 0 && diffDays <= 7;
}

function isThisMonth(dateString) {
  if (!dateString) return false;

  const today = new Date();
  const date = new Date(dateString);

  return (
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

let products = JSON.parse(localStorage.getItem("products")) || [
  { id: "P001", name: "Tomatoes", vendor: "Diddly Farm", stock: 5 },
  { id: "P002", name: "Fresh Basil", vendor: "Diddly Farm", stock: 3 },
  { id: "P003", name: "Raw Honey", vendor: "Farmer's Market", stock: 20 },
  { id: "P004", name: "Carrots", vendor: "Tony's Family Farm", stock: 7 },
  { id: "P005", name: "Lettuce", vendor: "Dina's Garden", stock: 15 }
];

let vendors = JSON.parse(localStorage.getItem("vendors")) || [
  { name: "Diddly Farm" },
  { name: "Tony's Family Farm" },
  { name: "Farmer's Market" },
  { name: "Dina's Garden" }
];

let customers = JSON.parse(localStorage.getItem("customers")) || [
  { name: "Customer 1" },
  { name: "Customer 2" },
  { name: "Customer 3" }
];

let orders = JSON.parse(localStorage.getItem("orders")) || [
  {
    orderId: "LR1021",
    customerName: "James Parker",
    vendorName: "Diddly Farm",
    orderDate: "2026-04-07",
    total: "$54.00",
    deliveryStatus: "Completed",
    paymentStatus: "Paid"
  },
  {
    orderId: "LR1022",
    customerName: "Olivia Smith",
    vendorName: "Tony's Family Farm",
    orderDate: "2026-04-07",
    total: "$31.50",
    deliveryStatus: "Processing",
    paymentStatus: "Paid"
  },
  {
    orderId: "LR1023",
    customerName: "Liam Johnson",
    vendorName: "Dina's Garden",
    orderDate: "2026-04-06",
    total: "$76.20",
    deliveryStatus: "Cancelled",
    paymentStatus: "Pending"
  },
  {
    orderId: "LR1024",
    customerName: "Emma Wilson",
    vendorName: "Farmer's Market",
    orderDate: "2026-04-05",
    total: "$18.00",
    deliveryStatus: "Completed",
    paymentStatus: "Paid"
  }
];

function calculateReports() {
  const completedPaidOrders = orders.filter(function (order) {
    return (
      getDeliveryStatus(order) === "Completed" &&
      getPaymentStatus(order) === "Paid"
    );
  });

  const cancelledOrdersList = orders.filter(function (order) {
    return (
      getDeliveryStatus(order) === "Cancelled" &&
      isThisMonth(getOrderDate(order))
    );
  });

  const dailySales = completedPaidOrders
    .filter(function (order) {
      return isToday(getOrderDate(order));
    })
    .reduce(function (sum, order) {
      return sum + parseAmount(order.total);
    }, 0);

  const weeklySales = completedPaidOrders
    .filter(function (order) {
      return isThisWeek(getOrderDate(order));
    })
    .reduce(function (sum, order) {
      return sum + parseAmount(order.total);
    }, 0);

  const monthlySales = completedPaidOrders
    .filter(function (order) {
      return isThisMonth(getOrderDate(order));
    })
    .reduce(function (sum, order) {
      return sum + parseAmount(order.total);
    }, 0);

  document.getElementById("dailySales").textContent = formatCurrency(dailySales);
  document.getElementById("weeklySales").textContent = formatCurrency(weeklySales);
  document.getElementById("monthlySales").textContent = formatCurrency(monthlySales);
  document.getElementById("cancelledOrders").textContent = cancelledOrdersList.length;

  renderTopVendors(completedPaidOrders);
  renderTopProducts(completedPaidOrders);
  renderLowStock();
  renderPlatformSummary();
}

function renderTopVendors(completedPaidOrders) {
  const vendorCount = {};

  completedPaidOrders.forEach(function (order) {
    const vendorName = getVendorName(order);

    if (!vendorCount[vendorName]) {
      vendorCount[vendorName] = 0;
    }

    vendorCount[vendorName] += 1;
  });

  const sortedVendors = Object.entries(vendorCount)
    .sort(function (a, b) {
      return b[1] - a[1];
    })
    .slice(0, 4);

  const topVendorsList = document.getElementById("topVendorsList");
  topVendorsList.innerHTML = "";

  if (sortedVendors.length === 0) {
    topVendorsList.innerHTML = "<p>No vendor data available</p>";
    return;
  }

  sortedVendors.forEach(function (vendor, index) {
    topVendorsList.innerHTML += `<p>${index + 1}. ${vendor[0]}</p>`;
  });
}

function renderTopProducts(completedPaidOrders) {
  const productCount = {};

  completedPaidOrders.forEach(function (order) {
    const productName = getProductName(order);

    if (productName) {
      if (!productCount[productName]) {
        productCount[productName] = 0;
      }

      productCount[productName] += getQuantity(order);
    }
  });

  const sortedProducts = Object.entries(productCount)
    .sort(function (a, b) {
      return b[1] - a[1];
    })
    .slice(0, 4);

  const topProductsList = document.getElementById("topProductsList");
  topProductsList.innerHTML = "";

  if (sortedProducts.length === 0) {
    topProductsList.innerHTML = "<p>No product data available</p>";
    return;
  }

  sortedProducts.forEach(function (product, index) {
    topProductsList.innerHTML += `<p>${index + 1}. ${product[0]}</p>`;
  });
}

function renderLowStock() {
  const lowStockProducts = products.filter(function (product) {
    return Number(product.stock) <= 7;
  });

  const lowStockList = document.getElementById("lowStockList");
  lowStockList.innerHTML = "";

  if (lowStockProducts.length === 0) {
    lowStockList.innerHTML = "<p>No low stock products</p>";
    return;
  }

  lowStockProducts.forEach(function (product) {
    lowStockList.innerHTML += `<p>${product.name} - ${product.stock} left</p>`;
  });
}

function renderPlatformSummary() {
  document.getElementById("totalVendors").textContent = vendors.length;
  document.getElementById("totalCustomers").textContent = customers.length;
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalOrders").textContent = orders.length;
}

calculateReports();