import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";
import BundleCard from "../components/BundleCard";
import { isLoggedIn } from "../services/cookies";
import { getReservedBundles, confirmBundle } from '../services/api.js'

/**
 * Cart page displaying reserved bundles with option to confirm order.
 * @returns {JSX.Element} Cart page component.
 */
function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reserved bundles when loading the cart page.
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    // Function to fetch cart items by calling getReservedBundles().
    const fetchCart = async () => {
      try {
        const bundles = await getReservedBundles();
        setCartItems(bundles || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {

        // Set loading to false to indicate fetching is done.
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  if (!isLoggedIn()) return null;
  
  // Show loading state while fetching cart items.
  if (loading) {
    return <div className="cart-loading"><h2>Loading cart...</h2></div>;
  }

  // If cart is empty, display a message.
  if (cartItems.length === 0) {
    return (
    <div className="cart-empty">
      <h2>No Bundle in cart yet</h2>
      <p>Start adding bundle to your cart and they will appear here!</p>
    </div>
    )
  }

  // Calculate total price of items in the cart.
  const total = cartItems.map((b) => parseFloat(b.price)).reduce((a, b) => a + b, 0);

  // Handle confirming the order for all items in the cart.
  const handleConfirmOrder = async () => {
    setLoading(true)
    let errors = false
    // Confirm each bundle in the cart.
    for (const b of cartItems) {
      if (!(await confirmBundle(b.bundleId))) {
        errors = true
      }
    }
    
    if (errors) {
      alert("An error occurred, please try again later.")
    } else {
      // On success, alert the user and clear the cart.
      alert("Order confirmed! Total: " + total + " CHF");
      setCartItems([]);
    }
    // Set loading to false after processing to say that we are done.
    setLoading(false)
  };

  // Render the cart with items and total price.
  return (
      <div>
        <div className="cart-header">

          {/* Display total price and confirm button. */}
          <h2>Your Cart - Total: { total } CHF</h2>
          <button className="confirm-button" onClick={handleConfirmOrder}>
            Confirm order
          </button>
        </div>
        
        {/* Display the list of bundle cards in the cart. */}
        <div className="bundle-grid">
          {cartItems.map((bundle) => (
            <BundleCard bundle={bundle} key={bundle.bundleId} />
          ))}
        </div>
      </div>
    );
}

export default Cart;
