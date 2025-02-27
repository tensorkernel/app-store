import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppGrid from '../components/AppGrid';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type App = Database['public']['Tables']['apps']['Row'];

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [apps, setApps] = useState<App[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setApps([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Search apps by title, description, or publisher
        const { data: appsData, error: appsError } = await supabase
          .from('apps')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,publisher.ilike.%${query}%,category.ilike.%${query}%`)
          .order('download_count', { ascending: false });
        
        if (appsError) throw appsError;
        
        setApps(appsData || []);
        
        // Fetch ratings for all apps
        const ratingsData: Record<string, number> = {};
        
        for (const app of appsData || []) {
          const { data: reviews } = await supabase
            .from('reviews')
            .select('rating')
            .eq('app_id', app.id);
          
          if (reviews && reviews.length > 0) {
            const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            ratingsData[app.id] = avgRating;
          } else {
            ratingsData[app.id] = 0;
          }
        }
        
        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);

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
        <title>Search Results for "{query}" - APK Store</title>
        <meta 
          name="description" 
          content={`Search results for "${query}" - Find and download Android apps matching your search.`} 
        />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-gray-600 mt-2">
          {apps.length} {apps.length === 1 ? 'result' : 'results'} for "{query}"
        </p>
      </div>
      
      <AppGrid 
        apps={apps} 
        ratings={ratings} 
        emptyMessage={`No results found for "${query}"`} 
      />
    </div>
  );
};

export default SearchResultsPage;
