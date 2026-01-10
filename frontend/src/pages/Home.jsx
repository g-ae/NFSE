import BundleCard from "../components/BundleCard";
import { useState, useEffect } from "react";
import { searchBundles, getPopularBundles, getReservedBundles, getConfirmedBundles } from "../services/api.js";
import "../css/Home.css";
import { isLoggedIn } from "../services/cookies";
import { getToken } from '../services/cookies.js';
import { getUserId } from "../services/cookies.js";
import { getAccountTypeFromToken } from "../services/utils.js";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bundles, setBundles] = useState([]);
  const [rbundles, setRBundles] = useState([]);
  const [cbundles, setCBundles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState("unknown")
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getLocation = () => {
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
            // Fallback to IP Geolocation
            try {
                const response = await fetch("https://ipwho.is/");
                const data = await response.json();
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

    const loadPopularBundles = async () => {
      try { 
        const popularBundles = await getPopularBundles();
 
        if (!isLoggedIn()) {
          setBundles(popularBundles);
          return;
        }
        const token = getToken();
        const type = getAccountTypeFromToken(token);
        setAccountType(type);
        if (type === "Seller") {
          const reservedBundles = await getReservedBundles();
          const confirmedBundles = await getConfirmedBundles();
          const sellerId = getUserId(token)
          function filterBundles(bundles, sellerId){
            return bundles.filter(
              bundle => bundle.sellerId === sellerId
            )
          }
          setBundles(filterBundles(popularBundles, sellerId));
          setRBundles(reservedBundles);
          setCBundles(confirmedBundles);
          return;
        } 
        setBundles(popularBundles);


      } catch (err) {
        console.log(err);
        setError("Failed to load the bundles...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularBundles();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
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

  function SellersHome({ userLocation }) {
    function Sgrid({ title, bundlesref, className }) {
      return (
        <div className={`bundle-grid ${className || ""}`}>
          <h2 className="grid-title">{title}</h2>

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
    return (
      <div className="sellers-home">
        <Sgrid className="pop-grid" title="Not Reserved" bundlesref={bundles} />
        <Sgrid className="res-grid" title="Reserved" bundlesref={rbundles} />
        <Sgrid className="con-grid" title="Confirmed" bundlesref={cbundles} />
      </div>
    );
  }


  function BuyersHome({ userLocation }) {
    return (
      <div className="bundle-grid">
            {(bundles.length == 0) ? "No bundles available" : bundles.map((bundle) => (
              <BundleCard bundle={bundle} key={bundle.bundleId} userLocation={userLocation} />
            ))}
      </div>  
    )
  }



  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for bundles..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

        {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        accountType === "Seller" ? <SellersHome userLocation={userLocation} /> : <BuyersHome userLocation={userLocation} />
      )}
    </div>
  );
}

export default Home;
