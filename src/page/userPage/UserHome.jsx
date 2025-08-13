import React, { useEffect } from "react"
import UserHeader from "../../components/userCompnents/UserHeader"
import UserBody from "../../components/userCompnents/UserBody"
import UserFooter
 from "../../components/userCompnents/UserFooter"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

function UserHome() {
  const navigate = useNavigate()
  const authenticated = useSelector(
    (state) => state.userAuth.isAuthenticated
  )

  useEffect(() => {
    if (!authenticated) {
      navigate("/UserLoginPage")
    }
  }, [authenticated, navigate])

  return (
    <div>
      <UserHeader />
      <UserBody />
      <UserFooter />
    </div>
  )
}

export default UserHome
