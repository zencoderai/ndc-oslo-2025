import React, { useState } from 'react';
import axios from 'axios';

function SubmitTalk() {
  const [formData, setFormData] = useState({
    title: '',
    speaker_name: '',
    speaker_email: '',
    speaker_bio: '',
    description: '',
    category: 'web',
    level: 'beginner'
  });
  
  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({
      submitted: true,
      success: false,
      message: 'Submitting your talk...'
    });
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/talks`, formData);
      
      setSubmitStatus({
        submitted: true,
        success: true,
        message: 'Your talk has been submitted successfully!'
      });
      
      // Reset form
      setFormData({
        title: '',
        speaker_name: '',
        speaker_email: '',
        speaker_bio: '',
        description: '',
        category: 'web',
        level: 'beginner'
      });
    } catch (error) {
      // Handle validation errors better
      let errorMessage = 'Error submitting talk';
      
      if (error.response?.data) {
        // For our custom validation error format
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = `Validation errors:\n${error.response.data.errors.join('\n')}`;
        }
        // For validation errors which typically come as an array or object
        else if (Array.isArray(error.response.data.detail)) {
          // Handle array of validation errors
          errorMessage = `Validation error: ${error.response.data.detail.map(err => err.msg || err.message).join(', ')}`;
        } else if (typeof error.response.data.detail === 'object') {
          // Handle object of validation errors
          errorMessage = `Validation error: ${JSON.stringify(error.response.data.detail)}`;
        } else if (error.response.data.detail) {
          // Handle string error message
          errorMessage = `Error: ${error.response.data.detail}`;
        }
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setSubmitStatus({
        submitted: true,
        success: false,
        message: errorMessage
      });
    }
  };
  
  return (
    <div>
      <h2>Submit a Talk Proposal</h2>
      <p>Share your knowledge and experience with the NDC Oslo community.</p>
      
      {submitStatus.submitted && (
        <div className={submitStatus.success ? 'success-message' : 'error-message'}>
          {submitStatus.message}
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Talk Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="speaker_name">Your Name *</label>
            <input
              type="text"
              id="speaker_name"
              name="speaker_name"
              className="form-control"
              value={formData.speaker_name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="speaker_email">Your Email *</label>
            <input
              type="email"
              id="speaker_email"
              name="speaker_email"
              className="form-control"
              value={formData.speaker_email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="speaker_bio">Short Bio *</label>
            <textarea
              id="speaker_bio"
              name="speaker_bio"
              className="form-control"
              value={formData.speaker_bio}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Talk Description *</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Development</option>
              <option value="cloud">Cloud & DevOps</option>
              <option value="ai">Artificial Intelligence & ML</option>
              <option value="security">Security</option>
              <option value="data">Data & Databases</option>
              <option value="architecture">Architecture & Patterns</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="level">Experience Level *</label>
            <select
              id="level"
              name="level"
              className="form-control"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          
          <button type="submit" className="btn">Submit Talk</button>
        </form>
      </div>
    </div>
  );
}

export default SubmitTalk;