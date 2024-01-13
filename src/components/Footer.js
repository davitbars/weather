import React from 'react';
import '../styles/Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p>Built with <a href='https://openweathermap.org/' target="_blank" rel="noopener noreferrer">OpenWeatherMap API  <FontAwesomeIcon icon={faExternalLinkAlt} /></a></p>
                <p>&copy; 2024 Davit's Weather App</p>
                <p>Contact: davitbarseg@gmail.com</p>
            </div>
        </footer>
    );
};

export default Footer;
