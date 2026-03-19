import axios from "axios";
import ALLAPI, { access_token } from "./AllApi";
import { useHandleError } from "@/utils/useHandleError";
import { toast } from "react-toastify";

export interface Broker {
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

export interface createBrokerData {
    name: string,
    logo: string, // url 
    series: string,
    fullForm: string,
    accessServer: string,
    aboutBroker: string,
    websiteLink: string, // url
    isActive: boolean
}

export interface updateBrokerData {
    name?: string,
    logo?: string, // url 
    series?: string,
    fullForm?: string,
    accessServer?: string,
    aboutBroker?: string,
    websiteLink?: string, // url
    isActive?: boolean
}


export const getBrokers = async () => {
    const config = {
        method: ALLAPI.getBrokers.method,
        url: ALLAPI.getBrokers.url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
    }
    try {
        const { data: response }: { data: Broker[] } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error);
        console.error(err);
        toast.error(err)
    }
}


export const getSingleBroker = async (brokerID: string) => {
    const config = {
        method: ALLAPI.getSingleBroker.method,
        url: ALLAPI.getSingleBroker.url.replace(":id", brokerID),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
    }
    try {
        const { data: response }: { data: Broker } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error);
        console.error(err);
        toast.error(err)
    }
}


export const createBroker = async (brokerData: createBrokerData) => {
    const config = {
        method: ALLAPI.createBroker.method,
        url: ALLAPI.createBroker.url,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        data: brokerData,
    }
    try {
        const { data: response } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error);
        console.error(err);
        toast.error(err)
    }
}

export const updateBroker = async (brokerID: string, brokerData: updateBrokerData) => {
    const config = {
        method: ALLAPI.updateBroker.method,
        url: ALLAPI.updateBroker.url.replace(":id", brokerID),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        data: brokerData,
    }
    try {
        const { data: response } = await axios.request(config)
        if (response) {
            return response
        }
    } catch (error) {
        const err = useHandleError(error);
        console.error(err);
        toast.error(err)
    }
}

