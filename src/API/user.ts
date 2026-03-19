import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"
import { Broker } from "./broker"


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



export const HandleApproveUser = async (userID: string, approvedAmount?: number) => {

    const config = {
        url: ALLAPI.approveUser.url.replace(":id", userID),
        method: ALLAPI.approveUser.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        data: {
            approvedAmount: approvedAmount ? approvedAmount : undefined
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

export const HandleRejectUser = async (userID: string, reason: string) => {

    const config = {
        url: ALLAPI.rejectUser.url.replace(":id", userID),
        method: ALLAPI.rejectUser.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        data: {
            reason
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

export const HandleUpdateUserLeverage = async (userID: string, leverage: number) => {

    const config = {
        url: ALLAPI.UpdateUserLeverage.url.replace(":id", userID),
        method: ALLAPI.UpdateUserLeverage.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        data: {
            leverage: leverage
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
