import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Talks() {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Input states (what user types)
  const [searchInput, setSearchInput] = useState('');
  const [speakerInput, setSpeakerInput] = useState('');
  
  // Filter states (used for API requests)
  const [activeFilters, setActiveFilters] = useState({
    search: '',
    category: '',
    level: '',
    speaker_name: ''
  });
  
  // Available filter options
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Development' },
    { value: 'cloud', label: 'Cloud & DevOps' },
    { value: 'ai', label: 'AI & ML' },
    { value: 'security', label: 'Security' },
    { value: 'data', label: 'Data & Databases' },
    { value: 'architecture', label: 'Architecture & Patterns' },
    { value: 'other', label: 'Other' }
  ];
  
  const levels = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];
  
  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  // Fetch talks using current filters
  const fetchTalks = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (activeFilters.search) params.append('search', activeFilters.search);
      if (activeFilters.category) params.append('category', activeFilters.category);
      if (activeFilters.level) params.append('level', activeFilters.level);
      if (activeFilters.speaker_name) params.append('speaker_name', activeFilters.speaker_name);
      
      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/talks`;
      const queryUrl = params.toString() ? `${url}?${params.toString()}` : url;
      
      const response = await axios.get(queryUrl);
      setTalks(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load talks. Please try again later.');
      setLoading(false);
    }
  }, [activeFilters]);
  
  // Apply filters after debounce
  const applyFilters = useCallback(debounce((filters) => {
    setActiveFilters(filters);
  }, 500), []);
  
  // Initial fetch and when active filters change
  useEffect(() => {
    fetchTalks();
  }, [fetchTalks]);
  
  const getCategoryLabel = (category) => {
    const categories = {
      'web': 'Web Development',
      'mobile': 'Mobile Development',
      'cloud': 'Cloud & DevOps',
      'ai': 'AI & ML',
      'security': 'Security',
      'data': 'Data & Databases',
      'architecture': 'Architecture & Patterns',
      'other': 'Other'
    };
    
    return categories[category] || category;
  };
  
  const getLevelLabel = (level) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };
  
  if (loading) {
    return <div>Loading talks...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    applyFilters({
      ...activeFilters,
      search: value
    });
  };
  
  // Handle filter changes
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    applyFilters({
      ...activeFilters,
      category: value
    });
  };
  
  const handleLevelChange = (e) => {
    const value = e.target.value;
    applyFilters({
      ...activeFilters,
      level: value
    });
  };
  
  const handleSpeakerChange = (e) => {
    const value = e.target.value;
    setSpeakerInput(value);
    applyFilters({
      ...activeFilters,
      speaker_name: value
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchInput('');
    setSpeakerInput('');
    setActiveFilters({
      search: '',
      category: '',
      level: '',
      speaker_name: ''
    });
  };

  return (
    <div>
      <h2>Submitted Talks</h2>
      
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search talks..."
            value={searchInput}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select 
            value={activeFilters.category} 
            onChange={handleCategoryChange} 
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          
          <select 
            value={activeFilters.level} 
            onChange={handleLevelChange} 
            className="filter-select"
          >
            {levels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Filter by speaker..."
            value={speakerInput}
            onChange={handleSpeakerChange}
            className="filter-input"
          />
          
          <button onClick={resetFilters} className="reset-button">Reset Filters</button>
        </div>
        
        {loading && <div>Filtering talks...</div>}
      </div>
      
      {!loading && talks.length === 0 ? (
        <div className="card">
          <p>No talks match your filters. <button onClick={resetFilters}>Reset filters</button> or <a href="/submit">submit a talk</a>!</p>
        </div>
      ) : (
        <div className="talk-list">
          {talks.map((talk) => (
            <div key={talk.id} className="talk-card">
              <h3>{talk.title}</h3>
              <p className="speaker">By {talk.speaker_name}</p>
              <div>
                <span className="category">{getCategoryLabel(talk.category)}</span>
                <span className="category">{getLevelLabel(talk.level)}</span>
              </div>
              <p>{talk.description.length > 150 ? `${talk.description.substring(0, 150)}...` : talk.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Talks;