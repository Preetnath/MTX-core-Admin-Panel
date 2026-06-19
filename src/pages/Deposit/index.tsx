import { useEffect, useState } from 'react';
import {
    HandleGetAllDepositMethods,
    HandleCreateDepositMethod,
    HandleEnableDepositMethod,
    HandleDisableDepositMethod,
    DepositMethodsType,
    HandleGetAllDepositRequest,
    HandleApproveDepositRequest,
    HandleRejectDepositRequest,
    depositSingleRiquest,
    HandleCreateDepositRequest
} from '@/API/deposit';
import Button from '@/components/Base/Button';
import { FormInput, FormLabel, FormSelect, FormCheck } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import { Dialog, Menu } from '@/components/Base/Headless';
import Table from '@/components/Base/Table';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import Pagination from '@/components/Base/Pagination';
import { ChevronFirst, ChevronLast } from 'lucide-react';

interface DepositMethod {
    id: string;
    name: string;
    type: string;
    details: any;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

function Deposit() {
    const [methods, setMethods] = useState<DepositMethod[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [type, setType] = useState('UPI');
    const [isActive, setIsActive] = useState(true);

    // Dynamic details states
    const [upiId, setUpiId] = useState('');
    const [upiName, setUpiName] = useState('');

    const [bankName, setBankName] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');

    const [contactNumber, setContactNumber] = useState('');
    const [officeAddress, setOfficeAddress] = useState('');

    const [tokenName, setTokenName] = useState('');
    const [networkType, setNetworkType] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 1;
    const [PageSearch, setPageSearch] = useState('');
    const [pagination, setPagination] = useState<any>(null);

    // Manual Deposit form state
    const [manualModalOpen, setManualModalOpen] = useState(false);
    const [manualTraderAccountId, setManualTraderAccountId] = useState('');
    const [manualAmount, setManualAmount] = useState('');
    const [manualMethodId, setManualMethodId] = useState('');
    const [manualTxRef, setManualTxRef] = useState('');
    const [manualComment, setManualComment] = useState('');

    // Deposit Requests state
    const [requests, setRequests] = useState<depositSingleRiquest[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<depositSingleRiquest | null>(null);
    const [adminComment, setAdminComment] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchMethods = async () => {
        setLoading(true);
        try {
            const res = await HandleGetAllDepositMethods();
            if (res) {
                setMethods(res);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const res = await HandleGetAllDepositRequest(page);
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
        fetchMethods();
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [page]);

    const handleOpenManualDepositModal = () => {
        setManualTraderAccountId('');
        setManualAmount('');
        const activeMethod = methods.find(m => m.isActive);
        setManualMethodId(activeMethod ? activeMethod.id : '');
        setManualTxRef('');
        setManualComment('');
        setManualModalOpen(true);
    };

    const handleCreateManualDeposit = async () => {
        if (!manualTraderAccountId || !manualAmount || !manualMethodId || !manualTxRef) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await HandleCreateDepositRequest(
                Number(manualTraderAccountId),
                Number(manualAmount),
                manualMethodId,
                manualTxRef,
                manualComment || undefined
            );
            if (res) {
                toast.success("Manual deposit created successfully");
                setManualModalOpen(false);
                fetchRequests();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
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

    const resetForm = () => {
        setName('');
        setType('UPI');
        setIsActive(true);
        setUpiId('');
        setUpiName('');
        setBankName('');
        setIfscCode('');
        setAccountNumber('');
        setAccountHolderName('');
        setContactNumber('');
        setOfficeAddress('');
        setTokenName('');
        setNetworkType('');
        setWalletAddress('');
    };

    const handleOpenCreateModal = () => {
        resetForm();
        setCreateModalOpen(true);
    };

    const handleToggleStatus = async (method: DepositMethod) => {
        try {
            if (method.isActive) {
                const res = await HandleDisableDepositMethod(method.id);
                if (res) {
                    toast.success(`${method.name} disabled successfully`);
                    fetchMethods();
                }
            } else {
                const res = await HandleEnableDepositMethod(method.id);
                if (res) {
                    toast.success(`${method.name} enabled successfully`);
                    fetchMethods();
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (!name) {
            toast.error("Method name is required");
            return;
        }

        let details: any = {};

        if (type === DepositMethodsType.UPI) {
            if (!upiId || !upiName) {
                toast.error("UPI ID and UPI Name are required");
                return;
            }
            details = { upiId, upiName };
        } else if (type === DepositMethodsType.BANK_WIRE) {
            if (!bankName || !ifscCode || !accountNumber || !accountHolderName) {
                toast.error("All bank wire details are required");
                return;
            }
            details = { bankName, ifscCode, accountNumber, accountHolderName };
        } else if (type === DepositMethodsType.CASH) {
            if (!contactNumber || !officeAddress) {
                toast.error("Contact number and office address are required");
                return;
            }
            details = { contactNumber, officeAddress };
        } else if (type === DepositMethodsType.CRYPTO) {
            if (!tokenName || !networkType || !walletAddress) {
                toast.error("Token name, network type, and wallet address are required");
                return;
            }
            details = { tokenName, networkType, walletAddress };
        }

        setIsSubmitting(true);
        try {
            const res = await HandleCreateDepositMethod(name, type, details, isActive);
            if (res) {
                toast.success("Deposit method created successfully");
                setCreateModalOpen(false);
                fetchMethods();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderDetails = (method: DepositMethod) => {
        const d = method.details;
        if (!d) return "No details provided";

        switch (method.type) {
            case DepositMethodsType.UPI:
                return (
                    <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-400">
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">Name:</span> {d.upiName}</div>
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">UPI ID:</span> {d.upiId}</div>
                    </div>
                );
            case DepositMethodsType.BANK_WIRE:
                return (
                    <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-400">
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">Bank:</span> {d.bankName}</div>
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">A/C:</span> {d.accountNumber}</div>
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">Holder:</span> {d.accountHolderName}</div>
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">IFSC:</span> {d.ifscCode}</div>
                    </div>
                );
            case DepositMethodsType.CASH:
                return (
                    <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-400">
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">Contact:</span> {d.contactNumber}</div>
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">Office:</span> {d.officeAddress}</div>
                    </div>
                );
            case DepositMethodsType.CRYPTO:
                return (
                    <div className="text-xs space-y-0.5 text-slate-600 dark:text-slate-400">
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">Token:</span> {d.tokenName}</div>
                        <div><span className="font-semibold text-slate-700 dark:text-slate-300">Network:</span> {d.networkType}</div>
                        <div className="font-mono text-[10px] break-all max-w-[200px]" title={d.walletAddress}>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 font-sans">Wallet:</span> {d.walletAddress}
                        </div>
                    </div>
                );
            default:
                return "Unknown type";
        }
    };

    return (
        <>
            <div className="flex justify-between items-start mt-10">
                <h2 className="text-lg font-medium intro-y">Deposit Methods</h2>
                <div className="flex flex-wrap items-center justify-end col-span-12 intro-y sm:flex-nowrap">
                    <Button variant="primary" className="shadow-md" onClick={handleOpenCreateModal}>
                        <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New Method
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {/* BEGIN: Data List */}
                <div className="col-span-12">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Lucide icon="Loader" className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : methods?.length > 0 ? (
                        <div className="grid grid-cols-12 gap-6">
                            {methods.map((method) => {
                                // Select icon and color scheme based on type
                                let typeIcon = "CreditCard";
                                let typeBg = "bg-primary/10 text-primary dark:bg-primary/20";
                                if (method.type === DepositMethodsType.UPI) {
                                    typeIcon = "Smartphone";
                                    typeBg = "bg-success/10 text-success dark:bg-success/20";
                                } else if (method.type === DepositMethodsType.BANK_WIRE) {
                                    typeIcon = "Building";
                                    typeBg = "bg-warning/10 text-warning dark:bg-warning/20";
                                } else if (method.type === DepositMethodsType.CASH) {
                                    typeIcon = "DollarSign";
                                    typeBg = "bg-danger/10 text-danger dark:bg-danger/20";
                                } else if (method.type === DepositMethodsType.CRYPTO) {
                                    typeIcon = "Coins";
                                    typeBg = "bg-info/10 text-info dark:bg-info/20";
                                }

                                return (
                                    <div
                                        key={method.id}
                                        className="col-span-12 sm:col-span-6 lg:col-span-3 intro-y box p-5 border border-slate-200/60 dark:border-darkmode-400 flex flex-col justify-between min-w-0"
                                    >
                                        <div>
                                            {/* Card Header */}
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-darkmode-400/50 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center", typeBg)}>
                                                        <Lucide icon={typeIcon as any} className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800 dark:text-slate-300 truncate max-w-[150px]" title={method.name}>
                                                            {method.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{method.type.replace('_', ' ')}</div>
                                                    </div>
                                                </div>
                                                <div className={clsx("flex items-center text-xs font-semibold px-2 py-0.5 rounded", {
                                                    "bg-success/20 text-success": method.isActive,
                                                    "bg-danger/20 text-danger": !method.isActive
                                                })}>
                                                    {method.isActive ? "Active" : "Inactive"}
                                                </div>
                                            </div>

                                            {/* Details Section */}
                                            <div className="py-2">
                                                {renderDetails(method)}
                                            </div>
                                        </div>

                                        {/* Actions Section */}
                                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-darkmode-400/50 flex justify-end">
                                            <Button
                                                variant={method.isActive ? "outline-danger" : "outline-success"}
                                                size="sm"
                                                onClick={() => handleToggleStatus(method)}
                                                className="inline-flex items-center gap-1.5 w-full justify-center"
                                            >
                                                <Lucide icon={method.isActive ? "ToggleRight" : "ToggleLeft"} className="w-4 h-4" />
                                                {method.isActive ? "Disable Method" : "Enable Method"}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-500 box border border-slate-200/60 dark:border-darkmode-400">
                            No deposit methods found. Let's create one.
                        </div>
                    )}
                </div>
            </div>

            {/* Deposit Requests Section */}
            <div className="flex justify-between items-center mt-12 mb-5">
                <h2 className="text-lg font-medium intro-y">Deposit Requests</h2>
                <Button variant="primary" className="shadow-md flex items-center gap-2" onClick={handleOpenManualDepositModal}>
                    <Lucide icon="Plus" className="w-4 h-4" />
                    <span className='sm:block hidden' >Create Manual Deposit</span>
                </Button>
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
                                                    const updatedParams = new URLSearchParams(params);
                                                    updatedParams.set("page", PageSearch);
                                                    setParams(updatedParams);
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
                                            const updatedParams = new URLSearchParams(params);
                                            updatedParams.set("page", (pagination.page - 1).toString());
                                            setParams(updatedParams);
                                        }}
                                    />
                                    <div
                                        onClick={() => {
                                            const updatedParams = new URLSearchParams(params);
                                            updatedParams.set("page", "1");
                                            setParams(updatedParams);
                                        }}
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
                                        onClick={() => {
                                            const updatedParams = new URLSearchParams(params);
                                            updatedParams.set("page", pagination?.totalPages?.toString() || "1");
                                            setParams(updatedParams);
                                        }}
                                        className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm"
                                    >
                                        {pagination?.totalPages}
                                    </div>

                                    <ChevronLast
                                        className="cursor-pointer text-gray-400"
                                        onClick={() => {
                                            if (!pagination?.nextPage) return;
                                            const updatedParams = new URLSearchParams(params);
                                            updatedParams.set("page", (pagination.page + 1).toString());
                                            setParams(updatedParams);
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

            {/* BEGIN: Create Modal */}
            <Dialog open={createModalOpen} onClose={() => { setCreateModalOpen(false); }} size="lg">
                <Dialog.Panel>
                    <div className="p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 className="text-base font-medium">Create New Deposit Method</h2>
                    </div>
                    <div className="p-5 grid grid-cols-12 gap-4">
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="method-type">Type *</FormLabel>
                            <FormSelect
                                id="method-type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <option value="UPI">UPI</option>
                                <option value="BANK_WIRE">Bank Wire</option>
                                <option value="CASH">Cash</option>
                                <option value="CRYPTO">Crypto</option>
                            </FormSelect>
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="method-name">Method Name *</FormLabel>
                            <FormInput
                                id="method-name"
                                type="text"
                                placeholder="eg. UPI Pro, Bank Account A"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* UPI Fields */}
                        {type === 'UPI' && (
                            <>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="upi-id">UPI ID *</FormLabel>
                                    <FormInput
                                        id="upi-id"
                                        type="text"
                                        placeholder="eg. receiver@upi"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="upi-name">UPI Name *</FormLabel>
                                    <FormInput
                                        id="upi-name"
                                        type="text"
                                        placeholder="eg. John Doe"
                                        value={upiName}
                                        onChange={(e) => setUpiName(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {/* Bank Wire Fields */}
                        {type === 'BANK_WIRE' && (
                            <>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="bank-name">Bank Name *</FormLabel>
                                    <FormInput
                                        id="bank-name"
                                        type="text"
                                        placeholder="eg. HDFC Bank"
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="ifsc-code">IFSC Code *</FormLabel>
                                    <FormInput
                                        id="ifsc-code"
                                        type="text"
                                        placeholder="eg. HDFC0001234"
                                        value={ifscCode}
                                        onChange={(e) => setIfscCode(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="ac-number">Account Number *</FormLabel>
                                    <FormInput
                                        id="ac-number"
                                        type="text"
                                        placeholder="eg. 50100293847"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="ac-holder">Account Holder Name *</FormLabel>
                                    <FormInput
                                        id="ac-holder"
                                        type="text"
                                        placeholder="eg. John Doe"
                                        value={accountHolderName}
                                        onChange={(e) => setAccountHolderName(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {/* Cash Fields */}
                        {type === 'CASH' && (
                            <>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="contact-num">Contact Number *</FormLabel>
                                    <FormInput
                                        id="contact-num"
                                        type="text"
                                        placeholder="eg. +1234567890"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormLabel htmlFor="office-addr">Office Address *</FormLabel>
                                    <textarea
                                        id="office-addr"
                                        className="w-full form-control rounded-md border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white"
                                        rows={3}
                                        placeholder="Enter complete office address..."
                                        value={officeAddress}
                                        onChange={(e) => setOfficeAddress(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {/* Crypto Fields */}
                        {type === 'CRYPTO' && (
                            <>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="token-name">Token Name *</FormLabel>
                                    <FormInput
                                        id="token-name"
                                        type="text"
                                        placeholder="eg. USDT, BTC"
                                        value={tokenName}
                                        onChange={(e) => setTokenName(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6">
                                    <FormLabel htmlFor="network-type">Network Type *</FormLabel>
                                    <FormInput
                                        id="network-type"
                                        type="text"
                                        placeholder="eg. TRC20, ERC20"
                                        value={networkType}
                                        onChange={(e) => setNetworkType(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormLabel htmlFor="wallet-addr">Wallet Address *</FormLabel>
                                    <FormInput
                                        id="wallet-addr"
                                        type="text"
                                        placeholder="eg. T9yD14Nj9y..."
                                        value={walletAddress}
                                        onChange={(e) => setWalletAddress(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div className="col-span-12 mt-2">
                            <FormCheck className="w-full">
                                <FormCheck.Input
                                    id="isActive"
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />
                                <FormCheck.Label htmlFor="isActive" className="text-slate-500 font-medium">
                                    Active
                                </FormCheck.Label>
                            </FormCheck>
                        </div>
                    </div>
                    <div className="px-5 pb-8 flex items-center justify-end">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => { setCreateModalOpen(false); }}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-24"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
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
            {/* Create Manual Deposit Modal */}
            <Dialog open={manualModalOpen} onClose={() => { setManualModalOpen(false); }} size="lg">
                <Dialog.Panel>
                    <div className="p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 className="text-base font-medium">Create Manual Deposit</h2>
                    </div>
                    <div className="p-5 grid grid-cols-12 gap-4">
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="manual-account-id">Trader Account ID *</FormLabel>
                            <FormInput
                                id="manual-account-id"
                                type="number"
                                placeholder="eg. 12345"
                                value={manualTraderAccountId}
                                onChange={(e) => setManualTraderAccountId(e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="manual-amount">Amount ($) *</FormLabel>
                            <FormInput
                                id="manual-amount"
                                type="number"
                                placeholder="eg. 500"
                                value={manualAmount}
                                onChange={(e) => setManualAmount(e.target.value)}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="manual-method">Deposit Method *</FormLabel>
                            <FormSelect
                                id="manual-method"
                                value={manualMethodId}
                                onChange={(e) => setManualMethodId(e.target.value)}
                            >
                                <option value="" disabled>Select Method</option>
                                {methods.filter(m => m.isActive).map(method => (
                                    <option key={method.id} value={method.id}>
                                        {method.name} ({method.type})
                                    </option>
                                ))}
                            </FormSelect>
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="manual-tx-ref">Transaction Reference *</FormLabel>
                            <FormInput
                                id="manual-tx-ref"
                                type="text"
                                placeholder="eg. TXN987654321"
                                value={manualTxRef}
                                onChange={(e) => setManualTxRef(e.target.value)}
                            />
                        </div>
                        <div className="col-span-12">
                            <FormLabel htmlFor="manual-comment">Admin Comment (Optional)</FormLabel>
                            <FormInput
                                id="manual-comment"
                                type="text"
                                placeholder="Enter comments"
                                value={manualComment}
                                onChange={(e) => setManualComment(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="px-5 pb-8 flex items-center justify-end">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => { setManualModalOpen(false); }}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-32"
                            onClick={handleCreateManualDeposit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating..." : "Create Deposit"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </>
    );
}

export default Deposit;