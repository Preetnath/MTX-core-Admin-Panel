import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"


export interface LeverageSettingValues {
    trader: number,
    standard: number,
    freasher_account: number
}


export interface systemSetting {
    key: "account_style_leverage" | "auto_approve_accounts" | "liquidation_level" | "margin_call_level",
    value: LeverageSettingValues | boolean | number,
    createdAt: Date,
    updatedAt: Date
}


export const HandleGetAllSystemSetting = async () => {
    const config = {
        url: ALLAPI.GetAllSystemSetting.url,
        method: ALLAPI.GetAllSystemSetting.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    }
    try {
        const { data: response }: { data: systemSetting[] } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}

export const HandleUpdateSystemSetting = async (key: systemSetting["key"], value: systemSetting["value"]) => {
    const config = {
        url: ALLAPI.UpdateSystemSetting.url,
        method: ALLAPI.UpdateSystemSetting.method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        data: {
            key,
            value
        }
    }
    try {
        const { data: response }: { data: systemSetting } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error)
        console.error(err);
        toast.error(err)
    }
}