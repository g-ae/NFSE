import { useEffect, useState } from "react";
import "../css/BundleCard.css"
import { reserveBundle, unreserveBundle, getIsRatedFrom, postRate, getSeller } from "../services/api"
import { useNavigate } from "react-router-dom";
import { getAccountTypeFromToken } from "../services/utils";
import { getToken, isLoggedIn } from "../services/cookies";



function BundleCard({bundle, userLocation}) {
    const [accountType, setAccountType] = useState("unknown")
    const [isRated, setRated] = useState(false)
    const [showRating, setShowRating] = useState(false)
    const [rating, setRating] = useState(0)
    const navigate = useNavigate();
    const icon = bundle.reservedTime ? "❌" : "🛒"
    
    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      if (!lat1 || !lon1 || !lat2 || !lon2) return null;
      const R = 6371;
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in km
      return d.toFixed(1);
    }

    const deg2rad = (deg) => {
      return deg * (Math.PI / 180)
    }

    const distance = userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, bundle.latitude, bundle.longitude) : null;
    
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

    function Address({sellerId}) {
        const [s, setS] = useState(null);

        useEffect(() => {
            let cancelled = false;

            (async () => {
            const seller = await getSeller(sellerId); 
            if (!cancelled) setS(seller);
            })();
            return () => { cancelled = true };
        }, [sellerId]);

        if (!s) return null;
        return (
            <div className="bundle-address">
                <p className="bundle-address-large">{s.country} - {s.state} - {s.npa} - {s.city}</p>
                <p className="bundle-address-close">{s.address}</p>
        </div>)
    }

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
                <div className="bundle-info-top">
                    <h3>{bundle.content}</h3>
                </div>
                <div className="bundle-info-bottom">
                    <p>
                        {distance && <span className="bundle-distance" style={{marginRight: '8px'}}>📍 {distance} km</span>}
                        {distance && !bundle.pickupRealTime && <span style={{marginRight: '8px'}}>|</span>}
                        {!bundle.pickupRealTime && <span>{formatDateTime(bundle.pickupStartTime)} - {formatDateTime(bundle.pickupEndTime)}</span>}
                    </p>
                    {bundle.pickupRealTime && `Picked up at ${formatDateTime(bundle.pickupRealTime)}`}
                    <Address sellerId={bundle.sellerId}/>
                    <p className="bundle-price">{bundle.price}€</p>
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
        </div>
    )
}

export default BundleCard