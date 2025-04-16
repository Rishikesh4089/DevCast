import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FaUserCircle, FaCamera } from 'react-icons/fa';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../components/Navbar';

const supabaseUrl = 'https://pfwewoskqpvegfpwsyxl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd2V3b3NrcXB2ZWdmcHdzeXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MTkwMjcsImV4cCI6MjA2MDA5NTAyN30.rJdn0lXGFok5vcK6pyJvhtuJflng7XCXVLMOa6AXlHw';
const supabase = createClient(supabaseUrl, supabaseKey);

const Profile: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    age: '',
    company: '',
    position: '',
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchUserProfile(user.id);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setForm({
          name: data.name || '',
          email: data.email || '',
          contact: data.contact || '',
          age: data.age ? data.age.toString() : '',
          company: data.company || '',
          position: data.position || '',
        });

        if (data.imageurl) {
          setCurrentImageUrl(data.imageurl);
          setProfileImage(data.imageurl);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
      setFileUpload(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('Please sign in to save your profile');
      return;
    }

    try {
      let imageUrl = currentImageUrl || '';

      // Handle image upload if a new file was selected
      if (fileUpload) {
        // Delete old image if it exists
        if (currentImageUrl) {
          const oldImagePath = currentImageUrl.split('/').pop();
          await supabase.storage
            .from('profiles')
            .remove([`profile-images/${oldImagePath}`]);
        }

        // Upload new image
        const fileExt = fileUpload.name.split('.').pop();
        const fileName = `${userId}.${fileExt}`;
        const filePath = `profile-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, fileUpload, {
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
        setCurrentImageUrl(imageUrl);
      }

      // Update profile in database
      const { error } = await supabase.from('profiles').upsert({
        user_id: userId,
        name: form.name,
        email: form.email,
        contact: form.contact,
        age: Number(form.age),
        company: form.company,
        position: form.position,
        imageurl: imageUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      alert('Profile saved successfully!');
      setFileUpload(null); // Reset file upload after successful save
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile');
    }
  };


  return (
    <div className="profile-page">
      <Navbar />
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