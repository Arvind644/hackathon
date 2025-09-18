// This component is no longer used in the virtual try-on workflow
// but kept for potential future use or reference

'use client';

import { useState } from 'react';

interface PromptData {
  style: string;
  occasion: string;
  colors: string[];
  additional: string;
}

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (promptData: PromptData) => void;
}

export default function PromptModal({ isOpen, onClose, onSubmit }: PromptModalProps) {
  // Component kept for reference but not used in current workflow
  return null;
}