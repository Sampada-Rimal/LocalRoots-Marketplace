let defaultCustomers = [
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

let customers = JSON.parse(localStorage.getItem("customers")) || defaultCustomers;

function saveCustomersToStorage() {
  localStorage.setItem("customers", JSON.stringify(customers));
}

saveCustomersToStorage();

const customerTableBody = document.getElementById("customerTableBody");
const searchCustomerName = document.getElementById("searchCustomerName");
const topCustomerSearchInput = document.getElementById("topCustomerSearchInput");
const customerStatusFilter = document.getElementById("customerStatusFilter");
const openAddCustomerBtn = document.getElementById("openAddCustomerBtn");
const addCustomerCard = document.getElementById("addCustomerCard");
const addCustomerForm = document.getElementById("addCustomerForm");

function getCustomerStatusClass(status) {
  if (status === "Active") return "active-status";
  if (status === "Suspended") return "suspended";
  return "";
}

function renderCustomers() {
  const searchValue = searchCustomerName.value.toLowerCase().trim();
  const topSearchValue = topCustomerSearchInput.value.toLowerCase().trim();
  const selectedStatus = customerStatusFilter.value;

  const filteredCustomers = customers.filter(function (customer) {
    const matchesSearchName =
      searchValue === "" ||
      customer.name.toLowerCase().includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue);

    const matchesTopSearch =
      topSearchValue === "" ||
      customer.name.toLowerCase().includes(topSearchValue) ||
      customer.email.toLowerCase().includes(topSearchValue) ||
      customer.address.toLowerCase().includes(topSearchValue) ||
      customer.phone.toLowerCase().includes(topSearchValue);

    const matchesStatus =
      selectedStatus === "All" || customer.status === selectedStatus;

    return matchesSearchName && matchesTopSearch && matchesStatus;
  });

  customerTableBody.innerHTML = "";

  filteredCustomers.forEach(function (customer) {
    customerTableBody.innerHTML += `
      <tr>
        <td>${customer.id}</td>
        <td>${customer.name}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>${customer.address}</td>
        <td>${customer.totalOrders}</td>
        <td><span class="status ${getCustomerStatusClass(customer.status)}">${customer.status}</span></td>
        <td>
          <button class="approve-btn" onclick="activateCustomer('${customer.id}')">Activate</button>
          <button class="reject-btn" onclick="suspendCustomer('${customer.id}')">Suspend</button>
        </td>
      </tr>
    `;
  });
}

function activateCustomer(customerId) {
  const customer = customers.find(function (item) {
    return item.id === customerId;
  });

  if (customer) {
    customer.status = "Active";
    saveCustomersToStorage();
    renderCustomers();
  }
}

function suspendCustomer(customerId) {
  const customer = customers.find(function (item) {
    return item.id === customerId;
  });

  if (customer) {
    customer.status = "Suspended";
    saveCustomersToStorage();
    renderCustomers();
  }
}

function generateCustomerId() {
  const nextNumber = customers.length + 1;
  return "C" + String(nextNumber).padStart(3, "0");
}

openAddCustomerBtn.addEventListener("click", function () {
  if (addCustomerCard.style.display === "none") {
    addCustomerCard.style.display = "block";
  } else {
    addCustomerCard.style.display = "none";
  }
});

addCustomerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newCustomer = {
    id: generateCustomerId(),
    name: document.getElementById("customerName").value.trim(),
    email: document.getElementById("customerEmail").value.trim(),
    phone: document.getElementById("customerPhone").value.trim(),
    address: document.getElementById("customerAddress").value.trim(),
    totalOrders: Number(document.getElementById("customerOrders").value.trim()),
    status: document.getElementById("customerStatus").value
  };

  customers.push(newCustomer);
  saveCustomersToStorage();
  addCustomerForm.reset();
  addCustomerCard.style.display = "none";
  renderCustomers();
});

searchCustomerName.addEventListener("input", renderCustomers);
topCustomerSearchInput.addEventListener("input", renderCustomers);
customerStatusFilter.addEventListener("change", renderCustomers);

renderCustomers();