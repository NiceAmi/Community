const initialState = {
    user: JSON.parse(localStorage.getItem('userData')) || null,
    users: [],
    requests: [],
    offers: [],
    reviews: [],
    messages: []
};

export const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('userData', JSON.stringify(action.payload));
            return { ...state, user: action.payload };

        case 'LOGOUT':
            localStorage.removeItem('userData');
            return { ...state, user: null };

        case 'UPDATE_PROFILE_IMAGE':
            const updatedUser = { ...state.user, ProfileImageURL: action.payload };
            localStorage.setItem('userData', JSON.stringify(updatedUser));
            return { ...state, user: updatedUser };

        case 'SET_USERS':
            return { ...state, users: action.payload };

        case 'SET_REQUESTS':
            return { ...state, requests: Array.isArray(action.payload) ? action.payload : [] };

        case 'SET_OFFERS':
            return { ...state, offers: Array.isArray(action.payload) ? action.payload : [] };

        case 'SET_REVIEWS':
            return { ...state, reviews: Array.isArray(action.payload) ? action.payload : [] };

        case 'SET_MESSAGES':
            console.log('SET_MESSAGES action received:', action.payload);
            return { ...state, messages: Array.isArray(action.payload) ? action.payload : [] };

        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };

        case 'UPDATE_MESSAGE':
            const updatedMessage = action.payload;
            const updatedMessages = [
                updatedMessage,
                ...state.messages.filter(msg => !(msg.SenderID === updatedMessage.SenderID &&
                    msg.ReceiverID === updatedMessage.ReceiverID &&
                    msg.MessageText === updatedMessage.MessageText))
            ];
            return { ...state, messages: updatedMessages };

        case 'REMOVE_LAST_MESSAGE':
            const slicedMessages = state.messages.slice(0, -1);
            return { ...state, messages: slicedMessages };

        default:
            return state;
    }
};