import React from "react";
import { Modal } from "./Modal";
import { Button } from "@/core/components/ui/button";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  textKey?: string;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  loading,
  _textKey = "admin.common.deleteConfirm"
}) => {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Подтверждение удаления"
      description="Вы уверены, что хотите удалить этот элемент?"
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Отмена
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            Удалить
          </Button>
        </div>
      }
    >
      <></>
    </Modal>
  );
};

export default DeleteConfirmModal;