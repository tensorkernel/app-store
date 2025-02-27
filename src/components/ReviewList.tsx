import React from 'react';
import { format } from 'date-fns';
import { Star, User } from 'lucide-react';
import { Database } from '../types/supabase';

type Review = Database['public']['Tables']['reviews']['Row'];

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, averageRating }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <div className="flex items-center mr-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={`${
                star <= Math.round(averageRating)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
        <span className="text-gray-500 ml-2">({reviews.length} reviews)</span>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center mb-2">
              <div className="bg-gray-200 rounded-full p-2 mr-3">
                <User size={20} className="text-gray-600" />
              </div>
              <div>
                <h4 className="font-medium">{review.user_name}</h4>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
