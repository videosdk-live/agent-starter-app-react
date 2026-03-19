import { useEffect, useMemo } from "react";

export const useVideoStream = (videoRef, stream, isOn) => {
  const mediaStream = useMemo(() => {
    if (isOn && stream) {
      const ms = new MediaStream();
      ms.addTrack(stream.track);
      return ms;
    }
    return null;
  }, [stream, isOn]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      if (mediaStream) {
        videoRef.current.play().catch(e => console.warn("Video play failed", e));
      }
    }
  }, [mediaStream, videoRef]);

  return mediaStream;
};
