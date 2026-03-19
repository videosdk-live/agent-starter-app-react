import { useState, useEffect, useRef } from "react";
import { MeetingProvider, useMeeting } from "@videosdk.live/react-sdk";
import sampleGif from "./assets/sample_gif.gif";
import { StatusBadge } from "./components/StatusBadge";
import { AgentOrb } from "./components/AgentOrb";
import { Toast } from "./components/Toast";
import { COLORS } from "./constants/colors";
import { createMeeting, dispatchAgent, verifyMeeting } from "./Api";
import { MeetingControls } from "./components/MeetingControls";
import MeetingView from "./components/MeetingView";
import CapacityModal from "./components/CapacityModal";
import BaseModal from "./components/BaseModal";

const JoinMeeting = ({ onCapacityReached, onAgentLeft, onMeetingError }) => {
  const { join, leave, participants, localParticipant } = useMeeting({
    onParticipantLeft: (participant) => {
      if (participant?.isAgent) {
        onAgentLeft?.();
      }
    },
    onMeetingStateChanged: (state) => {
      if (state === "FAILED") {
        onMeetingError?.(true);
      } else if (state === "DISCONNECTED") {
        onMeetingError?.(false);
      }
    },
  });

  const hasJoined = useRef(false);

  // Join once
  useEffect(() => {
    if (hasJoined.current) return;
    hasJoined.current = true;
    setTimeout(() => {
      join();
    }, 1000);
  }, []);

  const hasCheckedCapacity = useRef(false);

  useEffect(() => {
    if (!localParticipant?.id) return;
    if (hasCheckedCapacity.current) return;
    hasCheckedCapacity.current = true;

    setTimeout(() => {

      if (participants.size > 2) {
        console.warn("Meeting is full, leaving...");
        leave();
        onCapacityReached?.();
      }
    }, 2000);
  }, [localParticipant?.id]);

  return null;
};

const MainContent = ({
  status,
  showLoader,
  showToast,
  showCapacityModal,
  showAgentLeftModal,
  onCloseAgentLeft,
  agentState,
  tilesVisible,
  isChatOpen,
  onTalkToAgent,
  onEndAgent,
  onCloseToast,
  setIsChatOpen,
  setTilesVisible,
  setAgentState,
}) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center relative font-['Inter']"
      style={{ backgroundColor: COLORS.DARK_BG }}
    >
      {!(status === "Connected" && tilesVisible) && (
        <StatusBadge
          status={
            status === "Connected" && agentState
              ? agentState.charAt(0).toUpperCase() + agentState.slice(1).toLowerCase()
              : status
          }
        />
      )}

      <Toast isVisible={showToast} onClose={onCloseToast} />
      <CapacityModal isOpen={showCapacityModal} onClose={onEndAgent} />

      <BaseModal
        isOpen={showAgentLeftModal}
        onClose={onCloseAgentLeft}
        title="Agent Left"
        description="Meeting Left now you can also leave."
        actions={[
          {
            label: "Okay",
            onClick: onCloseAgentLeft,
            variant: "primary",
          },
        ]}
      />

      <div className="flex-1 flex items-center justify-center w-full relative">
        {status === "Connected" ? (
          <MeetingView
            onTilesVisible={setTilesVisible}
            onAgentStateChanged={setAgentState}
            isChatOpen={isChatOpen}
          />
        ) : (
          <AgentOrb
            isActive={status === "Connecting"}
            showLoader={showLoader}
            onTalkToAgent={onTalkToAgent}
            onEndAgent={onEndAgent}
            status={status}
            sampleGif={sampleGif}
          />
        )}

        {status === "Connected" && (
          <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 z-50">
            <MeetingControls onEnd={onEndAgent} onChatToggle={setIsChatOpen} />
          </div>
        )}
      </div>

      <div
        className="pb-8 w-[251px] h-[16px] font-['Inter'] font-normal text-[12px] leading-[16px] text-center"
        style={{ color: COLORS.FOOTER_TEXT }}
      >
        Powered by VideoSDK
      </div>
    </div>
  );
};

const MeetingProviderContent = ({
  props,
  setShowCapacityModal,
  setShowAgentLeftModal,
}) => {
  const { end } = useMeeting();

  const handleCloseModal = () => {
    end();
    props.onEndAgent();
  };

  return (
    <>
      <JoinMeeting
        onCapacityReached={() => setShowCapacityModal(true)}
        onAgentLeft={() => setShowAgentLeftModal(true)}
        onMeetingError={(withToast) => props.onMeetingError(withToast)}
      />
      <MainContent
        {...props}
        onEndAgent={
          props.showCapacityModal || props.showAgentLeftModal
            ? handleCloseModal
            : props.onEndAgent
        }
        onCloseAgentLeft={handleCloseModal}
      />
    </>
  );
};

export default function App() {
  const [status, setStatus] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [meetingId, setMeetingId] = useState(null);
  const [tilesVisible, setTilesVisible] = useState(false);
  const [agentState, setAgentState] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showCapacityModal, setShowCapacityModal] = useState(false);
  const [showAgentLeftModal, setShowAgentLeftModal] = useState(false);
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

  const handleStatusChange = (newStatus, withToast = false) => {
    setStatus(newStatus);
    if (newStatus === "Disconnected" && withToast) {
      setShowToast(true);
    } else {
      setShowToast(false);
    }
  };

  // Auto-clear disconnected toast after 5s
  useEffect(() => {
    if (status === "Disconnected" && showToast) {
      const timer = setTimeout(() => {
        setStatus(null);
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, showToast]);

  const handleTalkToAgent = async () => {
    handleStatusChange("Connecting");
    setShowLoader(true);

    try {
      let id = import.meta.env.VITE_MEETING_ID;

      if (id) {
        const isValid = await verifyMeeting(id);
        if (!isValid) throw new Error("Invalid meeting ID");
      } else {
        id = await createMeeting();
      }

      const isDispatched = await dispatchAgent({ meetingId: id });

      if (!isDispatched) throw new Error("Agent dispatch failed");

      setMeetingId(id);
      setShowLoader(false);
      handleStatusChange("Connected");
    } catch (error) {
      console.error("error:", error);
      setShowLoader(false);
      handleStatusChange("Disconnected", true);
    }
  };

  const handleEndAgent = () => {
    setShowLoader(false);
    handleStatusChange(null);
    setMeetingId(null);
    setShowCapacityModal(false);
    setShowAgentLeftModal(false);
  };

  const handleMeetingError = (withToast = true) => {
    setShowLoader(false);
    handleStatusChange(withToast ? "Disconnected" : null, withToast);
    setMeetingId(null);
    setShowCapacityModal(false);
    setShowAgentLeftModal(false);
  };

  const props = {
    status,
    showLoader,
    showToast,
    showCapacityModal,
    showAgentLeftModal,
    agentState,
    tilesVisible,
    isChatOpen,
    onTalkToAgent: handleTalkToAgent,
    onEndAgent: handleEndAgent,
    onMeetingError: handleMeetingError,
    onCloseToast: () => handleStatusChange(null),
    setIsChatOpen,
    setTilesVisible,
    setAgentState,
    onCloseAgentLeft: handleEndAgent,
  };

  if (AUTH_TOKEN && meetingId) {
    return (
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: true,
          webcamEnabled: false,
          name: "Pavan",
        }}
        token={AUTH_TOKEN}
      >
        <MeetingProviderContent
          props={props}
          setShowCapacityModal={setShowCapacityModal}
          setShowAgentLeftModal={setShowAgentLeftModal}
        />
      </MeetingProvider>
    );
  }

  return <MainContent {...props} />;
}
