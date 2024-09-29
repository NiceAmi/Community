import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import '../App.css'

export const MessagesComp = () => {
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const [usernames, setUsernames] = useState({});
    const user = useSelector(state => state.user);
    const messages = useSelector(state => state.messages);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { receiverId } = useParams();

    useEffect(() => {
        if (!user || !user.token) {
            navigate('/login');
            return;
        }
        if (receiverId) {
            fetchMessages();
            fetchUsername(receiverId);
        } else {
            fetchConversations();
        }
    }, [receiverId, user, navigate]);

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

    const fetchConversations = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/messages/user/${user.userId}`, {
                headers: { Authorization: user.token }
            });
            console.log('API response:', response.data);
            const groupedConversations = response.data.reduce((acc, message) => {
                const otherUserId = message.SenderID === user.userId ? message.ReceiverID : message.SenderID;
                if (!acc[otherUserId]) {
                    acc[otherUserId] = [];
                }
                acc[otherUserId].push(message);
                return acc;
            }, {});
            console.log('Grouped conversations:', groupedConversations);
            setConversations(Object.entries(groupedConversations));

            Object.keys(groupedConversations).forEach(fetchUsername);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async () => {
        if (!receiverId || !user || !user.token) return;

        try {
            const response = await axios.get(
                `http://localhost:5000/api/messages/between/${user.userId}/${receiverId}`,
                { headers: { Authorization: user.token } }
            );

            if (Array.isArray(response.data)) {
                dispatch({ type: 'SET_MESSAGES', payload: response.data });
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!receiverId || !user || !user.token) return;

        const messageData = {
            SenderID: user.userId,
            ReceiverID: parseInt(receiverId),
            MessageText: newMessage,
            TIMESTAMP: new Date().toISOString()
        };

        dispatch({ type: 'ADD_MESSAGE', payload: messageData });
        setNewMessage('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/messages',
                messageData,
                {
                    headers: {
                        Authorization: user.token,
                        'Content-Type': 'application/json'
                    }
                }
            );
            dispatch({ type: 'UPDATE_MESSAGE', payload: response.data });
        } catch (error) {
            console.error("Error sending message:", error);
            dispatch({ type: 'REMOVE_LAST_MESSAGE' });
        }
    };

    const profile = () => {
        navigate('/profile');
    };


    return (
        <div className="d-flex flex-column" style={{ height: 'calc(100vh - 56px)' }}>
            <div className="flex-grow-1 overflow-hidden">
                <div className="container-fluid h-100 p-0">
                    <div className="row h-100 g-0">
                        <div className="col-md-4 border-end bg-light overflow-auto h-100">
                            <div className="headLine">
                                <Link to={'/homepage'} className="custoumLogo">COMMUNITY
                                    <img src="../src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '12%', height: '3%', marginRight: '8px' }} />
                                </Link>            </div>
                            <div className="p-4">

                                <h2 className="mb-4 text-primary fw-bold">
                                    <i className="bi bi-chat-dots-fill me-2"></i>Conversations
                                </h2>
                                {console.log('All conversations:', conversations)}
                                {conversations
                                    .sort(([, messagesA], [, messagesB]) => {
                                        const timeA = messagesA.length ? new Date(messagesA[0].TIMESTAMP).getTime() : 0;
                                        const timeB = messagesB.length ? new Date(messagesB[0].TIMESTAMP).getTime() : 0;
                                        return timeB - timeA;
                                    })
                                    .map(([otherUserId, messages]) => {
                                        console.log(`Rendering conversation for ${otherUserId}:`, messages);
                                        const latestMessage = messages.length > 0 ? messages[0] : null;
                                        return (
                                            <div
                                                key={otherUserId}
                                                className={`d-flex align-items-center mb-3 p-3 bg-white rounded shadow-sm transition-hover ${receiverId === otherUserId ? 'border-primary border' : ''}`}
                                                onClick={() => navigate(`/messages/${otherUserId}`)}
                                                style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center" style={{ width: '50px', height: '50px' }}>
                                                        <span className="text-white fw-bold">{(usernames[otherUserId] || `User ${otherUserId}`).charAt(0).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6 className="mb-0 fw-bold">{usernames[otherUserId] || `User ${otherUserId}`}</h6>
                                                    <p className="mb-0 text-muted small text-truncate" style={{ maxWidth: '200px' }}>
                                                        {latestMessage ? latestMessage.MessageText : 'No messages yet'}
                                                    </p>
                                                </div>
                                                <div className="text-muted small">
                                                    {latestMessage ? new Date(latestMessage.TIMESTAMP).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        <div className="col-md-8 d-flex flex-column h-100">
                            {receiverId ? (
                                <>
                                    <div className="p-4 border-bottom bg-white">
                                        <h3 className="mb-0 fw-bold d-flex align-items-center">
                                            <div className="bg-primary rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: '40px', height: '40px' }}>
                                                <span className="text-white">{(usernames[receiverId] || `User ${receiverId}`).charAt(0).toUpperCase()}</span>
                                            </div>
                                            {usernames[receiverId] || `User ${receiverId}`}
                                        </h3>
                                    </div>

                                    <div className="flex-grow-1 p-4 overflow-auto">
    {messages
        .filter(message => 
            (message.SenderID === user.userId && message.ReceiverID === parseInt(receiverId)) ||
            (message.SenderID === parseInt(receiverId) && message.ReceiverID === user.userId)
        )
        .slice(0).reverse().map((message, index) => (
            <div key={index} className={`d-flex ${message.SenderID === user.userId ? "justify-content-end" : "justify-content-start"} mb-3`}>
                <div 
                    className={`p-3 rounded-3 shadow-sm ${message.SenderID === user.userId ? "bg-primary text-white" : "bg-light"}`}
                    style={{maxWidth: '75%'}}
                >
                    <div className="d-flex align-items-center mb-2">
                        <div className={`rounded-circle me-2 ${message.SenderID === user.userId ? "bg-white" : "bg-primary"}`} 
                             style={{width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <span className={`fw-bold ${message.SenderID === user.userId ? "text-primary" : "text-white"}`} style={{fontSize: '12px'}}>
                                {(message.SenderID === user.userId ? user.Username : usernames[receiverId])?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className={`fw-bold ${message.SenderID === user.userId ? "text-white" : "text-primary"}`} style={{fontSize: '0.9rem'}}>
                            {message.SenderID === user.userId ? user.Username : usernames[receiverId]}
                        </span>
                    </div>
                    <p className="mb-0">{message.MessageText || message.MessageTEXT}</p>
                    <small className={`d-block mt-2 ${message.SenderID === user.userId ? "text-white-50" : "text-muted"}`}>
                        {message.TIMESTAMP && new Date(message.TIMESTAMP).toLocaleString()}
                    </small>
                </div>
            </div>
        ))
    }
</div>

                                    <div className="p-4 border-top bg-white">
                                        <form onSubmit={sendMessage}>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control border-primary"
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    placeholder="Type your message..."
                                                    required
                                                />
                                                <button className="btn btn-primary" type="submit">
                                                    <i className="bi bi-send-fill me-2"></i>Send
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex justify-content-center align-items-center h-100">
                                    <div className="text-center">
                                        <i className="bi bi-chat-text text-primary" style={{ fontSize: '5rem' }}></i>
                                        <h3 className="mt-3">Select a conversation to start messaging</h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                Back to your <a href="#" onClick={profile}>Profile</a>.
            </div>
        </div>
    );
};
