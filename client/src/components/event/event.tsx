import React from "react";

import "./event.scss";

interface eventProps {
  eventDate: number;
}

const Event: React.FC<eventProps> = ({ eventDate }) => {
  const handleClick = (message) => {};

  return (
    <div className="event-container">
      <span
        className="event-container-content"
        onClick={() => handleClick("Hello World")}
      >
        {eventDate}
      </span>
    </div>
  );
};

export default Event;
