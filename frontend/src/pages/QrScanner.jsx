import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/QrScanner.css";
import { sha256 } from "../services/utils";

function QrScanner() {

    // References to the video element and the barcode reader.
    const videoRef = useRef(null);

    // Reference to track if navigation has already occurred.
    const readerRef = useRef(null);

    // To prevent multiple navigations on successful scan.
    const navigatedRef = useRef(false);

    const { state } = useLocation();
    const navigate = useNavigate();

    const [started, setStarted] = useState(false);
    const [denied, setDenied] = useState(false);
    const [error, setError] = useState(null);

    // Function to stop the camera and reset the reader.
    const stopCamera = () => {

        // Reset the barcode reader if it exists.
        try {
            readerRef.current?.reset();
        } catch {}

        // Stop all video tracks to turn off the camera.
        const v = videoRef.current;

        // if no video element, return early
        const stream = v?.srcObject;

        // Stop all tracks of the media stream.
        if (stream && typeof stream.getTracks === "function") {
            stream.getTracks().forEach((t) => t.stop());
        }

        // Clear the video source object.
        if (v) v.srcObject = null
    };

    // Effect to start the QR code scanning process.
    useEffect(() => {

        // Early returns if conditions are not met.
        if (state == null) return;
        if (!started) return;
        if (!videoRef.current) return;
        if (denied) return;
        if (navigatedRef.current) return;

        // Initialize the barcode reader.
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        let cancelled = false;

        // Async function to set up video device and start decoding.
        (async () => {
            try {
                let deviceId = undefined;
                try {
                    // Enumerate video input devices to find a suitable camera.
                    const devices = await BrowserMultiFormatReader.listVideoInputDevices();

                    // If devices are found, select the back-facing camera if available.
                    if (devices && devices.length > 0) {
                        // Default to first device
                        deviceId = devices[0].deviceId;
                        
                        // Try to find a back-facing camera
                        const backCamera = devices.find(device => 
                            device.label.toLowerCase().includes('back') || 
                            device.label.toLowerCase().includes('rear') ||
                            device.label.toLowerCase().includes('environment')
                        );

                        // If a back-facing camera is found, use this device
                        if (backCamera) {
                            deviceId = backCamera.deviceId;
                        }
                    }
                } catch (enumError) {
                    console.warn("Could not enumerate devices, attempting to use default camera:", enumError);
                }

                // If the operation was cancelled, exit early.
                if (cancelled) return;

                // Start decoding from the selected video device.
                await reader.decodeFromVideoDevice(deviceId, videoRef.current, async (result, err) => {

                    if (cancelled) return;

                    if (err) {
                        if (err.name !== "NotFoundException") return;
                        return;
                    }
                    
                    // If a result is found, process the QR code value.
                    if (!result) return;

                    // Prevent multiple navigations.
                    if (navigatedRef.current) return;

                    // Compare the scanned QR code value with the expected hash.
                    const qrValue = result.getText();
                    const expected = await sha256(String(state));

                    // If the QR code matches, navigate to confirmation page and stop the camera.
                    if (qrValue === expected) {
                        navigatedRef.current = true;
                        stopCamera();

                        setTimeout(() => {
                            navigate("/scan/confirmation", { replace : true, state});
                        }, 0)
                    } else {

                        // If the QR code does not match, show denied message and stop the camera.
                        setDenied(true);
                        stopCamera()
                    }
                })

                // Small delay to ensure video plays smoothly.
                setTimeout(() => {
                    const v = videoRef.current;
                    if (v) v.play().catch(() => {})
                }, 200)
            } catch (e) {

                // if any error occurs, set the error state.
                setError(e?.message || String(e))
            }
        })();

        // Cleanup function to stop the camera on component unmount.
        return () => {
            cancelled = true;
            stopCamera();
        }
    }, [state, started, denied, navigate]);

    // Function to retry scanning after a denial.
    const retry = () => {
        navigatedRef.current = false;
        setDenied(false);
        setError(null);
        setStarted(false);
    }

    // If no state, display access denied.
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

    // Render the QR scanner page.
    return (
        <div className="scan-page">
            <h2 className="title">Scan QR Code</h2>

            {/* Display start button if not started and not denied */}
            {!started && !denied && (
                <button className="denied-btn" onClick={() => setStarted(true)}>
                    Start Scanning
                </button>
            )}

            {/* If denied, show denied message, else display scanner */}
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
                    {/* Declared video element with autoPlay, muted, and playsInline (avoid full-screen on mobile) attributes */}
                    <video ref={videoRef} autoPlay={true} muted={true} playsInline={true} width="420" height="420" />
                </div>
            )}

            {error && <p className="scan-error">{error}</p>}
        </div>
    );
}

export default QrScanner;