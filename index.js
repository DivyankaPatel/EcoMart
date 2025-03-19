// Toggle between Login and Signup Forms
function toggleForm() {
    document.getElementById("login-section").classList.toggle("hidden");
    document.getElementById("signup-section").classList.toggle("hidden");
}

// Mock Login Function (For Testing)
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "user@example.com" && password === "password") {
        alert("Login Successful!");
    } else {
        alert("Invalid Email or Password.");
    }
}

// Mock Signup Function (For Testing)
function signupUser() {
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    if (name && email && password) {
        alert("Signup Successful! Now Login.");
        toggleForm(); // Switch to login form
    } else {
        alert("Please fill all fields.");
    }
}
