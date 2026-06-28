import axios from "axios"
import ALLAPI, { access_token } from "./AllApi"
import { pagination, SingleUser } from "./user"
import { useHandleError } from "@/utils/useHandleError"
import { toast } from "react-toastify"


export interface SupportTicketItem {
    id: string,
    userId: string,
    user: SingleUser,
    category: string,
    title: string,
    level: "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    description: string,
    status: string,
    replyStatus: string,
    assignedAdminId: string | null,
    createdAt: Date,
    updatedAt: Date
}

interface SupportTicketRes {
    data: SupportTicketItem[],
    pagination: pagination
}

export interface TicketReplaysItem {
    id: string,
    ticketId: string,
    senderType: "USER" | "ADMIN",
    senderId: string,
    message: string,
    attachments: string[] | [],
    createdAt: Date,
    attachmentUrls: string[] | [],
    updatedAt: Date,
}

export interface TicketReplaysRes {
    data: TicketReplaysItem[],
    pagination: pagination
}

export const GetAllSupportTickets = async (page: number = 1) => {
    const config = {
        url: ALLAPI.GetAllSupportTickets.url,
        method: ALLAPI.GetAllSupportTickets.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        params: {
            page
        }
    }
    try {
        const { data: response }: { data: SupportTicketRes } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}

export const GetSingleSupportTicket = async (id: string, page: number = 1) => {
    const config = {
        url: ALLAPI.GetSupportTicketReplies.url.replace(":id", id),
        method: ALLAPI.GetSupportTicketReplies.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        params: {
            page
        }
    }
    try {
        const { data: response }: { data: TicketReplaysRes } = await axios.request(config)
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}

export const ReplaySupportTicket = async (attachments: File[], message: string, ticketId: string) => {
    const formData = new FormData()
    attachments.forEach(file => formData.append('attachments', file))
    formData.append('message', message)

    try {
        const { data: response }: { data: any } = await axios.post(ALLAPI.SendSupportTicketReply.url.replace(':id', ticketId), formData, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        if (response) {
            return response;
        }
    } catch (error) {
        const err = useHandleError(error)
        toast.error(err)
    }
}

export const UpdateSupportTicketStatus = async (ticketId: string, status: string) => {
    const config = {
        url: ALLAPI.UpdateSupportTicketStatus.url.replace(':id', ticketId),
        method: ALLAPI.UpdateSupportTicketStatus.method,
        headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json"
        },
        data: {
            status // OPEN, IN_PROGRESS, RESOLVED, CLOSED
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