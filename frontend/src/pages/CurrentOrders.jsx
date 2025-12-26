import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css"; // Reuse Cart CSS for consistency
import BundleCard from "../components/BundleCard";
import { isLoggedIn } from "../services/cookies";
import { getConfirmedBundles } from '../services/api.js'

function CurrentOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const bundles = await getConfirmedBundles();
        setOrders(bundles || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (!isLoggedIn()) return null;
  
  if (loading) {
    return <div className="cart-loading"><h2>Loading orders...</h2></div>;
  }

  if (orders.length === 0) {
    return (
    <div className="cart-empty">
      <h2>No orders found</h2>
      <p>You haven't confirmed any orders yet.</p>
    </div>
    )
  }

  return (
      <div className="incart">
        <div className="cart-header">
          <h2>Your Current Orders</h2>
        </div>
        <div className="bundle-grid">
          {orders.map((bundle) => (
            <BundleCard bundle={bundle} key={bundle.bundleId} />
          ))}
        </div>
      </div>
    );
}

export default CurrentOrders;
