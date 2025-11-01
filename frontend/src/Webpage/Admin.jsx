
import React, { useState } from 'react';
import '../styles/main.scss';

export default function Admin() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');
  const [socials, setSocials] = useState({
    twitter: '',
    instagram: '',
    // others...
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // call API to save settings
    console.log({ name, password, theme, socials });
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Theme Style</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            {/* other styles */}
          </select>
        </div>

        <div className="form-group">
          <label>Twitter URL</label>
          <input
            type="text"
            value={socials.twitter}
            onChange={(e) => setSocials((s) => ({ ...s, twitter: e.target.value }))}
          />
        </div>

        <div className="form-group">
          <label>Instagram URL</label>
          <input
            type="text"
            value={socials.instagram}
            onChange={(e) => setSocials((s) => ({ ...s, instagram: e.target.value }))}
          />
        </div>

        <button className="btn-primary" type="submit">Save Settings</button>
      </form>
    </div>
  );
}
