import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import '../App.css'


export const LoginComp = () => {
    const navigate = useNavigate();
    const URL = 'http://localhost:5000/api/auth/login';
    const [user, setUser] = useState({ Username: '', Password: '' });
    const dispatch = useDispatch();

    const setUserDetails = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const login = async () => {
        if (!user.Username || !user.Password) {
            alert('Please fill all the fields');
            return;
        }

        try {
            console.log('Sending login request with data:', {
                Username: user.Username,
                Password: user.Password
            });

            const response = await axios.post(URL, {
                Username: user.Username,
                Password: user.Password
            });

            console.log('Server response:', response.data);

            if (response.data.token) {
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        userId: response.data.userId,
                        Username: response.data.Username,
                        Fname: response.data.Fname,
                        Lname: response.data.Lname,
                        Address: response.data.Address,
                        Email: response.data.Email,
                        token: response.data.token,
                        ProfileImageURL: response.data.ProfileImageURL
                    }
                });
                localStorage.setItem("userData", JSON.stringify(response.data));
                alert('User logged in successfully');
                navigate('/profile');
            } else {
                alert(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                alert(`Login failed: ${error.response.data.message || 'Unknown error'}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                alert("No response received from server. Please try again later.");
            } else {
                console.error('Error:', error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const register = () => {
        navigate('/register');
    };

    const homePage = () => {
        navigate('/')
    };

    return (
        <div className='login'>
            <div className="headLine">
                <Link to={'/homepage'} className="custoumLogo">COMMUNITY
                    <img src="./src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '5%', height: '3%', marginRight: '8px' }} />
                </Link>            </div>
            <div className="container mt-5">
                <h1 className="mb-4">Login</h1>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="Username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Username"
                            name="Username"
                            placeholder="Type your Username..."
                            value={user.Username}
                            onChange={setUserDetails}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="Password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="Password"
                            name="Password"
                            placeholder="Type your Password..."
                            value={user.Password}
                            onChange={setUserDetails}
                        />
                    </div>
                    <div className="col-12">
                        <button type="button" className="btn btn-primary" onClick={login}>Login</button>
                        <p className="mt-3">Don't have an account yet? Please <a href="#" onClick={register}>register</a>.</p>
                        <p className="mt-3">Return to Home Page <a href="#" onClick={homePage}>Home Page</a>.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};
