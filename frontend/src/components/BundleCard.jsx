import { useEffect, useState } from "react";
import "../css/BundleCard.css"
//import { useBundleContext } from "../context/BundleContext"
import { reserveBundle, unreserveBundle, getIsRatedFrom, postRate } from "../services/api"
import { useNavigate } from "react-router-dom";
import { getAccountTypeFromToken } from "../services/utils";
import { getToken, isLoggedIn } from "../services/cookies";



function BundleCard({bundle}) {
    //const {isReserved, addToCart, removeFromCart} = useBundleContext()
    //const incart = isReserved(bundle.bundleId)
    const [accountType, setAccountType] = useState("unknown")
    const [isRated, setRated] = useState(false)
    const [showRating, setShowRating] = useState(false)
    const [rating, setRating] = useState(0)
    const navigate = useNavigate();
    const icon = bundle.reservedTime ? "❌" : "🛒"
    
    useEffect(() => {
      const fetchData = async () => {
        let accType = "unknown"
        if (isLoggedIn()) {
          const token = getToken();
          accType = getAccountTypeFromToken(token)
          setAccountType(accType);
        } else {
          setAccountType("unknown");
        }
        
        const id = accType === "Buyer" ? bundle.sellerId : bundle.buyerId
        setRated(await getIsRatedFrom(id))
      };

      fetchData();
    }, []);

    const formatDateTime = (iso) =>
        new Date(iso).toLocaleString("fr-CH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    
    

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

    
    const onQrButtonClicked = (e) => {
        e.stopPropagation();
        navigate("/qrcode", { state: bundle.bundleId });
    }

    const onScannerButtonClicked = (e) => {
        e.stopPropagation();
        navigate("/scan", { state : bundle.bundleId});
    }
    
    const onRateButtonClicked = (e) => {
      e.stopPropagation()
      setShowRating(true)
    }

    const submitRating = async (e) => {
        e.stopPropagation()
        setRated(true)
        await postRate(getToken()[0] == "b" ? bundle.sellerId : bundle.buyerId,rating)
        setShowRating(false)
    }

    function CartButton() {
        return (
            <div className="bundle-overlay">
                {(bundle.confirmedTime) ? "" : (<button className={`cart-btn ${!bundle.reservedTime ? "" : "active"}`} onClick={onIncartClick}>
                    {icon}
                </button>)}
            </div>
        )
    }

    return (
        <div className="bundle-card">
            <div className="bundle-poster">
                <img src={bundle.image_url} alt={`Image non existante pour ${bundle.content}`}/>
                {accountType === "Buyer" && <CartButton />}
                {bundle.confirmedTime && !bundle.pickupRealTime && accountType === "Buyer" && (
                    <div className="qr-btn-wrap">
                        <button className="qr-btn" onClick={onQrButtonClicked}>
                            Show QR CODE
                        </button>
                    </div>
                )}
                {bundle.confirmedTime && !bundle.pickupRealTime && accountType === "Seller" && (
                    <div className="qr-btn-wrap">
                        <button className="qr-btn" onClick={onScannerButtonClicked}>
                            Scan QR Code
                        </button>
                    </div>
                )}
            </div>
            <div className="bundle-info">
                <h3>{bundle.content}</h3>
                {!bundle.pickupRealTime && <p>{formatDateTime(bundle.pickupStartTime)} - {formatDateTime(bundle.pickupEndTime)}</p>}
                {bundle.pickupRealTime && `Picked up at ${formatDateTime(bundle.pickupRealTime)}`}
                {bundle.price && <p className="bundle-price">{bundle.price}€</p>}
                {bundle.pickupRealTime && !isRated && (
                    !showRating ? (
                        <button onClick={onRateButtonClicked}>Rate { accountType == "Buyer" ? "seller" : "buyer" }</button>
                    ) : (
                        <div className="rating-container" onClick={(e) => e.stopPropagation()}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                    key={star}
                                    className={`star-btn ${star <= rating ? "active" : ""}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                            <button className="rating-submit" onClick={submitRating} disabled={rating === 0}>Send</button>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default BundleCard