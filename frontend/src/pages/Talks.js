import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Talks() {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  return (
    <div>
      <h2>Submitted Talks</h2>
      
      {talks.length === 0 ? (
        <div className="card">
          <p>No talks have been submitted yet. Be the first to <a href="/submit">submit a talk</a>!</p>
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