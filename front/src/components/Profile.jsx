import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export const ProfileComp = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [userOffers, setUserOffers] = useState([]);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const categories = ['Home Repair and Maintenance', 'Childcare', 'Transportation', 'Food and Meals', 'Pet Care',
    'Garden and Yard Work', 'Tutoring and Education', 'Elderly Care and Companionship', 'Outdoor Adventure Groups', 'Grocery Assistance'];

  const statuses = ['Open', 'Closed'];

  useEffect(() => {
    if (!user) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        navigate('/login');
      } else {
        dispatch({ type: 'LOGIN', payload: userData });
      }
    } else {
      fetchUserRequests();
      fetchUserOffers();
      fetchUnreadMessageCount();
    }
  }, [user, navigate, dispatch]);

  const fetchUserRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user.userId}/requests`, {
        headers: { Authorization: user.token }
      });
      setUserRequests(response.data);
    } catch (error) {
      console.error('Error fetching user requests:', error);
    }
  };

  const fetchUserOffers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user.userId}/offers`, {
        headers: { Authorization: user.token }
      });
      setUserOffers(response.data);
    } catch (error) {
      console.error('Error fetching user offers:', error);
    }
  };

  const fetchUnreadMessageCount = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/unread/${user.userId}`, {
        headers: { Authorization: user.token }
      });
      setUnreadMessageCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread message count:', error);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    setProfileImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axios.post(`http://localhost:5000/api/users/${user.userId}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': user.token
        }
      });
      const updatedUser = { ...user, profileImage: response.data.imageUrl };
      dispatch({ type: 'UPDATE_PROFILE_IMAGE', payload: response.data.imageUrl });
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to upload image', error);
    }
  };

  const handleUpdateRequest = async (requestId, updatedData) => {
    try {
      const dataToUpdate = {
        ...updatedData,
        UserID: user.userId
      };

      await axios.put(`http://localhost:5000/api/requests/${requestId}`, dataToUpdate, {
        headers: { Authorization: user.token }
      });
      alert("Request updated successfully");
      fetchUserRequests();
      setEditingRequestId(null);
    } catch (error) {
      console.error('Error updating request:', error.response ? error.response.data : error);
      alert("Failed to update request");
    }
  };

  const handleUpdateOffer = async (offerId, updatedData) => {
    try {
      const dataToUpdate = {
        ...updatedData,
        UserID: user.userId
      };

      await axios.put(`http://localhost:5000/api/offers/${offerId}`, dataToUpdate, {
        headers: { Authorization: user.token }
      });
      alert("Offer updated successfully");
      fetchUserOffers();
      setEditingOfferId(null);
    } catch (error) {
      console.error('Error updating offer:', error.response ? error.response.data : error.message);
      alert("Failed to update offer");
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/${requestId}`, {
        headers: { Authorization: user.token }
      });
      alert("Request deleted successfully");
      fetchUserRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert("Failed to delete request");
    }
  };

  const deleteOffer = async (offerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/offers/${offerId}`, {
        headers: { Authorization: user.token }
      });
      alert("Offer deleted successfully");
      fetchUserOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      alert("Failed to delete offer");
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const navigateToRequests = () => navigate('/requests');
  const navigateToOffers = () => navigate('/offers');
  const navigateToMessages = () => navigate('/messages');

  const renderRequestCard = (request) => (
    <div key={request.RequestID} className="card mb-3">
      <div className="card-body">
        {editingRequestId === request.RequestID ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateRequest(request.RequestID, {
              Category: e.target.Category.value,
              RequestName: e.target.RequestName.value,
              Description: e.target.Description.value,
              Location: e.target.Location.value,
              Status: e.target.Status.value
            });
          }}>
            <div className="mb-3">
              <label htmlFor="Category" className="form-label">Category</label>
              <select className="form-select" name="Category" id="Category" defaultValue={request.Category}>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="RequestName" className="form-label">Request Name</label>
              <input type="text" className="form-control" name="RequestName" id="RequestName" defaultValue={request.RequestName} />
            </div>
            <div className="mb-3">
              <label htmlFor="Description" className="form-label">Description</label>
              <textarea className="form-control" name="Description" id="Description" defaultValue={request.Description}></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="Location" className="form-label">Location</label>
              <input type="text" className="form-control" name="Location" id="Location" defaultValue={request.Location} />
            </div>
            <div className="mb-3">
              <label htmlFor="Status" className="form-label">Status</label>
              <select className="form-select" name="Status" id="Status" defaultValue={request.Status}>
                {statuses.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary me-2">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingRequestId(null)}>Cancel</button>
          </form>
        ) : (
          <>
            {Object.entries(request).map(([key, value]) => (
              <p key={key} className="card-text">
                <strong>{key}:</strong> {value}
              </p>
            ))}
            <button className="btn btn-primary me-2" onClick={() => setEditingRequestId(request.RequestID)}>Edit</button>
            <button className="btn btn-danger" onClick={() => deleteRequest(request.RequestID)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );

  const renderOfferCard = (offer) => (
    <div key={offer.OfferID} className="card mb-3">
      <div className="card-body">
        {editingOfferId === offer.OfferID ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateOffer(offer.OfferID, {
              Category: e.target.Category.value,
              OfferName: e.target.OfferName.value,
              Description: e.target.Description.value,
              Location: e.target.Location.value,
              Status: e.target.Status.value
            });
          }}>
            <div className="mb-3">
              <label htmlFor="Category" className="form-label">Category</label>
              <select className="form-select" name="Category" id="Category" defaultValue={offer.Category}>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="OfferName" className="form-label">Offer Name</label>
              <input type="text" className="form-control" name="OfferName" id="OfferName" defaultValue={offer.OfferName} />
            </div>
            <div className="mb-3">
              <label htmlFor="Description" className="form-label">Description</label>
              <textarea className="form-control" name="Description" id="Description" defaultValue={offer.Description}></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="Location" className="form-label">Location</label>
              <input type="text" className="form-control" name="Location" id="Location" defaultValue={offer.Location} />
            </div>
            <div className="mb-3">
              <label htmlFor="Status" className="form-label">Status</label>
              <select className="form-select" name="Status" id="Status" defaultValue={offer.Status}>
                {statuses.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary me-2">Save</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingOfferId(null)}>Cancel</button>
          </form>
        ) : (
          <>
            {Object.entries(offer).map(([key, value]) => (
              <p key={key} className="card-text">
                <strong>{key}:</strong> {value}
              </p>
            ))}
            <button className="btn btn-primary me-2" onClick={() => setEditingOfferId(offer.OfferID)}>Edit</button>
            <button className="btn btn-danger" onClick={() => deleteOffer(offer.OfferID)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );

  if (!user) return null;
  const imageUrl = user.ProfileImageURL ? `http://localhost:5000${user.ProfileImageURL}` : null;

  return (
    <div className='profile'>
      <div className="headLine">
        <Link to={'/homepage'} className="custoumLogo">COMMUNITY
          <img src="./src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '5%', height: '3%', marginRight: '8px' }} />
        </Link>            </div>
      <div className="container mt-5">
        <h1 className="mb-4">Hello, {user.Username}</h1>
        <div className="row">
          <div className="col-md-4 text-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
            ) : (
              <p>No Image</p>
            )}
            <input type="file" className="form-control" onChange={uploadImage} accept="image/*" />
          </div>
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-body" id='userCard'>
                <p><strong>Username:</strong> {user.Username}</p>
                <p><strong>First name:</strong> {user.Fname}</p>
                <p><strong>Last name:</strong> {user.Lname}</p>
                <p><strong>Address:</strong> {user.Address}</p>
                <p><strong>Email:</strong> {user.Email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card mb-3">
          <div className="card-body">
            <h3>Messages</h3>
            {unreadMessageCount > 0 && (
              <p>You have {unreadMessageCount} unread messages</p>
            )}
            <button className="btn btn-primary" onClick={navigateToMessages}>View Messages</button>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4" id='mainBtn'>
          <button className="btn btn-outline-primary fw-bold mx-3 py-3 px-5 rounded-5 hover-fill fs-4" onClick={navigateToRequests}>Requests</button>
          <button className="btn btn-outline-success fw-bold mx-3 py-3 px-5 rounded-5 hover-fill fs-4" onClick={navigateToOffers}>Offers</button>
          <button className="btn btn-outline-info fw-bold mx-3 py-3 px-5 rounded-5 hover-fill fs-4" onClick={navigateToMessages}>Messages</button>
          <button className="btn btn-outline-danger fw-bold mx-3 py-3 px-5 rounded-5 hover-fill fs-4" onClick={logout}>Logout</button>
        </div>
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="card-title mb-0">Your Activity</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h4 className="mb-3">Your Requests</h4>
                {userRequests.length > 0 ? (
                  userRequests.map(request => renderRequestCard(request))
                ) : (
                  <p>No requests found.</p>
                )}
              </div>
              <div className="col-md-6">
                <h4 className="mb-3">Your Offers</h4>
                {userOffers.length > 0 ? (
                  userOffers.map(offer => renderOfferCard(offer))
                ) : (
                  <p>No offers found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
