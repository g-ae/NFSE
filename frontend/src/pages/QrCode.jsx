import "../css/QrCodePage.css";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { sha256 } from "../services/utils";
import { useEffect, useState } from "react";

function QrCode() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    const buildQr = async () => {
      if (!state) return;
      const hash = await sha256(String(state));
      setQrValue(hash);
    };
    buildQr();
  }, [state]);

  if (!state) return <div className="qr-error">QR code not valid</div>;
  if (!qrValue) return <div className="qr-error">Generating QR code...</div>;

  return (
    <div className="qr-page">
      <div className="qr-card">
        <h2 className="qr-title">QR Code</h2>
        <p className="qr-subtitle">Present this QR code to the seller</p>

        <div className="qr-box">
          <QRCode value={qrValue} size={260} />
        </div>

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

