import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import '../App.css'

export const OffersComp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const offers = useSelector(state => state.offers);
    const user = useSelector(state => state.user);
    const [newOffer, setNewOffer] = useState({
        Category: '',
        OfferName: "",
        Description: '',
        Location: '',
        StreetNumber: ''
    });
    const [usernames, setUsernames] = useState({});
    const [sortBy, setSortBy] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const categories = ['Home Repair and Maintenance', 'Childcare', 'Transportation', 'Food and Meals', 'Pet Care',
        'Garden and Yard Work', 'Tutoring and Education', 'Elderly Care and Companionship', 'Outdoor Adventure Groups', 'Grocery Assistance'];

    useEffect(() => {
        fetchOffers();
    }, []);

    useEffect(() => {
        setFilteredItems(offers);
    }, [offers]);

    useEffect(() => {
        filteredItems.forEach(offer => {
            if (!usernames[offer.UserID]) {
                fetchUsername(offer.UserID);
            }
        });
    }, [filteredItems]);

    const fetchOffers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/offers', {
                headers: { Authorization: user.token }
            });
            dispatch({ type: 'SET_OFFERS', payload: response.data });
        } catch (error) {
            console.error('Error fetching offers:', error);
            alert('Failed to fetch offers. Please try again.');
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
        setNewOffer(prev => ({ ...prev, [name]: value }));
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
        setNewOffer(prev => ({ ...prev, Location: value }));
        fetchAddressSuggestions(value);
    };

    const handleSuggestionClick = (suggestion) => {
        const simplifiedAddress = simplifyAddress(suggestion.display_name);
        setNewOffer(prev => ({
            ...prev,
            Location: simplifiedAddress
        }));
        setAddressSuggestions([]);
    };

    const createOffer = async (e) => {
        e.preventDefault();
        if (!newOffer.Category || !newOffer.OfferName || !newOffer.Description || !newOffer.Location || !newOffer.StreetNumber) {
            alert("Please fill in all fields.");
            return;
        }
        const fullAddress = `${newOffer.StreetNumber} ${newOffer.Location}`;
        try {
            const response = await axios.post('http://localhost:5000/api/offers',
                { ...newOffer, Location: fullAddress, UserID: user.userId, Status: 'Open' },
                { headers: { Authorization: user.token } }
            );
            if (response.data.message === 'Offer created successfully') {
                alert('Offer created successfully');
                setNewOffer({ Category: '', OfferName: "", Description: '', Location: '', StreetNumber: '' });
                fetchOffers();
            }
        } catch (error) {
            console.error('Error creating offer:', error);
            alert('Failed to create offer');
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('userData');
        navigate('/login');
    };

    const requests = () => navigate('/requests');
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
        <div className="offers">
            <div className="headLine">
                <Link to={'/homepage'} className="custoumLogo">COMMUNITY
                    <img src="./src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '5%', height: '3%', marginRight: '8px' }} />
                </Link>            </div>
            <div className="container">
                <h1 className="my-4">Offers</h1>

                <form onSubmit={createOffer} className="mb-4">
                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="Category"
                            value={newOffer.Category}
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
                        <label>Offer Name</label>
                        <input
                            type="text"
                            name="OfferName"
                            value={newOffer.OfferName}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Offer Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="Description"
                            value={newOffer.Description}
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
                            value={newOffer.Location}
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
                            value={newOffer.StreetNumber}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter street number"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Create Offer</button>
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
                        filteredItems.map(offer => (
                            <div key={offer.OfferID} className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title"><strong>Category: </strong> {offer.Category}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted"><strong>Offer Name: </strong>{offer.OfferName}</h6>
                                        <p className="card-text"><strong>Description: </strong>Description: {offer.Description}</p>
                                        <p className="card-text"><strong>Location: </strong>{offer.Location}</p>
                                        <p className="card-text"><strong>Status: </strong>{offer.Status}</p>
                                        <p className="card-text"><strong>Posted by: </strong>
                                            {usernames[offer.UserID] ? (
                                                <Link to={`/profile/${offer.UserID}`}> {usernames[offer.UserID]}</Link>
                                            ) : (
                                                'Loading...'
                                            )}
                                        </p>
                                        <button className="btn btn-primary" onClick={() => navigateToMessages(offer.UserID)}>
                                            Message User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No offers found.</p>
                    )}
                </div>
                <div className="btn-group mt-3" role="group">
                    <button className="btn btn-primary" onClick={requests}>Requests</button>
                    <button className="btn btn-primary" onClick={profile}>Profile</button>
                    <button className="btn btn-danger" onClick={logout}>Logout</button>
                </div>
            </div>
        </div>
    );
};