import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";
import BundleCard from "../components/BundleCard";
import { isLoggedIn } from "../services/cookies";
import { getReservedBundles, confirmBundle } from '../services/api.js'

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const bundles = await getReservedBundles();
        setCartItems(bundles || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  if (!isLoggedIn()) return null;
  
  if (loading) {
    return <div className="cart-loading"><h2>Loading cart...</h2></div>;
  }

  if (cartItems.length === 0) {
    return (
    <div className="cart-empty">
      <h2>No Bundle in cart yet</h2>
      <p>Start adding bundle to your cart and they will appear here!</p>
    </div>
    )
  }

  const total = cartItems.map((b) => parseFloat(b.price)).reduce((a, b) => a + b, 0);

  const handleConfirmOrder = async () => {
    setLoading(true)
    let errors = false
    for (const b of cartItems) {
      if (!(await confirmBundle(b.bundleId))) {
        errors = true
      }
    }
    
    if (errors) {
      alert("An error occurred, please try again later.")
    } else {
      alert("Order confirmed! Total: " + total + " CHF");
    }
    setLoading(false)
  };

  return (
      <div>
        <div className="cart-header">
          <h2>Your Cart - Total: { total } CHF</h2>
          <button className="confirm-button" onClick={handleConfirmOrder}>
            Confirm order
          </button>
        </div>
        <div className="bundle-grid">
          {cartItems.map((bundle) => (
            <BundleCard bundle={bundle} key={bundle.bundleId} />
          ))}
        </div>
      </div>
    );
}

export default Cart;
