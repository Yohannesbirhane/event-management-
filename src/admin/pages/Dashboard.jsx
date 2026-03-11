import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    conversionRate: 0
  });

  // Sample data for charts
  const [bookingData, setBookingData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([]);

  // Initialize data
  useEffect(() => {
    generateData();
    generateActivities();
  }, [timeRange]);

  const generateData = () => {
    // Sample booking data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const bookingData = months.map(month => ({
      name: month,
      bookings: Math.floor(Math.random() * 100) + 20,
      completed: Math.floor(Math.random() * 80) + 10,
      cancelled: Math.floor(Math.random() * 15) + 2
    }));
    setBookingData(bookingData);

    // Sample revenue data
    const revenueData = months.map(month => ({
      name: month,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      expenses: Math.floor(Math.random() * 20000) + 5000,
      profit: Math.floor(Math.random() * 30000) + 5000
    }));
    setRevenueData(revenueData);

    // Sample service data
    const services = [
      { name: 'Venue', value: 35 },
      { name: 'Catering', value: 25 },
      { name: 'Photography', value: 15 },
      { name: 'Decoration', value: 12 },
      { name: 'Entertainment', value: 8 },
      { name: 'Other', value: 5 }
    ];
    setServiceData(services);

    // Sample traffic data
    const trafficData = months.map(month => ({
      name: month,
      organic: Math.floor(Math.random() * 5000) + 1000,
      direct: Math.floor(Math.random() * 3000) + 500,
      social: Math.floor(Math.random() * 2000) + 300,
      referral: Math.floor(Math.random() * 1500) + 200
    }));
    setTrafficData(trafficData);

    // Update stats
    setStats({
      totalUsers: 1254,
      totalBookings: 324,
      totalRevenue: 24530,
      conversionRate: 4.2
    });
  };

  const generateActivities = () => {
    const activities = [
      {
        id: 1,
        type: 'booking',
        title: 'New booking received',
        description: 'John Doe booked Venue service for Nov 15, 2023',
        time: '2 hours ago',
        icon: '📅',
        color: 'text-green-500 bg-green-100 dark:bg-green-900'
      },
      {
        id: 2,
        type: 'user',
        title: 'New user registered',
        description: 'Jane Smith joined as a premium member',
        time: '5 hours ago',
        icon: '👤',
        color: 'text-blue-500 bg-blue-100 dark:bg-blue-900'
      },
      {
        id: 3,
        type: 'payment',
        title: 'Payment processed',
        description: 'Payment of $2,500 received for booking #3245',
        time: '1 day ago',
        icon: '💰',
        color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900'
      },
      {
        id: 4,
        type: 'support',
        title: 'Support ticket resolved',
        description: 'Ticket #234 regarding catering menu has been resolved',
        time: '2 days ago',
        icon: '✅',
        color: 'text-purple-500 bg-purple-100 dark:bg-purple-900'
      }
    ];
    setRecentActivities(activities);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white border border-gray-200 rounded shadow-md dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container px-6 mx-auto grid">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          {t('dashboard')}
        </h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 focus:border-purple-400 focus:ring-purple-300 focus:ring-opacity-40 dark:focus:border-purple-300 focus:outline-none focus:ring"
        >
          <option value="week">{t('this_week')}</option>
          <option value="month">{t('this_month')}</option>
          <option value="quarter">{t('this_quarter')}</option>
          <option value="year">{t('this_year')}</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('total_users')}
            </p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              {stats.totalUsers.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              +12% from last month
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('total_bookings')}
            </p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              {stats.totalBookings.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              +8% from last month
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-purple-500 bg-purple-100 rounded-full dark:text-purple-100 dark:bg-purple-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 极客时间 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 极客时间 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('total_revenue')}
            </p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              ${stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              +15% from last month
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <div className="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2极客时间 V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('conversion_rate')}
            </p>
            <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              {stats.conversionRate}%
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              +2.3% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Bookings Chart */}
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            {t('bookings_over_time')}
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="bookings" fill="#8884d8" name={t('total_bookings')} />
                <Bar dataKey="completed" fill="#82ca9d" name={t('completed')} />
                <Bar dataKey="cancelled" fill="#ff8042" name={t('cancelled')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            {t('revenue_over_time')}
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="极客时间 100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name={t('revenue')} />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name={t('expenses')} />
                <Line type="monotone" dataKey="profit" stroke="#ffc658" name={t('profit')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            {t('service_distribution')}
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            {t('traffic_sources')}
          </h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis data极客时间 Key="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="organic" stackId="a" fill="#8884d8" name={t('organic')} />
                <Bar dataKey="direct" stackId="a" fill="#82ca9d" name={t('direct')} />
                <Bar dataKey="social" stackId="a" fill="#ffc658" name={t('social')} />
                <Bar dataKey="referral" stackId="a" fill="#ff8042" name={t('referral')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            {t('recent_activity')}
          </h4>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start">
                <div className={`flex-shrink-0 rounded-full p-3 ${activity.color}`}>
                  <span className="text-lg">{activity.icon}</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
          <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-300">
            {t('quick_stats')}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {t('active_users')}
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                892
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {t('pending_bookings')}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                47
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {t('avg_booking_value')}
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                $245
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                {t('customer_satisfaction')}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                94%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;