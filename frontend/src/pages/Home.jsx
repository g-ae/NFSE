import BundleCard from "../components/BundleCard";
import { useState, useEffect } from "react";
import { searchBundles, getPopularBundles, getReservedBundles, getConfirmedBundles } from "../services/api.js";
import "../css/Home.css";
import { isLoggedIn } from "../services/cookies";
import { getToken } from '../services/cookies.js';
import { getUserId } from "../services/cookies.js";
import { getAccountTypeFromToken } from "../services/utils.js";

/**
 * Home page displaying popular bundles and search functionality.
 * @returns {JSX.Element} Home page component.
 */
function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bundles, setBundles] = useState([]);
  const [rbundles, setRBundles] = useState([]);
  const [cbundles, setCBundles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState("unknown")
  const [userLocation, setUserLocation] = useState(null);

  // Effect to get user location and load popular bundles on component mount.
  useEffect(() => {

    // Function to get user location.
    const getLocation = () => {
        if (isLoggedIn() && getAccountTypeFromToken(getToken()) != "Buyer") return
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
            setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            },
            async (error) => {
            console.log("Error getting browser location:", error);
            // Fallback to IP Geolocation.
            try {
                // Use ipwho.is for IP-based geolocation.
                const response = await fetch("https://ipwho.is/");
                const data = await response.json();

                // If valid location data received, set user location.
                if (data.latitude && data.longitude) {
                setUserLocation({
                    latitude: data.latitude,
                    longitude: data.longitude,
                });
                console.log("Using IP-based location.");
                }
            } catch (ipErr) {
                console.log("Error getting IP location:", ipErr);
            }
            }
          );
        } else {
          // Fallback if geolocation not supported
          fetch("https://ipwho.is/")
            .then(res => res.json())
            .then(data => {
              if (data.latitude && data.longitude) {
                setUserLocation({
                  latitude: data.latitude,
                  longitude: data.longitude,
                });
              }
            })
            .catch(err => console.log(err));
        }
    }
    getLocation();

    // Function to load popular bundles with getPopularBundles().
    const loadPopularBundles = async () => {
      try { 
        const popularBundles = await getPopularBundles();

        // If not logged in, display popular bundles only.
        if (!isLoggedIn()) {
          setBundles(popularBundles);
          return;
        }

        // If logged in, get account type and load relevant bundles.
        const token = getToken();
        const type = getAccountTypeFromToken(token);
        setAccountType(type);

        // If seller, filter popular bundles to only those sold by the seller.
        if (type === "Seller") {
          const reservedBundles = await getReservedBundles();
          const confirmedBundles = await getConfirmedBundles();
          const sellerId = getUserId(token)

          // Filter bundles to only those sold by the logged-in seller.
          function filterBundles(bundles, sellerId){
            return bundles.filter(
              bundle => bundle.sellerId === sellerId
            )
          }
          // Set state with filtered popular (setBundles), reserved (setRBundles), and confirmed bundles (setCBundles).
          setBundles(filterBundles(popularBundles, sellerId));
          setRBundles(reservedBundles);
          setCBundles(confirmedBundles);
          return;
        } 
        // If buyer, display popular bundles.
        setBundles(popularBundles);


      } catch (err) {
        console.log(err);
        setError("Failed to load the bundles...");
      } finally {
        
        // Set loading to false to indicate fetching is done.
        setLoading(false);
      }
    };

    loadPopularBundles();
  }, []);

  // Handle search by city name.
  const handleSearch = async (e) => {
    e.preventDefault();
    // Do not search if query is empty or already loading.
    if (!searchQuery.trim()) return
    if (loading) return

    setLoading(true)
    try {
        const searchResults = await searchBundles(searchQuery)
        setBundles(searchResults)
        setError(null)
    } catch (err) {
        console.log(err)
        setError("Failed to search bundles...")
    } finally {
        setLoading(false)
    }
  };

  // Home page for sellers with grids for Not Reserved, Reserved, and Confirmed bundles.
  function SellersHome({ userLocation }) {

    // Sub-component to render a grid of bundles with a title (Not Reserved, Reserved, Confirmed).
    function Sgrid({ title, bundlesref, className }) {
      return (
        <div className={`bundle-grid ${className || ""}`}>
          <h2 className="grid-title">{title}</h2>

          {/* If no bundles, display message / else render BundleCards. */}
          {bundlesref.length === 0 ? (
            <p className="empty-grid">No bundles yet</p>
          ) : (
            bundlesref.map((bundle) => (
              <BundleCard bundle={bundle} key={bundle.bundleId} userLocation={userLocation} />
            ))
          )}
        </div>
      );
    }

    // Render the three grids for sellers.
    return (
      <div className="sellers-home">
        <Sgrid className="pop-grid" title="Not Reserved" bundlesref={bundles} />
        <Sgrid className="res-grid" title="Reserved" bundlesref={rbundles} />
        <Sgrid className="con-grid" title="Confirmed" bundlesref={cbundles} />
      </div>
    );
  }

  // Home page for buyers displaying available bundles.
  function BuyersHome({ userLocation }) {
    return (
      <div className="bundle-grid">

            {/* If no bundles, display message / else render BundleCards. */}
            {(bundles.length == 0) ? "No bundles available" : bundles.map((bundle) => (
              <BundleCard bundle={bundle} key={bundle.bundleId} userLocation={userLocation} />
            ))}
      </div>  
    )
  }


  // Render the Home page depending on account type.
  return (
    <div className="home">

      {/* Search box for city name. */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for cities..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {/* Display loading state or the appropriate home page based on account type. */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        accountType === "Seller" ? <SellersHome userLocation={userLocation} /> : <BuyersHome userLocation={userLocation} />
      )}
    </div>
  );
}

export default Home;
