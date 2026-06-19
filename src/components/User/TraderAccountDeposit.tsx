import { useEffect, useState } from 'react';
import {
    HandleGetAllDepositRequest,
    HandleApproveDepositRequest,
    HandleRejectDepositRequest,
    depositSingleRiquest
} from '@/API/deposit';
import Button from '@/components/Base/Button';
import { FormInput, FormLabel, FormSelect } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import { Dialog, Menu } from '@/components/Base/Headless';
import Pagination from '@/components/Base/Pagination';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

interface TraderAccountDepositProps {
    accountId: string;
}

function TraderAccountDeposit({ accountId }: TraderAccountDepositProps) {
    const [requests, setRequests] = useState<depositSingleRiquest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [PageSearch, setPageSearch] = useState('');

    // Filter status state
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    // Modal state
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<depositSingleRiquest | null>(null);
    const [adminComment, setAdminComment] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const res = await HandleGetAllDepositRequest(page, statusFilter, accountId);
            if (res) {
                setRequests(res.deposits || []);
                setPagination(res.pagination || null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page, statusFilter, accountId]);

    const handleStatusChange = (status: string | undefined) => {
        setStatusFilter(status);
        setPage(1);
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;
        setIsSubmitting(true);
        try {
            const res = await HandleApproveDepositRequest(selectedRequest.id, adminComment || undefined);
            if (res) {
                toast.success("Deposit request approved successfully");
                setApproveModalOpen(false);
                fetchRequests();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;
        if (!rejectionReason) {
            toast.error("Rejection reason is required");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await HandleRejectDepositRequest(selectedRequest.id, rejectionReason, adminComment || undefined);
            if (res) {
                toast.success("Deposit request rejected successfully");
                setRejectModalOpen(false);
                fetchRequests();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-darkmode-600 p-1 rounded-lg text-xs font-medium">
                    <button
                        onClick={() => handleStatusChange(undefined)}
                        className={clsx("px-3 py-1.5 rounded-md transition-all", {
                            "bg-white dark:bg-darkmode-400 shadow-sm text-slate-800 dark:text-slate-200": statusFilter === undefined,
                            "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200": statusFilter !== undefined
                        })}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleStatusChange("PENDING")}
                        className={clsx("px-3 py-1.5 rounded-md transition-all", {
                            "bg-white dark:bg-darkmode-400 shadow-sm text-warning font-semibold": statusFilter === "PENDING",
                            "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200": statusFilter !== "PENDING"
                        })}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => handleStatusChange("APPROVED")}
                        className={clsx("px-3 py-1.5 rounded-md transition-all", {
                            "bg-white dark:bg-darkmode-400 shadow-sm text-success font-semibold": statusFilter === "APPROVED",
                            "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200": statusFilter !== "APPROVED"
                        })}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => handleStatusChange("REJECTED")}
                        className={clsx("px-3 py-1.5 rounded-md transition-all", {
                            "bg-white dark:bg-darkmode-400 shadow-sm text-danger font-semibold": statusFilter === "REJECTED",
                            "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200": statusFilter !== "REJECTED"
                        })}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mb-10">
                <div className="col-span-12">
                    {loadingRequests ? (
                        <div className="flex justify-center items-center py-20">
                            <Lucide icon="Loader" className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : requests?.length > 0 ? (
                        <div className="overflow-x-auto w-full">
                            <div className="flex flex-col gap-4 min-w-[900px]">
                                {requests.map((req) => (
                                    <div key={req.id} className="intro-y box p-5 border border-slate-200/60 dark:border-darkmode-400">
                                        <div className="flex flex-col gap-4">
                                            {/* Top Section: User List details & Action Button */}
                                            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-darkmode-400/50">
                                                <div className="flex items-center justify-between gap-6 text-sm flex-1">
                                                    <div>
                                                        <span className="text-slate-400 text-xs block font-medium uppercase mb-0.5">Username</span>
                                                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-300">{req.traderAccount?.generatedUsername || 'N/A'}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400 text-xs block font-medium uppercase mb-0.5">Name</span>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-300">
                                                            {req.traderAccount?.user?.firstName} {req.traderAccount?.user?.lastName}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400 text-xs block font-medium uppercase mb-0.5">Email</span>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-300 break-all">{req.traderAccount?.user?.email}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400 text-xs block font-medium uppercase mb-0.5">Account Type</span>
                                                        <span className={clsx("font-semibold px-2 py-0.5 rounded text-xs", {
                                                            "bg-success/20 text-success": req.traderAccount?.accountType === "FUNDED",
                                                            "bg-warning/20 text-warning": req.traderAccount?.accountType === "DEMO"
                                                        })}>
                                                            {req.traderAccount?.accountType}
                                                        </span>
                                                    </div>
                                                    {/* Action Buttons or Status */}
                                                    <div className="flex items-center gap-2">
                                                        {req.status === "PENDING" ? (
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedRequest(req);
                                                                        setAdminComment('');
                                                                        setApproveModalOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-1.5 text-white px-3 py-1.5"
                                                                >
                                                                    <Lucide icon="CheckCircle" className="w-4 h-4" /> Approve
                                                                </Button>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedRequest(req);
                                                                        setRejectionReason('');
                                                                        setAdminComment('');
                                                                        setRejectModalOpen(true);
                                                                    }}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5"
                                                                >
                                                                    <Lucide icon="XCircle" className="w-4 h-4" /> Reject
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className={clsx("font-bold uppercase text-xs px-2.5 py-1 rounded", {
                                                                "bg-success/20 text-success": req.status === "APPROVED",
                                                                "bg-danger/20 text-danger": req.status === "REJECTED"
                                                            })}>
                                                                {req.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Section: Deposit Details */}
                                            <div className="pt-1">
                                                <h4 className="font-semibold text-primary mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                                    <Lucide icon="CreditCard" className="w-4 h-4" /> Deposit Details
                                                </h4>
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div>
                                                        <span className="text-slate-500 font-medium">Method:</span>
                                                        <span className="font-semibold text-slate-800 dark:text-slate-300 ml-1.5">{req.depositMethod?.name}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 font-medium">Amount:</span>
                                                        <span className="font-mono font-bold text-success ml-1.5 text-sm">${req.amount}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 font-medium">Ref No:</span>
                                                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-300 ml-1.5 select-all break-all">{req.transactionReference}</span>
                                                    </div>
                                                    {req.rejectionReason && (
                                                        <div>
                                                            <span className="text-danger font-medium">Rejection Reason:</span>
                                                            <span className="text-danger ml-1.5 font-semibold break-words">{req.rejectionReason}</span>
                                                        </div>
                                                    )}
                                                    {req.adminComment && (
                                                        <div>
                                                            <span className="text-slate-500 font-medium">Comment:</span>
                                                            <span className="text-slate-700 dark:text-slate-300 ml-1.5 font-semibold break-words">{req.adminComment}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-500 box border border-slate-200/60 dark:border-darkmode-400">
                            No deposit requests found.
                        </div>
                    )}

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex flex-wrap mt-5 items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                            <Pagination className="w-full sm:w-auto sm:mr-auto">
                                <FormInput
                                    max={pagination?.totalPages}
                                    min={1}
                                    type="number"
                                    className="px-2 w-24 !box"
                                    placeholder="Search..."
                                    name="searchpage"
                                    value={PageSearch}
                                    onChange={(e) => setPageSearch(e.target.value)}
                                />
                                <div className="flex w-full sm:w-auto">
                                    <Menu>
                                        <Menu.Button
                                            as={Button}
                                            className="px-2 box"
                                            onClick={() => {
                                                if (PageSearch) {
                                                    setPage(Number(PageSearch));
                                                }
                                            }}
                                        >
                                            <span className="flex items-center justify-center w-5 h-5">
                                                <Lucide icon="Search" className="w-4 h-4" />
                                            </span>
                                        </Menu.Button>
                                    </Menu>
                                </div>
                                <div className="flex justify-center items-center gap-3 ml-5">
                                    <ChevronFirst
                                        className="cursor-pointer text-gray-400"
                                        onClick={() => {
                                            if (!pagination?.prevPage) return;
                                            setPage(p => Math.max(1, p - 1));
                                        }}
                                    />
                                    <div
                                        onClick={() => setPage(1)}
                                        className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm"
                                    >
                                        1
                                    </div>

                                    <h1>...</h1>
                                    <div className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm">
                                        {pagination?.page}
                                    </div>

                                    <h1>...</h1>

                                    <div
                                        onClick={() => setPage(pagination?.totalPages || 1)}
                                        className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm"
                                    >
                                        {pagination?.totalPages}
                                    </div>

                                    <ChevronLast
                                        className="cursor-pointer text-gray-400"
                                        onClick={() => {
                                            if (!pagination?.nextPage) return;
                                            setPage(p => Math.min(pagination.totalPages, p + 1));
                                        }}
                                    />
                                </div>
                            </Pagination>
                            <div className="flex flex-col items-end w-full mt-3 sm:w-auto sm:mt-0">
                                <h1 className="text-slate-500 text-sm">
                                    Showing{" "}
                                    {pagination && pagination.page && pagination.limit
                                        ? (pagination.page - 1) * pagination.limit + 1
                                        : 0}
                                    {" to "}
                                    {pagination && pagination.page && pagination.limit && pagination.count
                                        ? Math.min(pagination.page * pagination.limit, pagination.count)
                                        : 0}
                                    {" from "}
                                    {pagination?.count ?? 0} results
                                </h1>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Approve Deposit Modal */}
            <Dialog open={approveModalOpen} onClose={() => { setApproveModalOpen(false); }}>
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="CheckCircle"
                            className="w-16 h-16 mx-auto mt-3 text-success"
                        />
                        <div className="mt-5 text-3xl font-semibold">Approve Deposit Request</div>
                        <div className="mt-2 text-slate-500">
                            You are about to approve the deposit of <span className="font-bold text-success">${selectedRequest?.amount}</span> for <span className="font-semibold text-slate-800 dark:text-slate-300">{selectedRequest?.traderAccount?.generatedUsername}</span>.
                        </div>
                        <div className="mt-4 text-left">
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

            {/* Reject Deposit Modal */}
            <Dialog open={rejectModalOpen} onClose={() => { setRejectModalOpen(false); }}>
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl font-semibold">Reject Deposit Request</div>
                        <div className="mt-2 text-slate-500">
                            Reject the deposit of <span className="font-bold text-danger">${selectedRequest?.amount}</span> for <span className="font-semibold text-slate-800 dark:text-slate-300">{selectedRequest?.traderAccount?.generatedUsername}</span>.
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
        </div>
    );
}

export default TraderAccountDeposit;