import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'

export const RequestsComp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const requests = useSelector(state => state.requests);
    const user = useSelector(state => state.user);
    const [newRequest, setNewRequest] = useState({ Category: '', RequestName: "", Description: '', Location: '', StreetNumber: '' });
    const [usernames, setUsernames] = useState({});
    const [sortBy, setSortBy] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = [
        'Home Repair and Maintenance',
        'Childcare',
        'Transportation',
        'Food and Meals',
        'Pet Care',
        'Garden and Yard Work',
        'Tutoring and Education',
        'Elderly Care and Companionship',
        'Outdoor Adventure Groups',
        'Grocery Assistance'
    ];

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        setFilteredItems(requests);
    }, [requests]);

    useEffect(() => {
        filteredItems.forEach(request => {
            if (!usernames[request.UserID]) {
                fetchUsername(request.UserID);
            }
        });
    }, [filteredItems]);

    const fetchRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/requests', {
                headers: { Authorization: user.token }
            });
            dispatch({ type: 'SET_REQUESTS', payload: response.data });
        } catch (error) {
            console.error('Error fetching requests:', error);
            alert('Failed to fetch requests. Please try again.');
        }
    };

    const fetchUsername = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: user.token }
            });
            setUsernames(prev => ({ ...prev, [userId]: response.data.Username }));
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRequest(prev => ({ ...prev, [name]: value }));
    };

    const simplifyAddress = (displayName) => {
        const parts = displayName.split(', ');
        const relevantParts = parts.filter(part =>
            !part.includes('נפת') &&
            !(/^\d+$/.test(part)) &&
            part !== 'residential: highway'
        );
        return relevantParts.join(', ');
    };

    const removeDuplicates = (suggestions) => {
        const uniqueAddresses = new Map();
        suggestions.forEach(suggestion => {
            const simplifiedAddress = simplifyAddress(suggestion.display_name);
            if (!uniqueAddresses.has(simplifiedAddress)) {
                uniqueAddresses.set(simplifiedAddress, suggestion);
            }
        });
        return Array.from(uniqueAddresses.values());
    };

    const fetchAddressSuggestions = useCallback(
        async (query) => {
            if (query.length < 3) {
                setAddressSuggestions([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
                );
                const uniqueSuggestions = removeDuplicates(response.data);
                setAddressSuggestions(uniqueSuggestions);
            } catch (err) {
                setError('Failed to fetch address suggestions');
                console.error('Error fetching address suggestions:', err);
            } finally {
                setIsLoading(false);
            }
        },[]
    );

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setNewRequest(prev => ({ ...prev, Location: value }));
        fetchAddressSuggestions(value);
    };

    const handleSuggestionClick = (suggestion) => {
        const simplifiedAddress = simplifyAddress(suggestion.display_name);
        setNewRequest(prev => ({
            ...prev,
            Location: simplifiedAddress
        }));
        setAddressSuggestions([]);
    };

    const createRequest = async (e) => {
        e.preventDefault();
        if (!newRequest.Category || !newRequest.RequestName || !newRequest.Description || !newRequest.Location || !newRequest.StreetNumber) {
            alert("Please fill in all fields.");
            return;
        }
        const fullAddress = `${newRequest.StreetNumber} ${newRequest.Location}`;
        try {
            const response = await axios.post('http://localhost:5000/api/requests',
                { ...newRequest, Location: fullAddress, UserID: user.userId, Status: 'Open' },
                { headers: { Authorization: user.token } }
            );
            if (response.data.message === 'Request created successfully') {
                alert('Request created successfully');
                setNewRequest({ Category: '', RequestName: "", Description: '', Location: '', StreetNumber: '' });
                fetchRequests();
            }
        } catch (error) {
            console.error('Error creating request:', error);
            alert('Failed to create request');
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('userData');
        navigate('/login');
    };

    const offers = () => navigate('/offers');
    const profile = () => navigate('/profile');

    const navigateToMessages = (userId) => {
        navigate(`/messages/${userId}`);
    };

    const handleSort = (e) => {
        const value = e.target.value;
        setSortBy(value);
        let sorted = [...filteredItems];
        if (value === 'category') {
            sorted.sort((a, b) => a.Category.localeCompare(b.Category));
        } else if (value === 'location') {
            sorted.sort((a, b) => a.Location.localeCompare(b.Location));
        }
        setFilteredItems(sorted);
    };

    return (
        <div className='req'>
            <div className="headLine">
                <Link to={'/homepage'} className="custoumLogo">COMMUNITY
                    <img src="./src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '5%', height: '3%', marginRight: '8px' }} />
                </Link>            </div>
            <div className="container">
                <h1 className="my-4">Requests</h1>
                <form onSubmit={createRequest} className="mb-4">
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="Category"
                            value={newRequest.Category}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Request Name</label>
                        <input
                            type="text"
                            name="RequestName"
                            value={newRequest.RequestName}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Request Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="Description"
                            value={newRequest.Description}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Description"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="Location"
                            value={newRequest.Location}
                            onChange={handleLocationChange}
                            className="form-control"
                            placeholder="Enter location"
                            required
                        />
                        {isLoading && <p>Loading suggestions...</p>}
                        {error && <p className="text-danger">{error}</p>}
                        {addressSuggestions.length > 0 && (
                            <ul className="list-group mt-2">
                                {addressSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.place_id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {simplifyAddress(suggestion.display_name)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Street Number</label>
                        <input
                            type="text"
                            name="StreetNumber"
                            value={newRequest.StreetNumber}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter street number"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Create Request</button>
                </form>
                <div className="form-group mb-3">
                    <label>Sort by:</label>
                    <select
                        className="form-control"
                        value={sortBy}
                        onChange={handleSort}
                    >
                        <option value="">None</option>
                        <option value="category">Category</option>
                        <option value="location">Location</option>
                    </select>
                </div>
                <div className="row">
                    {filteredItems.length > 0 ? (
                        filteredItems.map(request => (
                            <div key={request.RequestID} className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title"><strong>Category: </strong>  {request.Category}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted"><strong>Request Name: </strong> {request.RequestName}</h6>
                                        <p className="card-text"><strong>Description: </strong>{request.Description}</p>
                                        <p className="card-text"><strong>Location: </strong>{request.Location}</p>
                                        <p className="card-text"><strong>Status: </strong>{request.Status}</p>
                                        <p className="card-text"><strong>Posted by: </strong>
                                            {usernames[request.UserID] ? (
                                                <Link to={`/profile/${request.UserID}`}>{usernames[request.UserID]}</Link>
                                            ) : (
                                                'Loading...'
                                            )}
                                        </p>
                                        <button className="btn btn-primary" onClick={() => navigateToMessages(request.UserID)}>
                                            Message User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No requests found.</p>
                    )}
                </div>
                <div className="btn-group mt-3" role="group">
                    <button className="btn btn-primary" onClick={offers}>Offers</button>
                    <button className="btn btn-primary" onClick={profile}>Profile</button>
                    <button className="btn btn-danger" onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    );
};
