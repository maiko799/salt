document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const res = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      window.location.href = 'game.html';  // Redirect to the game
    } else {
      alert('Error: ' + data.message);
    }
  });
  