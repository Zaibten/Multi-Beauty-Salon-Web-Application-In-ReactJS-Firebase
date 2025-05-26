import React, { useState } from "react";
import Time from "../../bookingTime/bookingTime";

const List = ({ mark, setMark, bookedTimes = [] }) => {
  const [hoveredTime, setHoveredTime] = useState(null);

  const formatTime = (timeObj) => timeObj.time + timeObj.shift;

  const handleClick = (timeObj) => {
    const fullTime = formatTime(timeObj);
    if (bookedTimes.includes(fullTime)) return;
    setMark(timeObj);
  };

  return (
    <div>
      {Time.map((timeObj) => {
        const fullTime = formatTime(timeObj);
        const isBooked = bookedTimes.includes(fullTime);
        const isHovered = hoveredTime === fullTime;

        return (
          <div
            key={fullTime}
            onClick={() => handleClick(timeObj)}
            onMouseEnter={() => setHoveredTime(fullTime)}
            onMouseLeave={() => setHoveredTime(null)}
            style={{
              padding: "8px 15px",
              margin: "5px 0",
              cursor: isBooked ? "not-allowed" : "pointer",
              backgroundColor:
                mark?.time === timeObj.time && mark?.shift === timeObj.shift
                  ? "#0069d9"
                  : isBooked
                  ? "#ff4d4f"
                  : "#222",
              color: isBooked ? "#fff" : "#eee",
              borderRadius: "5px",
              position: "relative",
              userSelect: "none",
              transition: "background-color 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "35px",
            }}
            title={isBooked ? "Booked time" : ""}
          >
            {!isBooked || !isHovered ? (
              <>
                <span>
                  {timeObj.time} {timeObj.shift}
                </span>
                {/* Show slot label next to time */}
                {timeObj.slot && (
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: isBooked ? "#fff" : "#ccc",
                      opacity: 0.8,
                      userSelect: "none",
                    }}
                  >
                    {timeObj.slot}
                  </span>
                )}
              </>
            ) : (
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#fff",
                  userSelect: "none",
                }}
              >
                Not Available
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default List;
