import React, { useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import { useVideoStream } from "../hooks/useVideoStream";

const RegularParticipantView = ({ participantId }) => {
  const videoRef = useRef(null);
  const { webcamStream, webcamOn, displayName } = useParticipant(participantId);

  // Shared Hook for Video Stream
  useVideoStream(videoRef, webcamStream, webcamOn);

  const initial = displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center w-full aspect-video rounded-[28px]"
      style={{
        background: webcamOn ? "#1B1B1E" : "#28292B",
      }}
    >
      {webcamOn ? (
        <video
          autoPlay
          playsInline
          muted
          ref={videoRef}
          className="w-full h-full object-cover rounded-[28px]"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div
            className="flex items-center justify-center rounded-full w-[30%] aspect-square bg-[#1B1B1E]"
          >
            <span
              className="font-['Inter'] font-semibold text-[3vw] leading-none text-white text-center"
            >
              {initial}
            </span>
          </div>
        </div>
      )}

      {/* YOU Label */}
      <div
        className="absolute bottom-[12px] left-[12px] text-white uppercase font-bold"
        style={{
          borderRadius: "14px",
          padding: "3px 8px",
          background: "#0C4A6E",
          border: "1px solid #075985",
          fontSize: "10px",
        }}
      >
        You
      </div>
    </div>
  );
};

export default RegularParticipantView;