"use client";

import { Modal } from "@heroui/react";
import type { ReactNode } from "react";

type Props = { title: string; isOpen: boolean; onClose: () => void; children: ReactNode };

export function ModalFrame({ title, isOpen, onClose, children }: Props) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()} className="bg-black/65">
      <Modal.Container>
        <Modal.Dialog className="w-full max-w-[560px] rounded-xl border border-ra-line bg-ra-panel p-6">
          <Modal.Header>
            <Modal.Heading className="text-lg font-semibold">{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>{children}</Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
