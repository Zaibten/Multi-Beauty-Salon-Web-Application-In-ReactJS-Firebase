import React, { useState, useEffect } from "react";
import { db } from "../../Firebase/firebase"; // Firebase initialization
import { collection, getDocs } from "firebase/firestore"; 
import Loader from "../Loader/loader";

const ArtistPortfolio = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const artistsPerPage = 20; // Customize how many artists to show per page

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistCollection = collection(db, "ArtistPortfolio");
        const artistSnapshot = await getDocs(artistCollection);
        const artistList = artistSnapshot.docs.map(doc => doc.data());
        setArtists(artistList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching artists data: ", error);
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const randomImageUrl = (name) => {
    const imageUrls = [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/women/2.jpg",
      "https://randomuser.me/api/portraits/men/3.jpg",
      "https://randomuser.me/api/portraits/women/4.jpg",
    ];
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
  };

  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist);

  const totalPages = Math.ceil(artists.length / artistsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ background: "#ffe6f2", fontFamily: "Poppins, sans-serif", padding: "30px", transition: "all 0.3s ease" }}>
      <h2 style={{ textAlign: "center", fontSize: "36px", color: "#ff4da6", marginBottom: "20px", letterSpacing: "1px" }}>
        Artist Portfolio
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {currentArtists.map((artist, index) => (
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
          }}>
            <img
              src={artist.imageLink || randomImageUrl(artist.name)}
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
            <p style={{ color: "#ff4da6", fontSize: "16px", fontWeight: "bold", marginBottom: "15px" }}>{artist.salonName}</p>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>{artist.description}</p>
            <p style={{ fontSize: "14px", color: "#333" }}>Role: {artist.role}</p>
          </div>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              backgroundColor: currentPage === index + 1 ? "#ff4da6" : "#fff",
              color: currentPage === index + 1 ? "#fff" : "#ff4da6",
              border: "1px solid #ff4da6",
              padding: "10px 15px",
              margin: "0 5px",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArtistPortfolio;
