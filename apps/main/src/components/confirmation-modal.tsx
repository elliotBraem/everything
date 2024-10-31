import { Button } from "@/components/ui/button";
import { useModalStack } from "@/hooks/use-modal-stack";
import WindowContainer from "./common/window-container";

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onConfirm,
  onCancel
}) => {
  const { closeModal } = useModalStack();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button onClick={handleConfirm}>Yes</Button>
      <Button onClick={handleCancel} variant="ghost">
        Cancel
      </Button>
    </div>
  );
};
