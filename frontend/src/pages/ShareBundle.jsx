import { getAllBuyers } from "../services/api";
import { shareOrder } from "../services/api";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getToken } from "../services/cookies";
import "../css/ShareBundle.css"

/**
 * Share Bundle page allowing a user to share a bundle with another buyer via email.
 * @returns {JSX.Element} Share Bundle page component.
 */
function ShareBundle() {
    const { state } = useLocation();
    const [destinationEmail, setDestinationEmail] = useState("");
    const [error, setError] = useState("");
    const [bundleId, setBundleId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Set the bundleId from state.
    useEffect(() => {
        if (state) setBundleId(state);
    }, [state]);

    // Share the order.
    const handleSharedOrder = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // If no bundleId, display no bundle error.
            if (!bundleId) {
                setError("No bundle specified to share.");
                setLoading(false);
                return;
            }

            // Fetch all buyers to find the one with the specified email.
            const buyers = await getAllBuyers();
            if (!buyers) {
                setError("Failed to retrieve buyers. Please try again.");
                return;
            }

            // Find buyer by email (case insensitive).
            const email = destinationEmail.trim().toLowerCase();
            const buyer = buyers.find(b => b.email.toLowerCase() === email);
            if (!buyer) {
                setError("No buyer found with the specified email.");
                return;
            }

            // Prevent sharing with the user himself.
            const token = getToken();
            const buyerId = token.split('/')[1];
            if (Number(buyer.buyerId) === Number(buyerId)) {
                setError("You cannot share a bundle with yourself.");
                return;
            }

            // Share the order by calling shareOrder().
            const response = await shareOrder({ newBuyerId: buyer.buyerId, bundleId });

            // If sharing fails, display error message.
            if (!response) {
                setError("Failed to share bundle. Please try again.");                
            }
            
            // On success, alert and redirect to home page.
            alert("Bundle shared successfully!");
            setLoading(false);
            window.location.href = "/";

        } catch (error) {
            setError("Failed to share bundle. Please try again.");
            return;
        } finally {
            setLoading(false);
        }

    };

    // If no bundleId, display no bundle to share error.
    if (!state) {
        return (
            <div className="share-bundle-wrapper">
                <p className="error-message">No bundle specified to share.</p>
            </div>
        );
    }

    // Render the share bundle form.
    return (
        <div className="share-bundle-wrapper">
            <h1>Enter the email of the person you want to share this bundle with:</h1>

            {/* Form for getting the destination email and sending the share request onSubmit. */}
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