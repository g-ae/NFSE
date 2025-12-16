import "../css/Login.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2 className="login-title">Are you a...</h2>
      <div className="login-form">
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
