import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      {/* Who We Are Section */}
      <div className="container section">
        <h3 className="text-center animate-header hotpink-text">
          <span className="highlight-border">Who We Are ?</span>
        </h3>
        <div className="row align-items-center mt-4">
          <div className="col-12 col-sm-6 animate-fade">
            <p className="about-text">
              Welcome to{" "}
              <strong className="hotpink-text">Glam The Girl</strong>, your
              one-stop-shop for finding the perfect hair salon near you! Our
              mission is to connect you with the best hair salons in your area
              and make booking an appointment a breeze. Thank you for choosing{" "}
              <strong className="hotpink-text">Glam The Girl!</strong>
            </p>
          </div>
          <div className="col-12 col-sm-6 animate-zoom">
            <img
              src="https://us.images.westend61.de/0000655104pw/mirror-image-of-teenage-girl-and-hairdresser-at-hair-salon-TMF000024.jpg"
              alt="salon"
              className="w-100 rounded-shadow"
            />
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container section animate-fade-up">
        <div className="stats-container">
          <div className="stat-card animate-scale">
            <h2>2K+</h2>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card animate-scale">
            <h2>#1</h2>
            <p>Worldwide Ranking</p>
          </div>
          <div className="stat-card animate-scale">
            <h2>500+</h2>
            <p>Partnered Shops</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonial-section section">
        <h3 className="text-center hotpink-text animate-header">
          What Our Clients Say
        </h3>
        <div className="testimonial-container">
          <div className="testimonial-card animate-fade">
            <p>
              "I love how easy it is to find salons through Glam The Girl!
              Their platform is user-friendly and always up-to-date."
            </p>
            <h5>- Sarah J.</h5>
          </div>
          <div className="testimonial-card animate-fade-up">
            <p>
              "The best experience ever! The reviews helped me choose the
              perfect salon for my makeover."
            </p>
            <h5>- Emily R.</h5>
          </div>
          <div className="testimonial-card animate-fade">
            <p>
              "I can’t imagine going back to the old ways of finding salons.
              Glam The Girl makes everything so convenient!"
            </p>
            <h5>- Olivia P.</h5>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="container section animate-fade-up">
        <h3 className="text-center hotpink-text">Our Mission</h3>
        <p className="text-center mission-text">
          At Glam The Girl, our mission is to empower individuals to express
          themselves through their style. We aim to bridge the gap between
          clients and top-notch salons, ensuring every experience is a memorable
          one. Whether it’s a quick trim or a complete transformation, we are
          here to make it happen.
        </p>
      </div>
    </div>
  );
};

export default About;
