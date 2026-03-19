import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"


type LoginResponse = {
    access_token: string,
    user: {
        id: number,
        email: string,
        role: string
    }
}


export const Login = async (email: string, password: string) => {
    const config = {
        url: ALLAPI.login.url,
        method: ALLAPI.login.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        data: {
            email,
            password
        }
    }
    try {
        const { data: response }: { data: LoginResponse } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);

        toast.error(err)
    }
}

