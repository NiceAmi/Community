import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'

export const ReviewComp = () => {
    const { userId } = useParams();
    const currentUser = useSelector(state => state.user);
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [userRequests, setUserRequests] = useState([]);
    const [userOffers, setUserOffers] = useState([]);
    const [userReviews, setUserReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newRating, setNewRating] = useState(0);
    const [newReviewText, setNewReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        fetchUserData();
        fetchUserRequests();
        fetchUserOffers();
        fetchUserReviews();
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: currentUser.token }
            });
            setProfileUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUserRequests = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${userId}/requests`, {
                headers: { Authorization: currentUser.token }
            });
            setUserRequests(response.data);
        } catch (error) {
            console.error('Error fetching user requests:', error);
        }
    };

    const fetchUserOffers = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${userId}/offers`, {
                headers: { Authorization: currentUser.token }
            });
            setUserOffers(response.data);
        } catch (error) {
            console.error('Error fetching user offers:', error);
        }
    };

    const fetchUserReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/reviews/user/${userId}`, {
                headers: { Authorization: currentUser.token }
            });
            setUserReviews(response.data || []);
            calculateAverageRating(response.data || []);
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            setUserReviews([]);
        }
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) {
            setAverageRating(0);
            return;
        }
        const sum = reviews.reduce((acc, review) => acc + review.Rating, 0);
        setAverageRating(sum / reviews.length);
    };

    const submitReview = async () => {
        if (newRating === 0) {
            alert("Please select a rating before submitting.");
            return;
        }
        try {
            const reviewData = {
                ReviewerID: currentUser.userId,
                RevieweeID: userId,
                Rating: newRating,
                ReviewText: newReviewText
            };
            await axios.post('http://localhost:5000/api/reviews', reviewData, {
                headers: { Authorization: currentUser.token }
            });
            setNewRating(0);
            setNewReviewText('');
            fetchUserReviews();
            alert("Review submitted successfully!");
        } catch (error) {
            console.error('Error submitting review:', error);
            alert("Failed to submit review. Please try again.");
        }
    };

    const StarRating = ({ rating, hoverRating, onRate, onHoverIn, onHoverOut }) => {
        return (
            <div>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        style={{
                            cursor: 'pointer',
                            fontSize: '2rem',
                            color: (hoverRating || rating) >= star ? '#ffc107' : '#e4e5e9'
                        }}
                        onClick={() => onRate(star)}
                        onMouseEnter={() => onHoverIn(star)}
                        onMouseLeave={onHoverOut}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const navigateToMessages = () => navigate(`/messages/${userId}`);
    const navigateToRequests = () => navigate('/requests');
    const navigateToOffers = () => navigate('/offers');
    const navigateToProfile = () => navigate('/profile');

    if (!profileUser) return <div>Loading...</div>;
    const imageUrl = profileUser.ProfileImageURL
        ? `http://localhost:5000${profileUser.ProfileImageURL}`
        : 'https://via.placeholder.com/150';

    return (
        <div className='review'>
            <div className="headLine">
                <Link to={'/homepage'} className="custoumLogo">COMMUNITY
                    <img src="../src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '5%', height: '3%', marginRight: '8px' }} />
                </Link>            </div>
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card border-0 shadow">
                            <div className="card-body text-center">
                                <img
                                    src={imageUrl}
                                    alt={profileUser.Username}
                                    className="rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
                                />
                                <h3 className="mb-0">{profileUser.Username}</h3>
                                <p className="text-muted mb-4">{profileUser.Address}</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <button className="btn btn-primary" onClick={navigateToMessages}>Message</button>
                                </div>
                            </div>
                        </div>
                        <div className="card border-0 shadow mt-4">
                            <div className="card-body">
                                <h5 className="mb-3">User Details</h5>
                                <p><strong>First name:</strong> {profileUser.Fname}</p>
                                <p><strong>Last name:</strong> {profileUser.Lname}</p>
                                <p><strong>Email:</strong> {profileUser.Email}</p>
                            </div>
                        </div>
                        <div className="card border-0 shadow mb-4">
                            <div className="card-body">
                                <h5 className="mb-3">Reviews</h5>
                                <div className="d-flex align-items-center mb-4">
                                    <h2 className="me-2 mb-0">{averageRating.toFixed(1)}</h2>
                                    <div>
                                        <StarRating
                                            rating={Math.round(averageRating)}
                                            hoverRating={0}
                                            onRate={() => { }}
                                            onHoverIn={() => { }}
                                            onHoverOut={() => { }}
                                        />
                                        <p className="mb-0 text-muted">Based on {userReviews.length} reviews</p>
                                    </div>
                                </div>
                                {userReviews.length > 0 ? (
                                    userReviews.map(review => (
                                        <div key={review.ReviewID} className="mb-3 p-3 bg-light rounded">
                                            <div className="d-flex justify-content-between">
                                                <h6>{review.ReviewerUserName}</h6>
                                                <StarRating
                                                    rating={review.Rating}
                                                    hoverRating={0}
                                                    onRate={() => { }}
                                                    onHoverIn={() => { }}
                                                    onHoverOut={() => { }}
                                                />
                                            </div>
                                            <p className="mb-0">{review.ReviewText}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No reviews yet.</p>
                                )}
                            </div>
                        </div>
                        <div className="card border-0 shadow">
                            <div className="card-body">
                                <h5 className="mb-3">Add Your Review</h5>
                                <div className="mb-3">
                                    <label className="form-label">Your Rating</label>
                                    <StarRating
                                        rating={newRating}
                                        hoverRating={hoverRating}
                                        onRate={setNewRating}
                                        onHoverIn={setHoverRating}
                                        onHoverOut={() => setHoverRating(0)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Your Review</label>
                                    <textarea
                                        className="form-control"
                                        value={newReviewText}
                                        onChange={(e) => setNewReviewText(e.target.value)}
                                        placeholder="Write your review here..."
                                        rows="3"
                                    />
                                </div>
                                <button className="btn btn-primary" onClick={submitReview}>Submit Review</button>
                            </div>
                            <label htmlFor="reqOff">Back to:</label>
                            <div className="btn-group mt-2" role="group">
                                <button className="btn btn-primary" onClick={navigateToRequests}>Requests</button>
                                <button className="btn btn-primary" onClick={navigateToOffers}>Offers</button>
                                <button className="btn btn-primary" onClick={navigateToProfile}>Profile</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card border-0 shadow mb-4">
                            <div className="card-body">
                                <h5 className="mb-3">User Activity</h5>
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="requests-tab" data-bs-toggle="tab" data-bs-target="#requests" type="button" role="tab">Requests</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="offers-tab" data-bs-toggle="tab" data-bs-target="#offers" type="button" role="tab">Offers</button>
                                    </li>
                                </ul>
                                <div className="tab-content mt-3" id="myTabContent">
                                    <div className="tab-pane fade show active" id="requests" role="tabpanel">
                                        {userRequests.map(request => {
                                            console.log('Request data:', request);  
                                            return (
                                                <div key={request.RequestID} className="mb-3 p-3 bg-light rounded">
                                                    {Object.entries(request).map(([key, value]) => (
                                                        <p key={key} className="mb-1">
                                                            <strong>{key}:</strong> {value}
                                                        </p>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="tab-pane fade" id="offers" role="tabpanel">
                                        {userOffers.map(offer => {
                                            console.log('Offer data:', offer);  
                                            return (
                                                <div key={offer.OfferID} className="mb-3 p-3 bg-light rounded">
                                                    {Object.entries(offer).map(([key, value]) => {
                                                        if (key === 'CreatedAt' || key === 'UpdatedAt' || key === 'Date' || key === 'OfferDate') {
                                                            return (
                                                                <p key={key} className="mb-1">
                                                                    <strong>Date:</strong> {new Date(value).toLocaleString()}
                                                                </p>
                                                            );
                                                        }
                                                        return (
                                                            <p key={key} className="mb-1">
                                                                <strong>{key}:</strong> {value}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};