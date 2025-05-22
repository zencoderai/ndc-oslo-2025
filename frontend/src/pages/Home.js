import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="hero">
        <h1>Welcome to NDC Oslo 2025</h1>
        <p>The premier developer conference in Scandinavia - join us for a week of learning, networking, and inspiration.</p>
        <Link to="/submit" className="btn">Submit Your Talk</Link>
      </div>
      
      <div className="card">
        <h2>About the Conference</h2>
        <p>NDC Oslo is one of Europe's largest developer conferences, bringing together software developers, architects, and tech leads from all over the world.</p>
        <p>Join us in Oslo from June 16-20, 2025 for workshops and talks covering a wide range of topics including cloud, web, mobile, AI, IoT, and more.</p>
      </div>
      
      <div className="card">
        <h2>Key Dates</h2>
        <ul>
          <li><strong>Call for Papers Deadline:</strong> December 15, 2024</li>
          <li><strong>Speaker Notification:</strong> February 1, 2025</li>
          <li><strong>Conference Dates:</strong> June 16-20, 2025</li>
        </ul>
      </div>
      
      <div className="card">
        <h2>Why Attend?</h2>
        <ul>
          <li>Learn from industry leaders and expert practitioners</li>
          <li>Network with like-minded professionals</li>
          <li>Get hands-on experience in workshops</li>
          <li>Discover the latest tools, techniques, and best practices</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;