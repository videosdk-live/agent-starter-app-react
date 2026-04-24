import React, { useRef } from "react";
import { useParticipant } from "@videosdk.live/react-sdk";
import clsx from "clsx";
import { useVideoStream } from "../hooks/useVideoStream";

const RegularParticipantView = ({ participantId }) => {
  const videoRef = useRef(null);
  const { webcamStream, webcamOn, displayName } = useParticipant(participantId);

  // Shared Hook for Video Stream
  useVideoStream(videoRef, webcamStream, webcamOn);

  const initial = displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div
      className={clsx(
        "relative overflow-hidden flex items-center justify-center w-full aspect-video rounded-tile",
        webcamOn ? "bg-card" : "bg-card-alt"
      )}
    >
      {webcamOn ? (
        <video
          autoPlay
          playsInline
          muted
          ref={videoRef}
          className="w-full h-full object-cover rounded-tile"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex items-center justify-center rounded-full w-[30%] aspect-square bg-card">
            <span className="font-semibold text-[3vw] leading-none text-white text-center">
              {initial}
            </span>
          </div>
        </div>
      )}

      {/* YOU Label */}
      <div className="absolute bottom-[12px] left-[12px] text-white uppercase font-bold rounded-badge-lg px-[8px] py-[3px] bg-you border border-you-border text-[10px]">
        You
      </div>
    </div>
  );
};

export default RegularParticipantView;
