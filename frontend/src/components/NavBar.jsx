import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"
import { isLoggedIn, clearToken, getToken } from "../services/cookies";
import { getAccountTypeFromToken } from '../services/utils.js'
import { getAccountEmail } from '../services/api.js'

// Renders user-specific navigation links based on login status and account type.
function UserSection() {
  const [userInfo, setUserInfo] = useState("Loading...");
  const [accountType, setAccountType] = useState(null);

  // Fetch user info on component mount.
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

  // If logged in, display relevant links depending on account type.
  if (isLoggedIn()) {
    return (
      <>
        {/* If seller, show New Bundle link / if buyer, show Cart and Current Orders links */}
        {accountType === "Seller" ? (
          <Link to="/new-bundle" className="nav-link">New Bundle</Link>
        ) : (
          <>
            <Link to="/cart" className="nav-link">Cart</Link>
            <Link to="/current-orders" className="nav-link">Current Orders</Link>
          </>
        )}
        {/* Display profile info and logout link */}
        <Link to="/profile" className="nav-link">{userInfo}</Link>
      </>
    );
  }

  // If not logged in, show Login and Register links.
  return (
    <>
      <Link to="/login" className="nav-link">Login</Link>
      <Link to="/register" className="nav-link">Register</Link>
    </>
  );
}

/**
 * Displays the navigation bar depending on user login status with links to
 * relevant pages.
 * @returns {JSX.Element} Navigation bar component.
 */
function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">NFSE</Link>
        </div>
        <div className="navbar-links">
            <UserSection />
        </div>
    </nav>
}

export default NavBar