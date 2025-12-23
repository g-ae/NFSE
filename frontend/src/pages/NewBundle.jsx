import { useState, useEffect } from "react";
import "../css/Login.css";
import { createBundle } from "../services/api";
import { getToken } from "../services/cookies";
import { getAccountTypeFromToken } from "../services/utils";

function NewBundle() {
  const getDefaultDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const type = getAccountTypeFromToken(token);
    if (type !== "Seller") {
      window.location.href = "/";
    }
  }, []);

  const [formData, setFormData] = useState({
    content: "",
    price: "",
    pickupStartTime: getDefaultDateTime(),
    pickupEndTime: getDefaultDateTime()
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

    try {
      const result = await createBundle(formData);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setError("Failed to create bundle. Please check your inputs and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">New Bundle</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message" style={{color: 'green', marginBottom: '10px'}}>Bundle created successfully! Redirecting...</div>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">Content Description</label>
          <input
            type="text"
            name="content"
            placeholder="e.g. 2 loafs of bread"
            className="login-input"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Price (CHF)</label>
          <input
            type="number"
            name="price"
            placeholder="0.00"
            step="0.01"
            min="0"
            className="login-input"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pickup Start Time</label>
          <input
            type="datetime-local"
            name="pickupStartTime"
            className="login-input"
            value={formData.pickupStartTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pickup End Time</label>
          <input
            type="datetime-local"
            name="pickupEndTime"
            className="login-input"
            value={formData.pickupEndTime}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Create Bundle
        </button>
      </form>
    </div>
  );
}

export default NewBundle;
