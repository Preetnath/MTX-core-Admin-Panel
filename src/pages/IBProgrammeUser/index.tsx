import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    GetSingleIbRequest,
    HandleApproveIbRequest,
    HandleRejectIbRequest,
    IBProgrammeRequestSingleRes
} from '@/API/ibProgramme';
import Lucide from '@/components/Base/Lucide';
import Button from '@/components/Base/Button';
import Table from '@/components/Base/Table';
import { FormInput, FormLabel } from '@/components/Base/Form';
import { Dialog } from '@/components/Base/Headless';
import { toast } from 'react-toastify';
import clsx from 'clsx';

function IBProgrammeUser() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const id = params.get("id");

    const [loading, setLoading] = useState<boolean>(false);
    const [details, setDetails] = useState<IBProgrammeRequestSingleRes | null>(null);

    // Modals
    const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false);
    const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Approve commission rates (dynamic array of { level, amountPerLot })
    const [rates, setRates] = useState<{ level: number; amountPerLot: number }[]>([
        { level: 0, amountPerLot: 2.0 },
        { level: 1, amountPerLot: 1.0 }
    ]);

    const fetchDetails = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await GetSingleIbRequest(id);
            if (res) {
                setDetails(res);
            }
        } catch (err) {
            console.error("Failed to load IB Request details", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleApprove = async () => {
        if (!id) return;
        const ratesToSend = rates.filter(rate => rate.amountPerLot > 0);
        if (ratesToSend.length === 0) {
            toast.error("Please configure at least one level commission rate greater than 0");
            return;
        }

        setSubmitting(true);
        try {
            const res = await HandleApproveIbRequest(id, ratesToSend);
            if (res) {
                toast.success("IB Request approved successfully");
                setApproveModalOpen(false);
                fetchDetails();
            }
        } catch (err) {
            console.error("Failed to approve IB Request", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!id) return;
        setSubmitting(true);
        try {
            const res = await HandleRejectIbRequest(id);
            if (res) {
                toast.success("IB Request rejected successfully");
                setRejectModalOpen(false);
                fetchDetails();
            }
        } catch (err) {
            console.error("Failed to reject IB Request", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRateChange = (index: number, val: string) => {
        const num = parseFloat(val);
        setRates(prev => prev.map((item, idx) => idx === index ? { ...item, amountPerLot: isNaN(num) ? 0 : num } : item));
    };

    const addRateLevel = () => {
        setRates(prev => {
            if (prev.length >= 3) return prev;
            return [...prev, { level: prev.length, amountPerLot: 0 }];
        });
    };

    const removeRateLevel = (index: number) => {
        if (rates.length <= 1) return;
        const filtered = rates.filter((_, idx) => idx !== index);
        // re-index levels sequentially starting from 0
        const updated = filtered.map((item, idx) => ({ ...item, level: idx }));
        setRates(updated);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Lucide icon="Loader" className="w-12 h-12 animate-spin text-primary" />
                <span className="mt-2 text-slate-500 font-medium">Loading IB Request Details...</span>
            </div>
        );
    }

    if (!details) {
        return (
            <div className="box p-5 text-center mt-5">
                <Lucide icon="AlertCircle" className="w-16 h-16 mx-auto text-warning mb-3" />
                <h3 className="text-lg font-semibold">Request Not Found</h3>
                <p className="text-slate-500">The requested IB program request details could not be retrieved.</p>
                <Button variant="primary" className="mt-4" onClick={() => navigate('/dashboard/ib-programme')}>
                    Back to Requests
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <div className="flex flex-col items-start justify-between border-b border-slate-200/60 dark:border-darkmode-400 pb-4 mb-5 sm:flex-row">
                <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer hover:text-primary mb-1" onClick={() => navigate('/dashboard/ib-programme')}>
                        <Lucide icon="ChevronLeft" className="w-4 h-4" /> Back to IB Requests
                    </div>
                    <h2 className="text-lg font-medium">
                        IB Request: {details.user?.firstName} {details.user?.lastName}
                    </h2>
                </div>

                {details.status === 'PENDING' && (
                    <div className="flex gap-2 mt-3 sm:mt-0">
                        <Button variant="danger" className="px-4" onClick={() => setRejectModalOpen(true)}>
                            Reject Request
                        </Button>
                        <Button variant="primary" className="px-4" onClick={() => setApproveModalOpen(true)}>
                            Approve & Configure
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Column 1: Profile & Status Details */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                    {/* User Profile Card */}
                    <div className="box p-5 border border-slate-200/60 dark:border-darkmode-400 bg-white dark:bg-darkmode-800 rounded-lg">
                        <h3 className="font-semibold text-base border-b border-slate-200/60 dark:border-darkmode-400 pb-3 mb-4">
                            Applicant Profile
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Full Name</span>
                                <span className="font-semibold">{details.user?.firstName} {details.user?.lastName}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Email Address</span>
                                <span className="font-semibold">{details.user?.email}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Phone Number</span>
                                <span className="font-semibold">{details.user?.phone || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">KYC Status</span>
                                <span className={clsx("font-bold text-xs uppercase px-2 py-0.5 rounded", {
                                    "bg-success/20 text-success": details.user?.kycStatus === 'APPROVED',
                                    "bg-warning/20 text-warning": details.user?.kycStatus === 'PENDING',
                                    "bg-danger/20 text-danger": details.user?.kycStatus === 'REJECTED'
                                })}>
                                    {details.user?.kycStatus || 'NOT VERIFIED'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* IB Program Account Stats Card */}
                    <div className="box p-5 border border-slate-200/60 dark:border-darkmode-400 bg-white dark:bg-darkmode-800 rounded-lg">
                        <h3 className="font-semibold text-base border-b border-slate-200/60 dark:border-darkmode-400 pb-3 mb-4">
                            IB Program Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">IB Profile ID</span>
                                <span className="font-mono text-xs">{details.id}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">IB Program Status</span>
                                <span className={clsx("font-bold text-xs uppercase px-2 py-0.5 rounded", {
                                    "bg-success/20 text-success": details.status === 'APPROVED',
                                    "bg-warning/20 text-warning": details.status === 'PENDING',
                                    "bg-danger/20 text-danger": details.status === 'REJECTED'
                                })}>
                                    {details.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Wallet Balance</span>
                                <span className="font-semibold text-success">${Number(details.balance).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Total Commissions Earned</span>
                                <span className="font-semibold">${Number(details.totalCommissionEarned).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Total Commissions Withdrawn</span>
                                <span className="font-semibold">${Number(details.totalCommissionWithdrawn).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Joined Date</span>
                                <span className="font-semibold">
                                    {details.joinedAt ? new Date(details.joinedAt).toLocaleString() : 'Pending Approval'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Referrer Tree Hierarchy */}
                <div className="col-span-12 lg:col-span-6">
                    <div className="box p-5 border border-slate-200/60 dark:border-darkmode-400 bg-white dark:bg-darkmode-800 rounded-lg h-full">
                        <h3 className="font-semibold text-base border-b border-slate-200/60 dark:border-darkmode-400 pb-3 mb-4">
                            Referrer Level Network
                        </h3>
                        {details.referrers && details.referrers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <Table.Thead className="bg-slate-50 dark:bg-darkmode-700/50">
                                        <Table.Tr>
                                            <Table.Th className="text-center">LEVEL</Table.Th>
                                            <Table.Th>REFERRER NAME</Table.Th>
                                            <Table.Th>EMAIL</Table.Th>
                                            <Table.Th className="text-center">STATUS</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {details.referrers.map((referrer, idx) => (
                                            <Table.Tr key={idx} className="hover:bg-slate-50 dark:hover:bg-darkmode-700/30">
                                                <Table.Td className="text-center font-bold text-primary">
                                                    Level {referrer.level}
                                                </Table.Td>
                                                <Table.Td className="font-medium">
                                                    {referrer.user?.firstName} {referrer.user?.lastName}
                                                </Table.Td>
                                                <Table.Td>{referrer.user?.email}</Table.Td>
                                                <Table.Td className="text-center">
                                                    <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded uppercase", {
                                                        "bg-success/20 text-success": referrer.ibProfile?.status === 'APPROVED',
                                                        "bg-warning/20 text-warning": referrer.ibProfile?.status === 'PENDING',
                                                        "bg-danger/20 text-danger": referrer.ibProfile?.status === 'REJECTED'
                                                    })}>
                                                        {referrer.ibProfile?.status}
                                                    </span>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <Lucide icon="Users" className="w-12 h-12 mb-2 text-slate-350" />
                                <p className="text-sm">No referrer levels associated with this user.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <Dialog open={approveModalOpen} onClose={() => setApproveModalOpen(false)}>
                <Dialog.Panel className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Approve IB Request & Configure Rates</h3>
                    <p className="text-xs text-slate-500 mb-4">
                        Set the commission amounts for each level in the referral hierarchy.
                    </p>

                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {rates.map((rate, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-slate-50 dark:bg-darkmode-700/30 p-3 rounded-lg border border-slate-200 dark:border-darkmode-600">
                                <div className="flex-1">
                                    <FormLabel className="text-xs font-semibold">Level {rate.level + 1} Commission</FormLabel>
                                    <FormInput
                                        type="number"
                                        step="0.01"
                                        value={rate.amountPerLot}
                                        onChange={(e) => handleRateChange(idx, e.target.value)}
                                        placeholder="0.00"
                                        className="w-full"
                                    />
                                </div>
                                {rates.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRateLevel(idx)}
                                        className="text-danger mt-6 hover:scale-105 transition-transform"
                                    >
                                        <Lucide icon="Trash" className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                        {rates.length < 3 && (
                            <Button type="button" variant="outline-secondary" size="sm" className="flex items-center gap-1" onClick={addRateLevel}>
                                <Lucide icon="Plus" className="w-4 h-4" /> Add Level
                            </Button>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline-secondary" onClick={() => setApproveModalOpen(false)} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="button" variant="primary" onClick={handleApprove} disabled={submitting}>
                            {submitting ? "Processing..." : "Confirm & Approve"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
                <Dialog.Panel className="p-6 text-center">
                    <Lucide icon="AlertTriangle" className="w-16 h-16 mx-auto text-danger mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Reject IB Request</h3>
                    <p className="text-slate-500 mb-6 text-sm">
                        Are you sure you want to reject {details.user?.firstName} {details.user?.lastName}'s IB programme request? This action cannot be undone.
                    </p>

                    <div className="flex justify-center gap-3">
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

export default IBProgrammeUser;