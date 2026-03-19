import { useState, useEffect } from "react";
import { useMediaDevice, Constants } from "@videosdk.live/react-sdk";

export const useMediaPermissions = () => {
  const { checkPermissions, requestPermission } = useMediaDevice();
  const [audioPermission, setAudioPermission] = useState(true);
  const [videoPermission, setVideoPermission] = useState(true);
  const [micDecline, setMicDecline] = useState(false);
  const [camDecline, setCamDecline] = useState(false);

  const refreshPermissions = async () => {
    try {
      const perms = await checkPermissions();
      setAudioPermission(perms.get(Constants.permission.AUDIO));
      setVideoPermission(perms.get(Constants.permission.VIDEO));
    } catch (e) {
      console.error("Error checking permissions", e);
    }
  };

  useEffect(() => {
    refreshPermissions();

    if (navigator.permissions && navigator.permissions.query) {
      const observe = async (name, setState) => {
        try {
          const status = await navigator.permissions.query({ name });
          setState(status.state === "denied");
          status.onchange = () => setState(status.state === "denied");
        } catch (e) {
          console.warn(`Query ${name} failed`, e);
        }
      };

      observe("microphone", setMicDecline);
      observe("camera", setCamDecline);
    }
  }, []);

  const handleRequest = async (type) => {
    const pType =
      type === "mic" ? Constants.permission.AUDIO : Constants.permission.VIDEO;
    try {
      await requestPermission(pType);
      await refreshPermissions();
      return true;
    } catch (e) {
      console.error("Request permission failed", e);
      return false;
    }
  };

  return {
    audioPermission,
    videoPermission,
    micDecline,
    camDecline,
    requestPermission: handleRequest,
    refreshPermissions,
  };
};
