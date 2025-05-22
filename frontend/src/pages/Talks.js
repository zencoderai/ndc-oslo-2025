import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Talks() {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [speakerFilter, setSpeakerFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/talks`);
        setTalks(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load talks. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTalks();
  }, []);
  
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
  
  const levels = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced'
  };
  
  const sortOptions = {
    'title': 'Title',
    'speaker_name': 'Speaker Name',
    'category': 'Category',
    'level': 'Level',
    'created_at': 'Submission Date'
  };
  
  // Extract unique speakers from talks
  const uniqueSpeakers = [...new Set(talks.map(talk => talk.speaker_name))].sort();
  
  const getCategoryLabel = (category) => {
    return categories[category] || category;
  };
  
  const getLevelLabel = (level) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };
  
  const resetFilters = () => {
    setCategoryFilter('');
    setLevelFilter('');
    setSearchQuery('');
    setSpeakerFilter('');
    setSortBy('created_at');
    setSortDirection('desc');
  };
  
  // Text search helper function (searches in title, speaker name, and description)
  const matchesSearchQuery = (talk) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      talk.title.toLowerCase().includes(query) ||
      talk.speaker_name.toLowerCase().includes(query) ||
      talk.description.toLowerCase().includes(query)
    );
  };
  
  // Filter talks based on all selected filters
  const filteredTalks = talks.filter(talk => {
    // Category filter
    if (categoryFilter && talk.category !== categoryFilter) return false;
    
    // Level filter
    if (levelFilter && talk.level !== levelFilter) return false;
    
    // Speaker filter
    if (speakerFilter && talk.speaker_name !== speakerFilter) return false;
    
    // Text search filter
    if (!matchesSearchQuery(talk)) return false;
    
    return true;
  });
  
  // Sort the filtered talks
  const sortedTalks = [...filteredTalks].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];
    
    // Handle special cases for sorting
    if (sortBy === 'category') {
      valueA = getCategoryLabel(valueA);
      valueB = getCategoryLabel(valueB);
    } else if (sortBy === 'level') {
      valueA = getLevelLabel(valueA);
      valueB = getLevelLabel(valueB);
    }
    
    // Handle string comparison
    if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    
    // Sort based on direction
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
  
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };
  
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Function to highlight search terms in text
  const highlightText = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index}>{part}</mark> 
        : part
    );
  };
  
  if (loading) {
    return <div>Loading talks...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  const isFiltering = categoryFilter || levelFilter || searchQuery || speakerFilter;
  
  return (
    <div>
      <h2>Submitted Talks</h2>
      
      {/* Search UI */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title, speaker or description..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="search-input"
        />
      </div>
      
      {/* Filter UI */}
      <div className="filters">
        <div className="filter-container">
          <label htmlFor="category-filter">Category:</label>
          <select 
            id="category-filter" 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {Object.entries(categories).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-container">
          <label htmlFor="level-filter">Level:</label>
          <select 
            id="level-filter" 
            value={levelFilter} 
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="">All Levels</option>
            {Object.entries(levels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-container">
          <label htmlFor="speaker-filter">Speaker:</label>
          <select 
            id="speaker-filter" 
            value={speakerFilter} 
            onChange={(e) => setSpeakerFilter(e.target.value)}
          >
            <option value="">All Speakers</option>
            {uniqueSpeakers.map((speaker) => (
              <option key={speaker} value={speaker}>{speaker}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-container">
          <label htmlFor="sort-by">Sort By:</label>
          <div className="sort-controls">
            <select 
              id="sort-by" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <button 
              onClick={toggleSortDirection} 
              className="sort-button"
              title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        {isFiltering && (
          <button onClick={resetFilters} className="reset-button">Reset All</button>
        )}
      </div>
      
      {/* Filter summary */}
      {isFiltering && (
        <div className="filter-summary">
          Showing {sortedTalks.length} {sortedTalks.length === 1 ? 'talk' : 'talks'}
          {categoryFilter ? ` in ${getCategoryLabel(categoryFilter)}` : ''}
          {levelFilter ? ` for ${getLevelLabel(levelFilter)} level` : ''}
          {speakerFilter ? ` by ${speakerFilter}` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </div>
      )}
      
      {talks.length === 0 ? (
        <div className="card">
          <p>No talks have been submitted yet. Be the first to <a href="/submit">submit a talk</a>!</p>
        </div>
      ) : sortedTalks.length === 0 ? (
        <div className="card">
          <p>No talks match the selected filters. <button onClick={resetFilters} className="text-button">Clear filters</button></p>
        </div>
      ) : (
        <div className="talk-list">
          {sortedTalks.map((talk) => (
            <div key={talk.id} className="talk-card">
              <h3>{searchQuery ? highlightText(talk.title, searchQuery) : talk.title}</h3>
              <p className="speaker">By {searchQuery ? highlightText(talk.speaker_name, searchQuery) : talk.speaker_name}</p>
              <div className="tags-container">
                <span className="category">{getCategoryLabel(talk.category)}</span>
                <span className="category">{getLevelLabel(talk.level)}</span>
              </div>
              <p>
                {searchQuery 
                  ? highlightText(talk.description.length > 150 ? `${talk.description.substring(0, 150)}...` : talk.description, searchQuery)
                  : (talk.description.length > 150 ? `${talk.description.substring(0, 150)}...` : talk.description)
                }
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Talks;