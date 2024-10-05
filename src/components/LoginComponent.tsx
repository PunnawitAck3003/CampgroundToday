"use client"
import { useState } from "react";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Simple mock login: In reality, you'd verify the user credentials here.
    if (email === "test@example.com" && password === "password") {
      setIsLoggedIn(true);
    } else {
      setError("Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div>
          <h2>Welcome! You are logged in.</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit">Login</button>
          </form>
        </>
      )}
    </div>
  );
}
