function getUsers() {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function signUp(username, name, email, password) {
    const users = getUsers();

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: "Username already exists!" };
    }

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: "Email already used!" };
    }

    users.push({ username, name, email, password });
    saveUsers(users);

    localStorage.setItem("currentUser", JSON.stringify({ username, name, email }));
    return { success: true, message: "Account created!" };
}

function login(username, password) {
    const users = getUsers();
    const user = users.find(
        u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!user) {
        return { success: false, message: "Wrong username or password!" };
    }

    localStorage.setItem("currentUser", JSON.stringify({
        username: user.username, name: user.name, email: user.email
    }));
    return { success: true, message: "Login done!" };
}

function logout() {
    localStorage.removeItem("currentUser");
    const inSubfolder = window.location.pathname.includes("/html/");
    window.location.href = inSubfolder ? "../home.html" : "home.html";
}

function getCurrentUser() {
    const data = localStorage.getItem("currentUser");
    return data ? JSON.parse(data) : null;
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function getPathPrefix() {
    return window.location.pathname.includes("/html/") ? "../" : "";
}

function getHtmlPrefix() {
    return window.location.pathname.includes("/html/") ? "" : "html/";
}

function updateNavbarAuth() {
    const userNavArea = document.getElementById("user-nav-area");
    if (!userNavArea) return;

    const user = getCurrentUser();
    const htmlPrefix = getHtmlPrefix();

    if (user) {
        userNavArea.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-primary dropdown-toggle btn-sm" 
                        type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-person-circle me-1"></i>${user.username}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><span class="dropdown-item-text fw-bold">${user.name}</span></li>
                    <li><span class="dropdown-item-text text-muted small">${user.email}</span></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout(); return false;">
                        <i class="bi bi-box-arrow-right me-1"></i>Logout
                    </a></li>
                </ul>
            </div>
        `;
    } else {
        userNavArea.innerHTML = `
            <a href="${htmlPrefix}login.html" class="btn btn-primary btn-sm">
                <i class="bi bi-person me-1"></i>Login
            </a>
        `;
    }
}

document.addEventListener("DOMContentLoaded", updateNavbarAuth);
