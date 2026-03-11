import { useState } from 'react'
import { useTranslation } from '../../node_modules/react-i18next'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Edit, LogOut, 
  Camera, Save, X, Calendar, Heart, CreditCard,
  Bell, Shield, Download, Eye, EyeOff, Key
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const { t, i18n } = useTranslation()
  const isAmharic = i18n.language === 'am'
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    profileImage: user?.profileImage || ''
  })
  const [saveStatus, setSaveStatus] = useState('') // '', 'saving', 'success', 'error'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      await updateProfile(formData)
      setSaveStatus('success')
      setIsEditing(false)
      // Clear success message after 2 seconds
      setTimeout(() => setSaveStatus(''), 2000)
    } catch (error) {
      setSaveStatus('error')
      console.error('Error updating profile:', error)
      // Clear error message after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth || '',
      profileImage: user?.profileImage || ''
    })
    setIsEditing(false)
    setSaveStatus('')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({
          ...formData,
          profileImage: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value
    i18n.changeLanguage(newLanguage)
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', newLanguage)
  }

  // Mock data for demonstration
  const upcomingEvents = [
    { id: 1, type: 'Wedding', date: '2024-06-15', status: 'Confirmed' },
    { id: 2, type: 'Consultation', date: '2024-05-20', status: 'Scheduled' }
  ]

  const paymentHistory = [
    { id: 1, amount: 5000, date: '2024-04-10', method: 'Telebirr', status: 'Completed' },
    { id: 2, amount: 10000, date: '2024-03-25', method: 'CBE', status: 'Completed' }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Save Status Messages */}
        {saveStatus === 'saving' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-700">{isAmharic ? 'በማስቀመጥ ላይ...' : 'Saving...'}</p>
          </div>
        )}
        {saveStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-700">{isAmharic ? 'በተሳካ ሁኔታ ተቀምጧል!' : 'Successfully saved!'}</p>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{isAmharic ? 'ስህተት ተፈጥሯል! እባክዎ ደግመው ይሞክሩ' : 'Error occurred! Please try again'}</p>
          </div>
        )}

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 font-display">
            {isAmharic ? 'የተጠቃሚ ሳጥን' : 'User Dashboard'}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            {isAmharic 
              ? 'የግል መረጃዎን ያስተዳድሩ እና የበዓሎችዎን ዝርዝር ይመልከቱ' 
              : 'Manage your personal information and view your event details'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center overflow-hidden">
                    {formData.profileImage ? (
                      <img 
                        src={formData.profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-primary-600" />
                    )}
                  </div>
                  {/* Always show image upload button */}
                  <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
                    <Camera size={16} className='text-black' />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                  {user?.email}
                </p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <User size={18} className="mr-3" />
                  {isAmharic ? 'ፕሮፋይል' : 'Profile'}
                </button>

                <button
                  onClick={() => setActiveTab('events')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'events'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Calendar size={18} className="mr-3" />
                  {isAmharic ? 'የበዓላት' : 'My Events'}
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'payments'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <CreditCard size={18} className="mr-3" />
                  {isAmharic ? 'ክፍያዎች' : 'Payments'}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Shield size={18} className="mr-3" />
                  {isAmharic ? 'ማስተካከያ' : 'Settings'}
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-600">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center py-2 px-4 text-red-600 hover:text-red-700 font-medium"
                >
                  <LogOut size={18} className="mr-2" />
                  {isAmharic ? 'ውጣ' : 'Sign Out'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">
                    {isAmharic ? 'የግል መረጃ' : 'Personal Information'}
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Edit size={18} className="mr-2" />
                      {isAmharic ? 'አርትዕ' : 'Edit'}
                    </button>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} className="mr-2" />
                        {saveStatus === 'saving' 
                          ? (isAmharic ? 'በማስቀመጥ ላይ...' : 'Saving...') 
                          : (isAmharic ? 'አስቀምጥ' : 'Save')
                        }
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center text-neutral-600 hover:text-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-200 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                      >
                        <X size={18} className="mr-2" />
                        {isAmharic ? 'አትቀምጥ' : 'Cancel'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                      {isAmharic ? 'ስም' : 'First Name'} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-100 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                      {isAmharic ? 'የአባት ስም' : 'Last Name'}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-100 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-100 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                      {isAmharic ? 'ስልክ ቁጥር' : 'Phone Number'} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-100 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                      {isAmharic ? 'የልደት ቀን' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-100 disabled:opacity-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                      {isAmharic ? 'አድራሻ' : 'Address'}
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-100 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab - Only Language Change */}
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
                <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
                  {isAmharic ? 'ማስተካከያ' : 'Settings'}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
                      {isAmharic ? 'ቋንቋ' : 'Language'}
                    </h3>
                    <select 
                      value={i18n.language} 
                      onChange={handleLanguageChange}
                      className="w-full md:w-48 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-700 dark:text-neutral-100"
                    >
                      <option value="en">English</option>
                      <option value="am">Amharic</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
                <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
                  {isAmharic ? 'የበዓላቴ' : 'My Events'}
                </h2>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-600 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg mr-4">
                          <Calendar className="text-primary-600" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">
                            {event.type}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                            {new Date(event.date).toLocaleDateString()} • {event.status}
                          </p>
                        </div>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        {isAmharic ? 'ዝርዝሮች' : 'View Details'}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
                  <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">
                    {isAmharic ? 'አዲስ በዓል ያስያዙ' : 'Book a New Event'}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-300 text-sm mb-4">
                    {isAmharic 
                      ? 'አዲስ የጋብቻ ወይም የበዓል አገልግሎት ይያዙ' 
                      : 'Schedule a new wedding or event service'}
                  </p>
                  <button 
                    onClick={() => navigate('/booking')}
                    className="bg-black cursor-pointer hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {isAmharic ? 'አሁን ያስያዙ' : 'Book Now'}
                  </button>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
                <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
                  {isAmharic ? 'የክፍያ ታሪክ' : 'Payment History'}
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-600">
                        <th className="text-left py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                          {isAmharic ? 'ቀን' : 'Date'}
                        </th>
                        <th className="text-left py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                          {isAmharic ? 'መጠን' : 'Amount'}
                        </th>
                        <th className="text-left py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                          {isAmharic ? 'ዘዴ' : 'Method'}
                        </th>
                        <th className="text-left py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                          {isAmharic ? 'ሁኔታ' : 'Status'}
                        </th>
                        <th className="text-right py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                          {isAmharic ? 'ድርጊቶች' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="border-b border-neutral-100 dark:border-neutral-700">
                          <td className="py-4 text-sm text-neutral-600 dark:text-neutral-300">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-sm font-medium text-neutral-800 dark:text-neutral-100">
                            {payment.amount.toLocaleString()} Birr
                          </td>
                          <td className="py-4 text-sm text-neutral-600 dark:text-neutral-300">
                            {payment.method}
                          </td>
                          <td className="py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                              <Download size={16} className="inline mr-1" />
                              {isAmharic ? 'ሰርተፍኬት' : 'Receipt'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile