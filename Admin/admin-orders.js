let defaultOrders = [
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
    deliveryStatus: "Processing",
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
  }
];

let orders = JSON.parse(localStorage.getItem("orders")) || defaultOrders;

const orderTableBody = document.getElementById("orderTableBody");
const searchOrderId = document.getElementById("searchOrderId");
const topOrderSearchInput = document.getElementById("topOrderSearchInput");
const deliveryStatusFilter = document.getElementById("deliveryStatusFilter");
const paymentStatusFilter = document.getElementById("paymentStatusFilter");
const openAddOrderBtn = document.getElementById("openAddOrderBtn");
const addOrderCard = document.getElementById("addOrderCard");
const addOrderForm = document.getElementById("addOrderForm");

function generateOrderId() {
  const nextNumber = orders.length + 1021;
  return "LR" + nextNumber;
}

function renderOrders() {
  const searchValue = searchOrderId.value.toLowerCase().trim();
  const topSearchValue = topOrderSearchInput.value.toLowerCase().trim();
  const selectedDeliveryStatus = deliveryStatusFilter.value;
  const selectedPaymentStatus = paymentStatusFilter.value;

  const filteredOrders = orders.filter(function (order) {
    const matchesSearchOrder =
      searchValue === "" ||
      order.id.toLowerCase().includes(searchValue) ||
      order.customerName.toLowerCase().includes(searchValue);

    const matchesTopSearch =
      topSearchValue === "" ||
      order.id.toLowerCase().includes(topSearchValue) ||
      order.customerName.toLowerCase().includes(topSearchValue) ||
      order.vendorName.toLowerCase().includes(topSearchValue);

    const matchesDelivery =
      selectedDeliveryStatus === "All" ||
      order.deliveryStatus === selectedDeliveryStatus;

    const matchesPayment =
      selectedPaymentStatus === "All" ||
      order.paymentStatus === selectedPaymentStatus;

    return (
      matchesSearchOrder &&
      matchesTopSearch &&
      matchesDelivery &&
      matchesPayment
    );
  });

  orderTableBody.innerHTML = "";

  filteredOrders.forEach(function (order) {
    orderTableBody.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.vendorName}</td>
        <td>${order.orderDate}</td>
        <td>$${Number(order.total).toFixed(2)}</td>
        <td>
          <select class="delivery-dropdown ${order.deliveryStatus.toLowerCase()}" id="delivery-${order.id}" onchange="updateDeliveryColor(this)">
            <option value="Processing" ${order.deliveryStatus === "Processing" ? "selected" : ""}>Processing</option>
            <option value="Completed" ${order.deliveryStatus === "Completed" ? "selected" : ""}>Completed</option>
            <option value="Cancelled" ${order.deliveryStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </td>
        <td>
          <select class="payment-dropdown ${order.paymentStatus.toLowerCase()}" id="payment-${order.id}" onchange="updatePaymentColor(this)">
            <option value="Paid" ${order.paymentStatus === "Paid" ? "selected" : ""}>Paid</option>
            <option value="Pending" ${order.paymentStatus === "Pending" ? "selected" : ""}>Pending</option>
          </select>
        </td>
        <td>
          <button class="approve-btn" onclick="updateOrderStatus('${order.id}')">Update</button>
          <button class="reject-btn" onclick="deleteOrder('${order.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function updateDeliveryColor(selectElement) {
  selectElement.className = "delivery-dropdown " + selectElement.value.toLowerCase();
}

function updatePaymentColor(selectElement) {
  selectElement.className = "payment-dropdown " + selectElement.value.toLowerCase();
}

function updateOrderStatus(orderId) {
  const order = orders.find(function (item) {
    return item.id === orderId;
  });

  if (order) {
    const deliverySelect = document.getElementById("delivery-" + orderId);
    const paymentSelect = document.getElementById("payment-" + orderId);

    order.deliveryStatus = deliverySelect.value;
    order.paymentStatus = paymentSelect.value;

    localStorage.setItem("orders", JSON.stringify(orders));

    renderOrders();
    alert("Order " + orderId + " updated successfully!");
  }
}

function deleteOrder(orderId) {
  orders = orders.filter(function (item) {
    return item.id !== orderId;
  });

  localStorage.setItem("orders", JSON.stringify(orders));

  renderOrders();
}

openAddOrderBtn.addEventListener("click", function () {
  if (addOrderCard.style.display === "none") {
    addOrderCard.style.display = "block";
  } else {
    addOrderCard.style.display = "none";
  }
});

addOrderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newOrder = {
    id: generateOrderId(),
    customerName: document.getElementById("orderCustomerName").value.trim(),
    vendorName: document.getElementById("orderVendorName").value.trim(),
    orderDate: document.getElementById("orderDate").value,
    total: Number(document.getElementById("orderTotal").value),
    deliveryStatus: document.getElementById("orderDeliveryStatus").value,
    paymentStatus: document.getElementById("orderPaymentStatus").value
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  addOrderForm.reset();
  addOrderCard.style.display = "none";
  renderOrders();
});

searchOrderId.addEventListener("input", renderOrders);
topOrderSearchInput.addEventListener("input", renderOrders);
deliveryStatusFilter.addEventListener("change", renderOrders);
paymentStatusFilter.addEventListener("change", renderOrders);

renderOrders();