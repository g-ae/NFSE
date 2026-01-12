import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { confirmPickup } from "../services/api";
import "../css/ScanConfirmation.css";

/**
 * Confirmation page when a QR code is scanned by the seller to confirm pickup.
 * @returns {JSX.Element} Scan confirmation component.
 */
function ScanConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(null);
  const [error, setError] = useState(null);

    // Effect to confirm pickup when component mounts with the scanned state.
    useEffect(() => {
        let cancelled = false;

        const checking = async () => {
            try {
                // If no state provided, show access denied.
                if (!state) {
                    if (!cancelled) {
                        setChecked(false)
                        setError("Access denied")
                    }
                    return;
                }
            
            const req = await confirmPickup(state);

            // Set the checked status if the request was successful.
            if (!cancelled) {
                setChecked(req);
                setError(null);
            }
        } catch (err) {
            if (!cancelled) {
                setChecked(false);
                setError("Request failed ...");
            }
        }
        }
        checking()
    }, [state]);

    // Render the confirmation status based on the checked state.
    return (
        <div className="confirmation">
            {error && <div className="error-message">{error}</div>}

            {/* If still checking, display loading message */}
            {checked === null && (
                <div className="prcs">
                    Confirmation in progress..
                </div>
            )}

            {/* If confirmed, show success message */}
            {checked === true && (
                <div className="success-table">
                    <h2 className="success-title">Verification Confirmed ✅</h2>
                    <p></p>

                    {/* Button to navigate back home */}
                    <button className="success-btn" onClick={() => navigate("/")}>
                        Back home
                    </button>
                </div>
            )}

            {/* If not confirmed, show failure message */}
            {checked === false && (
                <div className="fail-table">
                    <h2 className="success-title">Error while processing ❌</h2>
                    <p className="fail-subtitle">Please try again..</p>

                    {/* Button to retry by going back to the previous page */}
                    <button onClick={() => navigate(-1)}>⟳</button>
                </div>
            )}
        </div>
    );
    
}

export default ScanConfirmation;
