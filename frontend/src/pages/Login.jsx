import { useState } from "react";
import "../css/Login.css";
import { loginBuyer, loginSeller } from "../services/api";
import { saveToken } from "../services/cookies";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "buyer" // default role
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Login attempt:", formData);

    try {
      // Map username to email for the API
      const apiData = { ...formData, email: formData.username };
      
      const loginData = formData.role === 'buyer' 
        ? await loginBuyer(apiData) 
        : await loginSeller(apiData);
      console.log(loginData)
      if (!loginData) {
        setError("Invalid email or password. Please try again.");
      } else {
        saveToken(loginData.token);
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Sign In</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Email"
            className="login-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
            <label className="form-label">I am a:</label>
            <div className="role-selection">
                <label className="role-option">
                    <input 
                        type="radio" 
                        name="role" 
                        value="buyer"
                        checked={formData.role === "buyer"}
                        onChange={handleChange}
                        className="role-radio"
                    />
                    Buyer
                </label>
                <label className="role-option">
                    <input 
                        type="radio" 
                        name="role" 
                        value="seller"
                        checked={formData.role === "seller"}
                        onChange={handleChange}
                        className="role-radio"
                    />
                    Seller
                </label>
            </div>
        </div>

        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>
      <a className="no-account" href="/register">Don't have an account ? Register now !</a>
    </div>
  );
}

export default Login;