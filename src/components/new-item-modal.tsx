import React, { useEffect } from "react";
import { SubmitHandler, useForm, FieldValues } from "react-hook-form";
import BaseModal from "./base-modal";
import { Button } from "./ui/button";
// import { Alert, AlertDescription } from "./alert";
import { Inventory } from "@/lib/schema";
import { CoMap } from "jazz-tools";
import { Alert, AlertDescription } from "./ui/alert";

export interface ThingFormValues extends FieldValues {
  data?: string;
  type?: string;
  deleted: boolean;
  inventory: Inventory | null;
}

interface NewItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: ThingFormValues;
  onSave: (item: ThingFormValues) => void;
  inventories: Inventory[];
  selectedInventory: Inventory | undefined;
}

const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSave,
  inventories,
  selectedInventory
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
    // @ts-expect-error error
  } = useForm<ThingFormValues>({
    defaultValues: initialValues || {
      data: "",
      type: "",
      deleted: false,
      inventory: selectedInventory
    }
  });

  useEffect(() => {
    if (initialValues) {
      Object.entries(initialValues).forEach(([key, value]) => {
        const valueToSet = value instanceof CoMap ? value.id : value;
        setValue(key as keyof ThingFormValues & string, valueToSet);
      });
    } else {
      reset();
    }
  }, [initialValues, setValue, reset]);

  const onSubmit: SubmitHandler<ThingFormValues> = (data) => {
    const inventoryId = data?.inventory as unknown as string;
    const selectedInventory = inventories.find(
      (inventory) => inventory.id === inventoryId
    );
    if (selectedInventory) {
      data.inventory = selectedInventory;
    }
    onSave(data);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialValues ? "Edit Password" : "Add New Password"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="data"
            className="block text-sm font-medium text-gray-700"
          >
            Data
          </label>
          <input
            type="text"
            {...register("data", { required: "Data is required" })}
            id="data"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <Alert variant="destructive">
              <AlertDescription>{errors.name.message}</AlertDescription>
            </Alert>
          )}
        </div>
        
        
        <div>
          <label
            htmlFor="inventory"
            className="block text-sm font-medium text-gray-700"
          >
            Inventory
          </label>
          <select
            {...register("inventory", { required: "Must select a inventory" })}
            id="inventory"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a inventory</option>
            {inventories.map((inventory: Inventory) => (
              <option
                key={inventory.id}
                value={inventory.id}
                selected={
                  initialValues
                    ? initialValues?.inventory?.id === inventory.id
                    : selectedInventory?.id === inventory.id
                }
              >
                {inventory.name}
              </option>
            ))}
          </select>
          {errors.inventory && (
            <Alert variant="destructive">
              <AlertDescription>{errors.inventory.message}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialValues ? "Update" : "Save"}</Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default NewItemModal;
