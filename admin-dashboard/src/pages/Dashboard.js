// import React, { useState, useEffect } from 'react';
// import Sidebar from '../components/Sidebar';
// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jewelly-store-mern-app-production.up.railway.app';

// const StatCard = ({ icon, title, value, description, color, loading }) => (
//   <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-6`}>
//     <div className="flex items-center">
//       <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-600', '-100')} mr-4`}>
//         <span className="text-2xl">{icon}</span>
//       </div>
//       <div>
//         <p className="text-sm font-medium text-gray-600">{title}</p>
//         {loading ? (
//           <div className="animate-pulse bg-gray-200 h-7 w-20 rounded mb-1"></div>
//         ) : (
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//         )}
//         {loading ? (
//           <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
//         ) : (
//           <p className="text-xs text-gray-500 mt-1">{description}</p>
//         )}
//       </div>
//     </div>
//   </div>
// );

// const ActivityItem = ({ action, user, time, type }) => {
//   const getActivityIcon = (type) => {
//     switch (type) {
//       case 'order': return '🛒';
//       case 'user': return '👤';
//       case 'product': return '📦';
//       case 'payment': return '💳';
//       default: return '📝';
//     }
//   };

//   return (
//     <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-200">
//       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-medium text-gray-900 truncate">{action}</p>
//         <p className="text-xs text-gray-500 truncate">
//           {user && `by ${user} • `}{time}
//         </p>
//       </div>
//       <span className="text-lg">{getActivityIcon(type)}</span>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalSales: 0,
//     totalOrders: 0,
//     totalUsers: 0,
//     totalProducts: 0,
//     monthlyGrowth: {
//       sales: 0,
//       orders: 0,
//       users: 0,
//       products: 0
//     },
//     ordersByStatus: {},
//     paymentsByStatus: {},
//     topProducts: []
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdated, setLastUpdated] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const [statsResponse, activitiesResponse] = await Promise.all([
//         axios.get(`${API_BASE_URL}/api/dashboard/stats`),
//         axios.get(`${API_BASE_URL}/api/dashboard/activities`)
//       ]);

//       if (statsResponse.data.success) {
//         setStats(statsResponse.data.data);
//       } else {
//         throw new Error(statsResponse.data.message || 'Failed to fetch stats');
//       }

//       if (activitiesResponse.data.success) {
//         setRecentActivities(activitiesResponse.data.activities);
//       }

//       // Generate mock sales data if API fails
//       const mockSalesData = [
//         { month: 'Jan', amount: 45000 },
//         { month: 'Feb', amount: 52000 },
//         { month: 'Mar', amount: 48000 },
//         { month: 'Apr', amount: 61000 },
//         { month: 'May', amount: 55000 },
//         { month: 'Jun', amount: 72000 }
//       ];
//       setSalesData(mockSalesData);

//       setLastUpdated(new Date().toLocaleTimeString());
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError('Failed to load dashboard data');
      
//       // Set mock data for development
//       setStats({
//         totalSales: 125430,
//         totalOrders: 892,
//         totalUsers: 3247,
//         totalProducts: 156,
//         monthlyGrowth: {
//           sales: 112000,
//           orders: 825,
//           users: 3090,
//           products: 151
//         },
//         ordersByStatus: {
//           pending: 45,
//           processing: 23,
//           shipped: 67,
//           delivered: 712,
//           cancelled: 45
//         },
//         paymentsByStatus: {
//           pending: 34,
//           completed: 823,
//           failed: 12,
//           refunded: 23
//         },
//         topProducts: [
//           { name: 'Diamond Ring', sold: 45 },
//           { name: 'Gold Necklace', sold: 38 },
//           { name: 'Silver Bracelet', sold: 32 },
//           { name: 'Pearl Earrings', sold: 28 }
//         ]
//       });

//       setRecentActivities([
//         { _id: 1, action: 'New order placed', user: { name: 'John Doe' }, timestamp: new Date(), type: 'order' },
//         { _id: 2, action: 'Product added', user: { name: 'Sarah Smith' }, timestamp: new Date(Date.now() - 3600000), type: 'product' },
//         { _id: 3, action: 'User registered', user: { name: 'Mike Johnson' }, timestamp: new Date(Date.now() - 7200000), type: 'user' },
//         { _id: 4, action: 'Order shipped', user: { name: 'Emma Wilson' }, timestamp: new Date(Date.now() - 10800000), type: 'order' },
//       ]);

//       const mockSalesData = [
//         { month: 'Jan', amount: 45000 },
//         { month: 'Feb', amount: 52000 },
//         { month: 'Mar', amount: 48000 },
//         { month: 'Apr', amount: 61000 },
//         { month: 'May', amount: 55000 },
//         { month: 'Jun', amount: 72000 }
//       ];
//       setSalesData(mockSalesData);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   const formatNumber = (number) => {
//     return new Intl.NumberFormat('en-US').format(number);
//   };

//   const getGrowthDescription = (current, previous, type = '') => {
//     if (!previous || previous === 0) return 'No previous data';
    
//     const growth = ((current - previous) / previous * 100).toFixed(1);
//     const trend = growth >= 0 ? '+' : '';
    
//     if (type === 'sales') {
//       return `${trend}${growth}% from last month`;
//     }
//     return `${trend}${growth}% from last month`;
//   };

//   const renderSalesChart = () => {
//     if (loading) {
//       return (
//         <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       );
//     }

//     if (salesData.length === 0) {
//       return (
//         <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
//           <div className="text-center text-gray-500">
//             <div className="text-4xl mb-2">📊</div>
//             <p>No sales data available</p>
//             <p className="text-sm">Sales chart will appear here</p>
//           </div>
//         </div>
//       );
//     }

//     // Simple bar chart implementation
//     const maxSales = Math.max(...salesData.map(item => item.amount));
//     const chartHeight = 200;

//     return (
//       <div className="h-64 p-4">
//         <div className="flex items-end justify-between h-48 space-x-2">
//           {salesData.map((item, index) => (
//             <div key={index} className="flex-1 flex flex-col items-center">
//               <div
//                 className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
//                 style={{ height: `${(item.amount / maxSales) * chartHeight}px` }}
//               ></div>
//               <div className="text-xs text-gray-500 mt-2 text-center">
//                 <div className="font-medium">{item.month}</div>
//                 <div className="text-gray-400">{formatCurrency(item.amount)}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen bg-gray-100">
//         <Sidebar />
//         <div className="flex-1 md:ml-64 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />
      
//       {/* Main Content */}
//       <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto">
//         <div className="p-4 md:p-6">
//           {/* Mobile header spacing */}
//           <div className="md:hidden h-16"></div>
          
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={fetchDashboardData}
//                 disabled={loading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//               >
//                 {loading ? 'Refreshing...' : 'Refresh'}
//               </button>
//               <div className="text-sm text-gray-500">
//                 Last updated: {loading ? 'Updating...' : lastUpdated}
//               </div>
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//             <StatCard 
//               icon="💰" 
//               title="Total Sales" 
//               value={formatCurrency(stats.totalSales)}
//               description={getGrowthDescription(stats.totalSales, stats.monthlyGrowth.sales, 'sales')}
//               color="border-l-green-600"
//               loading={loading}
//             />
//             <StatCard 
//               icon="📦" 
//               title="Total Orders" 
//               value={formatNumber(stats.totalOrders)}
//               description={getGrowthDescription(stats.totalOrders, stats.monthlyGrowth.orders)}
//               color="border-l-blue-600"
//               loading={loading}
//             />
//             <StatCard 
//               icon="👥" 
//               title="Total Users" 
//               value={formatNumber(stats.totalUsers)}
//               description={getGrowthDescription(stats.totalUsers, stats.monthlyGrowth.users)}
//               color="border-l-purple-600"
//               loading={loading}
//             />
//             <StatCard 
//               icon="💎" 
//               title="Total Products" 
//               value={formatNumber(stats.totalProducts)}
//               description={getGrowthDescription(stats.totalProducts, stats.monthlyGrowth.products)}
//               color="border-l-amber-600"
//               loading={loading}
//             />
//           </div>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//             <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg md:text-xl font-semibold text-gray-800">Sales Overview</h2>
//                 <span className="text-sm text-gray-500">Last 6 months</span>
//               </div>
//               {renderSalesChart()}
//             </div>
            
//             <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recent Activity</h2>
//                 <span className="text-sm text-gray-500">Latest updates</span>
//               </div>
//               <div className="space-y-4 max-h-64 overflow-y-auto">
//                 {loading ? (
//                   Array.from({ length: 4 }).map((_, index) => (
//                     <div key={index} className="flex items-center space-x-3 p-3">
//                       <div className="animate-pulse bg-gray-200 w-2 h-2 rounded-full"></div>
//                       <div className="flex-1">
//                         <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
//                         <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
//                       </div>
//                     </div>
//                   ))
//                 ) : recentActivities.length > 0 ? (
//                   recentActivities.map(activity => (
//                     <ActivityItem
//                       key={activity._id || activity.id}
//                       action={activity.action}
//                       user={activity.user?.name || activity.user}
//                       time={new Date(activity.timestamp || activity.time).toLocaleTimeString()}
//                       type={activity.type}
//                     />
//                   ))
//                 ) : (
//                   <div className="text-center py-8 text-gray-500">
//                     <div className="text-4xl mb-2">📝</div>
//                     <p>No recent activities</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Quick Stats Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Status</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Pending</span>
//                   <span className="font-medium">{stats.ordersByStatus?.pending || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Processing</span>
//                   <span className="font-medium">{stats.ordersByStatus?.processing || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Shipped</span>
//                   <span className="font-medium">{stats.ordersByStatus?.shipped || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Delivered</span>
//                   <span className="font-medium">{stats.ordersByStatus?.delivered || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Cancelled</span>
//                   <span className="font-medium">{stats.ordersByStatus?.cancelled || 0}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Status</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Completed</span>
//                   <span className="font-medium text-green-600">{stats.paymentsByStatus?.completed || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Pending</span>
//                   <span className="font-medium text-yellow-600">{stats.paymentsByStatus?.pending || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Failed</span>
//                   <span className="font-medium text-red-600">{stats.paymentsByStatus?.failed || 0}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Refunded</span>
//                   <span className="font-medium text-gray-600">{stats.paymentsByStatus?.refunded || 0}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Products</h3>
//               <div className="space-y-2">
//                 {stats.topProducts && stats.topProducts.length > 0 ? (
//                   stats.topProducts.slice(0, 4).map((product, index) => (
//                     <div key={product._id || index} className="flex justify-between text-sm">
//                       <span className="text-gray-600 truncate">{product.name}</span>
//                       <span className="font-medium">{product.sold} sold</span>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center text-gray-500 py-4">
//                     No product data
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;











import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://jewelly-store-mern-app-production.up.railway.app';

const StatCard = ({ icon, title, value, description, color, loading }) => (
  <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-6`}>
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-600', '-100')} mr-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-7 w-20 rounded mb-1"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
        ) : (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  </div>
);

const ActivityItem = ({ action, user, time, type }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return '🛒';
      case 'user': return '👤';
      case 'product': return '📦';
      case 'payment': return '💳';
      default: return '📝';
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-200">
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{action}</p>
        <p className="text-xs text-gray-500 truncate">
          {user && `by ${user} • `}{time}
        </p>
      </div>
      <span className="text-lg">{getActivityIcon(type)}</span>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    monthlyGrowth: {
      sales: 0,
      orders: 0,
      users: 0,
      products: 0
    },
    ordersByStatus: {},
    paymentsByStatus: {},
    topProducts: []
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/dashboard/stats`),
        axios.get(`${API_BASE_URL}/api/dashboard/activities`)
      ]);

      console.log('Dashboard Stats Response:', statsResponse.data);
      console.log('Dashboard Activities Response:', activitiesResponse.data);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      } else {
        throw new Error(statsResponse.data.message || 'Failed to fetch stats');
      }

      if (activitiesResponse.data.success) {
        setRecentActivities(activitiesResponse.data.activities);
      }

      // Generate mock sales data if API fails
      const mockSalesData = [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 52000 },
        { month: 'Mar', amount: 48000 },
        { month: 'Apr', amount: 61000 },
        { month: 'May', amount: 55000 },
        { month: 'Jun', amount: 72000 }
      ];
      setSalesData(mockSalesData);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data: ' + (error.response?.data?.message || error.message));
      
      // Set mock data for development
      setStats({
        totalSales: 125430,
        totalOrders: 892,
        totalUsers: 3247,
        totalProducts: 156,
        monthlyGrowth: {
          sales: 112000,
          orders: 825,
          users: 3090,
          products: 151
        },
        ordersByStatus: {
          pending: 45,
          processing: 23,
          shipped: 67,
          delivered: 712,
          cancelled: 45
        },
        paymentsByStatus: {
          pending: 34,
          completed: 823,
          failed: 12,
          refunded: 23
        },
        topProducts: [
          { name: 'Diamond Ring', sold: 45 },
          { name: 'Gold Necklace', sold: 38 },
          { name: 'Silver Bracelet', sold: 32 },
          { name: 'Pearl Earrings', sold: 28 }
        ]
      });

      setRecentActivities([
        { _id: 1, action: 'New order placed', user: { name: 'John Doe' }, timestamp: new Date(), type: 'order' },
        { _id: 2, action: 'Product added', user: { name: 'Sarah Smith' }, timestamp: new Date(Date.now() - 3600000), type: 'product' },
        { _id: 3, action: 'User registered', user: { name: 'Mike Johnson' }, timestamp: new Date(Date.now() - 7200000), type: 'user' },
        { _id: 4, action: 'Order shipped', user: { name: 'Emma Wilson' }, timestamp: new Date(Date.now() - 10800000), type: 'order' },
      ]);

      const mockSalesData = [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 52000 },
        { month: 'Mar', amount: 48000 },
        { month: 'Apr', amount: 61000 },
        { month: 'May', amount: 55000 },
        { month: 'Jun', amount: 72000 }
      ];
      setSalesData(mockSalesData);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };

  const getGrowthDescription = (current, previous, type = '') => {
    if (!previous || previous === 0) return 'No previous data';
    
    const growth = ((current - previous) / previous * 100).toFixed(1);
    const trend = growth >= 0 ? '+' : '';
    
    if (type === 'sales') {
      return `${trend}${growth}% from last month`;
    }
    return `${trend}${growth}% from last month`;
  };

  const renderSalesChart = () => {
    if (loading) {
      return (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (salesData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No sales data available</p>
            <p className="text-sm">Sales chart will appear here</p>
          </div>
        </div>
      );
    }

    // Simple bar chart implementation
    const maxSales = Math.max(...salesData.map(item => item.amount));
    const chartHeight = 200;

    return (
      <div className="h-64 p-4">
        <div className="flex items-end justify-between h-48 space-x-2">
          {salesData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                style={{ height: `${(item.amount / maxSales) * chartHeight}px` }}
              ></div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                <div className="font-medium">{item.month}</div>
                <div className="text-gray-400">{formatCurrency(item.amount)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen overflow-y-auto">
        <div className="p-4 md:p-6">
          {/* Mobile header spacing */}
          <div className="md:hidden h-16"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              <div className="text-sm text-gray-500">
                Last updated: {loading ? 'Updating...' : lastUpdated}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard 
              icon="💰" 
              title="Total Sales" 
              value={formatCurrency(stats.totalSales)}
              description={getGrowthDescription(stats.totalSales, stats.monthlyGrowth.sales, 'sales')}
              color="border-l-green-600"
              loading={loading}
            />
            <StatCard 
              icon="📦" 
              title="Total Orders" 
              value={formatNumber(stats.totalOrders)}
              description={getGrowthDescription(stats.totalOrders, stats.monthlyGrowth.orders)}
              color="border-l-blue-600"
              loading={loading}
            />
            <StatCard 
              icon="👥" 
              title="Total Users" 
              value={formatNumber(stats.totalUsers)}
              description={getGrowthDescription(stats.totalUsers, stats.monthlyGrowth.users)}
              color="border-l-purple-600"
              loading={loading}
            />
            <StatCard 
              icon="💎" 
              title="Total Products" 
              value={formatNumber(stats.totalProducts)}
              description={getGrowthDescription(stats.totalProducts, stats.monthlyGrowth.products)}
              color="border-l-amber-600"
              loading={loading}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Sales Overview</h2>
                <span className="text-sm text-gray-500">Last 6 months</span>
              </div>
              {renderSalesChart()}
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recent Activity</h2>
                <span className="text-sm text-gray-500">Latest updates</span>
              </div>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3">
                      <div className="animate-pulse bg-gray-200 w-2 h-2 rounded-full"></div>
                      <div className="flex-1">
                        <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded mb-1"></div>
                        <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : recentActivities.length > 0 ? (
                  recentActivities.map(activity => (
                    <ActivityItem
                      key={activity._id || activity.id}
                      action={activity.action}
                      user={activity.user?.name || activity.user}
                      time={new Date(activity.timestamp || activity.time).toLocaleTimeString()}
                      type={activity.type}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p>No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium">{stats.ordersByStatus?.pending || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing</span>
                  <span className="font-medium">{stats.ordersByStatus?.processing || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipped</span>
                  <span className="font-medium">{stats.ordersByStatus?.shipped || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivered</span>
                  <span className="font-medium">{stats.ordersByStatus?.delivered || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-medium">{stats.ordersByStatus?.cancelled || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">{stats.paymentsByStatus?.completed || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-medium text-yellow-600">{stats.paymentsByStatus?.pending || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Failed</span>
                  <span className="font-medium text-red-600">{stats.paymentsByStatus?.failed || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Refunded</span>
                  <span className="font-medium text-gray-600">{stats.paymentsByStatus?.refunded || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Products</h3>
              <div className="space-y-2">
                {stats.topProducts && stats.topProducts.length > 0 ? (
                  stats.topProducts.slice(0, 4).map((product, index) => (
                    <div key={product._id || index} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate">{product.name}</span>
                      <span className="font-medium">{product.sold} sold</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No product data
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;