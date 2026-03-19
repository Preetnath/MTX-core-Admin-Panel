import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"

export interface DashboardResponse {
    usersStats: {
        totalUsers: number,
        totalVerifedUsers: number,
        totalUnverifedUsers: number
    },
    ordersStats: {
        totalOrders: number,
        totalPendingOrders: number,
        totalFilledOrders: number,
        totalRejectedOrders: number,
        totalCancelledOrders: number,
        totalBuyOrders: number,
        totalSellOrders: number
    },
    walletStats: {
        totalDeposit: string,
        totalWithdrawal: string
    }
}

export const HandleGetDashboardData = async () => {
    const config = {
        url: ALLAPI.dashboard.url,
        method: ALLAPI.dashboard.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }
    try {
        const { data: response }: { data: DashboardResponse } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}