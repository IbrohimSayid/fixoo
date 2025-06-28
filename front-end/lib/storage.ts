// Storage utility functions for localStorage

// Save user profile data
export const saveUserProfile = (userData: any) => {
  if (typeof window === "undefined") return false

  try {
    // Get all users
    const users = JSON.parse(localStorage.getItem("fixoo_users") || "[]")

    // Find and update the current user
    const updatedUsers = users.map((user: any) => {
      if (user.id === userData.id) {
        return { ...user, ...userData }
      }
      return user
    })

    // Save updated users
    localStorage.setItem("fixoo_users", JSON.stringify(updatedUsers))

    // Update current user if it's the logged in user
    const currentUser = JSON.parse(localStorage.getItem("fixoo_current_user") || "null")
    if (currentUser && currentUser.id === userData.id) {
      localStorage.setItem("fixoo_current_user", JSON.stringify({ ...currentUser, ...userData }))
    }

    return true
  } catch (error) {
    console.error("Error saving user profile:", error)
    return false
  }
}

// Save user media (portfolio)
export const saveUserMedia = (userId: string, media: any[]) => {
  if (typeof window === "undefined") return false

  try {
    // Get existing media or initialize
    const allMedia = JSON.parse(localStorage.getItem("fixoo_user_media") || "{}")

    // Update media for this user
    allMedia[userId] = media

    // Save to localStorage
    localStorage.setItem("fixoo_user_media", JSON.stringify(allMedia))

    return true
  } catch (error) {
    console.error("Error saving user media:", error)
    return false
  }
}

// Get user media (portfolio)
export const getUserMedia = (userId: string) => {
  if (typeof window === "undefined") return []

  try {
    const allMedia = JSON.parse(localStorage.getItem("fixoo_user_media") || "{}")
    return allMedia[userId] || []
  } catch (error) {
    console.error("Error getting user media:", error)
    return []
  }
}

// Save orders
export const saveOrder = (order: any) => {
  if (typeof window === "undefined") return false

  try {
    // Get existing orders
    const orders = JSON.parse(localStorage.getItem("fixoo_orders") || "[]")

    // Add new order
    orders.push(order)

    // Save to localStorage
    localStorage.setItem("fixoo_orders", JSON.stringify(orders))

    return true
  } catch (error) {
    console.error("Error saving order:", error)
    return false
  }
}

// Get all orders
export const getAllOrders = () => {
  if (typeof window === "undefined") return []

  try {
    return JSON.parse(localStorage.getItem("fixoo_orders") || "[]")
  } catch (error) {
    console.error("Error getting orders:", error)
    return []
  }
}

// Get orders for a specific specialist
export const getSpecialistOrders = (specialistId: string) => {
  if (typeof window === "undefined") return []

  try {
    const orders = JSON.parse(localStorage.getItem("fixoo_orders") || "[]")
    return orders.filter((order: any) => order.specialistId === specialistId)
  } catch (error) {
    console.error("Error getting specialist orders:", error)
    return []
  }
}

// Get new orders for a specific specialist
export const getNewSpecialistOrders = (specialistId: string) => {
  if (typeof window === "undefined") return []

  try {
    const orders = JSON.parse(localStorage.getItem("fixoo_orders") || "[]")
    return orders.filter((order: any) => order.specialistId === specialistId && order.status === "pending")
  } catch (error) {
    console.error("Error getting new specialist orders:", error)
    return []
  }
}

// Get orders for a specific client
export const getClientOrders = (clientId: string) => {
  if (typeof window === "undefined") return []

  try {
    const orders = JSON.parse(localStorage.getItem("fixoo_orders") || "[]")
    return orders.filter((order: any) => order.clientId === clientId)
  } catch (error) {
    console.error("Error getting client orders:", error)
    return []
  }
}

// Update order status
export const updateOrderStatus = (orderId: string, status: string) => {
  if (typeof window === "undefined") return false

  try {
    // Get existing orders
    const orders = JSON.parse(localStorage.getItem("fixoo_orders") || "[]")

    // Update status for the specified order
    const updatedOrders = orders.map((order: any) => {
      if (order.id === orderId) {
        return { ...order, status, statusUpdatedAt: new Date().toISOString() }
      }
      return order
    })

    // Save updated orders
    localStorage.setItem("fixoo_orders", JSON.stringify(updatedOrders))

    return true
  } catch (error) {
    console.error("Error updating order status:", error)
    return false
  }
}

// Delete user account
export const deleteUserAccount = (userId: string) => {
  if (typeof window === "undefined") return false

  try {
    // Get all users
    const users = JSON.parse(localStorage.getItem("fixoo_users") || "[]")

    // Filter out the user to delete
    const updatedUsers = users.filter((user: any) => user.id !== userId)

    // Save updated users
    localStorage.setItem("fixoo_users", JSON.stringify(updatedUsers))

    // Remove current user if it's the deleted user
    const currentUser = JSON.parse(localStorage.getItem("fixoo_current_user") || "null")
    if (currentUser && currentUser.id === userId) {
      localStorage.removeItem("fixoo_current_user")
    }

    // Remove user media
    const allMedia = JSON.parse(localStorage.getItem("fixoo_user_media") || "{}")
    if (allMedia[userId]) {
      delete allMedia[userId]
      localStorage.setItem("fixoo_user_media", JSON.stringify(allMedia))
    }

    return true
  } catch (error) {
    console.error("Error deleting user account:", error)
    return false
  }
}

// Update specialist availability
export const updateSpecialistAvailability = (specialistId: string, isAvailable: boolean) => {
  if (typeof window === "undefined") return false

  try {
    // Get all users
    const users = JSON.parse(localStorage.getItem("fixoo_users") || "[]")

    // Find and update the specialist
    const updatedUsers = users.map((user: any) => {
      if (user.id === specialistId && user.type === "specialist") {
        return { ...user, isAvailable }
      }
      return user
    })

    // Save updated users
    localStorage.setItem("fixoo_users", JSON.stringify(updatedUsers))

    // Update current user if it's the specialist
    const currentUser = JSON.parse(localStorage.getItem("fixoo_current_user") || "null")
    if (currentUser && currentUser.id === specialistId) {
      localStorage.setItem("fixoo_current_user", JSON.stringify({ ...currentUser, isAvailable }))
    }

    return true
  } catch (error) {
    console.error("Error updating specialist availability:", error)
    return false
  }
}
