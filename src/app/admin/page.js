"use client";
import React from "react";
import {
  Sparkles,
  House,
  GraduationCap,
  Bell,
  RefreshCcw,
  Calendar,
  Flame,
  MessagesSquare,
  Users,
  UserCheck,
  UserX,
  Shield,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useDashboard } from "../../context/DashboardContext";

// Main Dashboard Component
const Dashboard = () => {
  const { fetchDashboardData, dashboardLoading } =
    useDashboard();
  const [userStats, setUserStats] = useState(null);

  const fetchUserStats = useCallback(async () => {
    const response = await fetchDashboardData("/user/admin/user-stats");
    if (response?.status === 200) {
      setUserStats(response.data);
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);



  const getMaxCount = () => {
    if (!userStats?.monthlyStats) return 0;
    return Math.max(...userStats.monthlyStats.map((stat) => stat.count));
  };

  return (
    <div className="container-width fade-in p-6">
      <div className="flex items-center">
        <div className="bg-brand-beige p-2 sm:p-3 rounded-xl">
          <House className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold ml-2 sm:ml-3">Dashboard</h1>
      </div>

      <div className="bg-brand-beige p-4 sm:p-6 mt-4 rounded-xl">
        <div className="flex items-center">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          <p className="text-xs sm:text-sm font-semibold ml-2 sm:ml-3">Good to see you</p>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ml-4 sm:ml-6 mt-2 sm:mt-3">Welcome Back, Admin.</h1>
        <p className="text-sm sm:text-base font-semibold ml-4 sm:ml-6 mt-2 sm:mt-3">
          Let&apos;s create something amazing!
        </p>
      </div>

      {/* User Statistics Section */}
      <div className="mt-6">
        <div className="flex items-center mb-4">
          <div className="bg-brand-beige p-2 rounded-xl">
            <BarChart3 className="text-brand-warm-brown w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold ml-2 sm:ml-3 heading-secondary">
            User Statistics
          </h2>
        </div>

        {dashboardLoading ? (
          <div className="bg-brand-beige p-8 rounded-xl flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-warm-brown"></div>
          </div>
        ) : userStats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Users Card */}
              <div className="bg-brand-beige p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-warm-brown font-medium">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-brand-charcoal">
                      {userStats.totalUsers}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <Users className="h-6 w-6 text-brand-warm-brown" />
                  </div>
                </div>
              </div>

              {/* Verified Users Card */}
              <div className="bg-brand-beige p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-warm-brown font-medium">
                      Verified Users
                    </p>
                    <p className="text-3xl font-bold text-brand-charcoal">
                      {userStats.verifiedUsers}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Unverified Users Card */}
              <div className="bg-brand-beige p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-warm-brown font-medium">
                      Unverified Users
                    </p>
                    <p className="text-3xl font-bold text-brand-charcoal">
                      {userStats.unverifiedUsers}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <UserX className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Admin Users Card */}
              <div className="bg-brand-beige p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-brand-warm-brown font-medium">
                      Admin Users
                    </p>
                    <p className="text-3xl font-bold text-brand-charcoal">
                      {userStats.adminUsers}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Growth Chart */}
            <div className="bg-brand-beige p-6 rounded-xl shadow-sm mb-6">
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="bg-white p-2 rounded-xl mr-3">
                    <TrendingUp className="h-5 w-5 text-brand-warm-brown" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand-charcoal">
                    Monthly User Growth
                  </h3>
                </div>
                <p className="text-sm text-brand-warm-brown ml-11">
                  Track your platform&apos;s growth over time with detailed
                  monthly statistics
                </p>
              </div>

              <div className="flex items-end justify-between h-44 space-x-3">
                {userStats.monthlyStats.map((stat, index) => {
                  const maxCount = getMaxCount();
                  const height =
                    maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center flex-1"
                    >
                      <div className="relative w-full h-full">
                        {/* User count text - always visible */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-brand-charcoal text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 font-medium">
                          {stat.count} users
                        </div>
                        {/* Bar */}
                        <div
                          className="bg-brand-warm-brown rounded-t transition-all duration-500 ease-out hover:bg-brand-warm-brown/80 relative"
                          style={{ height: `${height}%` }}
                        >
                          {/* Bar hover effect */}
                          <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-t"></div>
                        </div>
                      </div>
                      <p className="text-xs text-brand-warm-brown mt-3 font-medium">
                        {stat.month}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-brand-warm-brown">
                  <span className="font-semibold">Recent Registrations:</span>{" "}
                  {userStats.recentRegistrations}
                </div>
                <div className="text-sm text-brand-warm-brown">
                  <span className="font-semibold">Regular Users:</span>{" "}
                  {userStats.regularUsers}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-brand-beige p-8 rounded-xl text-center">
            <p className="text-brand-warm-brown">
              Failed to load user statistics
            </p>
            <button
              onClick={fetchUserStats}
              className="mt-2 bg-brand-warm-brown text-white px-4 py-2 rounded hover:opacity-90 transition"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6 justify-evenly">
        <div className="w-full shadow-sm p-4 rounded">
          <div className="flex items-center">
            <GraduationCap />
            <h2 className="text-lg font-semibold ml-3">Getting Started</h2>
          </div>
          <p className="mt-2 font-semibold text-xl">Welcome to Our Academy!</p>
          <p className="mt-2 ">
            New here? Our getting started module will help you master the
            platform and create stunning social media content.
          </p>
          <button className="w-full mt-4 bg-brand-warm-brown hover:bg-[#a88e78]/90 text-white px-4 py-2 rounded transition">
            Start Learning
          </button>
        </div>

        <div className="w-full shadow-sm p-4 rounded ">
          <div className="flex items-center mb-4">
            <Bell />
            <h2 className="text-lg font-semibold ml-3">Recent Updates</h2>
          </div>

          <ul className="list-disc pl-6 space-y-4 text-sm ">
            <li>
              <p className="font-medium">New Content Drop: June 2025</p>
              <p>
                Usher in the summer with our latest content update! Head over to
                the calendar and get a jump start on your summer content with
                our new templates and captions.
              </p>
              <p className="text-xs opacity-60">May 28</p>
            </li>
            <li>
              <p className="font-medium">System maintenance scheduled</p>
              <p>
                Over 120 new templates and captions added for May. Explore the
                calendar and enjoy fresh content for Mother&apos;s Day, National
                Nurse&apos;s Day, and much more!
              </p>
              <p className="text-xs opacity-60">June 28</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-brand-beige p-6 mt-4 rounded-xl">
        <div className="flex items-center">
          <Sparkles />
          <p className="text-base font-semibold ml-3 align-">
            Upgrade to Member{" "}
          </p>
        </div>
        <p className="text-sm mt-3">
          Get access to exclusive content, advanced features, and premium
          resources to take your content creation to the next level.
        </p>
        <button className=" mt-4 bg-brand-warm-brown text-white px-4 py-2 rounded transition hover:bg-[#a88e78]/90">
          Upgrade Now
        </button>
      </div>

      <div className="w-full shadow-sm p-4 rounded mt-4 ">
        <div className="flex items-center">
          <div className="bg-brand-beige p-2 rounded-xl">
            <RefreshCcw />
          </div>
          <h2 className="text-lg font-semibold ml-3">Quick Action</h2>
        </div>

        <p className="opacity-60 mt-4">
          Quickly access common tasks and features
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          {/* View Calendar */}
          <button className="w-full flex items-start gap-3 bg-brand-beige text-black px-4 py-3 rounded-xl hover:opacity-90 transition">
            <div className="bg-white p-2 rounded-xl">
              <Calendar size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold leading-tight">View Calendar</p>
              <p className="text-sm opacity-60">
                View the monthly content calendar
              </p>
            </div>
          </button>

          {/* Trending */}
          <button className="w-full flex items-start gap-3 bg-brand-beige text-black px-4 py-3 rounded-xl hover:opacity-90 transition">
            <div className="bg-white p-2 rounded-xl">
              <Flame size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold leading-tight">Trending</p>
              <p className="text-sm opacity-60">
                Explore trending content and topics
              </p>
            </div>
          </button>



          {/* Academy */}
          <button className="w-full flex items-start gap-3 bg-brand-beige text-black px-4 py-3 rounded-xl hover:opacity-90 transition">
            <div className="bg-white p-2 rounded-xl">
              <GraduationCap size={20} />
            </div>
            <div className="text-left">
              <p className="font-semibold leading-tight">Academy</p>
              <p className="text-sm opacity-60">
                Learn more about using Social Spa effectively
              </p>
            </div>
          </button>
        </div>
      </div>



      <div className="w-full shadow-sm p-4 rounded mt-4">
        <div className="flex items-center">
          <div className="bg-brand-beige p-2 rounded-xl">
            <MessagesSquare />
          </div>
          <h2 className="text-lg font-semibold ml-3">Need Help?</h2>
        </div>
        <p className="mt-2">
          If you have any questions or need assistance, feel free to reach out
          to our support team.
        </p>
        <button className="w-full flex items-center gap-3 bg-brand-beige text-black px-4 py-3 rounded-xl hover:opacity-90 transition mt-4">
          <div className="bg-white p-2 rounded-xl">
            <MessagesSquare size={20} />
          </div>
          <div className="text-left">
            <p className="font-semibold leading-tight">Contact Support</p>
            <p className="text-sm opacity-60 mt-2">
              Get in touch with our support team for assistance
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
