import { useState, useEffect } from 'react';
import axios from 'axios';
import './TimelineView.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const CLIENT_API_KEY = import.meta.env.VITE_CLIENT_API_KEY;

const TimelineView = () => {
  const [country, setCountry] = useState('US');
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  useEffect(() => {
    fetchTimeline();
  }, [country]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      console.log(`[FRONTEND DEBUG] Fetching timeline from: ${API_BASE_URL}/timeline`);
      console.log(`[FRONTEND DEBUG] Using API Key: ${CLIENT_API_KEY ? '***' + CLIENT_API_KEY.slice(-4) : 'MISSING'}`);
      
      const response = await axios.get(`${API_BASE_URL}/timeline`, {
        params: { country, type: 'general' },
        headers: { 'x-api-key': CLIENT_API_KEY }
      });
      console.log('Timeline response:', response.data);
      setTimeline(response.data);
    } catch (err) {
      console.error('Failed to fetch timeline', {
        url: `${API_BASE_URL}/timeline`,
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="timeline-view">
      <div className="timeline-header">
        <h2>Election Timeline</h2>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="country-selector">
          <option value="US">USA 🇺🇸</option>
          <option value="IN">India 🇮🇳</option>
          <option value="GB">UK 🇬🇧</option>
        </select>
      </div>

      <div className="timeline-container">
        {loading ? (
          <div className="loading">Loading timeline...</div>
        ) : timeline ? (
          <div className="stepper">
            {timeline.phases.map((phase, index) => (
              <div 
                key={index} 
                className={`step ${expandedStep === index ? 'expanded' : ''}`}
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                <div className="step-marker">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-line"></div>
                </div>
                <div className="step-content">
                  <div className="step-main">
                    <h3>{phase.name}</h3>
                    <span className="duration-chip">{phase.typicalDuration}</span>
                  </div>
                  {expandedStep === index && (
                    <div className="step-details">
                      <p>{phase.description}</p>
                      <h4>Key Actions:</h4>
                      <ul>
                        {phase.keyActions.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="error">Failed to load timeline.</div>
        )}
      </div>
    </div>
  );
};

export default TimelineView;
