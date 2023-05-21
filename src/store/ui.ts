import { atom } from 'jotai';

export const isMobileMenuOpenAtom = atom<boolean>(false);

export const activeColorThemeAtom = atom<'red' | 'green' | 'blue' | 'grey'>('red');
