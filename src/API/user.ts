import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"


interface Broker {
    aboutBroker: string,
    accessServer: string,
    createdAt: string,
    fullForm: string,
    id: string,
    isActive: boolean,
    logo: string,
    name: string,
    series: string | null,
    updatedAt: string,
    websiteLink: string
}

export interface SingleUser {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    generatedUsername: string,
    age: number,
    phone: string,
    accountType: string,
    accountStatus: string,
    requestedAmount: string,
    emailVerified: boolean,
    kycStatus: string,
    accountMode: string,
    brokerId: string,
    linkedToUserId: string,
    rejectionReason: string,
    leverage: number,
    createdAt: string,
    updatedAt: string,
    broker?: Broker,
    password?: string,
    investorPassword?: string,
}

interface pagination {
    total: number,
    page: number,
    limit: number,
    currentPage: number,
    totalPages: number,
    nextPage: number | null,
    prevPage: number | null
}

export interface UsersData {
    data: SingleUser[],
    pagination: pagination
}




export const HandleGetUsers = async (url: string) => {

    const config = {
        url: url,
        method: ALLAPI.getUsers.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }
    try {
        const { data: response }: { data: UsersData } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}



export const HandleGetSingleUser = async (userID: string) => {

    const config = {
        url: ALLAPI.getSingleUser.url.replace(":id", userID),
        method: ALLAPI.getSingleUser.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }
    try {
        const { data: response }: { data: SingleUser } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}
