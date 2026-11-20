"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

export default function IntroVideo({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"playing" | "fading">("playing");

  const handleEnd = useCallback(() => {
    setPhase("fading");
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Start playback immediately
    video.play().catch(() => {
      // If browser blocks autoplay, gracefully complete
      onComplete();
    });

    video.addEventListener("ended", handleEnd);

    return () => {
      video.removeEventListener("ended", handleEnd);
    };
  }, [handleEnd, onComplete]);

  const handleSkip = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    handleEnd();
  };

  return (
    <div
      onClick={handleSkip}
      title="Click anywhere to continue"
      className={`fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer transition-all duration-700 ${
        phase === "fading" ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      style={{ backgroundColor: "#07140F" }}
    >
      {/* Background ambient lighting matching prototype */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-emerald/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Pure, Clean Fullscreen Video Player - No Duration Line, No Overlays */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/intro.mp4"
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-contain md:object-cover"
        />
      </div>
    </div>
  );
}
