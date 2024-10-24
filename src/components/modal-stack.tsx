// /src/components/ModalStack.tsx
import { useModalStack } from '@/hooks/use-modal-stack';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const ModalStack = () => {
  const { modalStack, closeModal } = useModalStack();

  if (modalStack.length === 0) return null;

  return (
    <>
      {modalStack.map(({ component: Component, props }, index) => (
        <Dialog
          key={index}
          open={true}
          onOpenChange={closeModal}
        >
          <DialogContent>
            <Component {...props} />
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
};
