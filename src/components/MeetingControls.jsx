import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  useMeeting,
  useMediaDevice,
  usePubSub,
} from "@videosdk.live/react-sdk";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  MonitorUp,
  MessageSquareText,
  MessageSquareX,
  ChevronUp,
  MoreHorizontal,
  SendHorizontal,
} from "lucide-react";
import ButtonComponent from "./ButtonComponent";
import Waveform from "./Waveform";
import DeviceDropdown from "./DeviceDropdown";
import PermissionModal from "./PermissionModal";
import InfoIcon from "../assets/Info.png";
import clsx from "clsx";
import { useTimer } from "../hooks/useTimer";
import { useMediaPermissions } from "../hooks/useMediaPermissions";

const PermissionIndicator = ({ onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 z-20"
    title="Permission required"
  >
    <img src={InfoIcon} alt="Info" className="w-full h-full object-contain" />
  </button>
);

const GroupWrapper = forwardRef(({ children, className, onClick }, ref) => (
  <div
    ref={ref}
    onClick={onClick}
    className={clsx(
      "flex items-center bg-[#1B1B1E] rounded-[8px] border-[0.5px] border-[#303033] hover:border-[#5E5E61] transition-all duration-150 shadow-inner font-['Inter'] relative cursor-pointer",
      className,
    )}
  >
    {children}
  </div>
));

export const MeetingControls = ({ onEnd, onChatToggle }) => {
  const {
    localParticipant,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    changeMic,
    changeWebcam,
    end,
    activeSpeakerId,
  } = useMeeting();

  const { publish } = usePubSub("CHAT");
  const { getMicrophones, getCameras, getPlaybackDevices } = useMediaDevice();
  
  // Custom Hooks
  const timer = useTimer();
  const { 
    audioPermission, 
    videoPermission, 
    micDecline, 
    camDecline, 
    requestPermission 
  } = useMediaPermissions();

  // Local State
  const [speakerOn, setSpeakerOn] = useState(true);
  const [chatOn, setChatOn] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [modalState, setModalState] = useState({ isOpen: false, type: "mic" });
  const [selectedMic, setSelectedMic] = useState({ id: null, label: null });
  const [selectedWebcam, setSelectedWebcam] = useState({ id: null, label: null });
  const [selectedSpeaker, setSelectedSpeaker] = useState({ id: null, label: null });

  const micRef = useRef(null);
  const speakerRef = useRef(null);
  const webcamRef = useRef(null);

  const micOn = localParticipant?.micOn ?? false;
  const videoOn = localParticipant?.webcamOn ?? false;
  const sharingOn = localParticipant?.screenShareOn ?? false;

  const toggleDropdown = (type) => {
    if (type === "mic" && (!micOn || !audioPermission)) return;
    if (type === "webcam" && (!videoOn || !videoPermission)) return;
    if (type === "speaker" && !speakerOn) return;
    setActiveDropdown(activeDropdown === type ? null : type);
  };

  const handleToggleMic = () => micDecline ? setModalState({ isOpen: true, type: "mic" }) : toggleMic();
  const handleToggleWebcam = () => camDecline ? setModalState({ isOpen: true, type: "webcam" }) : toggleWebcam();

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    try {
      await publish(chatMessage.trim());
      setChatMessage("");
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  const handleSpeakerChange = (deviceId, label) => {
    setSelectedSpeaker({ id: deviceId, label });
    const audioTags = document.getElementsByTagName("audio");
    Array.from(audioTags).forEach((tag) => {
      if (typeof tag.setSinkId === "function") {
        tag.setSinkId(deviceId).catch(err => console.error("Error setting sink ID:", err));
      }
    });
  };

  // Device Initialization
  useEffect(() => {
    const initDevices = async () => {
      if (audioPermission) {
        const mics = await getMicrophones();
        if (mics?.length > 0 && !selectedMic.id) {
          const defaultMic = mics.find(d => d.deviceId === "default") || mics[0];
          setSelectedMic({ id: defaultMic.deviceId, label: defaultMic.label });
        }
        const speakers = await getPlaybackDevices();
        if (speakers?.length > 0 && !selectedSpeaker.id) {
          const defaultSpk = speakers.find(d => d.deviceId === "default") || speakers[0];
          setSelectedSpeaker({ id: defaultSpk.deviceId, label: defaultSpk.label });
        }
      }
      if (videoPermission) {
        const cams = await getCameras();
        if (cams?.length > 0 && !selectedWebcam.id) {
          const defaultCam = cams.find(d => d.deviceId === "default") || cams[0];
          setSelectedWebcam({ id: defaultCam.deviceId, label: defaultCam.label });
        }
      }
    };
    initDevices();
  }, [audioPermission, videoPermission]);

  // Speaker Volume control logic
  useEffect(() => {
    const audioTags = document.getElementsByTagName("audio");
    Array.from(audioTags).forEach(tag => tag.volume = speakerOn ? 1 : 0);
  }, [speakerOn]);

  return (
    <div
      className={clsx(
        "p-[1px] pb-0 rounded-[24px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu",
        chatOn ? "min-h-[137px]" : "min-h-[72px]"
      )}
      style={{
        width: "500px",
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)",
      }}
    >
      <div
        className={clsx(
          "flex flex-col bg-black rounded-[23px] w-full h-full p-[20px_24px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl transform-gpu will-change-transform",
          chatOn ? "justify-between" : "justify-center"
        )}
      >
        <div
          className={clsx(
            "flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
            chatOn ? "h-[56px] opacity-100 mb-2" : "h-0 opacity-0 mb-0"
          )}
        >
          <div className="flex items-center justify-between w-full h-[40px] pt-1 pb-1">
            <input
              type="text"
              placeholder="Type something..."
              className="bg-transparent text-white border-none outline-none font-['Inter'] text-[14px] leading-[20px] w-[350px] placeholder:text-white/40"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <button
              disabled={!chatMessage.trim()}
              className={clsx(
                "w-8 h-8 flex items-center justify-center bg-[#303033] rounded-[6px] border-[0.5px] border-transparent shadow-[-1px_-1px_1px_0px_#00000040_inset,0px_4px_4px_0px_#00000040] transition-all duration-200",
                chatMessage.trim() ? "opacity-100 hover:border-white cursor-pointer" : "opacity-50 cursor-not-allowed"
              )}
              onClick={handleSendMessage}
            >
              <SendHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="w-full h-[0.5px] bg-white/10 mt-2" />
        </div>

        <div className="flex items-center justify-start gap-[12px] h-[32px] w-full">
          <div className="text-[#919093] font-['Inter'] font-normal text-[14px] leading-[20px] text-left select-none shrink-0 tabular-nums">
            {timer}
          </div>

          <div className="flex items-center justify-center gap-[6px] w-fit h-[32px]">
            {/* Mic Group */}
            <GroupWrapper ref={micRef} onClick={handleToggleMic} className="w-[70px] h-[32px] pt-1 pr-2 pb-1 pl-1 gap-1">
              <ButtonComponent
                isOn={micOn} unstyled className="w-5 h-5 pointer-events-none"
                BtnIcon={micOn ? Mic : MicOff} visualDisabled={!audioPermission}
              />
              {micOn ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <Waveform isOn={activeSpeakerId === localParticipant.id} />
                </div>
              ) : (
                <MoreHorizontal className="w-4 h-4 text-white/40" />
              )}
              <div className="flex items-center">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDropdown("mic"); }}
                  className="p-0 text-white/40 hover:text-white transition-colors"
                >
                  <ChevronUp className={clsx("w-4 h-4 transition-transform duration-200", activeDropdown === "mic" && "rotate-180")} />
                </button>
              </div>
              {micDecline && <PermissionIndicator onClick={() => setModalState({ isOpen: true, type: "mic" })} />}
              {activeDropdown === "mic" && (
                <DeviceDropdown
                  type="mic" isOpen anchorRef={micRef} selectedDeviceId={selectedMic.id}
                  onClose={() => setActiveDropdown(null)}
                  onSelect={(id, label) => { setSelectedMic({ id, label }); changeMic(id); }}
                />
              )}
            </GroupWrapper>

            {/* Speaker Group */}
            <GroupWrapper ref={speakerRef} onClick={() => setSpeakerOn(!speakerOn)} className="w-[56px] h-[32px] pt-1 pr-2 pb-1 pl-1 gap-1">
              <ButtonComponent
                isOn={speakerOn} unstyled className="w-5 h-5 pointer-events-none"
                BtnIcon={speakerOn ? Volume2 : VolumeX}
              />
              <div className="flex items-center ml-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDropdown("speaker"); }}
                  className="p-0 text-white/40 hover:text-white transition-colors"
                >
                  <ChevronUp className={clsx("w-4 h-4 transition-transform duration-200", activeDropdown === "speaker" && "rotate-180")} />
                </button>
              </div>
              {activeDropdown === "speaker" && (
                <DeviceDropdown
                  type="speaker" isOpen anchorRef={speakerRef} selectedDeviceId={selectedSpeaker.id}
                  onClose={() => setActiveDropdown(null)} onSelect={handleSpeakerChange}
                />
              )}
            </GroupWrapper>

            {/* Video Group */}
            <GroupWrapper ref={webcamRef} onClick={handleToggleWebcam} className="w-[56px] h-[32px] pt-1 pr-2 pb-1 pl-1 gap-1">
              <ButtonComponent
                isOn={videoOn} unstyled className="w-5 h-5 pointer-events-none"
                BtnIcon={videoOn ? Video : VideoOff} visualDisabled={!videoPermission}
              />
              <div className="flex items-center ml-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDropdown("webcam"); }}
                  className="p-0 text-white/40 hover:text-white transition-colors"
                >
                  <ChevronUp className={clsx("w-4 h-4 transition-transform duration-200", activeDropdown === "webcam" && "rotate-180")} />
                </button>
                {camDecline && <PermissionIndicator onClick={() => setModalState({ isOpen: true, type: "webcam" })} />}
              </div>
              {activeDropdown === "webcam" && (
                <DeviceDropdown
                  type="webcam" isOpen anchorRef={webcamRef} selectedDeviceId={selectedWebcam.id}
                  onClose={() => setActiveDropdown(null)}
                  onSelect={(id, label) => { setSelectedWebcam({ id, label }); changeWebcam(id); }}
                />
              )}
            </GroupWrapper>

            <ButtonComponent
              isOn={sharingOn} onClick={() => toggleScreenShare()}
              className={clsx("w-8 h-8 p-1 gap-1 transition-all duration-200 hover:border-white text-white", sharingOn ? "bg-[#37265E] border-[#D1BCFE]" : "bg-[#1B1B1E] border-[#303033]")}
              BtnIcon={MonitorUp}
            />

            <ButtonComponent
              isOn={chatOn} BtnIcon={chatOn ? MessageSquareX : MessageSquareText}
              className={clsx("w-8 h-8 p-1 gap-1 transition-all duration-200 hover:border-white text-white", chatOn ? "bg-[#37265E] border-[#D1BCFE]" : "bg-[#1B1B1E] border-[#303033]")}
              onClick={() => { const next = !chatOn; setChatOn(next); onChatToggle?.(next); }}
            />
          </div>

          <div className="ml-auto">
            <ButtonComponent
              variant="danger" label="End Call"
              className="w-[79px] h-[32px] p-[6px_12px] gap-[4px] rounded-[8px] font-bold"
              onClick={() => { end(); onEnd?.(); }}
            />
          </div>
        </div>
      </div>

      <PermissionModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onEnable={async () => {
          const success = await requestPermission(modalState.type);
          if (success) {
            if (modalState.type === "mic") toggleMic();
            else toggleWebcam();
          }
        }}
      />
    </div>
  );
};
