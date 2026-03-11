import { useState } from 'react'
import { useTranslation } from '../../node_modules/react-i18next'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Phone, Mail, CreditCard, CheckCircle } from 'lucide-react'
import PaymentForm from '../components/PaymentForm'
import QRCodeDisplay from '../components/QRCodeDisplay'

const Booking = () => {
  const { t, i18n } = useTranslation()
  const isAmharic = i18n.language === 'am'
  const [activeTab, setActiveTab] = useState('details')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    guestCount: '',
    message: ''
  })
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentData, setPaymentData] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Booking submitted:', formData)
    setActiveTab('payment')
  }

  const handlePaymentSuccess = (data) => {
    // Generate transaction ID with timestamp
    const timestamp = Date.now().toString();
    const transactionId = `TXN-${timestamp.slice(-8)}`;
    const currentDate = new Date().toLocaleDateString('en-ET');
    
    // Get service name based on event type
    const getServiceName = (type) => {
      const services = {
        wedding: isAmharic ? 'የጋብቻ አገልግሎት' : 'Wedding Service',
        engagement: isAmharic ? 'የጋብቻ ስምምነት አገልግሎት' : 'Engagement Service',
        reception: isAmharic ? 'የተቀባይ አገልግሎት' : 'Reception Service',
        other: isAmharic ? 'ሌላ የበዓል አገልግሎት' : 'Other Event Service'
      };
      return services[type] || (isAmharic ? 'የበዓል አገልግሎት' : 'Event Service');
    };

    setPaymentData({
      amount: data.amount,
      method: data.method,
      accountInfo: data.accountInfo,
      infoType: data.infoType,
      phone: data.phone, // From payment form
      email: data.email, // From payment form
      customerName: data.customerName, // From payment form
      transactionId: transactionId,
      date: currentDate,
      serviceName: getServiceName(formData.eventType),
      bookingDetails: {
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        guestCount: formData.guestCount
      }
    });
    setPaymentComplete(true);
  };

  const servicePrices = {
    wedding: 25000,
    engagement: 15000,
    reception: 20000,
    other: 10000
  }

  const calculateTotal = () => {
    const basePrice = servicePrices[formData.eventType] || 0
    const guestPrice = formData.guestCount ? parseInt(formData.guestCount) * 500 : 0
    return basePrice + guestPrice
  }

  const getServiceName = () => {
    const services = {
      wedding: isAmharic ? 'ጋብቻ' : 'Wedding',
      engagement: isAmharic ? 'የጋብቻ ስምምነት' : 'Engagement',
      reception: isAmharic ? 'ተቀባይ' : 'Reception',
      other: isAmharic ? 'ሌላ' : 'Other'
    };
    return services[formData.eventType] || (isAmharic ? 'አገልግሎት' : 'Service');
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 font-display">
            {isAmharic ? 'ቦታ ያስያዙ' : 'Book Your Event'}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">
            {isAmharic 
              ? 'የበዓልዎን ለማስያዝ እና ክፍያ ለማድረግ የሚያግዝ ቅጽ' 
              : 'Complete your event booking and payment in one place'}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex flex-col items-center ${activeTab === 'details' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-neutral-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === 'details' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500'}`}>
                1
              </div>
              <span className="text-sm mt-2">{isAmharic ? 'ዝርዝሮች' : 'Details'}</span>
            </div>
            <div className="w-16 h-1 bg-neutral-300 dark:bg-neutral-600 mx-4"></div>
            <div className={`flex flex-col items-center ${activeTab === 'payment' ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-neutral-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === 'payment' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500'}`}>
                2
              </div>
              <span className="text-sm mt-2">{isAmharic ? 'ክፍያ' : 'Payment'}</span>
            </div>
            <div className="w-16 h-1 bg-neutral-300 dark:bg-neutral-600 mx-4"></div>
            <div className={`flex flex-col items-center ${paymentComplete ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-neutral-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentComplete ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 dark:text-neutral-500'}`}>
                3
              </div>
              <span className="text-sm mt-2">{isAmharic ? 'ማረጋገጫ' : 'Confirmation'}</span>
            </div>
          </div>
        </div>

        {paymentComplete ? (
          <QRCodeDisplay paymentData={paymentData} />
        ) : activeTab === 'payment' ? (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md dark:shadow-neutral-900/50 p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-center mb-6">
              <CreditCard className="text-primary-600 dark:text-primary-400 mr-2" size={24} />
              <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 font-display">
                {isAmharic ? 'ክፍያ ይፈጽሙ' : 'Complete Payment'}
              </h2>
            </div>
            
            <div className="bg-primary-50 dark:bg-neutral-700/50 p-4 rounded-lg mb-6 border border-primary-100 dark:border-neutral-600">
              <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                {isAmharic ? 'የትዕዛዝ ማጠቃለያ' : 'Order Summary'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>{isAmharic ? 'የአገልግሎት አይነት' : 'Service Type'}</span>
                  <span className="font-medium dark:text-neutral-100">{getServiceName()}</span>
                </div>
                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>{isAmharic ? 'የእንግዶች ብዛት' : 'Guest Count'}</span>
                  <span className="font-medium dark:text-neutral-100">{formData.guestCount || '0'}</span>
                </div>
                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>{isAmharic ? 'የቀን' : 'Date'}</span>
                  <span className="font-medium dark:text-neutral-100">{formData.eventDate || '-'}</span>
                </div>
                <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                  <span>{isAmharic ? 'ሰዓት' : 'Time'}</span>
                  <span className="font-medium dark:text-neutral-100">{formData.eventTime || '-'}</span>
                </div>
                <div className="border-t border-primary-200 dark:border-neutral-600 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-neutral-800 dark:text-neutral-100">{isAmharic ? 'ጠቅላላ' : 'Total'}</span>
                    <span className="text-accent-600 dark:text-accent-400">{calculateTotal().toLocaleString()} Birr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pass customer data from booking form to PaymentForm */}
            <PaymentForm 
              onSuccess={handlePaymentSuccess} 
              amount={calculateTotal()}
              initialData={{
                customerName: formData.name,
                phone: formData.phone,
                email: formData.email,
                serviceName: getServiceName(),
                eventDate: formData.eventDate,
                eventTime: formData.eventTime,
                guestCount: formData.guestCount
              }}
            />
            
            <button
              onClick={() => setActiveTab('details')}
              className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {isAmharic ? 'ወደ ኋላ ይመለሱ' : 'Back to Details'}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-md dark:shadow-neutral-900/50 p-6 md:p-8 border border-neutral-200 dark:border-neutral-700"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    {isAmharic ? 'ሙሉ ስም' : 'Full Name'} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100"
                      placeholder={isAmharic ? 'ሙሉ ስም ያስገቡ' : 'Enter your full name'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    {isAmharic ? 'ስልክ ቁጥር' : 'Phone Number'} *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100"
                      placeholder="0911223344"
                      pattern="[0-9]{10}"
                      title={isAmharic ? '10-ዲጂት ስልክ ቁጥር' : '10-digit phone number'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100"
                      placeholder={isAmharic ? 'ኢሜይል ያስገቡ' : 'Enter your email'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    {isAmharic ? 'የበዓል አይነት' : 'Event Type'} *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100"
                    required
                  >
                    <option value="">{isAmharic ? 'ምረጥ' : 'Select'}</option>
                    <option value="wedding">{isAmharic ? 'ጋብቻ' : 'Wedding'}</option>
                    <option value="engagement">{isAmharic ? 'የጋብቻ ስምምነት' : 'Engagement'}</option>
                    <option value="reception">{isAmharic ? 'ተቀባይ' : 'Reception'}</option>
                    <option value="other">{isAmharic ? 'ሌላ' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    {isAmharic ? 'የበዓል ቀን' : 'Event Date'} *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500" size={20} />
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    {isAmharic ? 'የበዓል ሰዓት' : 'Event Time'} *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-neutral-400 dark:text-neutral-500" size={20} />
                    <input
                      type="time"
                      name="eventTime"
                      value={formData.eventTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    {isAmharic ? 'የእንግዶች ብዛት' : 'Guest Count'} *
                  </label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100"
                    min="1"
                    placeholder="50"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">
                    {isAmharic ? 'ተጨማሪ መልዕክት' : 'Additional Message'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-neutral-700 dark:text-neutral-100"
                    placeholder={isAmharic ? 'ማንኛውም ልዩ ፍላጎቶች ወይም ጥያቄዎች...' : 'Any special requests or questions...'}
                  ></textarea>
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-neutral-700/50 p-4 rounded-lg border border-primary-100 dark:border-neutral-600">
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                  {isAmharic ? 'የዋጋ ግምት' : 'Price Estimate'}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  {isAmharic 
                    ? `ጠቅላላ ዋጋ: ${calculateTotal().toLocaleString()} ብር`
                    : `Total estimate: ${calculateTotal().toLocaleString()} Birr`}
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center shadow-md hover:shadow-lg dark:shadow-neutral-900/50"
              >
                {isAmharic ? 'ወደ ክፍያ ይሂዱ' : 'Proceed to Payment'}
                <CreditCard size={20} className="ml-2" />
              </button>
            </form>
          </motion.div>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 bg-primary-50 dark:bg-neutral-700/50 p-8 rounded-xl text-center border border-primary-100 dark:border-neutral-600"
        >
          <div className="flex justify-center mb-4">
            <CheckCircle className="text-primary-600 dark:text-primary-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4 font-display">
            {isAmharic ? 'ማስታወሻ' : 'Important Note'}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-4">
            {isAmharic 
              ? 'የቦታ ማስያዝዎ ከተረጋገጠ በኋላ በ24 ሰዓት ውስጥ እናገኝዎታለን። ለተጨማሪ መረጃ በስልክ ቁጥር +251 912 345 678 ይደውሉ።' 
              : 'We will contact you within 24 hours after your booking is confirmed. For immediate assistance, call us at +251 912 345 678.'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Booking