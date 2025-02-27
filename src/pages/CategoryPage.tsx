import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AppGrid from '../components/AppGrid';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type App = Database['public']['Tables']['apps']['Row'];

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [apps, setApps] = useState<App[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryApps = async () => {
      if (!category) return;
      
      setIsLoading(true);
      
      try {
        // Fetch apps by category
        const { data: appsData, error: appsError } = await supabase
          .from('apps')
          .select('*')
          .eq('category', category)
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
        console.error('Error fetching category apps:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryApps();
  }, [category]);

  const formatCategoryName = (cat: string) => {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
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
        <title>{formatCategoryName(category || '')} Apps - APK Store</title>
        <meta 
          name="description" 
          content={`Download the best ${category} apps for Android. Browse our selection of top-rated ${category} applications.`} 
        />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{formatCategoryName(category || '')} Apps</h1>
        <p className="text-gray-600 mt-2">
          Browse our collection of {formatCategoryName(category || '')} apps for Android
        </p>
      </div>
      
      <AppGrid 
        apps={apps} 
        ratings={ratings} 
        emptyMessage={`No ${category} apps found`} 
      />
    </div>
  );
};

export default CategoryPage;
