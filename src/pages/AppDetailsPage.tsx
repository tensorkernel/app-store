import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Download, ArrowLeft, Info, Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';

type App = Database['public']['Tables']['apps']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

const AppDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<App | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  useEffect(() => {
    const fetchAppDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch app details
        const { data: appData, error: appError } = await supabase
          .from('apps')
          .select('*')
          .eq('id', id)
          .single();
        
        if (appError) throw appError;
        
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('app_id', id)
          .order('created_at', { ascending: false });
        
        if (reviewsError) throw reviewsError;
        
        setApp(appData);
        setReviews(reviewsData || []);
        
        // Calculate average rating
        if (reviewsData && reviewsData.length > 0) {
          const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
          setAverageRating(avgRating);
        }
        
        // Increment download count (just for viewing the page)
        await supabase
          .from('apps')
          .update({ download_count: (appData.download_count || 0) + 1 })
          .eq('id', id);
        
      } catch (error) {
        console.error('Error fetching app details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppDetails();
  }, [id]);

  const handleReviewSubmitted = async () => {
    if (!id) return;
    
    // Refresh reviews
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('app_id', id)
      .order('created_at', { ascending: false });
    
    setReviews(reviewsData || []);
    
    // Recalculate average rating
    if (reviewsData && reviewsData.length > 0) {
      const avgRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length;
      setAverageRating(avgRating);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">App Not Found</h2>
        <p className="mb-6">The app you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  const screenshots = app.screenshots as string[] || [];

  return (
    <div>
      <Helmet>
        <title>{app.title} - APK Store</title>
        <meta name="description" content={app.seo_description || app.description.substring(0, 160)} />
        <meta name="keywords" content={app.seo_keywords} />
      </Helmet>
      
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
      </div>
      
      {/* App Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 mb-6 md:mb-0">
            <img 
              src={app.thumbnail_url} 
              alt={app.title} 
              className="w-full rounded-lg shadow-sm"
            />
          </div>
          
          <div className="md:w-3/4 md:pl-8">
            <h1 className="text-3xl font-bold mb-2">{app.title}</h1>
            <p className="text-gray-600 mb-4">{app.publisher}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {app.category}
              </span>
              {app.tags && app.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                <span className="text-2xl font-bold mr-2">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center mr-4">
                <Download size={18} className="text-gray-500 mr-1" />
                <span className="text-gray-500">{app.download_count} downloads</span>
              </div>
              <div className="flex items-center">
                <Tag size={18} className="text-gray-500 mr-1" />
                <span className="text-gray-500">v{app.version}</span>
              </div>
            </div>
            
            <a 
              href={app.download_url} 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={18} className="inline mr-2" />
              Download APK
            </a>
          </div>
        </div>
      </div>
      
      {/* App Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          {/* Screenshots */}
          {screenshots.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
              <div className="mb-4">
                <img 
                  src={screenshots[activeScreenshot]} 
                  alt={`${app.title} screenshot ${activeScreenshot + 1}`} 
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {screenshots.map((screenshot, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveScreenshot(index)}
                    className={`flex-shrink-0 w-24 h-auto rounded ${index === activeScreenshot ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <img 
                      src={screenshot} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <div className="prose max-w-none">
              {app.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
          
          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <ReviewList reviews={reviews} averageRating={averageRating} />
          </div>
        </div>
        
        <div>
          {/* App Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">App Info</h2>
            <ul className="space-y-4">
              <li className="flex">
                <Info size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-gray-500">Version</span>
                  <span className="font-medium">{app.version}</span>
                </div>
              </li>
              <li className="flex">
                <User size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-gray-500">Publisher</span>
                  <span className="font-medium">{app.publisher}</span>
                </div>
              </li>
              <li className="flex">
                <Calendar size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-gray-500">Updated</span>
                  <span className="font-medium">
                    {format(new Date(app.updated_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </li>
              <li className="flex">
                <Download size={20} className="text-gray-500 mr-3 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-gray-500">Downloads</span>
                  <span className="font-medium">{app.download_count}</span>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Write a Review */}
          <ReviewForm appId={app.id} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>
    </div>
  );
};

export default AppDetailsPage;
