import React, { useState } from "react";
import BaseModal from "./ui/modal";
import { Button } from "./ui/button";
import { Group } from "jazz-tools";
import { Inventory } from "@/lib/schema";
import { createInviteLink } from "jazz-react";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInventory: Inventory | undefined;
}

// Define Zod schema for form validation
const schema = z.object({
  inventory: z.string().min(1, { message: "Must select an inventory" }),
  permission: z.string().min(1, { message: "Must select a permission" })
});

type FormData = z.infer<typeof schema>;

const availablePermissions = [
  {
    id: "reader",
    name: "reader"
  },
  {
    id: "writer",
    name: "writer"
  },
  {
    id: "admin",
    name: "admin"
  }
];

const InviteForm = ({
  selectedInventory,
  invitedMembers,
  onSubmit,
  onClose
}: any) => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <SelectValue id={selectedInventory.id}>
                      {selectedInventory.name}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    key={selectedInventory.id}
                    value={selectedInventory.id}
                  >
                    {selectedInventory.name}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Permission Field */}
        <FormField
          name="permission"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availablePermissions.map(
                    (permission: { id: string; name: string }) => (
                      <SelectItem key={permission.id} value={permission.id}>
                        {permission.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Invited Members */}
        <div>
          <h3 className="mb-2 text-lg font-medium">Existing Shared Users</h3>
          <div className="max-h-40 overflow-y-auto rounded-md bg-gray-100 p-2">
            {invitedMembers?.length > 0 ? (
              <ul className="list-inside list-disc">
                {invitedMembers.map((user) => (
                  <li
                    key={user?.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{user?.profile?.name}</span>
                    <button
                      onClick={() => {
                        if (!user?._raw) return;
                        selectedInventory?._owner
                          .castAs(Group)
                          ._raw.removeMember(user?._raw);
                      }}
                      className="ml-4 rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No users currently have access to this folder.
              </p>
            )}
          </div>
        </div>

        <Button type="submit">Create Invite Link</Button>
        {/* {inviteLink && (
          <div className="mt-4">
            <label
              htmlFor="inviteLink"
              className="block text-sm font-medium text-gray-700"
            >
              Invite Link
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <Input
                type="text"
                id="inviteLink"
                // className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={inviteLink}
                readOnly
              />
              <Button
                type="button"
                className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 px-3 text-sm text-gray-500"
                onClick={() => navigator.clipboard.writeText(inviteLink)}
              >
                Copy
              </Button>
            </div>
          </div>
        )} */}

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const shareInventory = (
  inventory: Inventory,
  permission: "reader" | "writer" | "admin"
): string | undefined => {
  if (inventory._owner && inventory.id) {
    return createInviteLink(inventory, permission);
  }
  return undefined;
};

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  selectedInventory
}) => {
  const [inviteLink, setInviteLink] = useState("");

  const members = selectedInventory?._owner.castAs(Group).members;
  const invitedMembers = members
    ? members
        .filter((m) => !m.account?.isMe && m.role !== "revoked")
        .map((m) => m.account)
    : [];

  const onSubmit = (values) => {
    if (!selectedInventory || !values.selectedPermission) return;
    const inviteLink = shareInventory(
      selectedInventory,
      values.selectedPermission
    );
    if (!inviteLink) return;
    setInviteLink(inviteLink);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Invite Users">
      <InviteForm
        selectedInventory={selectedInventory}
        onSubmit={onSubmit}
        invitedMembers={invitedMembers}
        onClose={onClose}
      />
    </BaseModal>
  );
};

export default InviteModal;
