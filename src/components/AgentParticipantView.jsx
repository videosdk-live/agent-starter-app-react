import React, { useRef, useState } from "react";
import { useAgentParticipant } from "@videosdk.live/react-sdk";
import sample_gif from "../assets/sample_gif.gif";
import { StatusBadge } from "./StatusBadge";
import { useVideoStream } from "../hooks/useVideoStream";

// --- Sub-component: AGENT name label (bottom-left) ---
const AgentNameBadge = () => (
  <div className="absolute bottom-[11.73px] left-[11.73px] z-20 flex items-center justify-center w-[54.08px] h-[23.46px] rounded-[14.08px] px-[7.04px] py-[2.35px] border-[1.17px] bg-agent-badge border-agent-badge-border shadow-agent-badge">
    <span className="font-normal text-[14.08px] leading-[18.77px] text-agent-badge-text">
      Agent
    </span>
  </div>
);

const AgentParticipantView = ({ participantId }) => {
  const videoRef = useRef(null);
  const [agentStateLocal, setAgentStateLocal] = useState(null);

  const { agentState, webcamStream, webcamOn } = useAgentParticipant(participantId, {
    onAgentStateChanged: (state) => setAgentStateLocal(state),
  });

  const currentAgentState = agentStateLocal ?? agentState;

  // Shared Hook for Video Stream
  useVideoStream(videoRef, webcamStream, webcamOn);

  return (
    <div className="relative overflow-hidden transition-all duration-300 ease-out bg-card w-full aspect-video rounded-[28.15px]">
      {webcamOn ? (
        <video autoPlay playsInline ref={videoRef} className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <img src={sample_gif} alt="Agent Fallback" className="w-[30%] aspect-square object-contain opacity-80" />
        </div>
      )}

      <StatusBadge
        status={currentAgentState ? currentAgentState.charAt(0).toUpperCase() + currentAgentState.slice(1).toLowerCase() : null}
        wrapperClassName="absolute top-[11.73px] right-[11.73px] z-20 flex items-center justify-center"
      />
      <AgentNameBadge />
    </div>
  );
};

export default AgentParticipantView;
