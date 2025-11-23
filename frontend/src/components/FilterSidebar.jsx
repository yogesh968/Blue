import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, setFilters }) => {
  const specialties = [
    'Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 
    'Dermatologist', 'Gynecologist', 'Dentist', 'Ophthalmologist'
  ];

  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      location: '',
      availability: '',
      feeRange: [0, 2000]
    });
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={clearFilters} className="clear-filters">Clear All</button>
      </div>

      <div className="filter-group">
        <h4>Specialty</h4>
        <select 
          value={filters.specialty} 
          onChange={(e) => handleFilterChange('specialty', e.target.value)}
        >
          <option value="">All Specialties</option>
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>{specialty}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Location</h4>
        <select 
          value={filters.location} 
          onChange={(e) => handleFilterChange('location', e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Availability</h4>
        <div className="radio-group">
          <label>
            <input 
              type="radio" 
              name="availability" 
              value="all"
              checked={filters.availability === 'all' || filters.availability === ''}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            />
            All Doctors
          </label>
          <label>
            <input 
              type="radio" 
              name="availability" 
              value="available"
              checked={filters.availability === 'available'}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
            />
            Available Now
          </label>
        </div>
      </div>

      <div className="filter-group">
        <h4>Consultation Fee</h4>
        <div className="fee-range">
          <input 
            type="range" 
            min="0" 
            max="2000" 
            step="100"
            value={filters.feeRange[1]}
            onChange={(e) => handleFilterChange('feeRange', [0, parseInt(e.target.value)])}
          />
          <div className="fee-display">₹0 - ₹{filters.feeRange[1]}</div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;