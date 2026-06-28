import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { pagination } from "./user"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"


export interface KYCItem {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    age: number,
    kycStatus: string,
    kycDocumentFront: string,
    kycDocumentBack: string,
    kycDocumentFrontUrl: string,
    kycDocumentBackUrl: string,
    createdAt: Date,
    updatedAt: Date
}

export interface KYCRes {
    data: KYCItem[],
    pagination: pagination
}



export const GetAllKycRequest = async (page: number = 1) => {
    const config = {
        url: ALLAPI.GetAllKycRequest.url,
        method: ALLAPI.GetAllKycRequest.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        params: {
            page
        }
    }
    try {
        const { data: response }: { data: KYCRes } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}



export const ApproveKycRequest = async (id: string) => {
    const config = {
        url: ALLAPI.ApproveKycRequest.url.replace(":id", id),
        method: ALLAPI.ApproveKycRequest.method,
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


export const RejectKycRequest = async (id: string, reason: string) => {
    const config = {
        url: ALLAPI.RejectKycRequest.url.replace(":id", id),
        method: ALLAPI.RejectKycRequest.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        data: {
            reason
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
