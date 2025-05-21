"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getTranslation } from "@/lib/i18n"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  language: string
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, description, language }: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            {getTranslation("no", language)}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {getTranslation("yes", language)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
