import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";
import BundleCard from "../components/BundleCard";
import { isLoggedIn } from "../services/cookies";
import { getReservedBundles } from '../services/api.js'

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

  return (
      <div className="incart">
      <h2>Your Cart - Total: { cartItems.map((b) => parseFloat(b.price)).reduce((a, b) => a + b, 0) } CHF</h2>
        <div className="bundle-grid">
          {cartItems.map((bundle) => (
            <BundleCard bundle={bundle} key={bundle.bundleId} />
          ))}
        </div>
      </div>
    );
}

export default Cart;
