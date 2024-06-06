import axios from "axios"
import { useContext } from "react"
import { LoginContext } from "../../store/LoginProvider"
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL // fetching from .env file
import { useQuery } from '@tanstack/react-query'

const useTasks = (page = 1, searchText = "") => {
    const { loginState } = useContext(LoginContext)

    // default values for pagination
    if (page < 1) {
        page = 1
    }
    const size = 5
    const sort = "asc"

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ["tasks"],
        enabled: true,
        queryFn: async () => {
            let url = `${VITE_BACKEND_URL}/tasks?page=${page}&size=${size}&sort=${sort}`

            // for searching, add extra query param "search"
            if (searchText.trim() != "") {
                url += `&search=${searchText}`
            }

            const response = await axios.get(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${loginState.token}`,
                    },
                }
            )
            return response.data
        },
    })

    return { isLoading, error, data, refetch }
}
export default useTasks
