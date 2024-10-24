import { atom } from 'jotai';

interface Sheet {
  component: React.FC<any>;
  props: Record<string, any>;
}

// keeps track of a stack of atoms
export const sheetStackAtom = atom<Sheet[]>([]);
