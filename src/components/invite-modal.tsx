import React, { useState } from "react";
import BaseModal from "./base-modal";
import { Button } from "./ui/button";
import { Group } from "jazz-tools";
import { Inventory } from "@/lib/schema";
import { createInviteLink } from "jazz-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInventory: Inventory | undefined;
}

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
  const [selectedPermission, setSelectedPermission] = useState<
    "reader" | "writer" | "admin"
  >("reader");
  const [inviteLink, setInviteLink] = useState("");

  const members = selectedInventory?._owner.castAs(Group).members;
  const invitedMembers = members
    ? members
        .filter((m) => !m.account?.isMe && m.role !== "revoked")
        .map((m) => m.account)
    : [];

  const handleCreateInviteLink = () => {
    if (!selectedInventory || !selectedPermission) return;
    const inviteLink = shareInventory(selectedInventory, selectedPermission);
    if (!inviteLink) return;
    setInviteLink(inviteLink);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Invite Users">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="inventory"
            className="block text-sm font-medium text-gray-700"
          >
            Select Inventory to Share
          </label>
          <select
            id="inventory"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option key={selectedInventory?.id} value={selectedInventory?.id}>
              {selectedInventory?.name}
            </option>
          </select>
        </div>
        <div>
          <label
            htmlFor="permission"
            className="block text-sm font-medium text-gray-700"
          >
            Select Permission
          </label>
          <select
            id="permission"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={selectedPermission}
            onChange={(e) =>
              setSelectedPermission(
                e.target.value as "reader" | "writer" | "admin"
              )
            }
          >
            <option value="reader">Reader</option>
            <option value="writer">Writer</option>
          </select>
        </div>
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
        <Button onClick={handleCreateInviteLink} className="w-full">
          Create Invite Link
        </Button>
        {inviteLink && (
          <div className="mt-4">
            <label
              htmlFor="inviteLink"
              className="block text-sm font-medium text-gray-700"
            >
              Invite Link
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="inviteLink"
                className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
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
        )}
      </div>
    </BaseModal>
  );
};

export default InviteModal;
