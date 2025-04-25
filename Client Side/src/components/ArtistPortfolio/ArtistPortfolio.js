import React from "react";

const ArtistPortfolio = () => {
  const artists = [
    {
      name: "Aqsa Danish",
      salon: "Flourish",
      role: "Lead Makeup Artist",
      description: "Aqsa Danish is the founder and principal makeup artist at Flourish Salon. Renowned for her transformative bridal and fashion makeovers, she has collaborated with numerous models and designers in Karachi.",
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipMkUIb3Dw-5QIgEfjYwo1NESIAmXUdwmHK4x1xH=w114-h114-n-k-no",
    },
    {
      name: "Sana Sarah",
      salon: "SanaSarah Salon",
      role: "Co-Founder",
      description: "Sana - The co-founder of SanaSarah salon, she has appeared alongside Sarah on shows such as ARY Digital's 'Good Morning Pakistan', showcasing their collaborative work in bridal makeovers.",
      imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB_9vLs7xJRthmpmT0MRGLBEwN4h4kid4pU9GXTMLD4dMmx3DNifjpNCx15Dt3Wk8Z9Q1YE5PUIIKiKJXiiq6oj81it3uQp52fK-hfDNfg1quXILaNCmiLNr86-IeZkMOv8yjU5r=w114-h114-n-k-no",
    },
    {
      name: "Amna Rafiq",
      salon: "Makeup by Amna Rafiq",
      role: "Makeup Artist",
      description: "Amna Rafiq is a professional makeup artist based in Karachi, specializing in bridal and event makeup, offering services by appointment only at her studio located in DHA Phase 7, Karachi.",
      imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB9-Gj6cx1jDh2s7sy7qT_Giz3p6Uh3HtLOkIry28n4GV1cWnlJp2Q5S2RF71JSYDv6t0BqfNFhIEPlIBD2MQYpGWm02mo74jw7PuB-pCNJ8zsV5ghaXbNWgS1coE3GUtSfynOX-=w296-h168-n-k-no",
    },
    {
      name: "Maria Jawwad",
      salon: "Maria J",
      role: "Makeup Artist",
      description: "Maria Jawwad is a renowned Karachi-based makeup artist, known for her bridal and party makeup with a signature style characterized by sculpted features and camera-ready looks.",
      imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB9RtSlVbAlyjfyet6xhx5PqEjJTWe7oJoZhXYoTkk0amFOJhW-lLADv0o8t5VKbE6jxw8v1x5BR701xATWfdCkE0cDuFF1BheLnKyLIaTBE7yfyn50Xh9gY2Qr20M30h7NJKng5=w114-h114-n-k-no",
    },
    {
      name: "Saba Ansari",
      salon: "Sabs Salon",
      role: "Founder and Lead Makeup Artist",
      description: "Saba Ansari is the founder of Sabs Salon, a renowned beauty establishment in Pakistan, offering a wide range of beauty services in Karachi and Lahore.",
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipO7b7SLWzJuIFi86LPBOJ3xdnpupqFZ30WpEHXA=w114-h114-n-k-no",
    },
    {
      name: "Waqar Hussain",
      salon: "Waqar's Salon",
      role: "Makeup Artist",
      description: "Waqar Hussain is known for his expertise in bridal and party makeup, offering elegant, camera-ready looks that have earned him a loyal clientele in Karachi.",
      imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB8vjLGlVEp1EPvH69dTMEK1NWA7R14VW0ivaiDYXmeWSb6sHa42ItjSnNAZ4wnGyupbW7wxb17hwIe4d7JKfL9qxX9VWMN0IMZsNPfEeapVriH-42w5B41d82siO0C2t5pxvEP87w=w114-h114-n-k-no",
    },
    {
      name: "Masarrat Misbah",
      salon: "Depilex",
      role: "Founder",
      description: "Masarrat Misbah is a pioneering Pakistani beautician, philanthropist, and entrepreneur, best known for her work in the beauty industry and her humanitarian efforts.",
      imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB_cThtrsEux1rj1mkfmx7heeOrgaCsHxoXAoohOUHsvsgqM-e7PeMC8CkKbFY7vQ2ZomQq9VUXfj4nUr0ucmHLtWcGDOGl6M5DnPJYSNNmi-8Tb0w8LEperJzE9sVFlwr6tL88=w114-h114-n-k-no",
    },
    {
      name: "Nadia Hussain",
      salon: "Nadia Hussain Salon & Medspa",
      role: "Founder and CEO",
      description: "Nadia Hussain is a famous supermodel and TV personality, founder of the renowned Nadia Hussain Salon & Medspa in Karachi, offering a variety of beauty and wellness services.",
      imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB_rBvnq3-FxDSL0sDlX-9_Shu0pL6TDzOpYdh9sfOb9IzuSD9UzXXEiGYpOWKhbyVhIbHdJPZ_QuhKyRhYaeP5qfS42R8WweMThV0cxvzJ3YRcrN7JHU1yaxM6JRzKaxUA2ILBhnA=w114-h114-n-k-no",
    },
    {
      name: "Sara Ali",
      salon: "Sara Ali Salon & Spa",
      role: "Founder",
      description: "Sara Ali is a recognized makeup artist and founder of the Sara Ali Salon & Spa. She also launched Sara Ali Cosmetics, offering premium makeup products.",
      imageUrl: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB-Q8JFSg1JHzeMjRXchWW47Dg2Xdr_b2PRJkFrRQrCfcLp8ootnuJ2omhmWhuw-TnljeIN5b1zoWHdS2-Zoj0FcsTtQ3QjbHJUUajdnODAADuK9-GMvpMGbJkF15xf9zEnkNaXX=w114-h114-n-k-no",
    },
    {
      name: "Najla Al Midfa",
      salon: "Najlas",
      role: "Business Leader",
      description: "Najla Al Midfa is a business leader in the Middle East, known for her entrepreneurial achievements and leadership roles in the region's beauty and wellness industry.",
      imageUrl: "https://lh3.googleusercontent.com/p/AF1QipP1csVMriZ1u-7BpaAvHgQa2TlPZT2HmZbMmalV=w114-h114-n-k-no",
    },
  ];

  return (
    <div style={{ background: "#ffe6f2", fontFamily: "Poppins, sans-serif", padding: "30px", transition: "all 0.3s ease" }}>
      <h2 style={{ textAlign: "center", fontSize: "36px", color: "#ff4da6", marginBottom: "20px", letterSpacing: "1px", animation: "fadeIn 1s ease-in-out" }}>
        Artist Portfolio
      </h2>
      
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {artists.map((artist, index) => (
          <div key={index} style={{
            background: "#fff",
            borderRadius: "15px",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            padding: "20px",
            width: "280px",
            textAlign: "center",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
            marginBottom: "30px",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)"
            }
          }}>
            <img
              src={artist.imageUrl}
              alt={artist.name}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                border: "2px solid #ff4da6",
                marginBottom: "15px",
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            />
            <h3 style={{ fontSize: "24px", color: "#333", marginBottom: "10px" }}>{artist.name}</h3>
            <p style={{ color: "#ff4da6", fontSize: "16px", fontWeight: "bold", marginBottom: "15px" }}>{artist.salon}</p>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>{artist.description}</p>
            <p style={{ fontSize: "14px", color: "#333" }}>Role: {artist.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistPortfolio;
