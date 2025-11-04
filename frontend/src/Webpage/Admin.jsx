// src/Webpage/Admin.jsx
import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import "../styles/main.scss";

function Admin() {
    const [isCollapsed, setIsCollapsed] = useState(false);

const data = [
    { day: "Mon", reviews: 40 },
    { day: "Tue", reviews: 55 },
    { day: "Wed", reviews: 70 },
    { day: "Thu", reviews: 90 },
    { day: "Fri", reviews: 75 },
    { day: "Sat", reviews: 65 },
    { day: "Sun", reviews: 85 },
];

return (
    <div className={`admin-dashboard ${isCollapsed ? "collapsed" : ""}`}>
        {/* Sidebar */}
        <aside className="sidebar">
        <div className="sidebar-header">
            <button
                className="collapse-btn"
                onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? "☰" : "×"}
            </button>
        </div>

        <ul className="sidebar-menu">
            <li>📊 Dashboard</li>
            <li>⭐ Reviews</li>
            <li>👥 Customers</li>
            <li>✉️ Invitations</li>
            <li>📦 Widgets</li>
            <li>⚙️ Configurations</li>
        </ul>
        </aside>

      {/* Main Dashboard */}
      <main className="dashboard-content">
        <h2>Overall Statistics</h2>
        <div className="stats-cards">
          <div className="card">
            <h3>5.0</h3>
            <p>Average Rating</p>
          </div>
          <div className="card">
            <h3>70</h3>
            <p>Total Reviews</p>
          </div>
          <div className="card">
            <h3>1.2%</h3>
            <p>Click Rate</p>
          </div>
          <div className="card">
            <h3>0.0%</h3>
            <p>Response Rate</p>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h3>Average Reviews (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="reviews"
                stroke="#4C7DF0"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

                {/* Mock platform cards */}
                <div className="platforms">
                    {["YouTube", "Facebook", "Twitter"].map((platform, i) => (
                    <div key={i} className="platform-card">
                        <h4>{platform}</h4>
                        <p>40 reviews</p>
                        <div className="stars">⭐️⭐️⭐️⭐️⭐️</div>
                        <p>Click rate: {(Math.random() * 5).toFixed(1)}%</p>
                    </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Admin;