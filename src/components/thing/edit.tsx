import { useModalStack } from "@/hooks/use-modal-stack";
import { Thing } from "@/lib/schema";
import { useState } from "react";
import { ConfirmationModal } from "../confirmation-modal";
import { Button } from "../ui/button";

interface EditThingProps {
  thing: Thing;
  inventory: string;
}

export const EditThing: React.FC<EditThingProps> = ({ thing }) => {
  const [formData, setFormData] = useState();
  const { openModal, closeModal } = useModalStack();

  const handleConfirmClick = () => {
    openModal(ConfirmationModal, {
      message: "Are you sure?",
      onConfirm: () => {
        console.log("Confirmed!");
      },
      onCancel: () => {}
    });
  };

  const handleSubmit = () => {
    // Handle the update logic here
    console.log("Updating thing:", formData);
  };

  return (
    <div>
      <h2>{thing.id}</h2>
      {/* form logic */}
      <Button onClick={handleConfirmClick}>Open Confirmation</Button>
    </div>
  );
};
