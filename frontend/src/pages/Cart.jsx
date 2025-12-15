import "../css/Cart.css";
import { useBundleContext } from "../context/BundleContext";
import BundleCard from "../components/BundleCard";

function Cart() {
  const { incart } = useBundleContext();

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
