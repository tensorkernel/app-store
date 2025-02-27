import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import AppGrid from '../components/AppGrid';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { Search, Zap, TrendingUp, Clock, Award } from 'lucide-react';

type App = Database['public']['Tables']['apps']['Row'];

const HomePage: React.FC = () => {
  const [featuredApps, setFeaturedApps] = useState<App[]>([]);
  const [popularApps, setPopularApps] = useState<App[]>([]);
  const [newApps, setNewApps] = useState<App[]>([]);
  const [topRatedApps, setTopRatedApps] = useState<App[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      
      try {
        // Fetch featured apps (for now, just random selection)
        const { data: featured } = await supabase
          .from('apps')
          .select('*')
          .limit(3);
        
        // Fetch popular apps (by download count)
        const { data: popular } = await supabase
          .from('apps')
          .select('*')
          .order('download_count', { ascending: false })
          .limit(8);
        
        // Fetch new apps (by created_at)
        const { data: newReleases } = await supabase
          .from('apps')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);
        
        // Fetch all categories
        const { data: categoriesData } = await supabase
          .from('apps')
          .select('category')
          .order('category');
        
        // Extract unique categories
        const uniqueCategories = [...new Set((categoriesData || []).map(app => app.category))];
        setCategories(uniqueCategories);
        
        // Fetch ratings for all apps
        const appIds = [...new Set([
          ...(featured || []).map(app => app.id),
          ...(popular || []).map(app => app.id),
          ...(newReleases || []).map(app => app.id)
        ])];
        
        const ratingsData: Record<string, number> = {};
        
        for (const appId of appIds) {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('app_id', appId);
          
          if (reviews && reviews.length > 0) {
            const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            ratingsData[appId] = avgRating;
          } else {
            ratingsData[appId] = 0;
          }
        }
        
        // Find top rated apps
        const topRated = [...(popular || [])].sort((a, b) => 
          (ratingsData[b.id] || 0) - (ratingsData[a.id] || 0)
        ).slice(0, 4);
        
        setFeaturedApps(featured || []);
        setPopularApps(popular || []);
        setNewApps(newReleases || []);
        setTopRatedApps(topRated);
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching apps:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApps();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
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
      <Helmet>
        <title>APK Store - Download Android Apps and Games</title>
        <meta name="description" content="Discover and download the latest Android apps and games. APK Store offers a wide selection of applications for your Android device." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Android Apps</h1>
          <p className="text-xl mb-8">Your trusted source for the latest and greatest Android applications</p>
          <form onSubmit={handleSearch} className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search for apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-3 rounded-l-md w-full text-gray-800 focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-blue-800 hover:bg-blue-900 px-6 py-3 rounded-r-md transition-colors flex items-center"
              >
                <Search size={20} className="mr-2" />
                Search
              </button>
            </div>
          </form>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Zap size={24} className="mr-2 text-blue-600" />
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category}
              to={`/category/${category}`}
              className="bg-white shadow-md rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap size={24} className="text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-800">{category}</h3>
              <p className="text-xs text-gray-500 mt-1">Explore apps</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Featured Apps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Award size={24} className="mr-2 text-blue-600" />
          Featured Apps
        </h2>
        <AppGrid 
          apps={featuredApps} 
          ratings={ratings} 
          variant="featured"
          columns={3}
          emptyMessage="No featured apps available"
        />
      </section>
      
      {/* Popular Apps */}
      <section className="mb-12">
        <AppGrid 
          apps={popularApps} 
          ratings={ratings} 
          title="Popular Apps"
          showViewAll={true}
          viewAllLink="/popular"
          emptyMessage="No popular apps available"
        />
      </section>
      
      {/* Top Rated Apps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <TrendingUp size={24} className="mr-2 text-blue-600" />
          Top Rated Apps
        </h2>
        <AppGrid 
          apps={topRatedApps} 
          ratings={ratings} 
          columns={4}
          emptyMessage="No top rated apps available"
        />
      </section>
      
      {/* New Releases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Clock size={24} className="mr-2 text-blue-600" />
          New Releases
        </h2>
        <AppGrid 
          apps={newApps} 
          ratings={ratings} 
          showViewAll={true}
          viewAllLink="/new"
          emptyMessage="No new releases available"
        />
      </section>
      
      {/* Download Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl text-white p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold mb-2">Ready to Download?</h2>
            <p className="text-indigo-100">Browse our extensive collection of apps and games.</p>
          </div>
          <Link 
            to="/category/games" 
            className="bg-white text-indigo-700 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition-colors"
          >
            Explore Games
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
