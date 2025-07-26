import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notices from "./pages/Notices";

// Ramnagar Colony boundary coordinates (improved with more points for better accuracy)
const COLONY_BOUNDARY = [
  { lat: 26.753944, lng: 83.362028 }, // 26°45'14.2"N 83°21'43.3"E
  { lat: 26.754688, lng: 83.361986 }, // 26°45'16.9"N 83°21'43.1"E
  { lat: 26.755472, lng: 83.361944 }, // 26°45'19.7"N 83°21'43.0"E
  { lat: 26.755472, lng: 83.361583 }, // 26°45'19.7"N 83°21'41.7"E
  { lat: 26.754833, lng: 83.361222 }, // 26°45'17.4"N 83°21'40.4"E
  { lat: 26.754178, lng: 83.361222 }, // 26°45'15.0"N 83°21'40.4"E
  { lat: 26.753944, lng: 83.361625 }, // 26°45'14.2"N 83°21'41.8"E
  { lat: 26.753944, lng: 83.362028 }, // 26°45'14.2"N 83°21'43.3"E (closing the polygon)
];

// Function to check if a point is inside a polygon (colony boundary)
function isPointInPolygon(point, polygon) {
  // point: { lat, lng }
  // polygon: [{ lat, lng }, ...]
  const x = point.lng; // longitude
  const y = point.lat; // latitude
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

// Location Access Component
function LocationCheck({ children }) {
  const [locationStatus, setLocationStatus] = useState("checking"); // "checking", "allowed", "denied", "error"
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("locationAllowed") === "true") {
      setLocationStatus("allowed");
      return;
    }
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
        console.log("Colony boundary:", COLONY_BOUNDARY);
        
        const isInside = isPointInPolygon(userLocation, COLONY_BOUNDARY);
        console.log("Is user inside colony boundary:", isInside);

        if (isInside) {
          setLocationStatus("allowed");
          localStorage.setItem("locationAllowed", "true");
        } else {
          setLocationStatus("denied");
          setErrorMessage("Access denied. You must be within Ramnagar Colony to view notices. Your location: " + 
            userLocation.lat.toFixed(6) + ", " + userLocation.lng.toFixed(6));
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
          <div className="space-y-3">
            <button
              onClick={checkLocation}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 mr-2"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setLocationStatus("allowed");
                localStorage.setItem("locationAllowed", "true");
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition duration-200"
            >
              Continue Anyway
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Note: You can continue if you're a colony member accessing from outside
          </p>
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
