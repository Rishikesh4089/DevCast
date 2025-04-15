import React, { useState } from 'react';
import './Profile.css';
import 'firebase/auth';
import Navbar from '../components/Navbar';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { auth, db } from '../utils/firebase'; // your Firebase config
import { setDoc, doc } from 'firebase/firestore'; // switch to setDoc for setting user data
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';

// 🔐 Supabase init
const supabaseUrl = 'https://pfwewoskqpvegfpwsyxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd2V3b3NrcXB2ZWdmcHdzeXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MTkwMjcsImV4cCI6MjA2MDA5NTAyN30.rJdn0lXGFok5vcK6pyJvhtuJflng7XCXVLMOa6AXlHw';
const supabase = createClient(supabaseUrl, supabaseKey);

const Profile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    age: '',
    company: '',
    position: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
      setFileUpload(file); // save file for upload
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if user is authenticated (optional step if using Firebase Auth)
      const user = auth.currentUser;
      if (!user) {
        alert('Please sign in to save your profile');
        return;
      }

      const docId = uuidv4();
      let imageUrl = '';

      // Handle image upload to Supabase
      if (fileUpload) {
        const {  error } = await supabase.storage
          .from('profiles') // Replace with your actual bucket name
          .upload(`profile-images/${docId}`, fileUpload);

        if (error) throw error;

        const { data: urlData } = await supabase.storage
          .from('profiles')
          .getPublicUrl(`profile-images/${docId}`);

        imageUrl = urlData?.publicUrl || '';
      }

      // Assuming Firebase Authentication is used, use currentUser.uid as the docId
      const userId = user?.uid;
      if (!userId) throw new Error('User is not authenticated');

      // Save the user profile data to Firestore
      const userDocRef = doc(db, 'users', userId); // Using user ID as document ID
      await setDoc(userDocRef, {
        ...form,
        contact: Number(form.contact),
        age: Number(form.age),
        imageurl: imageUrl,
      });

      alert('Profile saved successfully!');
      setForm({ name: '', email: '', contact: '', age: '', company: '', position: '' });
      setProfileImage(null);
      setFileUpload(null);
    } catch (err: any) {
      console.error('Error saving profile:', err.message);
      alert('Error saving profile');
    }
  };

  return (
    <div className="profile-page">
      <div className="navbar">
        <Navbar />
      </div>

      <div className="profile-container">
        <div className="top-section">
          <div className="profile-image-wrapper">
            <div className="profile-image">
              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <FaUserCircle className="user-icon" />
              )}
              <label htmlFor="profileImage" className="camera-icon">
                <FaCamera />
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <form className="profile-form" onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" required value={form.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" required value={form.email} onChange={handleChange} />
            <input type="text" name="contact" placeholder="Contact Number" required value={form.contact} onChange={handleChange} />
            <input type="number" name="age" placeholder="Age" required value={form.age} onChange={handleChange} />
            <input type="text" name="company" placeholder="Company" value={form.company} onChange={handleChange} />
            <input type="text" name="position" placeholder="Position" value={form.position} onChange={handleChange} />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
