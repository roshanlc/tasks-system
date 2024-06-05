import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { LoginContext } from "../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file

const useUserDetails = () => {
    const { loginState } = useContext(LoginContext)
    const { decodedToken, token } = loginState
    const userId = decodedToken.user_id

    const { isLoading, error, data } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const url = `${VITE_BACKEND_URL}/users/${userId}`
            const response = await axios.get(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return response.data.data
        },
    })

    return { isLoading, error, data, token }
}
export default useUserDetails
