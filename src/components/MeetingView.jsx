import React, { useMemo, useEffect, useState } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import RegularParticipantView from "./RegularParticipantView";
import AgentParticipantView from "./AgentParticipantView";
import AgentAudioPlayer from "./AgentAudioPlayer";
import AgentTranslation from "./AgentTranslation";
import sampleGif from "../assets/sample_gif.gif";
import ScreenSharePlaceholder from "./ScreenSharePlaceholder";

const MeetingView = ({ onTilesVisible, onAgentStateChanged, isChatOpen }) => {
  const { participants, localParticipant, disableScreenShare } = useMeeting();
  const [transcriptions, setTranscriptions] = useState([]);

  const handleTranscription = (data) => {
    if (data?.segment?.text) {
      setTranscriptions((prev) => {
        const newTranscriptions = [
          ...prev,
          {
            id: data.segment.timestamp || Date.now() + Math.random(),
            text: data.segment.text,
            participantName: data.participant?.displayName || "Agent",
          },
        ];
        return newTranscriptions.slice(-10);
      });
    }
  };

  const agentParticipant = useMemo(
    () => Array.from(participants.values()).find((p) => p.isAgent),
    [participants],
  );

  const localWebcamOn = localParticipant?.webcamOn;
  const agentWebcamOn = agentParticipant?.webcamOn;
  const sharingOn = localParticipant?.screenShareOn;
  const anyTileVisible = !!(localWebcamOn || agentWebcamOn || sharingOn);

  useEffect(() => {
    onTilesVisible?.(anyTileVisible);
  }, [anyTileVisible, onTilesVisible]);

  return (
    <>
      {agentParticipant && (
        <AgentAudioPlayer
          participantId={agentParticipant.id}
          onAgentStateChanged={onAgentStateChanged}
          onTranscriptionReceived={handleTranscription}
        />
      )}

      {/* Main Layout Container */}
      <div
        className="absolute inset-0 w-screen h-screen flex flex-col items-center pt-[50px] pointer-events-none"
        style={{
          paddingBottom: sharingOn ? "120px" : "287px",
          transition: "padding-bottom 300ms ease",
        }}
      >
        {sharingOn ? (
          /* Sidebar Mode (Screen Share) */
          <div className="flex flex-row w-full flex-1 gap-6 px-12 pointer-events-auto overflow-hidden min-h-0">
            {/* Left side: Screen share placeholder */}
            <div className="flex-[3] min-h-0 pointer-events-auto">
              <ScreenSharePlaceholder
                onStopSharing={() => disableScreenShare()}
              />
            </div>

            {/* Right side: Sidebar stack */}
            <div className="flex-1 flex flex-col gap-6 pointer-events-auto overflow-hidden min-h-0">
              {/* Local Participant */}
              <div className="w-full aspect-video pointer-events-auto shrink-0">
                <RegularParticipantView participantId={localParticipant.id} />
              </div>

              {/* Agent Participant */}
              <div className="w-full aspect-video pointer-events-auto shrink-0">
                {agentParticipant ? (
                  <AgentParticipantView participantId={agentParticipant.id} />
                ) : (
                  <div className="w-full h-full bg-[#1B1B1E] rounded-[28px]" />
                )}
              </div>

              {/* Translation in Sidebar */}
              <div className="flex-1 min-h-0 max-h-[250px] w-full pointer-events-auto mt-auto">
                <AgentTranslation
                  transcriptions={transcriptions}
                  isChatOpen={isChatOpen}
                  isSidebar={true}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Normal Mode */
          <>
            {!localWebcamOn && !agentWebcamOn ? (
              <div
                className="flex-1 w-full flex items-center justify-center"
                style={{ animation: "fadeIn 300ms ease" }}
              >
                <img
                  src={sampleGif}
                  alt="Agent"
                  className="w-[15%] aspect-square object-contain opacity-90 pointer-events-auto"
                />
              </div>
            ) : (
              <div className="flex-1 w-full flex items-center justify-center gap-[50px] px-[50px]">

                {/* Local tile */}
                <div className="flex-1 aspect-video pointer-events-auto">
                  {localWebcamOn ? (
                    <RegularParticipantView participantId={localParticipant.id} />
                  ) : (
                    <div
                      className="w-full h-full bg-[#1B1B1E] rounded-[28px] flex items-center justify-center"
                      style={{ animation: "fadeIn 300ms ease" }}
                    >
                      <span className="text-white text-4xl font-semibold">
                        {localParticipant?.displayName?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 aspect-video pointer-events-auto">
                  {agentParticipant ? (
                    <AgentParticipantView participantId={agentParticipant.id} />
                  ) : (
                    <div className="w-full h-full bg-[#1B1B1E] rounded-[28px]" />
                  )}
                </div>

              </div>
            )}

            <AgentTranslation
              transcriptions={transcriptions}
              isChatOpen={isChatOpen}
            />
          </>
        )}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </>
  );
};

export default MeetingView;