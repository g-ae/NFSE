import "../css/BundleCard.css"
import { useBundleContext } from "../context/BundleContext"

function BundleCard({bundle}) {
    const {isReserved, addToCart, removeFromCart} = useBundleContext()
    const incart = isReserved(bundle.bundleId)

    const onIncartClick = (e) => {
        e.stopPropagation()
        if (incart) removeFromCart(bundle.bundleId)
        else addToCart(bundle)
    }

    return (
        <div className="bundle-card">
            <div className="bundle-poster">
                {/*<img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>*/}
                <div className="bundle-overlay">
                    <button className={`cart-btn ${incart ? "active" : ""}`} onClick={onIncartClick}>
                        🛒
                    </button>
                </div>
            </div>
            <div className="bundle-info">
                <h3>{bundle.content}</h3>
                <p>{bundle.pickup_start_time} - {bundle.pickup_end_time}</p> {/*.split("-")[0]}*/}
            </div>
        </div>
    )
}

export default BundleCard