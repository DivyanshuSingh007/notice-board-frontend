import { useEffect, useState } from "react";
import API from "../api";
import NoticeCard from "../components/NoticeCard";
import AddNoticeForm from "../components/AddNoticeForm";
import { useNavigate } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const user = await API.get("/auth/me");
      setIsAdmin(user.data.admin);

      const res = await API.get("/notice");
      setNotices(res.data);
    } catch (err) {
      console.error("Error fetching notices", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNoticeAdded = () => {
    setShowAddForm(false);
    fetchData();
  };

  const handleNoticeDeleted = () => {
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      // Optionally handle error
    }
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Notice types in enum order with emojis
  const noticeTypes = [
    { name: "Maintenance", emoji: "🔧" },
    { name: "Rent/Sell", emoji: "🏠" },
    { name: "Meeting", emoji: "📋" },
    { name: "Event", emoji: "🎉" },
    { name: "Lost & Found", emoji: "🔍" },
    { name: "General Announcement", emoji: "📢" },
    { name: "Security Alert", emoji: "🚨" },
    { name: "Visitor Information", emoji: "👥" },
    { name: "Payment Reminder", emoji: "💰" },
    { name: "Service", emoji: "🛠️" },
    { name: "Emergency", emoji: "🚑" },
    { name: "Other", emoji: "📌" }
  ];

  // Group notices by type
  const noticesByType = noticeTypes.reduce((acc, type) => {
    acc[type.name] = notices.filter((notice) => notice.type === type.name);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Image Slider at the very top */}
      <ImageSlider />
      
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        {isAdmin && (
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Welcome, Admin!</h2>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl mb-2"
              onClick={() => setShowAddForm((prev) => !prev)}
            >
              {showAddForm ? "Close Add Notice" : "Add Notice"}
            </button>
          </div>
        )}
        {isAdmin && showAddForm && (
          <AddNoticeForm onSuccess={handleNoticeAdded} />
        )}
        <h1 className="text-3xl font-bold mb-4 text-center text-green-700">Community Notices</h1>
        
        {/* Grouped notices by type */}
        {noticeTypes.map((type) =>
          noticesByType[type.name] && noticesByType[type.name].length > 0 ? (
            <div key={type.name} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                {type.emoji} {type.name}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {noticesByType[type.name].map((notice) => (
                  <NoticeCard
                    key={notice.id}
                    notice={notice}
                    isAdmin={isAdmin}
                    onDelete={handleNoticeDeleted}
                  />
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
