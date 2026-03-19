import React, { useEffect, useRef } from "react";
import { useAgentParticipant } from "@videosdk.live/react-sdk";

/**
 * Always-mounted audio sink + agent state reporter.
 * Renders no UI, just a hidden <audio> element.
 * Stays mounted in all 4 camera cases so audio always plays.
 */
const AgentAudioPlayer = ({
  participantId,
  onAgentStateChanged,
  onTranscriptionReceived,
}) => {
  const micRef = useRef(null);
  const { micStream, micOn } = useAgentParticipant(participantId, {
    onAgentStateChanged: (state) => {
      onAgentStateChanged?.(state);
    },
    onAgentTranscriptionReceived: (data) => {
      onTranscriptionReceived?.(data);
    },
  });

  useEffect(() => {
    if (!micRef.current) return;
    if (micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      micRef.current.srcObject = mediaStream;
      micRef.current
        .play()
        .catch((err) => console.error("AgentAudioPlayer play() failed", err));
    } else {
      micRef.current.srcObject = null;
    }
  }, [micStream, micOn]);

  return <audio ref={micRef} autoPlay playsInline className="hidden" />;
};

export default AgentAudioPlayer;
