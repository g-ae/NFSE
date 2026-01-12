import "../css/QrCodePage.css";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { sha256 } from "../services/utils";
import { useEffect, useState } from "react";

/**
 * QR Code page displaying a encoded QR code for order pickup.
 * @returns {JSX.Element} QR Code page component.
 */
function QrCode() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [qrValue, setQrValue] = useState("");

  // Generate SHA-256 hash of the bundleId to use as QR code value.
  useEffect(() => {

    // Function to encode the bundleId into a QR code.
    const buildQr = async () => {
      if (!state) return;
      const hash = await sha256(String(state));
      setQrValue(hash);
    };
    buildQr();
  }, [state]);

  // If no state provided, show QR code error message.
  if (!state) return <div className="qr-error">QR code not valid</div>;

  // If QR value not yet generated, display generating message.
  if (!qrValue) return <div className="qr-error">Generating QR code...</div>;

  // Render the QR code page with the generated QR code.
  return (
    <div className="qr-page">
      <div className="qr-card">
        <h2 className="qr-title">QR Code</h2>
        <p className="qr-subtitle">Present this QR code to the seller</p>

        {/* Display the generated QR code */}
        <div className="qr-box">
          <QRCode value={qrValue} size={260} />
        </div>

        {/* Back button to navigate to the previous page */}
        <div className="qr-actions">
          <button className="qr-back-btn" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}

export default QrCode;

