"use client"
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

const CloudinaryVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Cloudinary optimization parameters
  const baseUrl = "https://res.cloudinary.com/dt3kpifmp/video/upload/";
  const optimizationParams = [
    "q_auto", // Automatic quality optimization
    "f_auto" // Automatic format selection
  ].join(",");

  const videoId = "v1741198310/street-comfort_wzxqa4";
  const optimizedUrl = `${baseUrl}${optimizationParams}/${videoId}.mp4`;
  console.log(optimizedUrl)
  useEffect(() => {
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isVisible) {
      videoRef.current.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isVisible]);

  const toggleSound = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden h-[424px] w-full">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster={`${baseUrl}q_auto,f_auto/${videoId}.jpg`}
        >
          <source src={optimizedUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        className="absolute bottom-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white"
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default CloudinaryVideo; 