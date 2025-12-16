import { Link } from "react-router-dom";
import "../css/Navbar.css"
import { isLoggedIn, clearToken } from "../services/cookies";

function loginOrCart() {
  if (isLoggedIn()) return <><Link to="/cart" className="nav-link">Cart</Link><a href="#" className="nav-link" onClick={(e) => {
    e.preventDefault()
    clearToken()
    window.location.reload()
  }}>Logout</a></>
  
  return <><Link to="/login" className="nav-link">Login</Link><Link to="/register" className="nav-link">Register</Link></>
}

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">NFSE</Link>
        </div>
        <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            {loginOrCart()}
        </div>
    </nav>
}

export default NavBar