import { useNavigate, Link } from "react-router-dom";
import '../App.css'

export const HomePageComp = () => {
    const navigate = useNavigate();
    const register = () => navigate('/register');
    const login = () => navigate('/login');

    return (
        <div className="full-width">
            <div className="headLine">
            <Link to={'/homepage'} className="custoumLogo">COMMUNITY
                    <img src="./src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '5%', height: '3%', marginRight: '8px' }} />
                </Link>            </div>
            <div className="container text-center mt-5" id="homeTxt">
                <h1 className="display-4 mb-4">Welcome to the Community Assistance Platform!</h1>
                <div className="lead mb-5" id="txtPage">
                    <p>Welcome to your local community's hub for mutual support and collaboration.</p>
                    <p>Whether you're seeking assistance or have skills to share,</p>
                    <p>this platform connects neighbors and strengthens our community bonds.</p>
                    <p>Join us in creating a network of local support,</p>
                    <p>where every skill shared and every need met</p>
                    <p>contributes to a more resilient and connected neighborhood.</p>
                </div>  
                <p style={{ fontSize: 'large' }}>Please register for our community, or if you are already a member, please login</p>
                <div className="btn-group">
                    <button className="btn btn-primary btn-lg mx-2" onClick={register}>Register</button>
                    <button className="btn btn-secondary btn-lg mx-2" onClick={login}>Login</button>
                </div>
            </div>
        </div>
    );
};