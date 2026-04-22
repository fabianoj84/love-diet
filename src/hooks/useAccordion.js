import { useState } from 'react';

export function useAccordion(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = () => setIsOpen(prev => !prev);

  return { isOpen, toggle };
}
