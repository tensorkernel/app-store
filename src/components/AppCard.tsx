import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download, Calendar, Clock } from 'lucide-react';
import { Database } from '../types/supabase';
import { format } from 'date-fns';

type App = Database['public']['Tables']['apps']['Row'];

interface AppCardProps {
  app: App;
  averageRating?: number;
  variant?: 'default' | 'featured' | 'compact';
}

const AppCard: React.FC<AppCardProps> = ({ app, averageRating = 0, variant = 'default' }) => {
  // Format the date
  const formattedDate = format(new Date(app.updated_at), 'MMM d, yyyy');
  
  if (variant === 'compact') {
    return (
      <Link to={`/app/${app.id}`} className="block">
        <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300">
          <img
            src={app.thumbnail_url}
            alt={app.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{app.title}</h3>
            <p className="text-xs text-gray-500">{app.publisher}</p>
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={`${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-600">{averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
  if (variant === 'featured') {
    return (
      <Link to={`/app/${app.id}`} className="block">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] group">
          <div className="relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              Featured
            </div>
            <img
              src={app.thumbnail_url}
              alt={app.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{app.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{app.publisher}</p>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={`${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{averageRating.toFixed(1)}</span>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{app.description.substring(0, 120)}...</p>
            
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {app.category}
              </span>
              <div className="flex items-center text-gray-500 text-xs">
                <Download size={14} className="mr-1" />
                <span>{app.download_count.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }
  
  // Default variant
  return (
    <Link to={`/app/${app.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] h-full flex flex-col">
        <div className="relative pb-[56.25%]">
          <img
            src={app.thumbnail_url}
            alt={app.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{app.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{app.publisher}</p>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">{averageRating.toFixed(1)}</span>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Download size={14} className="mr-1" />
                <span>{app.download_count.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {app.category}
              </span>
              <span className="text-xs text-gray-500">v{app.version}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AppCard;
