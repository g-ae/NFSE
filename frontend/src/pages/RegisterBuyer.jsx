import { useState } from "react";
import "../css/Login.css";
import { registerBuyer } from '../services/api.js'

/**
 * Register Buyer page allowing new buyers to create an account.
 * @returns {JSX.Element} Register Buyer page component.
 */
function RegisterBuyer() {

  // Buyer registration informations.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    telephone: ""
  });
  const [error, setError] = useState("");

  // Update data state on input changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Register the buyer with registerBuyer().
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const registerData = await registerBuyer(formData);
      
      // If registration fails, display registration error message.
      if (!registerData) {
        setError("Registration failed. Please try again.");
      } else {

        // On success, alert and redirect to login page.
        alert("Your have been registered, please log in to use your account.")
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during registration. Please try again later.");
    }
  };

  // Render the buyer registration form.
  return (
    <div className="login-container">
      <h2 className="login-title">Register as Buyer</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">

        {/* Input fields for name, email, telephone, and password. */}
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="login-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="login-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="tel"
            name="telephone"
            placeholder="Telephone"
            className="login-input"
            value={formData.telephone}
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

        {/* Submit button for registration. */}
        <button type="submit" className="login-button">
          Register
        </button>
      </form>
      <a className="no-account" href="/login">Already have an account ? Sign in !</a>
    </div>
  );
}

export default RegisterBuyer;
