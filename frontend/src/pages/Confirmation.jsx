import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { confirmPickup } from "../services/api";
import "../css/ScanConfirmation.css";

function ScanConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const checking = async () => {
        try {
            if (!state) {
                if (!cancelled) {
                    setChecked(false)
                    setError("Access denied")
                }
                return;
            }
            
            const req = await confirmPickup(state);

            if (! cancelled) {
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
  }, [state])

  return (
    <div className="confirmation">
        {error && <div className="error-message">{error}</div>}

        {checked === null && (
            <div className="prcs">
                Confirmation in progress..
            </div>
        )}

        {checked === true && (
            <div className="success-table">
                <h2 className="success-title">Verification Confirmed ✅</h2>
                <p></p>
                <button className="success-btn" onClick={() => navigate("/")}>
                    Back home
                </button>
            </div>
        )}
        {checked === false && (
            <div className="fail-table">
                <h2 className="success-title">Error while processing ❌</h2>
                <p className="fail-subtitle">Please try again..</p>
                <button onClick={() => navigate(-1)}>⟳</button>
            </div>
        )}
    </div>
  );
    
}

export default ScanConfirmation;
