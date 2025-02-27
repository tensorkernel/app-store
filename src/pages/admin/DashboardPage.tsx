import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Download, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  BarChart2, 
  Calendar, 
  Star, 
  Activity, 
  AlertTriangle, 
  Zap,
  ArrowUp,
  ArrowDown,
  Clock,
  Target,
  Award,
  Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format, subDays, differenceInDays } from 'date-fns';
import { Database } from '../../types/supabase';

type App = Database['public']['Tables']['apps']['Row'];

interface DashboardStats {
  totalApps: number;
  totalDownloads: number;
  totalReviews: number;
  totalUsers: number;
  newAppsThisWeek: number;
  newReviewsThisWeek: number;
  averageRating: number;
  topCategories: {category: string, count: number}[];
  lowRatedApps: any[];
  downloadsTrend: {date: string, count: number}[];
  reviewsTrend: {date: string, count: number}[];
  usersTrend: {date: string, count: number}[];
  topDownloadedApps: App[];
  topRatedApps: {app: App, rating: number}[];
  recentActivity: {
    type: 'app' | 'review' | 'user',
    title: string,
    date: Date,
    id: string,
    details?: string
  }[];
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalApps: 0,
    totalDownloads: 0,
    totalReviews: 0,
    totalUsers: 0,
    newAppsThisWeek: 0,
    newReviewsThisWeek: 0,
    averageRating: 0,
    topCategories: [],
    lowRatedApps: [],
    downloadsTrend: [],
    reviewsTrend: [],
    usersTrend: [],
    topDownloadedApps: [],
    topRatedApps: [],
    recentActivity: []
  });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [comparisonStats, setComparisonStats] = useState({
    downloads: { value: 0, percentage: 0, isPositive: true },
    reviews: { value: 0, percentage: 0, isPositive: true },
    users: { value: 0, percentage: 0, isPositive: true },
    apps: { value: 0, percentage: 0, isPositive: true }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch total apps
        const { count: appsCount } = await supabase
          .from('apps')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total downloads
        const { data: downloadData } = await supabase
          .from('apps')
          .select('download_count');
        
        const totalDownloads = downloadData?.reduce((sum, app) => sum + (app.download_count || 0), 0) || 0;
        
        // Fetch total reviews
        const { count: reviewsCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Fetch recent apps
        const { data: recent } = await supabase
          .from('apps')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        // Fetch new apps this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: newAppsCount } = await supabase
          .from('apps')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());
        
        // Fetch new reviews this week
        const { count: newReviewsCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneWeekAgo.toISOString());
        
        // Fetch average rating
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('rating');
        
        let avgRating = 0;
        if (reviewsData && reviewsData.length > 0) {
          avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
        }
        
        // Fetch top categories
        const { data: categoriesData } = await supabase
          .from('apps')
          .select('category');
        
        const categoryCount: Record<string, number> = {};
        categoriesData?.forEach(app => {
          categoryCount[app.category] = (categoryCount[app.category] || 0) + 1;
        });
        
        const topCategories = Object.entries(categoryCount)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        // Fetch low rated apps (rating < 3)
        const { data: allApps } = await supabase
          .from('apps')
          .select('id, title, thumbnail_url');
        
        const lowRatedApps: any[] = [];
        
        if (allApps) {
          for (const app of allApps) {
            const { data: appReviews } = await supabase
              .from('reviews')
              .select('rating')
              .eq('app_id', app.id);
            
            if (appReviews && appReviews.length > 0) {
              const appAvgRating = appReviews.reduce((sum, review) => sum + review.rating, 0) / appReviews.length;
              
              if (appAvgRating < 3) {
                lowRatedApps.push({
                  ...app,
                  rating: appAvgRating
                });
              }
            }
          }
        }
        
        // Fetch recent reviews
        const { data: recentReviewsData } = await supabase
          .from('reviews')
          .select(`
            *,
            app:app_id (
              title
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);
        
        // Fetch top downloaded apps
        const { data: topDownloaded } = await supabase
          .from('apps')
          .select('*')
          .order('download_count', { ascending: false })
          .limit(5);
        
        // Generate trend data for downloads, reviews, and users
        const downloadTrend = generateTrendData(7, 'downloads');
        const reviewsTrend = generateTrendData(7, 'reviews');
        const usersTrend = generateTrendData(7, 'users');
        
        // Generate top rated apps
        const topRatedApps: {app: App, rating: number}[] = [];
        if (allApps) {
          for (const app of allApps.slice(0, 10)) {
            const { data: appReviews } = await supabase
              .from('reviews')
              .select('rating')
              .eq('app_id', app.id);
            
            if (appReviews && appReviews.length > 0) {
              const appAvgRating = appReviews.reduce((sum, review) => sum + review.rating, 0) / appReviews.length;
              topRatedApps.push({
                app: app as App,
                rating: appAvgRating
              });
            }
          }
          topRatedApps.sort((a, b) => b.rating - a.rating).slice(0, 5);
        }
        
        // Generate recent activity
        const recentActivity: DashboardStats['recentActivity'] = [];
        
        // Add recent apps to activity
        recent?.forEach(app => {
          recentActivity.push({
            type: 'app',
            title: `New app: ${app.title}`,
            date: new Date(app.created_at),
            id: app.id,
            details: `Published by ${app.publisher}`
          });
        });
        
        // Add recent reviews to activity
        recentReviewsData?.forEach(review => {
          recentActivity.push({
            type: 'review',
            title: `New review for ${review.app.title}`,
            date: new Date(review.created_at),
            id: review.id,
            details: `${review.rating}/5 stars by ${review.user_name}`
          });
        });
        
        // Sort activity by date
        recentActivity.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        // Calculate comparison stats
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        // Downloads comparison
        const prevPeriodDownloads = Math.floor(Math.random() * totalDownloads * 0.9); // Mock data
        const downloadsDiff = totalDownloads - prevPeriodDownloads;
        const downloadsPercentage = prevPeriodDownloads ? (downloadsDiff / prevPeriodDownloads) * 100 : 100;
        
        // Reviews comparison
        const { count: prevPeriodReviews } = await supabase
          .from('reviews')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', oneWeekAgo.toISOString())
          .gte('created_at', twoWeeksAgo.toISOString());
        
        const reviewsDiff = (newReviewsCount || 0) - (prevPeriodReviews || 0);
        const reviewsPercentage = prevPeriodReviews ? (reviewsDiff / prevPeriodReviews) * 100 : 100;
        
        // Apps comparison
        const { count: prevPeriodApps } = await supabase
          .from('apps')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', oneWeekAgo.toISOString())
          .gte('created_at', twoWeeksAgo.toISOString());
        
        const appsDiff = (newAppsCount || 0) - (prevPeriodApps || 0);
        const appsPercentage = prevPeriodApps ? (appsDiff / prevPeriodApps) * 100 : 100;
        
        // Users comparison (mock data for now)
        const prevPeriodUsers = Math.floor(Math.random() * (usersCount || 1) * 0.9);
        const usersDiff = (usersCount || 0) - prevPeriodUsers;
        const usersPercentage = prevPeriodUsers ? (usersDiff / prevPeriodUsers) * 100 : 100;
        
        setComparisonStats({
          downloads: { 
            value: downloadsDiff, 
            percentage: Math.abs(downloadsPercentage), 
            isPositive: downloadsPercentage >= 0 
          },
          reviews: { 
            value: reviewsDiff, 
            percentage: Math.abs(reviewsPercentage), 
            isPositive: reviewsPercentage >= 0 
          },
          users: { 
            value: usersDiff, 
            percentage: Math.abs(usersPercentage), 
            isPositive: usersPercentage >= 0 
          },
          apps: { 
            value: appsDiff, 
            percentage: Math.abs(appsPercentage), 
            isPositive: appsPercentage >= 0 
          }
        });
        
        setStats({
          totalApps: appsCount || 0,
          totalDownloads,
          totalReviews: reviewsCount || 0,
          totalUsers: usersCount || 0,
          newAppsThisWeek: newAppsCount || 0,
          newReviewsThisWeek: newReviewsCount || 0,
          averageRating: avgRating,
          topCategories,
          lowRatedApps: lowRatedApps.slice(0, 5),
          downloadsTrend: downloadTrend,
          reviewsTrend: reviewsTrend,
          usersTrend: usersTrend,
          topDownloadedApps: topDownloaded || [],
          topRatedApps,
          recentActivity: recentActivity.slice(0, 10)
        });
        
        setRecentApps(recent || []);
        setRecentReviews(recentReviewsData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeRange]);

  // Helper function to generate trend data
  const generateTrendData = (days: number, type: 'downloads' | 'reviews' | 'users') => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      // In a real app, you would fetch actual data for each day
      // This is just a placeholder with random data
      let baseValue = 0;
      let variance = 0;
      
      switch (type) {
        case 'downloads':
          baseValue = 100;
          variance = 50;
          break;
        case 'reviews':
          baseValue = 20;
          variance = 15;
          break;
        case 'users':
          baseValue = 30;
          variance = 20;
          break;
      }
      
      const randomCount = Math.floor(Math.random() * variance) + baseValue;
      data.push({
        date: format(date, 'MMM dd'),
        count: randomCount
      });
    }
    return data;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1 rounded-md ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1 rounded-md ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded-md ${timeRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Package size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Apps</p>
                <p className="text-2xl font-semibold">{stats.totalApps}</p>
              </div>
            </div>
            <div className={`flex items-center ${comparisonStats.apps.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {comparisonStats.apps.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-medium ml-1">{comparisonStats.apps.percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full" 
              style={{ width: `${Math.min((stats.newAppsThisWeek / stats.totalApps) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.newAppsThisWeek} new this week
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Download size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Downloads</p>
                <p className="text-2xl font-semibold">{stats.totalDownloads.toLocaleString()}</p>
              </div>
            </div>
            <div className={`flex items-center ${comparisonStats.downloads.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {comparisonStats.downloads.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-medium ml-1">{comparisonStats.downloads.percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full" 
              style={{ width: '75%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {comparisonStats.downloads.value.toLocaleString()} more than last period
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <MessageSquare size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-semibold">{stats.totalReviews}</p>
              </div>
            </div>
            <div className={`flex items-center ${comparisonStats.reviews.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {comparisonStats.reviews.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-medium ml-1">{comparisonStats.reviews.percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-600 rounded-full" 
              style={{ width: `${Math.min((stats.newReviewsThisWeek / stats.totalReviews) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.newReviewsThisWeek} new this week
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold">{stats.totalUsers}</p>
              </div>
            </div>
            <div className={`flex items-center ${comparisonStats.users.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {comparisonStats.users.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-medium ml-1">{comparisonStats.users.percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-600 rounded-full" 
              style={{ width: '60%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {comparisonStats.users.value} more than last period
          </p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Download Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Download Trend</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1" />
              <span>Last 7 Days</span>
            </div>
          </div>
          
          <div className="h-64">
            <div className="flex h-full items-end">
              {stats.downloadsTrend.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative">
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.count} downloads
                    </div>
                  </div>
                  <div 
                    className="w-full bg-blue-500 rounded-t-md mx-1 transition-all duration-300 hover:bg-blue-600" 
                    style={{ height: `${(day.count / 150) * 100}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">{day.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Reviews Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Reviews Trend</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1" />
              <span>Last 7 Days</span>
            </div>
          </div>
          
          <div className="h-64">
            <div className="flex h-full items-end">
              {stats.reviewsTrend.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative">
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.count} reviews
                    </div>
                  </div>
                  <div 
                    className="w-full bg-yellow-500 rounded-t-md mx-1 transition-all duration-300 hover:bg-yellow-600" 
                    style={{ height: `${(day.count / 35) * 100}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">{day.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart2 size={20} className="mr-2 text-blue-600" />
            Top Categories
          </h2>
          <div className="space-y-4">
            {stats.topCategories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div className="w-32 text-sm">{category.category}</div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${(category.count / stats.totalApps) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-medium">{category.count}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link 
              to="/admin/apps" 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-end"
            >
              <span>View All Categories</span>
              <Eye size={16} className="ml-1" />
            </Link>
          </div>
        </div>
        
        {/* Top Downloaded Apps */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Download size={20} className="mr-2 text-green-600" />
            Top Downloaded Apps
          </h2>
          <div className="space-y-4">
            {stats.topDownloadedApps.map((app, index) => (
              <div key={app.id} className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 mr-3">
                  <img 
                    className="h-10 w-10 rounded-md object-cover" 
                    src={app.thumbnail_url} 
                    alt={app.title} 
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{app.title}</div>
                  <div className="text-xs text-gray-500">{app.publisher}</div>
                </div>
                <div className="text-sm font-medium text-gray-700 flex items-center">
                  <Download size={14} className="mr-1 text-gray-400" />
                  {app.download_count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link 
              to="/admin/apps" 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-end"
            >
              <span>View All Apps</span>
              <Eye size={16} className="ml-1" />
            </Link>
          </div>
        </div>
        
        {/* Top Rated Apps */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Star size={20} className="mr-2 text-yellow-600" />
            Top Rated Apps
          </h2>
          <div className="space-y-4">
            {stats.topRatedApps.map((item) => (
              <div key={item.app.id} className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 mr-3">
                  <img 
                    className="h-10 w-10 rounded-md object-cover" 
                    src={item.app.thumbnail_url} 
                    alt={item.app.title} 
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.app.title}</div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={`${
                          star <= Math.round(item.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-500">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link 
              to="/admin/reviews" 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-end"
            >
              <span>View All Reviews</span>
              <Eye size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Activity size={20} className="mr-2 text-blue-600" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-100">
                <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                  activity.type === 'app' 
                    ? 'bg-blue-100' 
                    : activity.type === 'review' 
                      ? 'bg-yellow-100' 
                      : 'bg-purple-100'
                }`}>
                  {activity.type === 'app' && <Package size={16} className="text-blue-600" />}
                  {activity.type === 'review' && <MessageSquare size={16} className="text-yellow-600" />}
                  {activity.type === 'user' && <User size={16} className="text-purple-600" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{activity.title}</div>
                  {activity.details && (
                    <div className="text-xs text-gray-500">{activity.details}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {format(activity.date, 'MMM d, yyyy')} • {format(activity.date, 'h:mm a')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Low Rated Apps */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle size={20} className="mr-2 text-red-600" />
            Apps Needing Attention
          </h2>
          {stats.lowRatedApps.length > 0 ? (
            <div className="space-y-4">
              {stats.lowRatedApps.map((app) => (
                <div key={app.id} className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                    <img 
                      className="h-10 w-10 rounded-md object-cover" 
                      src={app.thumbnail_url} 
                      alt={app.title} 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{app.title}</div>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={`${
                            star <= Math.round(app.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-red-500">
                        {app.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/admin/apps/edit/${app.id}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Award size={32} className="text-green-600" />
              </div>
              <p className="text-gray-500">All apps are rated well!</p>
              <p className="text-sm text-gray-400">No low-rated apps found</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Apps */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Package size={20} className="mr-2 text-blue-600" />
            Recent Apps
          </h2>
          <Link 
            to="/admin/apps" 
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            <span>View All</span>
            <Eye size={16} className="ml-1" />
          </Link>
        </div>
        
        {recentApps.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    App
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Publisher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={app.thumbnail_url} 
                            alt={app.title} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{app.title}</div>
                          <div className="text-sm text-gray-500">v{app.version}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {app.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {app.publisher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Download size={16} className="mr-1 text-gray-400" />
                        {app.download_count}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/admin/apps/edit/${app.id}`} 
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <Link 
                        to={`/app/${app.id}`} 
                        className="text-green-600 hover:text-green-900"
                        target="_blank"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No apps added yet</p>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Zap size={20} className="mr-2 text-blue-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/apps/add"
            className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Package size={20} className="text-blue-600 mr-2" />
            <span>Add New App</span>
          </Link>
          
          <Link
            to="/admin/apps"
            className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <TrendingUp size={20} className="text-green-600 mr-2" />
            <span>Manage Apps</span>
          </Link>
          
          <Link
            to="/admin/reviews"
            className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <MessageSquare size={20} className="text-yellow-600 mr-2" />
            <span>Manage Reviews</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
