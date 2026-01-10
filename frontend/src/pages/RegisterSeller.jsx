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
    city: "",
    npa: "",
    street: "",
    street_no: "",
    latitude: "",
    longitude: ""
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

        <div className="form-group" style={{display: "flex", gap: "10px"}}>
          <input
            type="text"
            name="npa"
            placeholder="Postal Code"
            className="login-input"
            value={formData.npa}
            onChange={handleChange}
            required
            style={{flex: 1}}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            className="login-input"
            value={formData.city}
            onChange={handleChange}
            required
            style={{flex: 2}}
          />
        </div>

        <div className="form-group" style={{display: "flex", gap: "10px"}}>
          <input
            type="text"
            name="street"
            placeholder="Street"
            className="login-input"
            value={formData.street}
            onChange={handleChange}
            required
          />
          
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

        <div className="form-group">
          <button 
            type="button" 
            className="login-button" 
            style={{backgroundColor: "#4CAF50", marginBottom: "1rem"}}
            onClick={() => {
              const getLocation = () => {
                if (navigator.geolocation) {
                   navigator.geolocation.getCurrentPosition((position) => {
                    setFormData(prev => ({
                      ...prev,
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    }));
                  }, async (err) => {
                    console.error("Geolocation API failed:", err);
                    // Fallback to IP Geolocation
                    try {
                      const response = await fetch("https://ipwho.is/");
                      const data = await response.json();
                      if (data.latitude && data.longitude) {
                        setFormData(prev => ({
                          ...prev,
                          latitude: data.latitude,
                          longitude: data.longitude
                        }));
                        alert("Browser location failed. Used approximate IP-based location.");
                      } else {
                        throw new Error("Invalid data from IP API");
                      }
                    } catch (ipErr) {
                      console.error("IP Geolocation failed:", ipErr);
                      alert("Could not determine location. Please try again or check permissions.");
                    }
                  }, {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 0
                  });
                } else {
                  alert("Geolocation is not supported by this browser.");
                }
              }
              getLocation();
            }}
          >
            Get My Location
          </button>
        </div>

        <div className="form-group" style={{display: "flex", gap: "10px"}}>
           <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            className="login-input"
            value={formData.latitude}
            readOnly
          />
           <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            className="login-input"
            value={formData.longitude}
            readOnly
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
