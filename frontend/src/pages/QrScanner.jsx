import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/QrScanner.css";
import { sha256 } from "../services/utils";

function QrScanner() {
    const videoRef = useRef(null);
    const readerRef = useRef(null);
    const navigatedRef = useRef(false);

    const { state } = useLocation();
    const navigate = useNavigate();

    const [started, setStarted] = useState(false);
    const [denied, setDenied] = useState(false);
    const [error, setError] = useState(null);

    const stopCamera = () => {
        try {
            readerRef.current?.reset();
        } catch {}

        const v = videoRef.current;
        const stream = v?.srcObject;
        if (stream && typeof stream.getTracks === "function") {
            stream.getTracks().forEach((t) => t.stop());
        }

        if (v) v.srcObject = null
    };

    useEffect(() => {
        if (state == null) return;
        if (!started) return;
        if (!videoRef.current) return;
        if (denied) return;
        if (navigatedRef.current) return;

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        let cancelled = false;

        (async () => {
            try {
                let deviceId = undefined;
                try {
                    const devices = await BrowserMultiFormatReader.listVideoInputDevices();
                    if (devices && devices.length > 0) {
                        // Default to first device
                        deviceId = devices[0].deviceId;
                        
                        // Try to find a back-facing camera
                        const backCamera = devices.find(device => 
                            device.label.toLowerCase().includes('back') || 
                            device.label.toLowerCase().includes('rear') ||
                            device.label.toLowerCase().includes('environment')
                        );
                        if (backCamera) {
                            deviceId = backCamera.deviceId;
                        }
                    }
                } catch (enumError) {
                    console.warn("Could not enumerate devices, attempting to use default camera:", enumError);
                }

                if (cancelled) return;

                await reader.decodeFromVideoDevice(deviceId, videoRef.current, async (result, err) => {
                    if (cancelled) return;

                    if (err && err.name === "NotFoundExeption") return;

                    if (err && err.name !== "NotFoundExpetion") {
                        // Only log real errors, not the "not found" which happens every frame
                        // setError(err.message); 
                        return;
                    }

                    if (!result) return;
                    if (navigatedRef.current) return;

                    const qrValue = result.getText();
                    const expected = await sha256(String(state));

                    if (qrValue === expected) {
                        navigatedRef.current = true;
                        stopCamera();

                        setTimeout(() => {
                            navigate("/scan/confirmation", { replace : true, state});
                        }, 0)
                    } else {
                        setDenied(true);
                        stopCamera()
                    }
                })

                setTimeout(() => {
                    const v = videoRef.current;
                    if (v) v.play().catch(() => {})
                }, 200)
            } catch (e) {
                setError(e?.message || String(e))
            }
        })();

        return () => {
            cancelled = true;
            stopCamera();
        }
    }, [state, started, denied, navigate])

    const retry = () => {
        navigatedRef.current = false;
        setDenied(false);
        setError(null);
        setStarted(false);
    }

    if (state == null) {
        return (
            <div className="scan-page">
                <p className="scan-error">Access Denied</p>
                <button className="denied-btn" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="scan-page">
            <h2 className="title">Scan QR Code</h2>

            {!started && !denied && (
                <button className="denied-btn" onClick={() => setStarted(true)}>
                    Start Scanning
                </button>
            )}

            {denied ? (
                <div className="denied-display">
                    <h2 className="denied-title">Denied</h2>
                    <p className="denied-icon">⛔</p>
                    <p className="denied-subtitle">Invalid QR code. Please try again.</p>
                    <button className="denied-btn" onClick={retry}>
                        Retry ?
                    </button>
                </div>
            ) : (
                <div className="scanner">
                    <video ref={videoRef} autoPlay muted playsInline width="420" height="420" />
                </div>
            )}

            {error && <p className="scan-error">{error}</p>}
        </div>
    );
}

export default QrScanner;