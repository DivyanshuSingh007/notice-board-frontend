import { useState } from "react";
import API from "../api";

export default function AddNoticeForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    post_date: "",
    event_date: "",
    event_start_time: "",
    event_end_time: "",
    type: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a clean form data object, excluding empty optional fields
    const formData = {
      title: form.title,
      description: form.description,
      type: form.type,
    };

    // Only add event fields if they have values and the notice type needs them
    if (needsEventTime.includes(form.type)) {
      // Only add date if it's not empty
      if (form.event_date && form.event_date.trim() !== '') {
        formData.event_date = form.event_date;
      }
      // Only add start time if it's not empty
      if (form.event_start_time && form.event_start_time.trim() !== '') {
        formData.event_start_time = form.event_start_time;
      }
      // Only add end time if it's not empty
      if (form.event_end_time && form.event_end_time.trim() !== '') {
        formData.event_end_time = form.event_end_time;
      }
    }

    console.log("Sending form data:", formData); // Debug log

    try {
      await API.post("/notice/", formData);
      onSuccess();
      setForm({
        title: "",
        description: "",
        post_date: "",
        event_date: "",
        event_start_time: "",
        event_end_time: "",
        type: "",
      });
    } catch (error) {
      console.error("Failed to add notice:", error);
      console.error("Request data:", formData);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
      alert(`Failed to add notice: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
    }
  };

  // Notice types that need event date/time
  const needsEventTime = ["Meeting", "Event", "Service"];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">Add New Notice</h2>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Enter notice title"
            aria-label="Notice Title"
            value={form.title}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-lg w-full"
          />
        </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Enter description"
            aria-label="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-lg w-full"
          />
        </div>
        {/* Dropdown for notice type */}
        <div>
          <label htmlFor="type" className="block mb-1 text-sm font-medium text-gray-700">Notice Type</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="px-3 py-2 border rounded-lg w-full"
            aria-label="Notice Type"
          >
            <option value="">Select notice type</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Rent/Sell">Rent/Sell</option>
            <option value="Meeting">Meeting</option>
            <option value="Event">Event</option>
            <option value="Lost & Found">Lost & Found</option>
            <option value="General Announcement">General Announcement</option>
            <option value="Security Alert">Security Alert</option>
            <option value="Visitor Information">Visitor Information</option>
            <option value="Payment Reminder">Payment Reminder</option>
            <option value="Service">Service</option>
            <option value="Emergency">Emergency</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {/* Event Date - only show for types that need it */}
        {needsEventTime.includes(form.type) && (
          <div>
            <label htmlFor="event_date" className="block mb-1 text-sm font-medium text-gray-700">Event Date</label>
            <input
              id="event_date"
              type="date"
              name="event_date"
              aria-label="Event Date"
              value={form.event_date}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded-lg w-full"
            />
          </div>
        )}
        {/* Event Start Time - only show for types that need it */}
        {needsEventTime.includes(form.type) && (
          <div>
            <label htmlFor="event_start_time" className="block mb-1 text-sm font-medium text-gray-700">Start Time</label>
            <input
              id="event_start_time"
              type="time"
              name="event_start_time"
              aria-label="Event Start Time"
              value={form.event_start_time}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded-lg w-full"
            />
          </div>
        )}
        {/* Event End Time - only show for types that need it */}
        {needsEventTime.includes(form.type) && (
          <div>
            <label htmlFor="event_end_time" className="block mb-1 text-sm font-medium text-gray-700">End Time</label>
            <input
              id="event_end_time"
              type="time"
              name="event_end_time"
              aria-label="Event End Time"
              value={form.event_end_time}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded-lg w-full"
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
      >
        Add Notice
      </button>
    </form>
  );
}
