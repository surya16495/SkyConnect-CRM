// Initialize dummy users in localStorage if not present
if (!localStorage.getItem("users")) {
  const defaultUsers = [
    { email: "admin@skyconnect.com", password: "12345" },
    { email: "staff@skyconnect.com", password: "67890" }
  ];
  localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// Helper function to get all users
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Helper function to update users
function updateUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Handle login
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-msg");

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    errorMsg.style.color = "lightgreen";
    errorMsg.textContent = "Login successful! Redirecting...";
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    setTimeout(() => {
      window.location.href = "home.html"; 
    }, 1500);
  } else {
    errorMsg.style.color = "red";
    errorMsg.textContent = "Invalid email or password. Try again!";
  }
});

// Toggle forms
document.getElementById("forgot-link").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("login-box").classList.add("hidden");
  document.getElementById("forgot-box").classList.remove("hidden");
});

document.getElementById("back-to-login").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("forgot-box").classList.add("hidden");
  document.getElementById("login-box").classList.remove("hidden");
});

// Handle password reset
document.getElementById("forgotForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const resetEmail = document.getElementById("resetEmail").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const resetMsg = document.getElementById("reset-msg");

  let users = getUsers();
  const userIndex = users.findIndex(u => u.email === resetEmail);

  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
    updateUsers(users); // update localStorage
    resetMsg.style.color = "lightgreen";
    resetMsg.textContent = "Password successfully updated!";
    setTimeout(() => {
      document.getElementById("forgot-box").classList.add("hidden");
      document.getElementById("login-box").classList.remove("hidden");
    }, 1500);
  } else {
    resetMsg.style.color = "red";
    resetMsg.textContent = "Email not found. Please try again.";
  }
});
