import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { pagination, SingleUser } from "./user"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"
import { bankWireDetails, cryptoDetails } from "./deposit"

export interface IBProgrammeRequestItem {
    id: string
    user: SingleUser
    userId: string
    status: string
    balance: string
    totalCommissionEarned: string
    totalCommissionWithdrawn: string
    joinedAt: string
}

export interface IBProgrammeRequestRes {
    data: IBProgrammeRequestItem[]
    pagination: pagination
}

export interface Referrer {
    level: number
    user: ReferrerUser
    ibProfile: IbProfile
}

export interface ReferrerUser {
    id: string
    email: string
    firstName: string
    lastName: string
    kycStatus: string
    createdAt: Date
}

export interface IbProfile {
    id: string
    status: string
    balance: number
    joinedAt: string
}


export interface IBProgrammeRequestSingleRes {
    id: string
    user: SingleUser
    userId: string
    status: string
    balance: string
    totalCommissionEarned: string
    totalCommissionWithdrawn: string
    joinedAt: string
    referrers: Referrer[]
}

export interface IbWithdrawRequestItem {
    id: string
    ibProfileId: string
    user: User
    amountUSD: number
    type: "BANK_WIRE" | "USDT"
    status: "PENDING" | "APPROVED" | "REJECTED"
    details: bankWireDetails | cryptoDetails
    transactionReference: string | null
    rejectionReason: string | null
    adminComment: string | null
    approvedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

export interface IBWithdrawRequest {
    data: IbWithdrawRequestItem[]
    pagination: pagination
}

export interface User {
    id: string
    firstName: string
    lastName: string
    email: string
}


export const GetAllIBRequests = async (page: number = 1) => {
    const config = {
        url: ALLAPI.GetAllIBRequests.url,
        method: ALLAPI.GetAllIBRequests.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        params: {
            page
        }
    }
    try {
        const { data: response }: { data: IBProgrammeRequestRes } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}


export const GetSingleIbRequest = async (id: string) => {
    const config = {
        url: ALLAPI.GetSingleIbRequest.url?.replace(":id", id),
        method: ALLAPI.GetSingleIbRequest.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        }
    }
    try {
        const { data: response }: { data: IBProgrammeRequestSingleRes } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}


export const HandleApproveIbRequest = async (id: string, rates: { level: number, amountPerLot: number }[]) => {
    const config = {
        url: ALLAPI.ApproveIbRequest.url?.replace(":id", id),
        method: ALLAPI.ApproveIbRequest.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        data: {
            rates
        }
    }
    try {
        const { data: response }: { data: any } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}


export const HandleRejectIbRequest = async (id: string) => {
    const config = {
        url: ALLAPI.RejectIbRequest.url?.replace(":id", id),
        method: ALLAPI.RejectIbRequest.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        }
    }
    try {
        const { data: response }: { data: any } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}

export const GetAllIBWithdrawRequest = async (page: number = 1) => {
    const config = {
        url: ALLAPI.GetAllIbWithdrawals.url,
        method: ALLAPI.GetAllIbWithdrawals.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        params: {
            page
        }
    }
    try {
        const { data: response }: { data: IBWithdrawRequest } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}

export const HandleApproveIbWithdrawal = async (id: string, transactionReference: string, adminComment?: string) => {
    const config = {
        url: ALLAPI.ApproveIbWithdrawal.url?.replace(":id", id),
        method: ALLAPI.ApproveIbWithdrawal.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        data: {
            transactionReference,
            adminComment
        }
    }
    try {
        const { data: response }: { data: any } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}


export const HandleRejectIbWithdrawal = async (id: string, rejectionReason: string, adminComment?: string) => {
    const config = {
        url: ALLAPI.RejectIbWithdrawal.url?.replace(":id", id),
        method: ALLAPI.RejectIbWithdrawal.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        data: {
            rejectionReason,
            adminComment
        }
    }
    try {
        const { data: response }: { data: any } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}