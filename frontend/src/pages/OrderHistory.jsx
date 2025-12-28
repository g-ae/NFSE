import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css"; // Reuse Cart CSS for consistency
import BundleCard from "../components/BundleCard";
import { isLoggedIn } from "../services/cookies";
import { getOldBundles } from '../services/api.js'

function OrderHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const bundles = await getOldBundles();
        setHistory(bundles || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (!isLoggedIn()) return null;
  
  if (loading) {
    return <div className="cart-loading"><h2>Loading history...</h2></div>;
  }

  if (history.length === 0) {
    return (
    <div className="cart-empty">
      <h2>No history found</h2>
      <p>You haven't completed any orders yet.</p>
    </div>
    )
  }

  return (
      <div className="incart">
        <div className="cart-header">
          <h2>Order History</h2>
        </div>
        <div className="bundle-grid">
          {history.map((bundle) => (
            <BundleCard bundle={bundle} key={bundle.bundleId} />
          ))}
        </div>
      </div>
    );
}

export default OrderHistory;
