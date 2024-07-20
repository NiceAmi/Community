import React from "react";
import { Link } from "react-router-dom";
import '../App.css'

export const AboutComp = () => {
    return (
        <div className="about">
            <div className="headLine">
                <Link to={'/homepage'} className="custoumLogo">COMMUNITY
                    <img src="./src/assets/icons8-handshake-94.png" alt="handshake icon" style={{ width: '5%', height: '3%', marginRight: '8px' }} />
                </Link>            </div>
            <div className="container my-5">
                <h1 className="text-center mb-4">About Community Assistance Platform</h1>
                <p className="lead text-center" >
                    <div className="leadText-center">
                        <p>
                            The Community Assistance Platform is a dynamic online hub designed to foster connections and mutual support within your local neighborhood. Our mission is to bridge the gap between those seeking assistance with various life tasks and community members eager to lend a helping hand.
                        </p>
                        <p>
                            Whether you're looking for help with household chores, need assistance with technology, require temporary caregiving, or seek guidance in personal or professional development, our platform provides a safe and user-friendly environment to voice your needs. Simultaneously, we offer an opportunity for skilled individuals to contribute their expertise, time, and compassion to make a meaningful difference in their community.
                        </p>
                        <p>
                            By facilitating these connections, we aim to strengthen community bonds, promote a culture of reciprocity, and create a more resilient neighborhood where resources are shared and no one feels alone in facing life's challenges. Join us in building a stronger, more connected community — one helpful interaction at a time.
                        </p>
                    </div>
                </p>
                <p className="text-center mb-5">
                    This site was built by Ami Nice, a Full Stack Developer.
                </p>
                <div className="mb-5" id="terms">
                    <h5>Terms of Use</h5>
                    <p>Users of this website assume full responsibility for all activities related to 'Requests,' 'Offers,' and any other interactions conducted through this platform.
                        The website owner, operators, and affiliates disclaim any liability for damages, losses, or consequences arising from the use of this service. By accessing and utilizing this website, users acknowledge and accept these terms of use and the associated risks.</p>
                    <p>Back to your <Link to="/profile">Profile</Link></p>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h4>Connect with Me</h4>
                    </div>
                    <div className="card-body">
                        <ul className="list-unstyled">
                            <li>
                                GitHub: <a href="https://github.com/NiceAmi" target="_blank" rel="noopener noreferrer">ami-nice</a>
                            </li>
                            <li>
                                LinkedIn: <a href="https://www.linkedin.com/in/ami-nice-18306224/" target="_blank" rel="noopener noreferrer">ami-nice</a>
                            </li>
                        </ul>
                        <p>Email: <a href="mailto:amimakeup@gmail.com">amimakeup@gmail.com</a></p>
                        <p>Phone: <a href="tel:+972547440075">054-744-0075</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};
