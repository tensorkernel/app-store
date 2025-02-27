import React from 'react';
import { Link } from 'react-router-dom';
import AppCard from './AppCard';
import { Database } from '../types/supabase';
import { ChevronRight } from 'lucide-react';

type App = Database['public']['Tables']['apps']['Row'];

interface AppGridProps {
  apps: App[];
  ratings: Record<string, number>;
  title?: string;
  emptyMessage?: string;
  variant?: 'default' | 'featured' | 'compact';
  columns?: 2 | 3 | 4 | 5;
  showViewAll?: boolean;
  viewAllLink?: string;
}

const AppGrid: React.FC<AppGridProps> = ({ 
  apps, 
  ratings, 
  title, 
  emptyMessage = "No apps found",
  variant = 'default',
  columns = 4,
  showViewAll = false,
  viewAllLink = "/apps"
}) => {
  if (apps.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  // Determine grid columns based on prop
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  }[columns];

  return (
    <div>
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewAll && (
            <Link to={viewAllLink} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              View All
              <ChevronRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
      )}
      
      <div className={`grid ${gridCols} gap-6`}>
        {apps.map((app) => (
          <AppCard 
            key={app.id} 
            app={app} 
            averageRating={ratings[app.id] || 0} 
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
};

export default AppGrid;
