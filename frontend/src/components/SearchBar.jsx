import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery, location, setLocation }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery, 'in', location);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-container">
        <div className="search-field">
          <label>What are you looking for?</label>
          <input
            type="text"
            placeholder="Search doctors, hospitals, treatments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="search-field">
          <label>Location</label>
          <input
            type="text"
            placeholder="Enter city or area"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="search-input"
          />
        </div>
        
        <button type="submit" className="search-button">
          🔍 Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;