import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { registerSeller } from "../services/api.js";

function RegisterSeller() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    telephone: "",
    country: "",
    state: "",
    npa: "",
    street: "",
    street_no: ""
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
    console.log("RegisterSeller handleSubmit called");
    setError("");

    try {
      console.log("Calling registerSeller with:", formData);
      const registerData = await registerSeller(formData);
      console.log("registerSeller returned:", registerData);
      
      if (!registerData) {
        setError("Registration failed. Please try again.");
      } else {
        alert("Your have been registered, please log in to use your account.")
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during registration. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Register as Seller</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="login-form">
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

        <div style={{ marginTop: "1rem" }}></div>

        <div className="form-group">
          <input
            type="text"
            name="country"
            placeholder="Country"
            className="login-input"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="state"
            placeholder="State"
            className="login-input"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="npa"
            placeholder="Postal Code"
            className="login-input"
            value={formData.npa}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="street"
            placeholder="Street"
            className="login-input"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="street_no"
            placeholder="Street Number"
            className="login-input"
            value={formData.street_no}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Register
        </button>
      </form>
      <a className="no-account" href="/login">Already have an account ? Sign in !</a>
    </div>
  );
}

export default RegisterSeller;
