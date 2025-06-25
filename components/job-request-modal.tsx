"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getTranslation } from "@/lib/i18n"
import { saveOrder } from "@/lib/storage"
import { getUserData } from "@/lib/auth"
import toast from 'react-hot-toast'

interface JobRequestModalProps {
  isOpen: boolean
  onClose: () => void
  specialist: any
  language: string
}

export default function JobRequestModal({ isOpen, onClose, specialist, language }: JobRequestModalProps) {
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!description.trim() || !location.trim()) {
      alert(getTranslation("pleaseCompleteAllFields", language))
      return
    }

    setIsSubmitting(true)

    // Get current client data
    const client = getUserData()

    if (!client) {
      alert(getTranslation("loginRequired", language))
      setIsSubmitting(false)
      onClose()
      return
    }

    // Create new order
    const newOrder = {
      id: Math.random().toString(36).substring(2, 15),
      clientId: client.id,
      clientName: `${client.firstName} ${client.lastName}`,
      clientPhone: client.phone,
      specialistId: specialist.id,
      specialistName: `${specialist.firstName} ${specialist.lastName}`,
      specialistPhone: specialist.phone,
      description,
      location,
      date: new Date().toISOString(),
      status: "pending", // pending, accepted, rejected, completed
    }

    // Save order to localStorage
    saveOrder(newOrder)

    setIsSubmitting(false)
    setDescription("")
    setLocation("")
    onClose()

    // Show success message
    toast.success(
      language === 'uz' ? "Buyurtmangiz muvaffaqiyatli yuborildi! Tez orada javob olasiz." :
      language === 'ru' ? "Ваш заказ успешно отправлен! Скоро получите ответ." :
      "Your order has been sent successfully! You'll receive a response soon."
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTranslation("requestSpecialist", language)}</DialogTitle>
          <DialogDescription>
            {getTranslation("requestSpecialistDescription", language)} {specialist?.firstName} {specialist?.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">{getTranslation("jobDescription", language)}</Label>
            <Textarea
              id="description"
              placeholder={getTranslation("jobDescriptionPlaceholder", language)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">{getTranslation("jobLocation", language)}</Label>
            <Input
              id="location"
              placeholder={getTranslation("jobLocationPlaceholder", language)}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            {getTranslation("cancel", language)}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? getTranslation("submitting", language) : getTranslation("submit", language)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
