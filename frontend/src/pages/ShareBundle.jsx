import { getAllBuyers } from "../services/api";
import { shareOrder } from "../services/api";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getToken } from "../services/cookies";
import "../css/ShareBundle.css"


function ShareBundle() {
    const { state } = useLocation();
    const [destinationEmail, setDestinationEmail] = useState("");
    const [error, setError] = useState("");
    const [bundleId, setBundleId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (state) setBundleId(state);
    }, [state]);

    const handleSharedOrder = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!bundleId) {
                setError("No bundle specified to share.");
                setLoading(false);
                return;
            }

            const buyers = await getAllBuyers();
            if (!buyers) {
                setError("Failed to retrieve buyers. Please try again.");
                return;
            }

            const email = destinationEmail.trim().toLowerCase();
            const buyer = buyers.find(b => b.email.toLowerCase() === email);
            if (!buyer) {
                setError("No buyer found with the specified email.");
                return;
            }

            const token = getToken();
            const buyerId = token.split('/')[1];
            if (Number(buyer.buyerId) === Number(buyerId)) {
                setError("You cannot share a bundle with yourself.");
                return;
            }

            const response = await shareOrder({ newBuyerId: buyer.buyerId, bundleId });
            if (!response) {
                setError("Failed to share bundle. Please try again.");                
            }

            alert("Bundle shared successfully!");
            setLoading(false);
            window.location.href = "/";

        } catch (error) {
            alert("Debug error: " + error);
            setError("Failed to share bundle. Please try again.");
            return;
        } finally {
            setLoading(false);
        }

    };

    if (!state) {
        return (
            <div className="share-bundle-wrapper">
                <p className="error-message">No bundle specified to share.</p>
            </div>
        );
    }


    return (
        <div className="share-bundle-wrapper">
            <h1>Enter the email of the person you want to share this bundle with:</h1>
            <form onSubmit={handleSharedOrder} className="share-bundle-form">
                <input
                    type="email"
                    placeholder="Enter email"
                    value={destinationEmail}
                    onChange={(e) => setDestinationEmail(e.target.value)}
                    required
                />
                <button type="submit" onSubmit={handleSharedOrder}>
                    {loading ? "Sharing..." : "Share Bundle"}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ShareBundle;