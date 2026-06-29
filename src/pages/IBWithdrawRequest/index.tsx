import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    GetAllIBWithdrawRequest,
    HandleApproveIbWithdrawal,
    HandleRejectIbWithdrawal,
    IbWithdrawRequestItem
} from '@/API/ibProgramme';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import Pagination from '@/components/Base/Pagination';
import Button from '@/components/Base/Button';
import { FormInput, FormLabel } from '@/components/Base/Form';
import { Dialog } from '@/components/Base/Headless';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'react-toastify';

function IBWithdrawRequest() {
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 1;

    const [loading, setLoading] = useState<boolean>(false);
    const [requests, setRequests] = useState<IbWithdrawRequestItem[]>([]);
    const [pagination, setPagination] = useState<any>(null);

    // Modal & action state
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<IbWithdrawRequestItem | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form inputs
    const [transactionReference, setTransactionReference] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [adminComment, setAdminComment] = useState('');

    const fetchWithdrawRequests = async () => {
        setLoading(true);
        try {
            const res = await GetAllIBWithdrawRequest(page);
            if (res) {
                setRequests(res.data || []);
                setPagination(res.pagination || null);
            }
        } catch (err) {
            console.error("Failed to load IB withdrawal requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawRequests();
    }, [page]);

    const handleApproveClick = (request: IbWithdrawRequestItem) => {
        setSelectedRequest(request);
        setTransactionReference('');
        setAdminComment('');
        setApproveModalOpen(true);
    };

    const handleRejectClick = (request: IbWithdrawRequestItem) => {
        setSelectedRequest(request);
        setRejectionReason('');
        setAdminComment('');
        setRejectModalOpen(true);
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;
        if (!transactionReference.trim()) {
            toast.error("Transaction Reference is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await HandleApproveIbWithdrawal(
                selectedRequest.id,
                transactionReference,
                adminComment || undefined
            );
            if (res) {
                toast.success("Withdrawal approved successfully");
                setApproveModalOpen(false);
                fetchWithdrawRequests();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        if (!rejectionReason.trim()) {
            toast.error("Rejection reason is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await HandleRejectIbWithdrawal(
                selectedRequest.id,
                rejectionReason,
                adminComment || undefined
            );
            if (res) {
                toast.success("Withdrawal rejected successfully");
                setRejectModalOpen(false);
                fetchWithdrawRequests();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex flex-col items-center justify-between border-b border-slate-200/60 dark:border-darkmode-400 pb-4 mb-5 sm:flex-row">
                <h2 className="text-lg font-medium intro-y">IB Withdrawal Requests</h2>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    {loading && <Lucide icon="Loader" className="w-5 h-5 animate-spin text-primary" />}
                </div>
            </div>

            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-auto intro-y lg:overflow-visible bg-white dark:bg-darkmode-800 rounded-lg p-5 border border-slate-200/60 dark:border-darkmode-400">
                <Table className="border-spacing-y-[10px] border-separate -mt-2">
                    <Table.Thead className="bg-slate-50 dark:bg-darkmode-700/50">
                        <Table.Tr>
                            <Table.Th className="border-b-0 whitespace-nowrap" colSpan={7}>WITHDRAWAL REQUESTS</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {loading ? (
                            <Table.Tr>
                                <Table.Td colSpan={7} className="text-center py-10">
                                    <Lucide icon="Loader" className="w-8 h-8 animate-spin mx-auto text-primary" />
                                </Table.Td>
                            </Table.Tr>
                        ) : requests.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={7} className="text-center py-10 text-slate-500">
                                    No IB Withdrawal Requests found.
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            requests.map((request) => (
                                <Table.Tr key={request.id} className="intro-x">
                                    <Table.Td colSpan={7} className="box shadow-[5px_3px_5px_#00000005] rounded-[0.6rem] border dark:bg-darkmode-600 p-5">
                                        {/* Top metadata section */}
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pb-4 border-b border-slate-100 dark:border-slate-500/30 items-center">
                                            <div className="md:col-span-2">
                                                <div className="font-semibold text-primary text-base">
                                                    {request.user?.firstName} {request.user?.lastName}
                                                </div>
                                                <div className="text-slate-500 text-xs mt-0.5">{request.user?.email}</div>
                                            </div>
                                            <div className="text-left md:text-center">
                                                <div className="text-[10px] uppercase font-bold text-slate-400">Amount</div>
                                                <div className="font-semibold text-success text-base mt-0.5">${Number(request.amountUSD).toFixed(2)}</div>
                                            </div>
                                            <div className="text-left md:text-center">
                                                <div className="text-[10px] uppercase font-bold text-slate-400">Method</div>
                                                <div className="font-medium text-slate-700 dark:text-slate-300 text-sm mt-0.5">{request.type}</div>
                                            </div>
                                            <div className="text-left md:text-center">
                                                <div className="text-[10px] uppercase font-bold text-slate-400">Status</div>
                                                <div
                                                    className={clsx("text-xs font-bold uppercase inline-block px-2.5 py-1 rounded-full mt-1", {
                                                        "bg-warning/10 text-warning": request.status === "PENDING",
                                                        "bg-success/10 text-success": request.status === "APPROVED",
                                                        "bg-danger/10 text-danger": request.status === "REJECTED"
                                                    })}
                                                >
                                                    {request.status}
                                                </div>
                                            </div>
                                            <div className="text-left md:text-center">
                                                <div className="text-[10px] uppercase font-bold text-slate-400">Requested At</div>
                                                <div className="text-slate-500 text-sm mt-0.5">
                                                    {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom info section */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
                                            <div className="bg-slate-50 dark:bg-darkmode-700 p-3 rounded-lg border border-slate-100 dark:border-darkmode-600">
                                                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2 text-[11px] uppercase tracking-wider">Payout Details</span>
                                                {request.type === 'BANK_WIRE' && request.details && 'bankName' in request.details ? (
                                                    <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-slate-600 dark:text-slate-300">
                                                        <div><span className="text-slate-400">Bank Name:</span> <div className="font-medium mt-0.5">{request.details.bankName}</div></div>
                                                        <div><span className="text-slate-400">Account Holder:</span> <div className="font-medium mt-0.5">{request.details.accountHolderName}</div></div>
                                                        <div><span className="text-slate-400">Account Number:</span> <div className="font-medium mt-0.5">{request.details.accountNumber}</div></div>
                                                        <div><span className="text-slate-400">IFSC Code:</span> <div className="font-medium mt-0.5">{request.details.ifscCode}</div></div>
                                                    </div>
                                                ) : request.type === 'USDT' && request.details && 'walletAddress' in request.details ? (
                                                    <div className="space-y-2 text-slate-600 dark:text-slate-300">
                                                        <div className="grid grid-cols-1 gap-4">
                                                            <div><span className="text-slate-400">Network:</span> <div className="font-medium mt-0.5">{request.details.networkType}</div></div>
                                                        </div>
                                                        <div><span className="text-slate-400">Wallet Address:</span> <div className="font-medium break-all mt-0.5">{request.details.walletAddress}</div></div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">N/A</span>
                                                )}
                                            </div>

                                            <div className="flex flex-col justify-between gap-4">
                                                {(request.transactionReference || request.rejectionReason || request.adminComment) ? (
                                                    <div className="bg-slate-50 dark:bg-darkmode-700 p-3 rounded-lg border border-slate-100 dark:border-darkmode-600 flex-1">
                                                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2 text-[11px] uppercase tracking-wider">Processing Details</span>
                                                        <div className="space-y-2 text-slate-600 dark:text-slate-300">
                                                            {request.transactionReference && (
                                                                <div><span className="text-slate-400">Tx Reference:</span> <div className="font-medium mt-0.5">{request.transactionReference}</div></div>
                                                            )}
                                                            {request.rejectionReason && (
                                                                <div><span className="text-slate-400 text-danger">Rejection Reason:</span> <div className="font-medium text-danger mt-0.5">{request.rejectionReason}</div></div>
                                                            )}
                                                            {request.adminComment && (
                                                                <div><span className="text-slate-400">Admin Comment:</span> <div className="font-medium mt-0.5">{request.adminComment}</div></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200 dark:border-darkmode-600 rounded-lg p-3 text-slate-400 dark:text-slate-500 italic">
                                                        No processing details available.
                                                    </div>
                                                )}

                                                {request.status === "PENDING" && (
                                                    <div className="flex justify-end gap-3 mt-auto">
                                                        <Button
                                                            variant="success"
                                                            className="text-white px-5"
                                                            onClick={() => handleApproveClick(request)}
                                                        >
                                                            Approve Request
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            className="px-5"
                                                            onClick={() => handleRejectClick(request)}
                                                        >
                                                            Reject Request
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </div>
            {/* END: Data List */}

            {/* BEGIN: Pagination */}
            {
                pagination && pagination.totalPages > 1 && (
                    <div className="flex flex-wrap items-center col-span-12 mt-6 justify-between bg-white dark:bg-darkmode-800 p-4 rounded-lg border border-slate-200/60 dark:border-darkmode-400">
                        <Pagination className="w-full sm:w-auto mr-auto">
                            <div className="flex justify-center items-center gap-3">
                                <ChevronFirst
                                    className={clsx("cursor-pointer", { "text-gray-300 pointer-events-none": page <= 1, "text-gray-600 dark:text-slate-400": page > 1 })}
                                    onClick={() => {
                                        if (page <= 1) return;
                                        const updatedParams = new URLSearchParams(params);
                                        updatedParams.set("page", (page - 1).toString());
                                        setParams(updatedParams);
                                    }}
                                />
                                <div className="bg-slate-100 dark:bg-darkmode-700 px-3 py-1.5 rounded text-slate-800 dark:text-slate-200 font-medium">
                                    Page {page} of {pagination.totalPages}
                                </div>
                                <ChevronLast
                                    className={clsx("cursor-pointer", { "text-gray-300 pointer-events-none": page >= pagination.totalPages, "text-gray-600 dark:text-slate-400": page < pagination.totalPages })}
                                    onClick={() => {
                                        if (page >= pagination.totalPages) return;
                                        const updatedParams = new URLSearchParams(params);
                                        updatedParams.set("page", (page + 1).toString());
                                        setParams(updatedParams);
                                    }}
                                />
                            </div>
                        </Pagination>
                        <div className="text-slate-500 text-sm mt-3 sm:mt-0">
                            Showing {(page - 1) * pagination.limit + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} requests
                        </div>
                    </div>
                )
            }

            {/* Approve Modal */}
            <Dialog open={approveModalOpen} onClose={() => { setApproveModalOpen(false); }}>
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="CheckCircle"
                            className="w-16 h-16 mx-auto mt-3 text-success"
                        />
                        <div className="mt-5 text-3xl font-semibold">Approve Withdrawal Request</div>
                        <div className="mt-2 text-slate-500">
                            You are about to approve the withdrawal of <span className="font-bold text-success">${selectedRequest?.amountUSD}</span> for <span className="font-semibold text-slate-800 dark:text-slate-300">{selectedRequest?.user?.firstName} {selectedRequest?.user?.lastName}</span>.
                        </div>
                        <div className="mt-4 text-left space-y-3">
                            <div>
                                <FormLabel htmlFor="txn-reference">Transaction Reference *</FormLabel>
                                <FormInput
                                    id="txn-reference"
                                    type="text"
                                    placeholder="Enter transaction reference hash or ID"
                                    value={transactionReference}
                                    onChange={(e) => setTransactionReference(e.target.value)}
                                />
                            </div>
                            <div>
                                <FormLabel htmlFor="approve-comment">Admin Comment (Optional)</FormLabel>
                                <FormInput
                                    id="approve-comment"
                                    type="text"
                                    placeholder="Enter approval comment"
                                    value={adminComment}
                                    onChange={(e) => setAdminComment(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center flex justify-center gap-3">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => { setApproveModalOpen(false); }}
                            className="w-24"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            type="button"
                            className="w-32 text-white"
                            onClick={handleApprove}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Approving..." : "Approve"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={rejectModalOpen} onClose={() => { setRejectModalOpen(false); }}>
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl font-semibold">Reject Withdrawal Request</div>
                        <div className="mt-2 text-slate-500">
                            Reject the withdrawal of <span className="font-bold text-danger">${selectedRequest?.amountUSD}</span> for <span className="font-semibold text-slate-800 dark:text-slate-300">{selectedRequest?.user?.firstName} {selectedRequest?.user?.lastName}</span>.
                        </div>
                        <div className="mt-4 text-left space-y-3">
                            <div>
                                <FormLabel htmlFor="reject-reason">Rejection Reason *</FormLabel>
                                <FormInput
                                    id="reject-reason"
                                    type="text"
                                    placeholder="Enter reason for rejection"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                            <div>
                                <FormLabel htmlFor="reject-comment">Admin Comment (Optional)</FormLabel>
                                <FormInput
                                    id="reject-comment"
                                    type="text"
                                    placeholder="Enter comment"
                                    value={adminComment}
                                    onChange={(e) => setAdminComment(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center flex justify-center gap-3">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => { setRejectModalOpen(false); }}
                            className="w-24"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            className="w-32"
                            onClick={handleReject}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Rejecting..." : "Reject"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div >
    );
}

export default IBWithdrawRequest;