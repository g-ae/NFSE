import { useState, useEffect } from "react";
import { getToken, clearToken } from '../services/cookies.js'
import { getBuyer, getSeller } from "../services/api.js";
import { getAccountTypeFromToken } from "../services/utils.js";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css"; 

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountType, setAccountType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const type = getAccountTypeFromToken(token);
      setAccountType(type);
      const id = token.split('/')[1];

      try {
        let data = null;
        if (type === "Buyer") {
          data = await getBuyer(id);
        } else if (type === "Seller") {
          data = await getSeller(id);
        }

        if (data) {
          setUserData(data);
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    clearToken();
    window.location.reload();
  };

  const handleHistory = async () => {
    navigate('/history');
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!userData) return <div className="error-message">No user data found.</div>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">{accountType} Profile</h2>
      <div className="profile-details">
        <div className="profile-item">
            <strong className="profile-label">Name:</strong> 
            <span className="profile-value">{userData.name}</span>
        </div>
        <div className="profile-item">
            <strong className="profile-label">Email:</strong> 
            <span className="profile-value">{userData.email}</span>
        </div>
        <div className="profile-item">
            <strong className="profile-label">Telephone:</strong> 
            <span className="profile-value">{userData.telephone}</span>
        </div>
        
        {accountType === "Seller" && (
            <>
                <hr className="profile-divider" />
                <div className="profile-item">
                    <strong className="profile-label">Address:</strong> 
                    <span className="profile-value">{userData.address}, {userData.npa}</span>
                </div>
                <div className="profile-item">
                    <strong className="profile-label">State:</strong> 
              <span className="profile-value">{userData.state}</span>
                </div>
                <div className="profile-item">
                    <strong className="profile-label">Country:</strong> 
                    <span className="profile-value">{userData.country}</span>
                </div>
            </>
        )}
      </div>
      <hr className="profile-divider" />
      <div className="profile-actions">
        <button onClick={handleHistory}>Order History</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Profile;
