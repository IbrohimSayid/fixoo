"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { checkUserAuthentication, getUserData, logout } from "@/lib/auth"
import { getTranslation, getStoredLanguage } from "@/lib/i18n"
import Header from "@/components/header"
import ClientBottomNavigation from "@/components/client-bottom-navigation"
import { getClientOrders } from "@/lib/storage"
import { formatDistanceToNow } from "date-fns"

export default function ClientOrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState("uz")
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const isAuthenticated = checkUserAuthentication()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const userData = getUserData()
    if (userData?.type !== "client") {
      router.push("/home")
      return
    }

    setUser(userData)

    // Get stored language
    const storedLanguage = getStoredLanguage()
    setLanguage(storedLanguage)

    // Load orders for this client
    const clientOrders = getClientOrders(userData.id)
    setOrders(clientOrders)
  }, [router])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">{getTranslation("pending", language)}</Badge>
      case "accepted":
        return <Badge className="bg-blue-500">{getTranslation("accepted", language)}</Badge>
      case "completed":
        return <Badge className="bg-green-500">{getTranslation("completed", language)}</Badge>
      case "rejected":
        return <Badge className="bg-red-500">{getTranslation("rejected", language)}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return dateString
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary text-white">
        {getTranslation("loading", language)}...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary/5 pb-16 md:pb-0">
      <Header user={user} onLogout={handleLogout} language={language} onLanguageChange={handleLanguageChange} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{getTranslation("ordersList", language)}</h1>

        <Card>
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle>{getTranslation("allOrders", language)}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{getTranslation("specialistName", language)}</TableHead>
                    <TableHead className="hidden md:table-cell">{getTranslation("description", language)}</TableHead>
                    <TableHead className="hidden md:table-cell">{getTranslation("date", language)}</TableHead>
                    <TableHead>{getTranslation("status", language)}</TableHead>
                    <TableHead>{getTranslation("contact", language)}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.specialistName}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.description}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(order.date)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {order.status === "accepted" ? (
                          <span className="text-primary">{order.specialistPhone}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">{getTranslation("noNewOrders", language)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ClientBottomNavigation language={language} />
    </div>
  )
}
