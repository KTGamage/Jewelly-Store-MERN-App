// import React from 'react';

// const StatCard = ({ icon, title, value, description, color }) => (
//   <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-6`}>
//     <div className="flex items-center">
//       <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-600', '-100')} mr-4`}>
//         <span className="text-2xl">{icon}</span>
//       </div>
//       <div>
//         <p className="text-sm font-medium text-gray-600">{title}</p>
//         <p className="text-2xl font-bold text-gray-900">{value}</p>
//         <p className="text-xs text-gray-500 mt-1">{description}</p>
//       </div>
//     </div>
//   </div>
// );

// const Dashboard = () => {
//   // Mock data - replace with actual API calls
//   const stats = {
//     totalSales: 125430,
//     totalOrders: 892,
//     totalUsers: 3247,
//     totalProducts: 156
//   };

//   const recentActivities = [
//     { id: 1, action: 'New order placed', user: 'John Doe', time: '2 min ago' },
//     { id: 2, action: 'Product added', user: 'Sarah Smith', time: '1 hour ago' },
//     { id: 3, action: 'User registered', user: 'Mike Johnson', time: '3 hours ago' },
//     { id: 4, action: 'Order shipped', user: 'Emma Wilson', time: '5 hours ago' },
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
//         <div className="text-sm text-gray-500">Last updated: Just now</div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard 
//           icon="💰" 
//           title="Total Sales" 
//           value={`$${stats.totalSales.toLocaleString()}`}
//           description="+12% from last month"
//           color="border-l-green-600"
//         />
//         <StatCard 
//           icon="📦" 
//           title="Total Orders" 
//           value={stats.totalOrders.toLocaleString()}
//           description="+8% from last month"
//           color="border-l-blue-600"
//         />
//         <StatCard 
//           icon="👥" 
//           title="Total Users" 
//           value={stats.totalUsers.toLocaleString()}
//           description="+5% from last month"
//           color="border-l-purple-600"
//         />
//         <StatCard 
//           icon="💎" 
//           title="Total Products" 
//           value={stats.totalProducts.toLocaleString()}
//           description="+3% from last month"
//           color="border-l-amber-600"
//         />
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Overview</h2>
//           <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
//             <div className="text-center text-gray-500">
//               <div className="text-4xl mb-2">📊</div>
//               <p>Sales chart visualization</p>
//               <p className="text-sm">(Chart library integration)</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
//           <div className="space-y-4">
//             {recentActivities.map(activity => (
//               <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-200">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-gray-900">{activity.action}</p>
//                   <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;








import React from 'react';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, description, color, icon }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mr-4`}>
        <span className="text-white text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  const stats = [
    {
      title: "Total Sales",
      value: "$125,430",
      description: "+12% from last month",
      color: "bg-green-500",
      icon: "💰"
    },
    {
      title: "Total Orders", 
      value: "892",
      description: "+8% from last month",
      color: "bg-blue-500",
      icon: "📦"
    },
    {
      title: "Total Users",
      value: "3,247",
      description: "+5% from last month", 
      color: "bg-purple-500",
      icon: "👥"
    },
    {
      title: "Total Products",
      value: "156",
      description: "+3% from last month",
      color: "bg-amber-500",
      icon: "💎"
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New order placed', user: 'John Doe', time: '2 min ago' },
    { id: 2, action: 'Product added', user: 'Sarah Smith', time: '1 hour ago' },
    { id: 3, action: 'User registered', user: 'Mike Johnson', time: '3 hours ago' },
    { id: 4, action: 'Order shipped', user: 'Emma Wilson', time: '5 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {currentUser?.name || 'Admin'}!
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-medium"
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Sales chart will be displayed here</p>
              <p className="text-sm mt-1">Chart integration placeholder</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-150">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>by {activity.user}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-150 border border-blue-200">
            <div className="text-blue-600 text-lg font-bold">+</div>
            <p className="text-sm text-gray-700 mt-1">Add Product</p>
          </button>
          <button className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition duration-150 border border-green-200">
            <div className="text-green-600 text-lg font-bold">📋</div>
            <p className="text-sm text-gray-700 mt-1">View Orders</p>
          </button>
          <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-150 border border-purple-200">
            <div className="text-purple-600 text-lg font-bold">👥</div>
            <p className="text-sm text-gray-700 mt-1">Manage Users</p>
          </button>
          <button className="p-4 text-center bg-amber-50 hover:bg-amber-100 rounded-lg transition duration-150 border border-amber-200">
            <div className="text-amber-600 text-lg font-bold">📈</div>
            <p className="text-sm text-gray-700 mt-1">Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

