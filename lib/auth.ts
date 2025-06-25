// Simple authentication system using localStorage

// Generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Get current timestamp
const getCurrentTimestamp = () => {
  return new Date().getTime()
}

// Calculate token expiry (30 days from now)
const getTokenExpiry = () => {
  const now = getCurrentTimestamp()
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
  return now + thirtyDaysInMs
}

// Register a new user funksiyasini yangilash
export const registerUser = (userData: any) => {
  try {
    const users = JSON.parse(localStorage.getItem("fixoo_users") || "[]")

    // Check if user with this phone already exists
    const existingUser = users.find((user: any) => user.phone === userData.phone)
    if (existingUser) {
      // Xatolikni qaytarish o'rniga, false qaytaramiz
      return { success: false, error: "User with this phone number already exists" }
    }

    // Create new user with ID and token
    const newUser = {
      ...userData,
      id: generateId(),
      tokenExpiry: getTokenExpiry(),
    }

    // Add to users array
    users.push(newUser)
    localStorage.setItem("fixoo_users", JSON.stringify(users))

    // Set current user
    localStorage.setItem("fixoo_current_user", JSON.stringify(newUser))

    return { success: true, user: newUser }
  } catch (error) {
    return { success: false, error: "Registration failed" }
  }
}

// Login user
export const loginUser = (phone: string, password?: string) => {
  const users = JSON.parse(localStorage.getItem("fixoo_users") || "[]")

  // Find user by phone
  const user = users.find((user: any) => user.phone === phone)
  if (!user) {
    return null
  }

  // Check password if provided
  if (password && user.password !== password) {
    return null
  }

  // Update token expiry
  user.tokenExpiry = getTokenExpiry()

  // Update in users array
  const updatedUsers = users.map((u: any) => (u.id === user.id ? user : u))
  localStorage.setItem("fixoo_users", JSON.stringify(updatedUsers))

  // Set current user
  localStorage.setItem("fixoo_current_user", JSON.stringify(user))

  return user
}

// Check if user is authenticated
export const checkUserAuthentication = () => {
  const currentUser = localStorage.getItem("fixoo_current_user")
  if (!currentUser) {
    return false
  }

  const user = JSON.parse(currentUser)
  const now = getCurrentTimestamp()

  // Check if token is expired
  if (user.tokenExpiry < now) {
    // Token expired, logout user
    localStorage.removeItem("fixoo_current_user")
    return false
  }

  return true
}

// Get current user data
export const getUserData = () => {
  const currentUser = localStorage.getItem("fixoo_current_user")
  if (!currentUser) {
    return null
  }

  return JSON.parse(currentUser)
}

// Get all specialists
export const getAllSpecialists = () => {
  const users = JSON.parse(localStorage.getItem("fixoo_users") || "[]")
  return users.filter((user: any) => user.type === "specialist")
}

// Logout user
export const logout = () => {
  localStorage.removeItem("fixoo_current_user")
}
