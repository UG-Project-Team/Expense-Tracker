const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
});

// Handle Signup
async function handleSignup(event) {
    event.preventDefault();
    const fullName = document.querySelector('input[placeholder="Full Name"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Password"]').value;

    try {
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password }),
        });

        if (response.ok) {
            alert('Signup successful!');
            window.location.href = 'addMembers.html';
        } else {
            alert('Signup failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    const email = document.querySelector('.sign-in input[placeholder="Email"]').value;
    const password = document.querySelector('.sign-in input[placeholder="Password"]').value;

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('fullName', data.fullName);
            localStorage.setItem('email', data.email);
            alert('Login Successful');
            window.location.href = '../home/index.html';  // Redirect to Add Members page
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

