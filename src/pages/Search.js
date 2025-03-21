import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [location, setLocation] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (!location && !beds && !baths) {
      alert('Please enter at least one search criteria.');
      return;
    }

    const queryParams = new URLSearchParams({
      location,
      beds,
      baths,
      page: 1,
      limit: 10,
    }).toString();

    navigate(`/propertylist?${queryParams}`);
  };

  return (
    <div style={{ padding: '10px', marginTop: '-40px' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row g-3">
          {/* Location Input */}
          <div className="col-12 col-md-4">
            <input
              type="text"
              className="form-control py-2"
              value={location}
              placeholder="Enter Location"
              onChange={(e) => setLocation(e.target.value)}
              style={{
                backgroundColor: '#ffffff', // White background
                color: '#000000', // Black text
                border: '1px solid #ccc',
                width: '100%',
              }}
            />
          </div>

          {/* Beds & Baths Dropdown */}
          <div className="col-12 col-md-4 position-relative" ref={dropdownRef}>
            <div
              className="form-control py-2"
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff', // White background
                color: '#000000', // Black text
                border: '1px solid #ccc',
                width: '100%',
              }}
              onClick={() => setShowDropdown(!showDropdown)}
              aria-expanded={showDropdown}
              aria-label="Select number of beds and baths"
            >
              <span>
                {beds ? `${beds} Bed` : 'Beds'} & {baths ? `${baths} Bath` : 'Baths'}
              </span>
            </div>

            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff', // White background
                  color: '#000000', // Black text
                  border: '1px solid #ccc',
                  zIndex: 1000,
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '5px',
                  maxWidth: '100%',
                  borderRadius: '4px',
                }}
              >
                {/* Beds Selection */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div><strong>Beds:</strong></div>
                  {[1, 2, 3, 4, 5, 6, 7].map((bed) => (
                    <div
                      key={bed}
                      style={{
                        padding: '5px 10px',
                        cursor: 'pointer',
                        backgroundColor: beds === bed ? '#f0f0f0' : '#ffffff',
                        color: '#000000', // Black text
                        borderRadius: '4px',
                        border: beds === bed ? '1px solid #ccc' : '1px solid transparent',
                      }}
                      onClick={() => {
                        setBeds(bed);
                        setShowDropdown(false);
                      }}
                    >
                      {bed}
                    </div>
                  ))}
                </div>

                <hr style={{ margin: '0', border: '1px solid #ccc' }} />

                {/* Baths Selection */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div><strong>Baths:</strong></div>
                  {[1, 2, 3, 4, 5, 6, 7].map((bath) => (
                    <div
                      key={bath}
                      style={{
                        padding: '5px 10px',
                        cursor: 'pointer',
                        backgroundColor: baths === bath ? '#f0f0f0' : '#ffffff',
                        color: '#000000', // Black text
                        borderRadius: '4px',
                        border: baths === bath ? '1px solid #ccc' : '1px solid transparent',
                      }}
                      onClick={() => {
                        setBaths(bath);
                        setShowDropdown(false);
                      }}
                    >
                      {bath}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="col-12 col-md-4">
            <button
              className="btn border-0 w-100 py-2"
              style={{ backgroundColor: '#C9184A', color: 'white' }}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
