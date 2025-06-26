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
  const specialists = users.filter((user: any) => user.type === "specialist")
  
  // Agar hech qanday usta ro'yxatdan o'tmagan bo'lsa, test ma'lumotlarini qo'shamiz
  if (specialists.length === 0) {
    const testSpecialists = [
      {
        id: "test_spec_1",
        firstName: "Akmal",
        lastName: "Usmonov", 
        phone: "+998901234567",
        profession: "plumber",
        region: "toshkent",
        district: "yunusobod",
        address: "Yunusobod tumani, 5-mavze",
        type: "specialist",
        isAvailable: true,
        rating: 4.5,
        reviewCount: 23,
        tokenExpiry: getTokenExpiry()
      },
      {
        id: "test_spec_2", 
        firstName: "Sardor",
        lastName: "Karimov",
        phone: "+998907654321",
        profession: "electrician",
        region: "toshkent", 
        district: "mirobod",
        address: "Mirobod tumani, 3-mavze",
        type: "specialist",
        isAvailable: false,
        rating: 3.8,
        reviewCount: 15,
        tokenExpiry: getTokenExpiry()
      },
      {
        id: "test_spec_3",
        firstName: "Bobur", 
        lastName: "Rahmonov",
        phone: "+998909876543",
        profession: "carpenter",
        region: "samarqand",
        district: "samarqand_shahri",
        address: "Samarqand shahri, Registon ko'chasi",
        type: "specialist", 
        isAvailable: true,
        rating: 0,
        reviewCount: 0,
        tokenExpiry: getTokenExpiry()
      },
      {
        id: "test_spec_4",
        firstName: "Jasur",
        lastName: "Aliyev", 
        phone: "+998905555555",
        profession: "painter",
        region: "fargona",
        district: "fargona_shahri", 
        address: "Farg'ona shahri, Mustaqillik ko'chasi",
        type: "specialist",
        isAvailable: true,
        rating: 4.9,
        reviewCount: 45,
        tokenExpiry: getTokenExpiry()
      }
    ]
    
    // Test ustalarini localStorage'ga qo'shamiz
    const allUsers = [...users, ...testSpecialists]
    localStorage.setItem("fixoo_users", JSON.stringify(allUsers))
    
    // Test ustalar uchun portfolio qo'shamiz
    testSpecialists.forEach(specialist => {
      const portfolio = [
        { id: '1', name: 'ish1.jpg', type: 'image', fileInfo: { name: 'ish1.jpg', type: 'image/jpeg' }},
        { id: '2', name: 'ish2.jpg', type: 'image', fileInfo: { name: 'ish2.jpg', type: 'image/jpeg' }},
        { id: '3', name: 'ish3.mp4', type: 'video', fileInfo: { name: 'ish3.mp4', type: 'video/mp4' }}
      ]
      localStorage.setItem(`fixoo_media_${specialist.id}`, JSON.stringify(portfolio))
    })
    
    return testSpecialists
  }
  
  return specialists
}

// Logout user
export const logout = () => {
  localStorage.removeItem("fixoo_current_user")
}
