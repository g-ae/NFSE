import "../css/Login.css";
import { useNavigate } from "react-router-dom";

/**
 * Register page allowing users to choose between Buyer and Seller registration.
 * @returns {JSX.Element} Register page component.
 */
function Register() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2 className="login-title">Are you a...</h2>
      <div className="login-form">

        {/* Buttons to navigate to Buyer or Seller registration pages. */}
        <button 
          className="login-button" 
          onClick={() => navigate("/register/buyer")}
        >
          Buyer
        </button>
        <button 
          className="login-button" 
          onClick={() => navigate("/register/seller")}
        >
          Seller
        </button>
      </div>
    </div>
  );
}

export default Register;
