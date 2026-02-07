document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginTerminal = document.getElementById('loginTerminal');
    const forgotBtn = document.getElementById('forgotBtn');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Forgot password
    forgotBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginTerminal.innerHTML = '> [SYSTEM] Recovery protocol initiated...<br>> Sending quantum key to registered device...';
        loginTerminal.style.color = '#ff0';
        
        setTimeout(() => {
            loginTerminal.innerHTML += '<br>> [SUCCESS] Temporary access code: RNY-' + Math.random().toString(36).substr(2, 8).toUpperCase();
            loginTerminal.style.color = '#0f0';
        }, 1500);
    });

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        const remember = document.getElementById('remember').checked;
        
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.innerHTML;
        
        // Validation
        if (!username || !password) {
            loginTerminal.innerHTML = '> [ERROR] Username and password required!';
            loginTerminal.style.color = '#f00';
            return;
        }
        
        // Simulate login process
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AUTHENTICATING...';
        loginBtn.disabled = true;
        
        loginTerminal.innerHTML = '> Verifying credentials...<br>'> Checking security clearance...';
        loginTerminal.style.color = '#0ff';
        
        // Simulate API call
        setTimeout(() => {
            // Success condition (demo)
            if (password.length >= 6) {
                loginTerminal.innerHTML = '> [SUCCESS] Access granted!<br>'> Welcome, ' + username + '.<br>'> Loading AI Dashboard...';
                loginTerminal.style.color = '#0f0';
                
                // Store session
                if (remember) {
                    localStorage.setItem('rnyy_user', username);
                }
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } else {
                loginTerminal.innerHTML = '> [FAILURE] Invalid credentials or security breach detected.<br>'> Please try again.';
                loginTerminal.style.color = '#f00';
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;
            }
        }, 2000);
    });

    // Load saved username
    const savedUser = localStorage.getItem('rnyy_user');
    if (savedUser) {
        document.getElementById('username').value = savedUser;
        document.getElementById('remember').checked = true;
    }

    // Add some random terminal messages
    const messages = [
        "> System integrity: 100%",
        "> Encryption: AES-256 Active",
        "> Last login: " + new Date().toLocaleDateString(),
        "> AI Core: Online"
    ];
    
    let msgIndex = 0;
    setInterval(() => {
        if (msgIndex < messages.length) {
            loginTerminal.innerHTML += '<br>' + messages[msgIndex];
            msgIndex++;
        }
    }, 3000);
});