// /src/components/ModalStack.tsx
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModalStack } from "@/hooks/use-modal-stack";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import WindowContainer from "./window-container";

export const ModalStack = () => {
  const { modalStack, closeModal } = useModalStack();

  if (modalStack.length === 0) return null;

  return (
    <>
      {modalStack.map(({ component: Component, props, metadata }, index) => (
        <Dialog key={index} open={true} onOpenChange={closeModal}>
          <DialogContent>
            <div className="flex-1 overflow-y-auto">
              <DialogHeader className="text-left">
                <DialogTitle>{metadata.title}</DialogTitle>
                <DialogDescription>{metadata.description}</DialogDescription>
              </DialogHeader>
            </div>

            <Component {...props} />
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
};
