import BundleCard from "../components/BundleCard";
import { useState, useEffect } from "react";
import { searchBundles, getPopularBundles } from "../services/api.js";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bundle, setBundles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPopularBundles = async () => {
      try {
        const popularBundles = await getPopularBundles();
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
        <div className="bundle-grid">
          {bundle.map((bundle) => (
            <BundleCard movie={bundle} key={bundle.bundleId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
