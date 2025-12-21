import React, { useState, useEffect } from "react";
import { Users, Eye, Target, TrendingUp, MoreHorizontal, Upload, Share2, FileText } from 'lucide-react';
import "../styles/main.scss";

export default function Dashboard() {
  // State for user metrics
  const [userMetrics, setUserMetrics] = useState({
    imagesUploaded: 0,
    imagesShared: 0,
    dailyPosts: 0
  });

  // State for screen time (conversion rate replacement)
  const [screenTime, setScreenTime] = useState({
    daily: 0, // minutes
    weekly: 0, // hours
    currentSession: 0 // minutes
  });

  // State for bar chart data (now showing daily screen time per month)
  const [barHeights, setBarHeights] = useState([65, 45, 85, 95, 75, 50, 95, 70, 60, 85, 75, 95]);

  // Simulate user activity data (replace with actual API calls)
  useEffect(() => {
    // Fetch user metrics
    const fetchUserMetrics = async () => {
      // Replace with your actual API endpoint
      try {
        const response = await fetch('/api/user/metrics');
        const data = await response.json();
        setUserMetrics({
          imagesUploaded: data.imagesUploaded || 128,
          imagesShared: data.imagesShared || 42,
          dailyPosts: data.dailyPosts || 7
        });
      } catch (error) {
        // Fallback data
        setUserMetrics({
          imagesUploaded: 128,
          imagesShared: 42,
          dailyPosts: 7
        });
      }
    };

    // Fetch screen time data
    const fetchScreenTime = async () => {
      try {
        const response = await fetch('/api/user/screen-time');
        const data = await response.json();
        setScreenTime({
          daily: data.daily || 142,
          weekly: data.weekly || 23,
          currentSession: data.currentSession || 18
        });

        // Update bar chart with screen time data
        if (data.monthlyData) {
          setBarHeights(data.monthlyData);
        }
      } catch (error) {
        setScreenTime({
          daily: 142, // minutes
          weekly: 23, // hours
          currentSession: 18 // minutes
        });
      }
    };

    fetchUserMetrics();
    fetchScreenTime();

    // Track current session time
    const startTime = Date.now();
    const interval = setInterval(() => {
      const currentTime = Math.floor((Date.now() - startTime) / 60000); // Convert to minutes
      setScreenTime(prev => ({
        ...prev,
        currentSession: currentTime
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Format time for display
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  return (
    <div className="dashboard">
      <h1 className="title">User Activity Dashboard</h1>
      
      <div className="metrics-grid">
        {/* Images Uploaded */}
        <div className="metric-card">
          <div className="icon-wrapper blue-bg">
            <Upload className="icon" size={24} color="#4A90E2" />
          </div>
          <div className="metric-value">{userMetrics.imagesUploaded}</div>
          <div className="metric-label">Images Uploaded</div>
        </div>

        {/* Images Shared */}
        <div className="metric-card">
          <div className="icon-wrapper green-bg">
            <Share2 className="icon" size={24} color="#7ED321" />
          </div>
          <div className="metric-value">{userMetrics.imagesShared}</div>
          <div className="metric-label">Images Shared</div>
        </div>

        {/* Daily Posts */}
        <div className="metric-card">
          <div className="icon-wrapper yellow-bg">
            <FileText className="icon" size={24} color="#F5A623" />
          </div>
          <div className="metric-value">{userMetrics.dailyPosts}</div>
          <div className="metric-label">Posts Today</div>
        </div>
      </div>

      <div className="content-grid">
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">
              <span className="dot yellow-dot"></span>
              <span>Monthly Screen Time</span>
            </div>
            <MoreHorizontal size={20} color="#ccc" />
          </div>
          
          <h2 className="section-title">Daily Average (minutes)</h2>
          <div className="bar-chart">
            {barHeights.map((height, index) => (
              <div key={index} className="bar-wrapper">
                <div className="bar" style={{ height: `${height}%` }}></div>
                </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h2 className="section-title">Screen Time Analytics</h2>
          </div>
          <div className="conversion-content">
            <div className="conversion-left">
              <h3 className="conversion-title">Usage Breakdown</h3>
              <p className="conversion-text">
                Track your time spent on the platform. Daily shows today's usage, Weekly shows the past 7 days, and Current Session tracks your active time. Managing screen time helps maintain healthy digital habits.
              </p>
              <div className="time-stats">
                <div className="time-stat-item">
                  <span className="stat-label">Today:</span>
                  <span className="stat-value">{formatTime(screenTime.daily)}</span>
                </div>
                <div className="time-stat-item">
                  <span className="stat-label">This Week:</span>
                  <span className="stat-value">{screenTime.weekly}h</span>
                </div>
                <div className="time-stat-item">
                  <span className="stat-label">Current Session:</span>
                  <span className="stat-value">{screenTime.currentSession}m</span>
                </div>
              </div>
            </div>
            <div className="conversion-right">
              <div className="circular-progress">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="#f0f0f0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="60"
                    fill="none"
                    stroke="#301f17"
                    strokeWidth="12"
                    strokeDasharray="377"
                    strokeDashoffset={377 - (screenTime.daily / 240 * 377)} // Assuming 4h max daily
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                  />
                </svg>
                <div className="progress-text">
                  {Math.min(100, Math.round(screenTime.daily / 240 * 100))}%
                </div>
                <div className="progress-subtext">of daily limit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}