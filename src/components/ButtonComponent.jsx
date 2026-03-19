import clsx from "clsx";
import { forwardRef } from "react";
import { Spinner } from "../ui/spinner";

const VARIANT_CONFIGS = {
  default: {
    bg: "bg-[#1B1B1E]",
    border: "border-[#303033]",
    hoverBorder: "hover:border-[#5E5E61]",
    active: (isOn) => (isOn ? "border-[#FFFFFF]" : "border-[#F87171]"),
  },
  danger: {
    bg: "bg-[#991B1B]",
    hoverBg: "hover:bg-[#B91C1C]",
    text: "text-white",
    base: "border-none",
  },
  ghost: {
    bg: (isOn) => (isOn ? "bg-[#FFFFFF06]" : "bg-[#F8717106]"),
    border: (isOn) => (isOn ? "border-[#FFFFFF1A]" : "border-[#F871711A]"),
    hoverBg: (isOn) => (isOn ? "hover:bg-[#FFFFFF0D]" : "hover:bg-[#F871710D]"),
    hoverBorder: (isOn) => (isOn ? "hover:border-[#FFFFFF33]" : "hover:border-[#F8717133]"),
    active: (isOn) => (isOn ? "border-[#FFFFFF]" : "border-[#F87171]"),
  },
};

const ButtonComponent = forwardRef(function ButtonComponent(
  {
    isOn = true,
    variant = "default",
    isActive = false,
    label,
    children,
    unstyled = false,
    isLoading = false,
    disabled = false,
    visualDisabled = false,
    onClick,
    BtnIcon,
    className,
    IconClassName,
  },
  ref
) {
  const isDisabled = (disabled || isLoading) && !visualDisabled;
  const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.default;

  const getStyleClasses = () => {
    if (unstyled) return "";

    const resolve = (val) => (typeof val === "function" ? val(isOn) : val);

    const classes = [
      resolve(config.bg),
      resolve(config.border),
      resolve(config.hoverBg),
      resolve(config.hoverBorder),
      config.base,
    ];

    if (isActive && config.active) {
      classes.push(config.active(isOn));
    }

    if (isDisabled) {
      return clsx(classes, "opacity-100 cursor-not-allowed");
    }

    return clsx(classes);
  };

  const baseClasses = "flex items-center justify-center cursor-pointer transition-all duration-150 rounded-[8px] border-[0.5px] font-['Inter'] font-medium text-[12px] leading-[16px] select-none shadow-[-1px_-1px_1px_0px_#00000040_inset,0px_4px_4px_0px_#00000040] relative overflow-hidden";
  const textClasses = config.text || (isOn ? "text-white" : "text-[#F87171]");

  return (
    <button
      ref={ref}
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={clsx(
        !unstyled && baseClasses,
        getStyleClasses(),
        visualDisabled && "opacity-50 grayscale-[0.5] cursor-pointer",
        textClasses,
        className
      )}
    >
      {isLoading ? (
        <Spinner className="w-4 h-4" />
      ) : (
        <>
          {BtnIcon && (
            <BtnIcon className={clsx("w-5 h-5 transition-all duration-200", IconClassName, isOn ? "" : "opacity-70")} />
          )}
          {label && <span className="truncate">{label}</span>}
          {children}
        </>
      )}
    </button>
  );
});

export default ButtonComponent;
