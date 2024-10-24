import { atom } from 'jotai';

interface Modal {
  component: React.FC<any>;
  props: Record<string, any>;
}

// keeps track of a stack of atoms
export const modalStackAtom = atom<Modal[]>([]);
