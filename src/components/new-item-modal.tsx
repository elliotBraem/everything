import React, { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "./ui/button";
import BaseModal from "./ui/modal";
// import { Alert, AlertDescription } from "./alert";
import { Inventory } from "@/lib/schema";
import { CoMap } from "jazz-tools";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";

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

// Define Zod schema for form validation
const schema = z.object({
  data: z.string().min(1, { message: "Data is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  inventory: z.string().min(1, { message: "Must select an inventory" })
});

type FormData = z.infer<typeof schema>;

export const NewItemForm = ({
  inventories,
  initialValues,
  onSubmit,
  onClose
}: any) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Data Field */}
        <FormField
          name="data"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input {...field} id="data" placeholder="Enter your data" />
              </FormControl>
              {/* <FormMessage>{form.data?.message}</FormMessage> */}
            </FormItem>
          )}
        />

        {/* Type Field */}
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} id="type" placeholder="Enter your type" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Inventory Field */}
        <FormField
          name="inventory"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inventory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {inventories.map((inventory: Inventory) => (
                    <SelectItem key={inventory.id} value={inventory.id}>
                      {inventory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initialValues ? "Update" : "Save"}</Button>
        </div>
      </form>
    </Form>
  );
};

const NewItemModal: React.FC<NewItemModalProps> = ({
  isOpen,
  onClose,
  initialValues,
  onSave,
  inventories,
  selectedInventory
}) => {
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
      <NewItemForm
        initialValues={initialValues}
        inventories={inventories}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </BaseModal>
  );
};

export default NewItemModal;
