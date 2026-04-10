document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("adminLoginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("adminEmail").value.trim();
      const password = document.getElementById("adminPassword").value.trim();

      if (email === "admin@localroots.com" && password === "admin123") {
        window.location.href = "admin-dashboard.html";
      } else {
        alert("Invalid admin email or password");
      }
    });
  }
});