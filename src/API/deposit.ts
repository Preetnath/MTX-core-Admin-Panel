import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"


export const DepositMethodsType = {
    UPI: "UPI",
    BANK_WIRE: "BANK_WIRE",
    CASH: "CASH",
    CRYPTO: "CRYPTO"
}

interface upiDetails {
    upiId: string,
    upiName: string
}
interface bankWireDetails {
    bankName: string,
    ifscCode: string,
    accountNumber: string,
    accountHolderName: string
}
interface cashDetails {
    contactNumber: string,
    officeAddress: string
}
interface cryptoDetails {
    tokenName: string,
    networkType: string,
    walletAddress: string
}


interface depositMethodsResponse {
    id: string,
    name: string,
    type: string,
    details: upiDetails | bankWireDetails | cashDetails | cryptoDetails,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface depositSingleRiquest {
    id: string,
    traderAccount: {
        generatedUsername: string,
        user: {
            firstName: string,
            lastName: string,
            email: string,
        },
        accountType: "FUNDED" | "DEMO"
    },
    depositMethod: {
        name: string
    },
    amount: string,
    status: string,
    transactionReference: string,
    receiptUrl: null | string,
    rejectionReason: null | string,
    adminComment: null | string,
    approvedAt: Date | null,
    rejectedAt: Date | null,
    createdAt: Date,
    updatedAt: Date
}

interface pagination {
    page: number,
    limit: number,
    count: number,
    totalPages: number,
    nextPage: null,
    prevPage: null
}


interface depostiRequestResponse {
    deposits: depositSingleRiquest[],
    pagination: pagination
}



export const HandleGetAllDepositMethods = async () => {
    const config = {
        url: ALLAPI.GetAllDepositMethods.url,
        method: ALLAPI.GetAllDepositMethods.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
    }
    try {
        const { data: response }: { data: depositMethodsResponse[] } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleCreateDepositMethod = async (name: string, type: string, details: upiDetails | bankWireDetails | cashDetails | cryptoDetails, isActive: boolean) => {
    const config = {
        url: ALLAPI.CreateDepositMethod.url,
        method: ALLAPI.CreateDepositMethod.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
        data: {
            name: name,
            type: type,
            details: details,
            isActive: isActive
        }
    }
    try {
        const { data: response }: { data: depositMethodsResponse } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleUpdateDepositMethod = async (id: string, name: string, type: string, details: upiDetails | bankWireDetails | cashDetails | cryptoDetails, isActive: boolean) => {
    const config = {
        url: ALLAPI.UpdateDepositMethod.url?.replace(":id", id) || '',
        method: ALLAPI.UpdateDepositMethod.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
        data: {
            name: name,
            type: type,
            details: details,
            isActive: isActive
        }
    }
    try {
        const { data: response }: { data: depositMethodsResponse } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleEnableDepositMethod = async (id: string) => {
    const config = {
        url: ALLAPI.EnableDepositMethod.url?.replace(":id", id),
        method: ALLAPI.EnableDepositMethod.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        }
    }
    try {
        const { data: response }: { data: depositMethodsResponse } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleDisableDepositMethod = async (id: string) => {
    const config = {
        url: ALLAPI.DisableDepositMethod.url?.replace(":id", id),
        method: ALLAPI.DisableDepositMethod.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        }
    }
    try {
        const { data: response }: { data: depositMethodsResponse } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleGetAllDepositRequest = async (page: number = 1, status?: string, traderAccountId?: string) => {
    const config = {
        url: ALLAPI.GetAllDepositRequest.url,
        method: ALLAPI.GetAllDepositRequest.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
        params: {
            page,
            status: status ? status : undefined,
            traderAccountId: traderAccountId ? traderAccountId : undefined
        }
    }
    try {
        const { data: response }: { data: depostiRequestResponse } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleCreateDepositRequest = async (traderAccountId: number, amount: number, depositMethodId: string, transactionReference: string, adminComment?: string) => {
    const config = {
        url: ALLAPI.CreateManuleDeposit.url,
        method: ALLAPI.CreateManuleDeposit.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
        data: {
            traderAccountId,
            amount,
            depositMethodId,
            transactionReference,
            adminComment
        }
    }
    try {
        const { data: response }: { data: depositMethodsResponse[] } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleApproveDepositRequest = async (id: string, adminComment?: string) => {
    const config = {
        url: ALLAPI.ApproveDepositRequest.url?.replace(":id", id),
        method: ALLAPI.ApproveDepositRequest.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
        data: {
            adminComment
        }
    }
    try {
        const { data: response }: { data: depositMethodsResponse[] } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleRejectDepositRequest = async (id: string, rejectionReason: string, adminComment?: string) => {
    const config = {
        url: ALLAPI.RejectDepositRequest.url?.replace(":id", id),
        method: ALLAPI.RejectDepositRequest.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
        data: {
            rejectionReason,
            adminComment
        }
    }
    try {
        const { data: response }: { data: depositMethodsResponse[] } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

