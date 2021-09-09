import React, { useState } from "react";
import _ from "lodash";
import "./App.scss";

import Calendar from "./components/calendar/calendar";

interface obj {
  [key: string]: Array<string>;
}

function App() {
  const [events, setEvents] = useState<obj[]>([]);

  return (
    <section className="App">
      <Calendar
        events={events}
        onAddEvent={(eventName, date) => {
          if (!eventName.length) eventName = "untitled";
          let event;

          if (_.has(events, date)) {
            event = {
              [date]: [...events[date], eventName],
            };
          } else {
            event = {
              [date]: [eventName],
            };
          }
          setEvents({ ...events, ...event });
          // localStorage.setItem("events", events);
        }}
      />
    </section>
  );
}

export default App;
