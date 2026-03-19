import BaseModal from "./BaseModal";

const PermissionModal = ({ isOpen, onClose, type = "mic" }) => {
  const isMic = type === "mic";
  const title = isMic ? "Microphone Permission Required" : "Camera Permission Required";
  
  const description = isMic
    ? "It seems like you have declined microphone access. To talk, please click the site settings icon in your browser's address bar and enable the microphone."
    : "It seems like you have declined camera access. To be seen, please click the site settings icon in your browser's address bar and enable the camera.";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      zIndex={2000}
      actions={[
        {
          label: "Okay",
          onClick: onClose,
          variant: "primary",
        },
      ]}
    />
  );
};

export default PermissionModal;

