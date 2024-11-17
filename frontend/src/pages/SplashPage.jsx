import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SplashPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');
  const navigate = useNavigate();

  const createTestUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/create-test-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Test user created:', data);
      alert('Test user created! Try logging in now.');
    } catch (error) {
      console.error('Error creating test user:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL.replace(/\/$/, '');
      console.log('Making request to:', `${apiUrl}/api/auth/login`);
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Login</h1>
      <button onClick={createTestUser} style={{ marginBottom: '20px' }}>
        Create Test User
      </button>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: '10px', padding: '5px' }}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default SplashPage; 