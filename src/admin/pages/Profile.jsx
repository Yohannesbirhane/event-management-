// src/admin/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    role: '',
    bio: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  // Load user data from localStorage (in a real app, this would come from an API)
  useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (Object.keys(savedUserData).length === 0) {
      // Default user data if none exists
      setUserData({
        name: 'Admin User',
        email: 'admin@yeshigabcha.com',
        phone: '+251911223344',
        avatar: 'https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82',
        role: 'Administrator',
        bio: 'System administrator with full access to all features.'
      });
    } else {
      setUserData(savedUserData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.name.trim()) {
      newErrors.name = t('name_required');
    }
    
    if (!userData.email.trim()) {
      newErrors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = t('valid_email_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsEditing(false);
      alert(t('profile_updated'));
    }
  };

  const handleCancel = () => {
    // Reload original data
    const savedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (Object.keys(savedUserData).length > 0) {
      setUserData(savedUserData);
    }
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="container px-6 mx-auto grid">
      <div className="flex justify-between items-center my-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {t('profile')}
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
          >
            {t('edit_profile')}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 active:bg-gray-100 hover:bg-gray-50 focus:outline-none focus:shadow-outline-gray"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              {t('save_changes')}
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col md:flex-row">
          {/* Avatar Section */}
          <div className="md:w-1/3 p-4">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  className="w-32 h-32 rounded-full mx-auto"
                  src={userData.avatar}
                  alt="Profile"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleAvatarChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                {userData.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{userData.role}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:w-2/3 p-4 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {t('personal_information')}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('name')}
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring ${
                        errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-700 focus:border-purple-400 focus:ring-purple-300'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </>
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{userData.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('email')}
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 text-sm text-gray-700 bg-white border rounded-md dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring ${
                        errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-700 focus:border-purple-400 focus:ring-purple-300'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </>
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{userData.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('phone')}
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
                  />
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">{userData.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('role')}
                </label>
                <p className="text-gray-800 dark:text-gray-200">{userData.role}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('bio')}
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
                ></textarea>
              ) : (
                <p className="text-gray-800 dark:text-gray-200">{userData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {t('security')}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              {t('change_password')}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('change_password_description')}
            </p>
            <button
              onClick={() => navigate('/admin/change-password')}
              className="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            >
              {t('change_password')}
            </button>
          </div>
          
          <div>
            <h5 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              {t('two_factor_auth')}
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('two_factor_auth_description')}
            </p>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                {t('status')}: {t('disabled')}
              </span>
              <button className="px-3 py-1 text-xs font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-md active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green">
                {t('enable')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;