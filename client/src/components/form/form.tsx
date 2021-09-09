import React, { useState, forwardRef } from "react";
import "./form.scss";

interface props {
  handleFormSubmit: (eventName: string) => void;
}

const Form = forwardRef<HTMLFormElement, props>(({ handleFormSubmit }, ref) => {
  const [eventName, setEventName] = useState("");

  const handleChange = (e) => {
    setEventName(e.target.value);
  };

  return (
    <form
      ref={ref}
      action="#"
      className="form"
      onSubmit={() => handleFormSubmit(eventName)}
    >
      <span className="form-input">
        <label htmlFor="name" className="form-input-label">
          Event Name
        </label>
        <input
          type="string"
          className="form-input-field"
          id="name"
          value={eventName}
          placeholder="type here"
          onChange={handleChange}
        />
      </span>

      <button className="form-btn" type="submit">
        Submit
      </button>
    </form>
  );
});

export default Form;
