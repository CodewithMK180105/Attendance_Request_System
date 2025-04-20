import Home from '@/components/HomePage'
import React from 'react'
import { getUserFromCookies } from "@/lib/auth"

// Server-side function to check user authentication
async function getUser() {
  const user = await getUserFromCookies()
  return user
}

const Homepage = async () => {

  const user = await getUser();
  console.log("Home user", user);

  const isLoggedIn = !!user
  const userRole = user?.role || null

  return (
    <div>
      <Home isLoggedIn={isLoggedIn} userRole={userRole} />
    </div>
  )
}

export default Homepage
