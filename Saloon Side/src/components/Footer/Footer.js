import React from "react";
import "./Footer.css";
import logo from "../../assets/logo.png"; // Replace with your logo path
import galleryImage1 from "../../assets/gallery1.jpg"; // Replace with actual paths
import galleryImage2 from "../../assets/gallery2.jpg"; // Replace with actual paths
import galleryImage3 from "../../assets/gallery3.jpg"; // Replace with actual paths
import galleryImage4 from "../../assets/gallery4.png"; // Replace with actual paths
import galleryImage5 from "../../assets/gallery5.jpg"; // Replace with actual paths
import galleryImage6 from "../../assets/gallery6.jpg"; // Replace with actual paths
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src={logo} alt="Glam The Girl Logo" />
          </div>
          <p>
            <strong>Glam The Girl</strong> is a premium Glam The Girl that redefines elegance with unmatched services in hairstyling, makeup, and skincare. Experience luxury, expertise, and personalized care in every visit.
          </p>
        </div>
        <div className="footer-gallery">
          <h3>Our Gallery</h3>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src={galleryImage1} alt="Salon Experience 1" />
            </div>
            <div className="gallery-item">
              <img src={galleryImage2} alt="Salon Experience 2" />
            </div>
            <div className="gallery-item">
              <img src={galleryImage3} alt="Salon Experience 3" />
            </div>
            <div className="gallery-item">
              <img src={galleryImage4} alt="Salon Experience 4" />
            </div>
            <div className="gallery-item">
              <img src={galleryImage5} alt="Salon Experience 5" />
            </div>
            <div className="gallery-item">
              <img src={galleryImage6} alt="Salon Experience 6" />
            </div>
          </div>
        </div>
        <div className="footer-social">
  <h3>Follow Us</h3>
  <p>Stay connected with us on social media for the latest updates, offers, and beauty tips. Join our community of beauty enthusiasts!</p>
  <div className="social-icons">
    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
    <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest"></i></a>
    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
  </div>
  <div className="footer-community">
    <p><strong>Trending Hashtags:</strong> #GlamTheGirl #BeautyRedefined #SalonExperience</p>
    <p>Subscribe to our newsletter for exclusive updates and offers!</p>
  </div>
</div>

      </div>
      <div className="footer-bottom">
        <p>© 2024 Glam The Girl. All rights reserved. Designed with ❤️ for beauty enthusiasts.</p>
      </div>
    </footer>
  );
};

export default Footer;
