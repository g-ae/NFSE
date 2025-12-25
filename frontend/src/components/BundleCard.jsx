import { useState } from "react";
import "../css/BundleCard.css"
//import { useBundleContext } from "../context/BundleContext"
import { reserveBundle, unreserveBundle } from "../services/api"
import { useNavigate } from "react-router-dom";



function BundleCard({bundle}) {
    //const {isReserved, addToCart, removeFromCart} = useBundleContext()
    //const incart = isReserved(bundle.bundleId)
    const navigate = useNavigate();
    const icon = bundle.reservedTime ? "❌" : "🛒"

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

    function QrcodeButton() {
        const onQrButtonClicked = (e) => {
            e.stopPropagation();
            navigate("/qrcode", { state: bundle.bundleId });;
; 
        }
        return (
            <div className="qr-btn-wrap">
                <button className="qr-btn" onClick={onQrButtonClicked}>
                    Show QR CODE
                </button>
            </div>
        )
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
                {bundle.reservedTime && <QrcodeButton/>}
            </div>
            <div className="bundle-info">
                <h3>{bundle.content}</h3>
                <p>{formatDateTime(bundle.pickupStartTime)} - {formatDateTime(bundle.pickupEndTime)}</p>
                {bundle.price && <p className="bundle-price">{bundle.price}€</p>}
            </div>
        </div>
    )
}

export default BundleCard