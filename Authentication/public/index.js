<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Demo</title>
    <script>
        async function register() {
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.text();
            document.getElementById('register-result').textContent = data;
        }

        async function login() {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            document.getElementById('login-result').textContent = data.message;
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
        }

        async function accessProtected() {
            const token = localStorage.getItem('token');
            
            const response = await fetch('http://localhost:3000/protected', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });

            const data = await response.text();
            document.getElementById('protected-result').textContent = data;
        }
    </script>
</head>
<body>
    <h1>Authentication Demo</h1>
    <div>
        <h2>Register</h2>
        <input type="text" id="register-username" placeholder="Username">
        <input type="password" id="register-password" placeholder="Password">
        <button onclick="register()">Register</button>
        <p id="register-result"></p>
    </div>
    <div>
        <h2>Login</h2>
        <input type="text" id="login-username" placeholder="Username">
        <input type="password" id="login-password" placeholder="Password">
        <button onclick="login()">Login</button>
        <p id="login-result"></p>
    </div>
    <div>
        <h2>Access Protected Route</h2>
        <button onclick="accessProtected()">Access</button>
        <p id="protected-result"></p>
    </div>
</body>
</html>
