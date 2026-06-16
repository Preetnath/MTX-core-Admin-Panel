import axios from "axios";
import ALLAPI, { access_token } from "./AllApi";
import { useHandleError } from "@/utils/useHandleError";
import { toast } from "react-toastify";

export interface Symbols {
    id: string,
    name: string,
    description: string,
    exchange: string,
    sector: string,
    digits: number,
    contractSize: number,
    spread: number,
    stopLevels: number,
    marginCurrency: string,
    profitCurrency: string,
    calculation: string,
    initialMargin: number,
    hedgeMargin: number,
    trade: boolean,
    chartMode: string,
    execution: string,
    gtcMode: string,
    fillPolicy: string,
    expiration: string,
    orders: boolean,
    minimalVolume: number,
    maximalVolume: number,
    volumeStep: number,
    swapLong: number,
    swapShort: number,
    swapType: string,
    createdAt: string,
    updatedAt: string
}



export const getSymbols = async () => {
    const config = {
        method: ALLAPI.getSymbols.method,
        url: ALLAPI.getSymbols.url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
    }
    try {
        const { data: response }: { data: Symbols[] } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error);
        console.error(err);
        toast.error(err)
    }
}