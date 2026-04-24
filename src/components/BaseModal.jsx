import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";

const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  zIndex = 2000,
  actions = [],
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      style={{ zIndex }}
    >
      <div
        className="bg-modal border border-[#FFFFFF0D] rounded-modal shadow-2xl p-[20px_24px] flex flex-col justify-between animate-in zoom-in-95 duration-200 w-[500px] h-[154px]"
      >
        {/* Header */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between h-[26px] mb-1">
            <h3 className="text-white text-[18px] font-[600] leading-[26px]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-muted text-[12px] leading-[16px] font-[400]">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-[12px]">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={clsx(
                "h-[32px] text-[12px] rounded-button shadow-button transition-all duration-300 ease-out flex items-center justify-center hover:brightness-110 active:scale-95 transform-gpu cursor-pointer",
                action.variant === "primary"
                  ? "bg-accent text-modal"
                  : "bg-btn-secondary text-white"
              )}
              style={{ width: action.width ?? "126px" }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default BaseModal;
