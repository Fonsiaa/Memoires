import React from "react";
import { Users, Eye, Target, TrendingUp, MoreHorizontal } from 'lucide-react';
import "../styles/main.scss";

export default function Dashboard({
  followersCount = "28.7K",
  impressionsCount = "2.7K",
  engagementsCount = "47.4K",
  conversionRateCount = "13.9K",
}) {

  const barHeights = [65, 45, 85, 95, 75, 50, 95, 70, 60, 85, 75, 95];

return (
    <div className="dashboard">
        <h1 className="title">Analytics Overview</h1>
    
    <div className="metrics-grid">
        <div className="metric-card">
            <div className="icon-wrapper yellow-bg">
            <Users className="icon" size={24} color="#F5A623" />
            </div>
            <div className="metric-value">{followersCount}</div>
            <div className="metric-label">Followers</div>
        </div>

        <div className="metric-card">
            <div className="icon-wrapper blue-bg">
            <Eye className="icon" size={24} color="#4A90E2" />
            </div>
            <div className="metric-value">{impressionsCount}</div>
            <div className="metric-label">Impressions</div>
        </div>

        <div className="metric-card">
            <div className="icon-wrapper green-bg">
            <Target className="icon" size={24} color="#7ED321" />
            </div>
            <div className="metric-value">{engagementsCount}</div>
            <div className="metric-label">Engagements</div>
        </div>

        <div className="metric-card">
            <div className="icon-wrapper yellow-light-bg">
            <TrendingUp className="icon" size={24} color="#F5A623" />
            </div>
            <div className="metric-value">{conversionRateCount}</div>
            <div className="metric-label">Conversion Rate</div>
        </div>
    </div>

    <div className="content-grid">
        <div className="chart-card">
            <div className="card-header">
                <div className="card-title">
                    <span className="dot yellow-dot"></span>
                    <span>Monthly Report</span>
                </div>
                <MoreHorizontal size={20} color="#ccc" />
            </div>
            
            <h2 className="section-title">Followers</h2>
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
            <h2 className="section-title">Conversion Rate</h2>
          </div>
          <div className="conversion-content">
            <div className="conversion-left">
              <h3 className="conversion-title">Conversion Per Ad</h3>
              <p className="conversion-text">
                The rate of users who took a desired action after clicking on an ad. This includes purchases, sign-ups, or downloads. A higher conversion rate indicates effective ad targeting and compelling content.
              </p>
              <div className="legend">
                <span className="legend-item">
                  <span className="legend-dot red-dot"></span>
                  Restless
                </span>
                <span className="legend-item">
                  <span className="legend-dot gray-dot"></span>
                  Awake
                </span>
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
                    strokeDashoffset="200"
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                  />
                </svg>
                <div className="progress-text">47%</div>
              </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
}