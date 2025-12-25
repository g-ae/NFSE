import "../css/BundleCard.css"
//import { useBundleContext } from "../context/BundleContext"
import { reserveBundle, unreserveBundle } from "../services/api"

function BundleCard({bundle}) {
    //const {isReserved, addToCart, removeFromCart} = useBundleContext()
    //const incart = isReserved(bundle.bundleId)
    const icon = bundle.reservedTime ? "❌" : "🛒"

    const onIncartClick = (e) => {
        e.stopPropagation()
        if (!bundle.reservedTime) {
          reserveBundle(bundle.bundleId)
          alert("Added item to cart")
          window.location.href = "/"
        } else {
          unreserveBundle(bundle.bundleId)
          alert("Removed item from cart")
          window.location.href = "/cart"
        }
    }

    return (
        <div className="bundle-card">
            <div className="bundle-poster">
                <img src={bundle.image_url} alt={`Image non existante pour ${bundle.content}`}/>
                <div className="bundle-overlay">
                    <button className={`cart-btn ${!bundle.reservedTime ? "" : "active"}`} onClick={onIncartClick}>
                        {icon}
                    </button>
                </div>
            </div>
            <div className="bundle-info">
                <h3>{bundle.content}</h3>
                <p>{bundle.pickupStartTime} - {bundle.pickupEndTime}</p>
                {bundle.price && <p className="bundle-price">{bundle.price}€</p>}
            </div>
        </div>
    )
}

export default BundleCard