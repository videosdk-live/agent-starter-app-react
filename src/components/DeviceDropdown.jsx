import { useState, useEffect, useRef } from "react";
import {
  useMediaDevice,
  Constants,
} from "@videosdk.live/react-sdk";
import { Check, Mic, Video, Volume2 } from "lucide-react";
import clsx from "clsx";

const DeviceDropdown = ({
  type,
  isOpen,
  onClose,
  anchorRef,
  selectedDeviceId,
  onSelect,
}) => {
  const {
    getCameras,
    getPlaybackDevices,
    getMicrophones,
    requestPermission,
    checkPermissions,
  } = useMediaDevice();

  const [devices, setDevices] = useState([]);
  const [permissionsMap, setPermissionsMap] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const perms = await checkPermissions();
        setPermissionsMap(perms);

        const hasPerm =
          type === "mic" || type === "speaker"
            ? perms?.get(Constants.permission.AUDIO)
            : perms?.get(Constants.permission.VIDEO);

        if (hasPerm) {
          let list = [];
          if (type === "mic") list = (await getMicrophones()) || [];
          else if (type === "webcam") list = (await getCameras()) || [];
          else if (type === "speaker")
            list = (await getPlaybackDevices()) || [];
          setDevices(list);
        }
      } catch (e) {
        console.error("Error fetching devices", e);
      }
    };
    fetchDevices();
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const handleDeviceChange = (deviceId) => {
    const device = devices.find((d) => d.deviceId === deviceId);
    const label = device?.label || `${title} ${deviceId.slice(0, 4)}`;
    onSelect(deviceId, label);
    onClose();
  };

  const hasPermission =
    type === "mic" || type === "speaker"
      ? permissionsMap?.get(Constants.permission.AUDIO)
      : permissionsMap?.get(Constants.permission.VIDEO);

  const handleRequest = async () => {
    try {
      await requestPermission();
      // Re-fetch devices after permission is granted
      onClose();
    } catch (e) {
      console.error("Error requesting permission", e);
    }
  };

  const Icon = type === "mic" ? Mic : type === "webcam" ? Video : Volume2;
  const title =
    type === "mic" ? "Microphone" : type === "webcam" ? "Camera" : "Speaker";

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-[calc(100%+8px)] left-0 z-[100] w-64 bg-[#111111] border border-white/10 rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="max-h-48 overflow-y-auto custom-scrollbar">
        {!hasPermission ? (
          <div className="px-3 py-4 text-center text-white/20 text-xs italic">
            Permission Denied
          </div>
        ) : devices.length === 0 ? (
          <div className="px-3 py-4 text-center text-white/20 text-xs italic">
            No {title.toLowerCase()}s found
          </div>
        ) : (
          devices.map((device) => (
            <button
              key={device.deviceId}
              onClick={() => handleDeviceChange(device.deviceId)}
              className={clsx(
                "w-full flex items-center p-2.5 rounded-lg transition-all text-left gap-3",
                selectedDeviceId === device.deviceId
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                {selectedDeviceId === device.deviceId && (
                  <Check className="w-3.5 h-3.5 text-white/40" />
                )}
              </div>
              <span className="text-xs truncate">
                {device.label || `${title} ${device.deviceId.slice(0, 4)}`}
              </span>
            </button>
          ))
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default DeviceDropdown;
