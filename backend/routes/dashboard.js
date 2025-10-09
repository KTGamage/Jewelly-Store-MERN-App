const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth'); // Use your existing auth middleware

// Get dashboard statistics
router.get('/stats', auth, admin, async (req, res) => {
  try {
    // Get current date and previous month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const firstDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Total sales (all completed orders)
    const totalSalesResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Current month sales
    const currentMonthSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: firstDayOfMonth },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Previous month sales for growth calculation
    const lastMonthSales = await Order.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: firstDayOfLastMonth,
            $lte: lastDayOfLastMonth
          },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Total orders
    const totalOrders = await Order.countDocuments();
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { 
        $gte: firstDayOfLastMonth,
        $lte: lastDayOfLastMonth
      }
    });

    // Total users
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { 
        $gte: firstDayOfLastMonth,
        $lte: lastDayOfLastMonth
      }
    });

    // Total products
    const totalProducts = await Product.countDocuments();
    const lastMonthProducts = await Product.countDocuments({
      createdAt: { 
        $gte: firstDayOfLastMonth,
        $lte: lastDayOfLastMonth
      }
    });

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Payments by status
    const paymentsByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          sold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          sold: '$sold'
        }
      }
    ]);

    // Format orders by status
    const ordersStatusObj = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    ordersByStatus.forEach(item => {
      ordersStatusObj[item._id] = item.count;
    });

    // Format payments by status
    const paymentsStatusObj = {
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0
    };
    paymentsByStatus.forEach(item => {
      paymentsStatusObj[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        totalSales: totalSalesResult[0]?.total || 0,
        totalOrders,
        totalUsers,
        totalProducts,
        monthlyGrowth: {
          sales: lastMonthSales[0]?.total || 0,
          orders: lastMonthOrders,
          users: lastMonthUsers,
          products: lastMonthProducts
        },
        ordersByStatus: ordersStatusObj,
        paymentsByStatus: paymentsStatusObj,
        topProducts: topProducts || []
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
});

// Get recent activities
router.get('/activities', auth, admin, async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const activities = recentOrders.map(order => ({
      _id: order._id,
      action: `New order placed - #${order._id.toString().slice(-8).toUpperCase()}`,
      user: order.user,
      timestamp: order.createdAt,
      type: 'order'
    }));

    // Add user registrations as activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    recentUsers.forEach(user => {
      activities.push({
        _id: user._id,
        action: 'New user registered',
        user: { name: user.name },
        timestamp: user.createdAt,
        type: 'user'
      });
    });

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Take only the 10 most recent
    const recentActivities = activities.slice(0, 10);

    res.json({
      success: true,
      activities: recentActivities
    });
  } catch (error) {
    console.error('Dashboard activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activities'
    });
  }
});

// Get sales data for charts
router.get('/sales-data', auth, admin, async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth()
      });
    }

    const salesData = await Promise.all(
      months.map(async ({ year, month }) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const monthlySales = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: firstDay, $lte: lastDay },
              paymentStatus: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$totalAmount' }
            }
          }
        ]);

        return {
          month: firstDay.toLocaleString('default', { month: 'short' }),
          amount: monthlySales[0]?.total || 0
        };
      })
    );

    res.json({
      success: true,
      salesData
    });
  } catch (error) {
    console.error('Sales data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales data'
    });
  }
});

module.exports = router;