import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"
import { Broker } from "./broker"

export interface pagination {
    total: number,
    page: number,
    limit: number,
    currentPage: number,
    totalPages: number,
    nextPage: number | null,
    prevPage: number | null
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

export interface TraderAccount {
    id: number,
    generatedUsername: string,
    passwordHash: string,
    investorPasswordHash: string,
    encryptedPassword: string,
    encryptedInvestorPassword: string,
    userId: string,
    accountType: string,
    accountMode: string,
    status: string,
    leverage: number,
    brokerId: string,
    spread: number | null,
    symbolSpreads: string
}

export interface UsersData {
    data: SingleUser[],
    pagination: pagination
}

export interface Wallet {
    balance: number,
    lockedBalance: number,
    availableBalance: number,
    currency: string
}

export interface Transactions {
    id: string,
    walletId: string,
    type: string,
    amount: number,
    balanceBefore: number,
    balanceAfter: number,
    referenceId: string,
    description: string,
    createdAt: string
}

export interface UserWalletTransactions {
    transactions: Transactions[],
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

export const HandleGetUserTradingAccounts = async (userID: string) => {
    const config = {
        url: ALLAPI.getUserTradingAccounts.url.replace(":userId", userID),
        method: ALLAPI.getUserTradingAccounts.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }
    try {
        const { data: response }: { data: TraderAccount[] } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleCreateUserTradingAccount = async (userID: string, data: { accountType: string, accountMode: string, leverage: number, amount: number }) => {
    const config = {
        url: ALLAPI.CreateUserTradingAccount.url.replace(":userId", userID),
        method: ALLAPI.CreateUserTradingAccount.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        data: data
    }
    try {
        const { data: response }: { data: any } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}
export const HandleApproveUserTradingAccount = async (userID: string, accountID: string) => {
    const config = {
        url: ALLAPI.ApproveUserTradingAccount.url.replace(":userId", userID).replace(":accountId", accountID),
        method: ALLAPI.ApproveUserTradingAccount.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }
    try {
        const { data: response }: { data: any } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}
export const HandleRejectUserTradingAccount = async (userID: string, accountID: string) => {
    const config = {
        url: ALLAPI.RejectUserTradingAccount.url.replace(":userId", userID).replace(":accountId", accountID),
        method: ALLAPI.RejectUserTradingAccount.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }
    try {
        const { data: response }: { data: any } = await axios.request(config)
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

export const HandleGetUserWallet = async (userID: string) => {

    const config = {
        url: ALLAPI.getUserWallet.url.replace(":userId", userID),
        method: ALLAPI.getUserWallet.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }
    try {
        const { data: response }: { data: Wallet } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleGetUserWalletTransactions = async (userID: string, page: number) => {

    const config = {
        url: ALLAPI.getUserWalletTransactions.url.replace(":userId", userID),
        method: ALLAPI.getUserWalletTransactions.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        params: {
            page: page
        }
    }
    try {
        const { data: response }: { data: UserWalletTransactions } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleUserDeposit = async (userID: string, amount: number) => {

    const config = {
        url: ALLAPI.UserDeposit.url.replace(":userId", userID),
        method: ALLAPI.UserDeposit.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        data: {
            amount: amount
        }
    }
    try {
        const { data: response } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleUserWithdrawal = async (userID: string, amount: number) => {
    const config = {
        url: ALLAPI.UserWithdrawal.url.replace(":userId", userID),
        method: ALLAPI.UserWithdrawal.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        data: {
            amount: amount
        }
    }
    try {
        const { data: response } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

