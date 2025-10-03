import React from 'react';

const StatCard = ({ icon, title, value, description, color }) => (
  <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-6`}>
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-600', '-100')} mr-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalSales: 125430,
    totalOrders: 892,
    totalUsers: 3247,
    totalProducts: 156
  };

  const recentActivities = [
    { id: 1, action: 'New order placed', user: 'John Doe', time: '2 min ago' },
    { id: 2, action: 'Product added', user: 'Sarah Smith', time: '1 hour ago' },
    { id: 3, action: 'User registered', user: 'Mike Johnson', time: '3 hours ago' },
    { id: 4, action: 'Order shipped', user: 'Emma Wilson', time: '5 hours ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: Just now</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon="💰" 
          title="Total Sales" 
          value={`$${stats.totalSales.toLocaleString()}`}
          description="+12% from last month"
          color="border-l-green-600"
        />
        <StatCard 
          icon="📦" 
          title="Total Orders" 
          value={stats.totalOrders.toLocaleString()}
          description="+8% from last month"
          color="border-l-blue-600"
        />
        <StatCard 
          icon="👥" 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()}
          description="+5% from last month"
          color="border-l-purple-600"
        />
        <StatCard 
          icon="💎" 
          title="Total Products" 
          value={stats.totalProducts.toLocaleString()}
          description="+3% from last month"
          color="border-l-amber-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>Sales chart visualization</p>
              <p className="text-sm">(Chart library integration)</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition duration-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;