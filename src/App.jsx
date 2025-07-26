import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notices from "./pages/Notices";

// Ramnagar Colony boundary coordinates
const COLONY_BOUNDARY = [
  { lat: 26.753944, lng: 83.362028 }, // 26°45'14.2"N 83°21'43.3"E
  { lat: 26.755472, lng: 83.361944 }, // 26°45'19.7"N 83°21'43.0"E
  { lat: 26.754833, lng: 83.361222 }, // 26°45'17.4"N 83°21'40.4"E
  { lat: 26.754833, lng: 83.362639 }, // 26°45'17.4"N 83°21'45.5"E
];

// Function to check if a point is inside a polygon (colony boundary)
function isPointInPolygon(point, polygon) {
  const x = point.lat;
  const y = point.lng;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }

  return inside;
}

// Location Access Component
function LocationCheck({ children }) {
  const [locationStatus, setLocationStatus] = useState("checking"); // "checking", "allowed", "denied", "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkLocation();
  }, []);

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setErrorMessage("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("User location:", userLocation);

        if (isPointInPolygon(userLocation, COLONY_BOUNDARY)) {
          setLocationStatus("allowed");
        } else {
          setLocationStatus("denied");
          setErrorMessage("Access denied. You must be within Ramnagar Colony to view notices.");
        }
      },
      (error) => {
        setLocationStatus("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage("Location access denied. Please enable location services to access the notice board.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Location information unavailable. Please try again.");
            break;
          case error.TIMEOUT:
            setErrorMessage("Location request timed out. Please try again.");
            break;
          default:
            setErrorMessage("An unknown error occurred while getting location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  if (locationStatus === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Checking Location Access...</h2>
          <p className="text-gray-500 mt-2">Please allow location access to continue</p>
        </div>
      </div>
    );
  }

  if (locationStatus === "denied" || locationStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-200">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-6">{errorMessage}</p>
          <button
            onClick={checkLocation}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return children;
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <LocationCheck>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/notices" 
            element={
              <ProtectedRoute>
                <Notices />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </LocationCheck>
  );
}

export default App;
