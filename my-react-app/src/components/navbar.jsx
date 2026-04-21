import React, { useState } from "react";
import "./mystyle.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim() === "") return;

    navigate("/search?query=" + search);
  };

  const handleLogout = () => {
    localStorage.removeItem("email");
    navigate("/login");
  };

  const user = localStorage.getItem("email");

  return (
    <nav className="nav-bar">
      <div className="container">
        <div className="LOGO">LimeRoad</div>

        <ul className="nav-links">
          <li>Women</li>
          <li>Men</li>
          <li>Kids</li>
          <li>Home</li>
          <li>Offers</li>
          <li>Vmart</li>
        </ul>

        <div className="right-part">

          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
          </form>

          <Link to="/cart">Cart</Link>

          {!user ? (
            <Link to="/login">Login</Link>
          ) : (
            <div className="profile-section">
              <span onClick={() => setShowProfile(!showProfile)}>
                Profile
              </span>

              {showProfile && (
                <div className="profile-dropdown">
                  <p>Hello {user}</p>
                  <button onClick={handleLogout}>Logout</button>
                  <p onClick={() => navigate("/orders")}>Orders</p>
                  
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;