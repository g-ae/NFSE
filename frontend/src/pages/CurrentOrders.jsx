import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css"; // Reuse Cart CSS for consistency
import BundleCard from "../components/BundleCard";
import { isLoggedIn } from "../services/cookies";
import { getConfirmedBundles } from '../services/api.js'


/**
 * Current Orders page displaying confirmed bundles (bundles with confirmedTime).
 * @returns {JSX.Element} Current Orders page component.
 */
function CurrentOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch confirmed bundles when loading the Current Orders page.
  useEffect(() => {
    // If not logged in, redirect to login page.
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    // Function to fetch confirmed bundles by calling getConfirmedBundles().
    const fetchOrders = async () => {
      try {
        const bundles = await getConfirmedBundles();
        setOrders(bundles || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {

        // Set loading to false to indicate fetching is done.
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (!isLoggedIn()) return null;
  
  if (loading) {
    return <div className="cart-loading"><h2>Loading orders...</h2></div>;
  }

  // If no orders found, display that the user has no orders.
  if (orders.length === 0) {
    return (
    <div className="cart-empty">
      <h2>No orders found</h2>
      <p>You haven't confirmed any orders yet.</p>
    </div>
    )
  }

  // Display the confirmed bundles.
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
