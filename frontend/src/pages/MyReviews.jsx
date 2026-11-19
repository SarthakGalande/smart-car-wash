import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Star, Trash2, MessageSquare } from 'lucide-react';

export const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadReviews = () => {
    setLoading(true);
    api.get('/reviews')
      .then((res) => {
        setReviews(res.data.reviews || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${id}`);
        toast.success('Review removed.');
        loadReviews();
      } catch (err) {
        toast.error('Failed to delete review.');
      }
    }
  };

  return (
    <div className="py-section bg-scw-soft min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <span className="section-tag">Customer Feedback</span>
          <h1 className="h3 fw-bold text-primary mb-1">My Service Reviews</h1>
          <p className="text-muted small mb-0">Ratings and impressions submitted for your completed appointments.</p>
        </div>

        {!loading && (
          <div className="row g-4">
            {reviews.map((rev) => (
              <div key={rev._id || rev.id} className="col-md-6">
                <div className="scw-card p-4 h-100 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex text-warning">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} className={s <= rev.rating ? 'fill-warning' : 'opacity-25'} />
                      ))}
                    </div>
                    <button
                      className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                      onClick={() => handleDeleteReview(rev._id || rev.id)}
                      title="Delete Review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p className="text-secondary small fst-italic flex-grow-1">
                    "{rev.comment}"
                  </p>

                  <div className="pt-3 border-top mt-auto small text-muted d-flex justify-content-between align-items-center">
                    <span>{rev.package?.packageName || rev.service?.serviceName || 'Car Detailing'}</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>

                  {rev.adminResponse && (
                    <div className="mt-3 p-2 bg-light rounded border small">
                      <strong className="text-primary d-block">Center Response:</strong>
                      <span className="text-muted">{rev.adminResponse}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <div className="col-12 text-center py-5 text-muted">
                <MessageSquare size={48} className="opacity-50 mb-2 mx-auto" />
                <h5 className="fw-bold">No reviews found</h5>
                <p className="small">Reviews can be submitted upon completing any appointment in My Bookings.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
