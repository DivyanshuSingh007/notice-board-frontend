import { useState, useEffect } from 'react';

const ImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: "/colony-image-1.jpg",
      alt: "Ramnagar Colony Street Scene 1",
      title: "Welcome to Ramnagar Colony"
    },
    {
      src: "/colony-image-2.jpg",
      alt: "Ramnagar Colony Street Scene 2", 
      title: "Community Notice Board"
    },
    {
      src: "/colony-image-3.jpg",
      alt: "Ramnagar Colony Street Scene 3",
      title: "Stay Connected"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg mb-6 bg-gray-100">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error(`Failed to load image ${index}:`, image.src);
              console.error("Error details:", e);
              // Show a placeholder or error message
              e.target.style.display = 'none';
              const errorDiv = document.createElement('div');
              errorDiv.className = 'w-full h-full bg-gray-300 flex items-center justify-center';
              errorDiv.innerHTML = `<p class="text-gray-600">Image not found: ${image.src}</p>`;
              e.target.parentNode.appendChild(errorDiv);
            }}
            onLoad={(e) => {
              console.log(`Successfully loaded image ${index}:`, image.src);
              console.log("Image dimensions:", e.target.naturalWidth, "x", e.target.naturalHeight);
            }}
          />
          {/* Title overlay */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-yellow-300 px-3 py-1">
            <h2 className="text-4xl font-bold">
              {image.title}
            </h2>
          </div>
        </div>
      ))}
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentImageIndex 
                ? 'bg-white' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider; 