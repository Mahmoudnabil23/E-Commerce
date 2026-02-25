document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("full_name").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;
    const terms = document.getElementById("terms").checked;
    const alertEl = document.getElementById("signup-alert");
    const successEl = document.getElementById("signup-success");

    alertEl.classList.add("d-none");
    successEl.classList.add("d-none");

    if (!name || !username || !email || !password || !confirmPassword) {
        alertEl.textContent = "Please fill all fields!";
        alertEl.classList.remove("d-none");
        return;
    }

    if (password.length < 8) {
        alertEl.textContent = "Password must be 8 characters or more!";
        alertEl.classList.remove("d-none");
        return;
    }

    if (password !== confirmPassword) {
        alertEl.textContent = "Passwords do not match!";
        alertEl.classList.remove("d-none");
        return;
    }

    if (!terms) {
        alertEl.textContent = "You must agree to the terms!";
        alertEl.classList.remove("d-none");
        return;
    }

    const result = signUp(username, name, email, password);

    if (result.success) {
        successEl.textContent = "Account created! Going to shop...";
        successEl.classList.remove("d-none");
        setTimeout(() => { window.location.href = "shop.html"; }, 1000);
    } else {
        alertEl.textContent = result.message;
        alertEl.classList.remove("d-none");
    }
});
