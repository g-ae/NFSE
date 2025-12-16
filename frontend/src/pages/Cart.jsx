import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";
import { useBundleContext } from "../context/BundleContext";
import BundleCard from "../components/BundleCard";
import { isLoggedIn } from "../services/cookies";

function Cart() {
  const { incart } = useBundleContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  if (!isLoggedIn()) return null;

  if (incart.length === 0) {
    return (
    <div className="cart-empty">
      <h2>No Bundle in cart yet</h2>
      <p>Start adding bundle to your cart and they will appear here!</p>
    </div>
    )
  }

  return (
      <div className="incart">
        <h2>Your Cart</h2>
        <div className="bundle-grid">
          {incart.map((bundle) => (
            <BundleCard bundle={bundle} key={bundle.bundleId} />
          ))}
        </div>
      </div>
    );
}

export default Cart;
