import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <input
    type="text"
    placeholder="Search shelves by name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
  />
);

export default SearchBar;
