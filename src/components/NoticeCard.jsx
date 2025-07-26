import API from "../api";
import { useState } from "react";

export default function NoticeCard({ notice, isAdmin, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...notice });

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build the notice object (JSON instead of FormData)
      const noticeData = {
        title: editForm.title,
        description: editForm.description,
        type: editForm.type,
      };
      
      // Add event fields if they exist
      if (editForm.event_date) {
        noticeData.event_date = editForm.event_date;
      }
      if (editForm.event_start_time) {
        noticeData.event_start_time = editForm.event_start_time;
      }
      if (editForm.event_end_time) {
        noticeData.event_end_time = editForm.event_end_time;
      }
      
      await API.put(`/notice/${notice.id}`, noticeData);
      setIsEditing(false);
      window.location.reload(); // Or call a prop to refresh notices
    } catch (error) {
      console.error("Failed to update notice:", error);
      alert(`Failed to update notice: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this notice?")) {
      try {
        await API.delete(`/notice/${notice.id}`);
        onDelete();
      } catch (error) {
        console.error("Failed to delete notice:", error);
        alert(`Failed to delete notice: ${error.response?.data?.detail || error.message || 'Unknown error'}`);
      }
    }
  };

  // Notice types that need event date/time (same as AddNoticeForm)
  const needsEventTime = ["Meeting", "Event", "Service"];

  if (isEditing) {
    return (
      <form onSubmit={handleEditSubmit} className="bg-white p-4 rounded-xl shadow-md">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {/* Notice Type */}
          <div>
            <label htmlFor="type" className="block mb-1 text-sm font-medium text-gray-700">Notice Type</label>
            <select
              id="type"
              name="type"
              value={editForm.type}
              onChange={handleEditChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
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
          {needsEventTime.includes(editForm.type) && (
            <div>
              <label htmlFor="event_date" className="block mb-1 text-sm font-medium text-gray-700">Event Date</label>
              <input
                id="event_date"
                type="date"
                name="event_date"
                value={editForm.event_date}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}
          {/* Event Start Time - only show for types that need it */}
          {needsEventTime.includes(editForm.type) && (
            <div>
              <label htmlFor="event_start_time" className="block mb-1 text-sm font-medium text-gray-700">Start Time</label>
              <input
                id="event_start_time"
                type="time"
                name="event_start_time"
                value={editForm.event_start_time}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}
          {/* Event End Time - only show for types that need it */}
          {needsEventTime.includes(editForm.type) && (
            <div>
              <label htmlFor="event_end_time" className="block mb-1 text-sm font-medium text-gray-700">End Time</label>
              <input
                id="event_end_time"
                type="time"
                name="event_end_time"
                value={editForm.event_end_time}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save</button>
          <button type="button" className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-green-800">{notice.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{notice.description}</p>
      <div className="mt-2 text-sm text-gray-500">
        <p><strong>Post Date:</strong> {notice.post_date}</p>
        <p><strong>Event:</strong> {notice.event_date} ({notice.event_start_time} - {notice.event_end_time})</p>
        <p><strong>Type:</strong> {notice.type}</p>
      </div>
      {isAdmin && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
