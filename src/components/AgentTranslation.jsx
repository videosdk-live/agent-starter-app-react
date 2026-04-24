import React, { useEffect, useRef } from "react";
import clsx from "clsx";

const AgentTranslation = ({ transcriptions = [], isChatOpen, isSidebar }) => {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  const isAtBottom = useRef(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    isAtBottom.current = scrollHeight - scrollTop - clientHeight < 50;
  };

  useEffect(() => {
    if (isAtBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [transcriptions]);

  return (
    <div
      className={clsx(
        "z-40 flex flex-col pointer-events-auto",
        isSidebar
          ? "relative w-full h-full"
          : "absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-smooth justify-end w-[500px] h-[172px]",
        !isSidebar && (isChatOpen ? "bottom-[180px]" : "bottom-[115px]")
      )}
    >
      {transcriptions.length > 0 ? (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-col gap-3 w-full overflow-y-auto flex-1 h-full min-h-0 pb-8"
        >
          {transcriptions.map((t) => (
            <div
              key={t.id}
              className="flex flex-row items-start gap-[10.67px] w-full shrink-0"
            >
              {/* Avatar Circle */}
              <div className="flex items-center justify-center rounded-full bg-muted mt-[2px] w-[25.6px] h-[25.6px] shrink-0">
                <span className="text-card font-medium text-[12px]">
                  {t.participantName?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>

              {/* Text Column (Name + Transcribed Text) */}
              <div className="flex flex-col items-start gap-1 w-full text-left">
                {/* Participant Name */}
                <span className="font-normal text-[14px] leading-[20px] text-muted">
                  {t.participantName || "Agent"}
                </span>

                {/* Transcription Text */}
                <p className="w-full font-medium text-[14px] leading-[20px] text-white">
                  {t.text}
                </p>
              </div>
            </div>
          ))}

          {/* Scroll anchor — always stays at the bottom */}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-2 opacity-50 h-full w-full"></div>
      )}
    </div>
  );
};

export default AgentTranslation;
