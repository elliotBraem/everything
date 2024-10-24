import { atom, useAtom } from "jotai";

/**
 * easy to stack modals, just provide the content with props
 * ships with @/components/common/modal-stack.tsx
 *
 * usage:
 */

// const { openModal, closeModal, closeAllModals } = useModalStack();
// function Content(props) { return <p>{props.message}</p> }
// openModal(Content, "hello");

// closeModal(); // closes top of stack

export interface Metadata {
  title: string;
  description?: string;
}

interface Modal {
  component: React.FC<any>;
  props: Record<string, any>;
  metadata: Metadata;
}

// keeps track of a stack of atoms
export const modalStackAtom = atom<Modal[]>([]);

export const useModalStack = () => {
  const [modalStack, setModalStack] = useAtom(modalStackAtom);

  // Pushes a new modal onto the stack
  const openModal = (
    component: React.FC<any>,
    props: Record<string, any> = {},
    metadata: Metadata
  ) => {
    setModalStack((prevStack) => [...prevStack, { component, props, metadata }]);
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
    closeAllModals
  };
};
