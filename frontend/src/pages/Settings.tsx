
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import Navbar from '../components/Navbar';

const supabaseUrl = 'https://pfwewoskqpvegfpwsyxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd2V3b3NrcXB2ZWdmcHdzeXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MTkwMjcsImV4cCI6MjA2MDA5NTAyN30.rJdn0lXGFok5vcK6pyJvhtuJflng7XCXVLMOa6AXlHw';
const supabase = createClient(supabaseUrl, supabaseKey);

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <><Navbar />
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account preferences</p>
        </div>

        <div className="settings-content">
          <div className="settings-card fade-in-up">
            <h2>Account Settings</h2>
            <div className="settings-group">
              <button className="settings-btn">Change Email</button>
              <button className="settings-btn">Change Password</button>
              <button className="settings-btn">Two-Factor Authentication</button>
            </div>
          </div>

          <div className="settings-card fade-in-up">
            <h2>Preferences</h2>
            <div className="settings-group">
              <div className="settings-toggle">
                <span>Dark Mode</span>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="settings-toggle">
                <span>Email Notifications</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="settings-toggle">
                <span>Push Notifications</span>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-card fade-in-up">
            <h2>Support</h2>
            <div className="settings-group">
              <button className="settings-btn">Help Center</button>
              <button className="settings-btn">Contact Us</button>
              <button className="settings-btn">Privacy Policy</button>
            </div>
          </div>

          <div className="settings-actions fade-in-up">
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Settings;