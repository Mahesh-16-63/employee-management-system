import React from "react";
import { IconSearch } from "./Icons";

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar">
      <IconSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search by ID, name, or department..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
