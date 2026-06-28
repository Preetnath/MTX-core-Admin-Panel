import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Base/Button';
import { FormInput, FormLabel, FormSelect, FormTextarea } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import {
    GetAllSupportTickets,
    GetSingleSupportTicket,
    ReplaySupportTicket,
    UpdateSupportTicketStatus,
    TicketReplaysItem,
    SupportTicketItem
} from '@/API/support';
import clsx from 'clsx';

function index() {
    // Tickets State
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [ticketPage, setTicketPage] = useState<number>(1);
    const [ticketPagination, setTicketPagination] = useState<any>(null);
    const [loadingTickets, setLoadingTickets] = useState<boolean>(false);

    // Chat / Replies State
    const [replies, setReplies] = useState<TicketReplaysItem[]>([]);
    const [replyPage, setReplyPage] = useState<number>(1);
    const [loadingReplies, setLoadingReplies] = useState<boolean>(false);
    const [loadingMoreReplies, setLoadingMoreReplies] = useState<boolean>(false);
    const [hasMoreReplies, setHasMoreReplies] = useState<boolean>(true);

    // Send Reply State
    const [replyMessage, setReplyMessage] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [sendingReply, setSendingReply] = useState<boolean>(false);
    const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load Tickets
    const loadTickets = async (page: number) => {
        setLoadingTickets(true);
        try {
            const res = await GetAllSupportTickets(page);
            if (res && res.data) {
                setTickets(res.data);
                setTicketPagination(res.pagination);

                // Auto-select 1st ticket on initial load or if selected ticket is not set
                if (res.data.length > 0 && !selectedTicket) {
                    setSelectedTicket(res.data[0]);
                }
            }
        } catch (err) {
            console.error("Failed to load tickets", err);
        } finally {
            setLoadingTickets(false);
        }
    };

    // Load Replies for Selected Ticket
    const loadReplies = async (ticketId: string, pageNum: number, prevScrollHeight?: number) => {
        if (pageNum === 1) {
            setLoadingReplies(true);
        } else {
            setLoadingMoreReplies(true);
        }

        try {
            const res = await GetSingleSupportTicket(ticketId, pageNum);
            // Handle variations in response format safely
            const resData = res?.data;
            const fetchedReplies: TicketReplaysItem[] = Array.isArray(res?.pagination)
                ? res.pagination
                : (Array.isArray(resData) ? resData : []);
            const pagination = res?.pagination;

            if (pageNum === 1) {
                setReplies(fetchedReplies);
                // Scroll to bottom on initial load
                setTimeout(() => {
                    if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                    }
                }, 50);
            } else {
                setReplies(prev => [...fetchedReplies, ...prev]);
                // Restore scroll position so user doesn't jump
                setTimeout(() => {
                    if (chatContainerRef.current && prevScrollHeight) {
                        const newHeight = chatContainerRef.current.scrollHeight;
                        chatContainerRef.current.scrollTop = newHeight - prevScrollHeight;
                    }
                }, 50);
            }

            if (pagination) {
                setHasMoreReplies(pagination.page < pagination.totalPages);
            } else {
                setHasMoreReplies(fetchedReplies.length > 0);
            }
        } catch (err) {
            console.error("Failed to load replies", err);
        } finally {
            setLoadingReplies(false);
            setLoadingMoreReplies(false);
        }
    };

    // Reload tickets when page changes
    useEffect(() => {
        loadTickets(ticketPage);
    }, [ticketPage]);

    // Load replies when selected ticket changes
    useEffect(() => {
        if (selectedTicket) {
            setReplyPage(1);
            setReplies([]);
            setHasMoreReplies(true);
            loadReplies(selectedTicket.id, 1);
        }
    }, [selectedTicket]);

    // Handle scroll up to load more (older) replies
    const handleChatScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        if (target.scrollTop === 0 && !loadingMoreReplies && hasMoreReplies && selectedTicket) {
            const prevScrollHeight = target.scrollHeight;
            const nextPage = replyPage + 1;
            setReplyPage(nextPage);
            loadReplies(selectedTicket.id, nextPage, prevScrollHeight);
        }
    };

    // Update ticket status
    const handleStatusChange = async (newStatus: string) => {
        if (!selectedTicket) return;
        setUpdatingStatus(true);
        try {
            const res = await UpdateSupportTicketStatus(selectedTicket.id, newStatus);
            if (res) {
                toast.success(`Status updated to ${newStatus}`);
                setSelectedTicket((prev: any) => ({ ...prev, status: newStatus }));
                // Update in tickets list as well
                setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: newStatus } : t));
            }
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    // Send Support Ticket Reply
    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || (!replyMessage.trim() && selectedFiles.length === 0)) return;

        setSendingReply(true);
        try {
            const res = await ReplaySupportTicket(selectedFiles, replyMessage, selectedTicket.id);
            if (res) {
                toast.success("Reply sent successfully");
                setReplyMessage('');
                setSelectedFiles([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
                // Reload replies (or page 1)
                setReplyPage(1);
                loadReplies(selectedTicket.id, 1);
            }
        } catch (err) {
            console.error("Failed to send reply", err);
        } finally {
            setSendingReply(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const removeAttachment = (idx: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg font-medium intro-y mb-5">Support Chat</h2>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Side: Tickets List */}
                <div className="col-span-12 lg:col-span-4 flex flex-col">
                    <div className="box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400 flex flex-col flex-1 h-[650px] justify-between">
                        <div>
                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-darkmode-400 pb-3 mb-4">
                                <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">Tickets</h3>
                                {loadingTickets && <Lucide icon="Loader" className="w-4 h-4 animate-spin text-primary" />}
                            </div>

                            <div className="overflow-y-auto max-h-[460px] space-y-3 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {tickets.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500">
                                        No tickets found.
                                    </div>
                                ) : (
                                    tickets.map((ticket: SupportTicketItem) => {
                                        const isSelected = selectedTicket?.id === ticket.id;
                                        return (
                                            <div
                                                key={ticket.id}
                                                onClick={() => setSelectedTicket(ticket)}
                                                className={clsx(
                                                    "p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-slate-100 dark:hover:bg-darkmode-600",
                                                    isSelected
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-slate-200 dark:border-darkmode-400"
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-300 truncate mt-1">
                                                        {ticket.title}
                                                    </h4>
                                                    <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase", {
                                                        "bg-success/20 text-success": ticket.status === "OPEN" || ticket.status === "IN_PROGRESS",
                                                        "bg-slate-200 text-slate-700 dark:bg-darkmode-400 dark:text-slate-300": ticket.status === "RESOLVED" || ticket.status === "CLOSED"
                                                    })}>
                                                        {ticket.status}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {ticket.description}
                                                </p>
                                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/40 dark:border-darkmode-400/40 text-[10px] text-slate-400">
                                                    <span>By: {ticket?.user?.firstName} {ticket?.user?.lastName}</span>
                                                    <span className={clsx("font-bold", {
                                                        "text-danger": ticket.level === "URGENT" || ticket.level === "HIGH",
                                                        "text-warning": ticket.level === "MEDIUM",
                                                        "text-success": ticket.level === "LOW"
                                                    })}>
                                                        {ticket.level}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* List Pagination */}
                        {ticketPagination && ticketPagination.totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-darkmode-400 pt-4 mt-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={ticketPage <= 1}
                                    onClick={() => setTicketPage(p => Math.max(1, p - 1))}
                                >
                                    Prev
                                </Button>
                                <span className="text-xs text-slate-500 font-medium">
                                    Page {ticketPagination.page} of {ticketPagination.totalPages}
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={ticketPage >= ticketPagination.totalPages}
                                    onClick={() => setTicketPage(p => Math.min(ticketPagination.totalPages, p + 1))}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Chat Box */}
                <div className="col-span-12 lg:col-span-8 flex flex-col">
                    <div className="box shadow-sm border border-slate-200/60 dark:border-darkmode-400 flex flex-col h-[650px]">
                        {selectedTicket ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-slate-200/60 dark:border-darkmode-400 flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-300 text-base flex items-center gap-2">
                                            {selectedTicket.title}
                                            <span className={clsx("text-xs font-bold px-2 py-0.5 rounded uppercase", {
                                                "bg-danger/10 text-danger": selectedTicket.level === "URGENT" || selectedTicket.level === "HIGH",
                                                "bg-warning/10 text-warning": selectedTicket.level === "MEDIUM",
                                                "bg-success/10 text-success": selectedTicket.level === "LOW"
                                            })}>
                                                {selectedTicket.level}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Category: {selectedTicket.category}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500">Status:</span>
                                        <FormSelect
                                            value={selectedTicket.status}
                                            disabled={updatingStatus}
                                            onChange={(e) => handleStatusChange(e.target.value)}
                                            className="w-36 text-xs h-8"
                                        >
                                            <option value="OPEN">OPEN</option>
                                            <option value="IN_PROGRESS">IN PROGRESS</option>
                                            <option value="RESOLVED">RESOLVED</option>
                                            <option value="CLOSED">CLOSED</option>
                                        </FormSelect>
                                    </div>
                                </div>

                                {/* Chat Area */}
                                <div
                                    ref={chatContainerRef}
                                    onScroll={handleChatScroll}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-slate-50/50 dark:bg-darkmode-900/50"
                                >
                                    {loadingMoreReplies && (
                                        <div className="text-center py-2">
                                            <Lucide icon="Loader" className="w-5 h-5 animate-spin mx-auto text-primary" />
                                        </div>
                                    )}

                                    {loadingReplies ? (
                                        <div className="flex items-center justify-center h-full">
                                            <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                                        </div>
                                    ) : replies.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                            <Lucide icon="MessageSquare" className="w-12 h-12 mb-2 text-slate-300" />
                                            <p className="text-sm">No messages yet. Send a reply below.</p>
                                        </div>
                                    ) : (
                                        replies.map((reply) => {
                                            const isAdmin = reply.senderType === "ADMIN";
                                            return (
                                                <div
                                                    key={reply.id}
                                                    className={clsx("flex", isAdmin ? "justify-end" : "justify-start")}
                                                >
                                                    <div className={clsx(
                                                        "max-w-[70%] p-3 rounded-lg shadow-sm border",
                                                        isAdmin
                                                            ? "bg-primary text-white border-primary rounded-tr-none"
                                                            : "bg-white dark:bg-darkmode-600 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-darkmode-400 rounded-tl-none"
                                                    )}>
                                                        <div className="text-[10px] font-semibold opacity-70 mb-1">
                                                            {isAdmin ? "Admin" : (selectedTicket.user?.name || "User")}
                                                        </div>
                                                        <p className="text-sm break-words whitespace-pre-wrap">{reply.message}</p>

                                                        {/* Attachments */}
                                                        {reply.attachmentUrls && reply.attachmentUrls.length > 0 && (
                                                            <div className="mt-2 space-y-1">
                                                                {reply.attachmentUrls.map((url, idx) => (
                                                                    <a
                                                                        key={idx}
                                                                        href={url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={clsx(
                                                                            "flex items-center gap-1.5 text-xs underline mt-1 truncate",
                                                                            isAdmin ? "text-white/90 hover:text-white" : "text-primary hover:text-primary-dark"
                                                                        )}
                                                                    >
                                                                        <Lucide icon="Paperclip" className="w-3 h-3" />
                                                                        Attachment {idx + 1}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="text-[9px] opacity-60 text-right mt-1.5">
                                                            {new Date(reply.createdAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Send Reply Form Input */}
                                <div className="p-4 border-t border-slate-200/60 dark:border-darkmode-400 bg-white dark:bg-darkmode-800">
                                    {selectedTicket.status === 'CLOSED' ? (
                                        <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 py-2">
                                            This ticket has been closed. You cannot send replies to this ticket.
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSendReply} className="space-y-3">
                                            <div className="flex gap-2 items-end">
                                                {/* File Upload Trigger */}
                                                <div className="relative">
                                                    <label
                                                        htmlFor="reply-file-upload"
                                                        className="flex items-center justify-center h-10 w-10 bg-slate-50 dark:bg-darkmode-700 border border-slate-200 dark:border-darkmode-600 hover:bg-slate-100 dark:hover:bg-darkmode-600/80 text-slate-500 dark:text-slate-400 rounded-md cursor-pointer transition-all duration-150"
                                                        title="Add Attachments"
                                                    >
                                                        <Lucide icon="Paperclip" className="h-4 w-4" />
                                                    </label>
                                                    <input
                                                        id="reply-file-upload"
                                                        type="file"
                                                        multiple
                                                        ref={fileInputRef}
                                                        className="sr-only"
                                                        onChange={handleFileChange}
                                                    />
                                                </div>

                                                {/* Text Input */}
                                                <input
                                                    type="text"
                                                    value={replyMessage}
                                                    onChange={(e) => setReplyMessage(e.target.value)}
                                                    placeholder="Type your reply here..."
                                                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-darkmode-700/50 border border-slate-200 dark:border-darkmode-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-xs transition duration-200"
                                                />

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    disabled={sendingReply}
                                                    className="flex items-center justify-center h-10 px-4 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-md transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
                                                >
                                                    {sendingReply ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    ) : (
                                                        <Lucide icon="Send" className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Show attachments ready for upload */}
                                            {selectedFiles.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {selectedFiles.map((file, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-darkmode-700/40 border border-slate-200 dark:border-darkmode-600 text-[10px] text-slate-600 dark:text-slate-350"
                                                        >
                                                            <span className="truncate max-w-[120px]">{file.name}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAttachment(idx)}
                                                                className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white"
                                                            >
                                                                <Lucide icon="X" className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </form>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <Lucide icon="MessageSquare" className="w-16 h-16 mb-2 text-slate-300" />
                                <h3 className="font-semibold text-lg">No Ticket Selected</h3>
                                <p className="text-sm">Select a ticket from the list to view the chat history.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default index;