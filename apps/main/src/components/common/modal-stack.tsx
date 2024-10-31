import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useModalStack } from "@/hooks/use-modal-stack";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

const ModalWindowControls = ({ onClose }: { onClose: () => void }) => (
  <div className="border-b-2 border-gray-800">
    <div className="flex items-center justify-end">
      <div
        className="mx-4 my-3 h-4 w-4 cursor-pointer rounded-full bg-black transition-opacity hover:opacity-80"
        onClick={onClose}
      />
    </div>
  </div>
);

export const ModalStack = () => {
  const { modalStack, closeModal } = useModalStack();

  if (modalStack.length === 0) return null;

  return (
    <>
      {modalStack.map(({ component: Component, props, metadata }, index) => (
        <Dialog key={index} open={true} onOpenChange={closeModal}>
          <DialogContent className="border-none p-0 shadow-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative border-2 border-gray-800 bg-white shadow-[4px_4px_0_rgba(0,0,0,1)]"
            >
              <ModalWindowControls onClose={closeModal} />

              <div className="p-6">
                <DialogHeader className="text-left">
                  <DialogTitle className="font-mono text-xl font-semibold">
                    {metadata.title}
                  </DialogTitle>
                  {metadata.description && (
                    <DialogDescription className="text-gray-600">
                      {metadata.description}
                    </DialogDescription>
                  )}
                </DialogHeader>

                <div className="mt-4">
                  <Component {...props} />
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
};
