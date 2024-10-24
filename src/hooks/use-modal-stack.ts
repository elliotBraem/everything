// /src/hooks/useModalStack.ts
import { useAtom } from 'jotai';
import { modalStackAtom } from '@/atoms/modal';

export const useModalStack = () => {
  const [modalStack, setModalStack] = useAtom(modalStackAtom);

  // Pushes a new modal onto the stack
  const openModal = (component: React.FC<any>, props: Record<string, any> = {}) => {
    setModalStack((prevStack) => [...prevStack, { component, props }]);
  };

  // Pops the top modal off the stack
  const closeModal = () => {
    setModalStack((prevStack) => prevStack.slice(0, -1)); // Remove the last modal
  };

  // Closes all modals
  const closeAllModals = () => {
    setModalStack([]);
  };

  return {
    modalStack,
    openModal,
    closeModal,
    closeAllModals,
  };
};
