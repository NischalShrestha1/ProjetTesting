import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  createComment, 
  updateComment, 
  deleteComment,
  addReply,
  updateReply,
  deleteReply,
  getProductComments,
  selectComments,
  selectCommentsPagination,
  selectCommentsLoading,
  selectCommentCreating,
  selectCommentUpdating,
  selectIsAuthenticated,
  selectUser
} from '../store';

const CommentItem = ({ comment, onReply, onEdit, onDelete, isUpdating = false }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  
  const dispatch = useDispatch();
  const isCreating = useSelector(selectCommentCreating);
  const user = useSelector(selectUser);

  // Reset form states when comment changes or when switching editing/reply modes
  useEffect(() => {
    setEditContent(comment.content);
    setReplyContent('');
    setShowReplyForm(false);
    setIsEditing(false);
  }, [comment._id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await dispatch(addReply({ commentId: comment._id, content: replyContent })).unwrap();
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      await dispatch(updateComment({ commentId: comment._id, content: editContent })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await dispatch(deleteReply({ commentId: comment._id, replyId })).unwrap();
      } catch (error) {
        console.error('Failed to delete reply:', error);
      }
    }
  };

  const canEditDelete = user && comment.user && (comment.user._id === user.id || user.isAdmin);
  const canReply = user && !isEditing;

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {comment.user?.username ? comment.user.username[0].toUpperCase() : 'U'}
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.user?.username || comment.user?.firstname || 'Anonymous'}
            </span>
            {comment.isVerifiedPurchase && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified Purchase
              </span>
            )}
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleEdit} className="mb-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                maxLength={1000}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={isUpdating || !editContent.trim()}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-700 mb-2 whitespace-pre-wrap">{comment.content}</p>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-4 mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {reply.user.username ? reply.user.username[0].toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {reply.user.username || reply.user.firstname || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                    {user && reply.user._id === user.id && (
                      <button
                        onClick={() => handleDeleteReply(reply._id)}
                        className="text-red-600 hover:text-red-800 text-xs mt-1"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {canReply && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {showReplyForm ? 'Cancel' : 'Reply'}
              </button>
              {canEditDelete && !isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(comment._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <form onSubmit={handleReply} className="mt-3 ml-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Write a reply..."
                maxLength={1000}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={isCreating || !replyContent.trim()}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                >
                  {isCreating ? 'Posting...' : 'Reply'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentComponent = ({ productId }) => {
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  
  
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Reset content when productId changes (user navigates to different product)
  useEffect(() => {
    setContent('');
  }, [productId]);
  const user = useSelector(selectUser);
  const comments = useSelector(selectComments);
  const pagination = useSelector(selectCommentsPagination);
  const isLoading = useSelector(selectCommentsLoading);
  const isCreating = useSelector(selectCommentCreating);

  useEffect(() => {
    if (productId) {
      dispatch(getProductComments({ productId, page }));
    }
  }, [productId, page, dispatch]);

  

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await dispatch(createComment({ productId, content })).unwrap();
      setContent('');
      setPage(1); // Reset to first page to see new comment
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(commentId)).unwrap();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {isAuthenticated ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Leave a Comment</h3>
          <form onSubmit={handleCreateComment}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Share your thoughts about this product..."
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length}/1000 characters
              </span>
              <button
                type="submit"
                disabled={!content.trim() || isCreating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isCreating ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-600">
            Please <a href="/login" className="text-blue-600 hover:text-blue-800">sign in</a> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">
          Comments ({pagination.total})
        </h3>
        
        {isLoading && comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                onDelete={handleDeleteComment}
              />
            ))}
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;