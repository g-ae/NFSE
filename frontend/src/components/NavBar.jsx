import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"
import { isLoggedIn, clearToken, getToken } from "../services/cookies";
import { getAccountTypeFromToken } from '../services/utils.js'
import { getAccountEmail } from '../services/api.js'

function UserSection() {
  const [userInfo, setUserInfo] = useState("Loading...");

  useEffect(() => {
    const fetchInfo = async () => {
      const token = getToken();
      if (!token) return;
      
      try {
        const accountType = getAccountTypeFromToken(token);
        // Passing token as id as well, assuming token acts as ID
        const accountEmail = await getAccountEmail(token, token);
        setUserInfo(`${accountType}: ${accountEmail}`);
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
        <Link to="/cart" className="nav-link">Cart</Link>
        <a href="#" className="nav-link" onClick={handleLogout}>
          {userInfo}
        </a>
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