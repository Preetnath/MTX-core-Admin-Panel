import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    GetAllKycRequest,
    ApproveKycRequest,
    RejectKycRequest,
    KYCItem
} from '@/API/kyc';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import Button from '@/components/Base/Button';
import Pagination from '@/components/Base/Pagination';
import { FormTextarea, FormLabel } from '@/components/Base/Form';
import { Dialog } from '@/components/Base/Headless';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

function KYC() {
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 1;

    const [loading, setLoading] = useState<boolean>(false);
    const [kycRequests, setKycRequests] = useState<KYCItem[]>([]);
    const [pagination, setPagination] = useState<any>(null);

    // Modal states
    const [selectedKyc, setSelectedKyc] = useState<KYCItem | null>(null);
    const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false);
    const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
    const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);

    const fetchKycRequests = async () => {
        setLoading(true);
        try {
            const res = await GetAllKycRequest(page);
            if (res) {
                setKycRequests(res.data || []);
                setPagination(res.pagination || null);
            }
        } catch (err) {
            console.error("Failed to load KYC requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKycRequests();
    }, [page]);

    const handleApprove = async () => {
        if (!selectedKyc) return;
        setSubmitting(true);
        try {
            const res = await ApproveKycRequest(selectedKyc.id);
            if (res) {
                toast.success(`KYC request for ${selectedKyc.firstName} approved successfully`);
                setApproveModalOpen(false);
                fetchKycRequests();
            }
        } catch (err) {
            console.error("Approval failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedKyc) return;
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }
        setSubmitting(true);
        try {
            const res = await RejectKycRequest(selectedKyc.id, rejectionReason);
            if (res) {
                toast.success(`KYC request for ${selectedKyc.firstName} rejected successfully`);
                setRejectModalOpen(false);
                setRejectionReason('');
                fetchKycRequests();
            }
        } catch (err) {
            console.error("Rejection failed", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex flex-col items-center justify-between border-b border-slate-200/60 dark:border-darkmode-400 pb-4 mb-5 sm:flex-row">
                <h2 className="text-lg font-medium intro-y">KYC Verification Requests</h2>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    {loading && <Lucide icon="Loader" className="w-5 h-5 animate-spin text-primary" />}
                </div>
            </div>

            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-auto intro-y lg:overflow-visible bg-white dark:bg-darkmode-800 rounded-lg p-5 border border-slate-200/60 dark:border-darkmode-400">
                <Table className="border-spacing-y-[10px] border-separate -mt-2">
                    <Table.Thead className="bg-slate-50 dark:bg-darkmode-700/50">
                        <Table.Tr>
                            <Table.Th className="border-b-0 whitespace-nowrap">USER</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap">CONTACT</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">AGE</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">DOCUMENTS</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">STATUS</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">SUBMITTED AT</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">ACTIONS</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {loading ? (
                            <Table.Tr>
                                <Table.Td colSpan={7} className="text-center py-10">
                                    <Lucide icon="Loader" className="w-8 h-8 animate-spin mx-auto text-primary" />
                                </Table.Td>
                            </Table.Tr>
                        ) : kycRequests.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={7} className="text-center py-10 text-slate-500">
                                    No pending KYC requests found.
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            kycRequests.map((kyc) => (
                                <Table.Tr key={kyc.id} className="intro-x">
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-semibold whitespace-nowrap text-slate-800 dark:text-slate-300">
                                            {kyc.firstName} {kyc.lastName}
                                        </div>
                                        <div className="text-xs text-slate-500">{kyc.email}</div>
                                    </Table.Td>
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="text-slate-700 dark:text-slate-400 text-xs whitespace-nowrap">{kyc.phone || 'N/A'}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="text-xs font-medium">{kyc.age || 'N/A'}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="flex items-center justify-center gap-2">
                                            {kyc.kycDocumentFrontUrl ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewDocUrl(kyc.kycDocumentFrontUrl)}
                                                    className="text-xs text-primary hover:underline flex items-center gap-0.5"
                                                >
                                                    <Lucide icon="FileText" className="w-3.5 h-3.5" /> Front
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-450">No Front</span>
                                            )}
                                            <span className="text-slate-300 dark:text-slate-700">|</span>
                                            {kyc.kycDocumentBackUrl ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewDocUrl(kyc.kycDocumentBackUrl)}
                                                    className="text-xs text-primary hover:underline flex items-center gap-0.5"
                                                >
                                                    <Lucide icon="FileText" className="w-3.5 h-3.5" /> Back
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-450">No Back</span>
                                            )}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div
                                            className={clsx("flex items-center justify-center text-xs font-bold uppercase", {
                                                "text-warning": kyc.kycStatus === "PENDING",
                                                "text-success": kyc.kycStatus === "APPROVED",
                                                "text-danger": kyc.kycStatus === "REJECTED"
                                            })}
                                        >
                                            {kyc.kycStatus}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="text-slate-500 whitespace-nowrap text-xs">
                                            {kyc.createdAt ? new Date(kyc.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedKyc(kyc);
                                                    setApproveModalOpen(true);
                                                }}
                                                className="text-success hover:scale-110 transition-transform"
                                                title="Approve KYC"
                                            >
                                                <Lucide icon="CheckCircle" className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedKyc(kyc);
                                                    setRejectModalOpen(true);
                                                }}
                                                className="text-danger hover:scale-110 transition-transform"
                                                title="Reject KYC"
                                            >
                                                <Lucide icon="XCircle" className="w-5 h-5" />
                                            </button>
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
            {pagination && pagination.totalPages > 1 && (
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
            )}
            {/* END: Pagination */}

            {/* Document Preview Modal */}
            <Dialog open={previewDocUrl !== null} onClose={() => setPreviewDocUrl(null)}>
                <Dialog.Panel className="p-4 max-w-lg mx-auto">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                        <h4 className="font-semibold text-sm">Document Preview</h4>
                        <button type="button" onClick={() => setPreviewDocUrl(null)} className="text-slate-500 hover:text-black">
                            <Lucide icon="X" className="w-5 h-5" />
                        </button>
                    </div>
                    {previewDocUrl && (
                        <div className="flex justify-center bg-slate-100 dark:bg-darkmode-900 p-2 rounded max-h-[500px] overflow-auto">
                            <img src={previewDocUrl} alt="KYC Document" className="max-w-full h-auto object-contain rounded" />
                        </div>
                    )}
                </Dialog.Panel>
            </Dialog>

            {/* Approve Modal */}
            <Dialog open={approveModalOpen} onClose={() => setApproveModalOpen(false)}>
                <Dialog.Panel className="p-6 text-center">
                    <Lucide icon="CheckCircle" className="w-16 h-16 mx-auto text-success mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Approve KYC Request</h3>
                    <p className="text-slate-500 mb-6 text-sm">
                        Are you sure you want to approve {selectedKyc?.firstName} {selectedKyc?.lastName}'s KYC request? This will verify their account status.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button type="button" variant="outline-secondary" onClick={() => setApproveModalOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="button" variant="primary" onClick={handleApprove} disabled={submitting}>
                            {submitting ? "Processing..." : "Yes, Approve"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
                <Dialog.Panel className="p-6">
                    <div className="text-center mb-4">
                        <Lucide icon="AlertTriangle" className="w-16 h-16 mx-auto text-danger mb-2" />
                        <h3 className="text-lg font-semibold">Reject KYC Request</h3>
                        <p className="text-slate-500 text-sm">
                            Please specify the reason for rejecting {selectedKyc?.firstName} {selectedKyc?.lastName}'s KYC request.
                        </p>
                    </div>

                    <div className="mb-4">
                        <FormLabel className="text-xs font-semibold">Reason for Rejection</FormLabel>
                        <FormTextarea
                            rows={3}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please explain why the document was rejected..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button type="button" variant="outline-secondary" onClick={() => setRejectModalOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="button" variant="danger" onClick={handleReject} disabled={submitting}>
                            {submitting ? "Rejecting..." : "Yes, Reject"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    );
}

export default KYC;