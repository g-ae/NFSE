import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"
import { isLoggedIn, clearToken, getToken } from "../services/cookies";
import { getAccountTypeFromToken } from '../services/utils.js'
import { getAccountEmail } from '../services/api.js'

function UserSection() {
  const [userInfo, setUserInfo] = useState("Loading...");
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const token = getToken();
      if (!token) return;
      
      try {
        const type = getAccountTypeFromToken(token);
        setAccountType(type);
        const accountEmail = await getAccountEmail(token);
        setUserInfo(`${type}: ${accountEmail}`);
      } catch (err) {
        console.error(err);
        setUserInfo("Error loading info");
      }
    };
    
    fetchInfo();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    clearToken();
    window.location.reload();
  };

  if (isLoggedIn()) {
    return (
      <>
        {accountType === "Seller" ? (
          <Link to="/new-bundle" className="nav-link">New Bundle</Link>
        ) : (
          <Link to="/cart" className="nav-link">Cart</Link>
        )}
        <Link to="/profile" className="nav-link">{userInfo}</Link>
        <a href="#" className="nav-link" onClick={handleLogout}>Logout</a>
      </>
    );
  }
  
  return (
    <>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
    </>
  );
}

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">NFSE</Link>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <UserSection />
        </div>
    </nav>
}

export default NavBar