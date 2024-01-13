import React, { useState } from 'react';
import "../styles/Search.css";

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  return (
    <div className='search'>
      <div className='searchBar'>
        <label htmlFor="search">Search City:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          className='search-input'
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className='search-btn'>Search</button>
      </div>
    </div>
  );
};

export default Search;
