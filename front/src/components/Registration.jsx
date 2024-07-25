import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'

export const RegistrationComp = () => {
    const navigate = useNavigate();
    const URL = 'http://localhost:5000/api/auth/register';
    const [newUser, setNewUser] = useState({
        Username: "",
        Fname: "",
        Lname: "",
        Address: "",
        StreetNumber: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
    });
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const simplifyAddress = (displayName) => {
        const parts = displayName.split(', ');
        const relevantParts = parts.filter(part =>
            !part.includes('נפת') &&
            !(/^\d+$/.test(part)) &&
            part !== 'residential: highway'
        );
        return relevantParts.join(', ');
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

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setNewUser(prevUser => ({ ...prevUser, Address: value }));
        fetchAddressSuggestions(value);
    };

    const handleSuggestionClick = (suggestion) => {
        const simplifiedAddress = simplifyAddress(suggestion.display_name);
        setNewUser(prevUser => ({
            ...prevUser,
            Address: simplifiedAddress
        }));
        setAddressSuggestions([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const createNewUser = async () => {
        if (
            !newUser.Username ||
            !newUser.Fname ||
            !newUser.Lname ||
            !newUser.Address ||
            !newUser.StreetNumber ||
            !newUser.Email ||
            !newUser.Password ||
            !newUser.ConfirmPassword
        ) {
            alert("Please fill in all fields.");
            return;
        }

        if (newUser.Password !== newUser.ConfirmPassword) {
            alert("Passwords do not match. Please re-enter.");
            return;
        }

        try {
            console.log("Sending user data:", newUser);
            const fullAddress = `${newUser.StreetNumber} ${newUser.Address}`;
            const response = await axios.post(URL, { ...newUser, Address: fullAddress });
            console.log("Server response:", response);

            if (response.data.token) {
                alert("User Created Successfully!");
                navigate('/login');
            } else {
                alert(response.data.message || "User creation failed");
            }
        } catch (error) {
            console.error("Error registering user:", error);

            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
                alert(`Registration failed: ${error.response.data.message || "Unknown error"}`);
            } else if (error.request) {
                console.error("Request:", error.request);
                alert("No response received from server. Please try again later.");
            } else {
                console.error("Error:", error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className='registration'>
            <div className="headLine">
                <Link to={'/homepage'} className="custoumLogo">COMMUNITY
                    <img src="./src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '5%', height: '3%', marginRight: '8px' }} />
                </Link>            </div>
            <div className="container mt-5">
                <h1 className="mb-4">Register</h1>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="Username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Username"
                            name="Username"
                            placeholder="Type your username..."
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Fname" className="form-label">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Fname"
                            name="Fname"
                            placeholder="Type your first name..."
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Lname" className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Lname"
                            name="Lname"
                            placeholder="Type your last name..."
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Address" className="form-label">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Address"
                            name="Address"
                            placeholder="Type your address..."
                            value={newUser.Address}
                            onChange={handleAddressChange}
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
                    <div className="col-md-6">
                        <label htmlFor="StreetNumber" className="form-label">Street Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="StreetNumber"
                            name="StreetNumber"
                            placeholder="Type your street number..."
                            value={newUser.StreetNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="Email"
                            name="Email"
                            placeholder="Type your email..."
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="Password"
                            name="Password"
                            placeholder="Type your password..."
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="ConfirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="ConfirmPassword"
                            name="ConfirmPassword"
                            placeholder="Retype your password..."
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-md-12">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={createNewUser}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};
