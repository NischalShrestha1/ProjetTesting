import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createRating, 
  updateRating, 
  deleteRating,
  getUserRating,
  getProductRatings,
  selectUserRating,
  selectRatings,
  selectRatingsDistribution,
  selectRatingsLoading,
  selectRatingCreating,
  selectRatingUpdating,
  selectIsAuthenticated
} from '../store';

const StarRating = ({ rating, onRate, readonly = false, size = 'md' }) => {
  const [hover, setHover] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
        >
          <svg
            className={`${sizeClasses[size]} ${
              star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

const RatingModal = ({ isOpen, onClose, productId, productName, existingRating, initialRating = 0 }) => {
  const [rating, setRating] = useState(existingRating?.rating || initialRating);
  const [review, setReview] = useState(existingRating?.review || '');
  const dispatch = useDispatch();
  const isCreating = useSelector(selectRatingCreating);
  const isUpdating = useSelector(selectRatingUpdating);

  // Reset form when existingRating changes or modal opens/closes
  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setReview(existingRating.review || '');
    } else {
      setRating(initialRating);
      setReview('');
    }
  }, [existingRating, isOpen, initialRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      if (existingRating) {
        await dispatch(updateRating({ ratingId: existingRating._id, rating, review })).unwrap();
      } else {
        await dispatch(createRating({ productId, rating, review })).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save rating:', error);
      alert(error.message || 'Failed to save rating. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">
          {existingRating ? 'Update Your Rating' : 'Rate this Product'}
        </h2>
        <p className="text-gray-600 mb-4">{productName}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <StarRating 
              rating={rating} 
              onRate={setRating} 
              size="lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Review (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Share your thoughts about this product..."
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {review.length}/500 characters
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || isCreating || isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating || isUpdating ? 'Saving...' : existingRating ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RatingComponent = ({ productId, productName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [initialRating, setInitialRating] = useState(0);
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRating = useSelector(selectUserRating);
  const ratings = useSelector(selectRatings);
  const distribution = useSelector(selectRatingsDistribution);
  const isLoading = useSelector(selectRatingsLoading);

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : '0.0';

  const totalRatings = distribution ? Object.values(distribution).reduce((sum, count) => sum + count, 0) : 0;

  useEffect(() => {
    if (productId) {
      dispatch(getProductRatings({ productId }));
      if (isAuthenticated) {
        dispatch(getUserRating(productId));
      }
    }
  }, [productId, dispatch, isAuthenticated]);

  // Reset initial rating when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setInitialRating(0);
    }
  }, [isModalOpen]);

  

  const handleStarClick = (rating) => {
    if (!isAuthenticated) {
      alert('Please login to rate this product');
      return;
    }
    
    setInitialRating(rating);
    setIsModalOpen(true);
  };

  const handleDeleteRating = async () => {
    if (userRating && window.confirm('Are you sure you want to delete your rating?')) {
      try {
        await dispatch(deleteRating(userRating._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete rating:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
            <StarRating rating={parseFloat(averageRating)} readonly={true} size="sm" />
            <div className="text-sm text-gray-600">{totalRatings} ratings</div>
          </div>
          
          {/* Rating Distribution */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <span className="text-sm w-3">{star}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Rating Action */}
        {isAuthenticated && (
          <div className="border-t pt-4">
            {userRating ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Your rating:</span>
                  <StarRating rating={userRating.rating} readonly={true} size="sm" />
                  <span className="text-sm font-medium">
                    {userRating.rating}/5
                    {userRating.review && ` - "${userRating.review.substring(0, 50)}${userRating.review.length > 50 ? '...' : ''}"`}
                  </span>
                  {userRating.isVerifiedPurchase && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteRating}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Click on the stars to rate this product</p>
                <StarRating 
                  rating={0} 
                  onRate={handleStarClick} 
                  size="lg"
                />
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <div className="border-t pt-4 text-center">
            <p className="text-gray-500 text-sm">
              Please <a href="/login" className="text-blue-600 hover:text-blue-800">login</a> to rate this product.
            </p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        productName={productName}
        existingRating={userRating}
        initialRating={initialRating}
      />
    </div>
  );
};

export default RatingComponent;