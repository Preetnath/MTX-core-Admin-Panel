import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    HandleGetUserTradingAccounts,
    HandleApproveUserTradingAccount,
    HandleRejectUserTradingAccount,
    HandleCreateUserTradingAccount,
    HandleGetSingleUser,
    TraderAccount,
    SingleUser
} from '@/API/user';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import Button from '@/components/Base/Button';
import { FormInput, FormLabel, FormSelect } from '@/components/Base/Form';
import { Dialog } from '@/components/Base/Headless';
import { toast } from 'react-toastify';
import PersonalDetails from '@/components/User/PersonalDetails';
import clsx from 'clsx';

function UserTraderList() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const userId = params.get("userId") as string;

    const [accounts, setAccounts] = useState<TraderAccount[]>([]);
    const [userData, setUserData] = useState<SingleUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

    // Modal state
    const [createModal, setCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        accountType: 'DEMO',
        accountMode: 'HEDGING',
        leverage: 100,
        amount: 1000
    });

    const fetchAccounts = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await HandleGetUserTradingAccounts(userId);
            if (res) {
                setAccounts(res);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserData = async () => {
        if (!userId) return;
        setUserLoading(true);
        try {
            const res = await HandleGetSingleUser(userId);
            if (res) {
                setUserData(res);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUserLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchUserData();
    }, [userId]);

    const handleRowClick = (accountId: number, leverage: string) => {
        navigate(`/dashboard/user-details?userId=${userId}&accountId=${accountId}&leverage=${leverage}`);
    };

    const handleApprove = async (e: React.MouseEvent, accountId: number) => {
        e.stopPropagation();
        const actionKey = `approve-${accountId}`;
        setActionLoading(prev => ({ ...prev, [actionKey]: true }));
        try {
            const res = await HandleApproveUserTradingAccount(userId, accountId.toString());
            if (res) {
                toast.success("Account approved successfully");
                fetchAccounts();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(prev => ({ ...prev, [actionKey]: false }));
        }
    };

    const handleReject = async (e: React.MouseEvent, accountId: number) => {
        e.stopPropagation();
        const actionKey = `reject-${accountId}`;
        setActionLoading(prev => ({ ...prev, [actionKey]: true }));
        try {
            const res = await HandleRejectUserTradingAccount(userId, accountId.toString());
            if (res) {
                toast.success("Account rejected successfully");
                fetchAccounts();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(prev => ({ ...prev, [actionKey]: false }));
        }
    };

    const handleCreateAccount = async () => {
        if (!formData.leverage || formData.leverage <= 0) {
            toast.error("Please enter a valid leverage");
            return;
        }
        if (!formData.amount || formData.amount <= 0) {
            toast.error("Please enter a valid initial amount");
            return;
        }

        setIsCreating(true);
        try {
            const res = await HandleCreateUserTradingAccount(userId, {
                accountType: formData.accountType,
                accountMode: formData.accountMode,
                leverage: Number(formData.leverage),
                amount: Number(formData.amount)
            });
            if (res) {
                toast.success("Trading account created successfully");
                setCreateModal(false);
                fetchAccounts();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">User Trading Accounts</h2>
                <Button variant="primary" className="shadow-md" onClick={() => setCreateModal(true)}>
                    <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New Account
                </Button>
            </div>

            {/* Personal Details Section */}
            <div className="mt-5 intro-y">
                {userLoading ? (
                    <div className="box p-5 text-center text-slate-500">
                        <Lucide icon="Loader" className="w-6 h-6 mx-auto animate-spin text-primary" />
                        <span className="mt-2 block font-medium">Loading Personal Details...</span>
                    </div>
                ) : (
                    userData && <PersonalDetails userData={userData} />
                )}
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                {/* BEGIN: Data List */}
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap">USERNAME</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">BROKER</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">TYPE / MODE</Table.Th>
                                <Table.Th className="text-right border-b-0 whitespace-nowrap">LEVERAGE</Table.Th>
                                <Table.Th className="text-right border-b-0 whitespace-nowrap">SPREAD</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">STATUS</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">ACTIONS</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7} className="text-center py-5">
                                        <Lucide icon="Loader" className="w-8 h-8 mx-auto animate-spin text-primary" />
                                    </Table.Td>
                                </Table.Tr>
                            ) : accounts?.length > 0 ? (
                                accounts.map((account) => (
                                    <Table.Tr
                                        key={account.id}
                                        className="intro-x cursor-pointer hover:bg-slate-100 dark:hover:bg-darkmode-400 transition-colors"
                                        onClick={() => handleRowClick(account.id, account.leverage.toString())}
                                    >
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-semibold text-primary whitespace-nowrap">
                                                {account.generatedUsername}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">ID: {account.id}</div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="flex items-center">
                                                <span className="font-medium whitespace-nowrap">
                                                    {account.brokerId?.slice(0, 12) + "..." || "Unknown"}
                                                </span>
                                            </div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className={`font-medium whitespace-nowrap capitalize ${account.accountType === "DEMO" ? "text-warning" : "text-success"}`}>{account.accountType}</div>
                                            <div className="text-xs text-slate-400 mt-0.5 capitalize">{account.accountMode}</div>
                                        </Table.Td>
                                        <Table.Td className="box text-right rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-mono text-slate-600 dark:text-slate-300">1:{account.leverage}</div>
                                        </Table.Td>
                                        <Table.Td className="box text-right rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-mono text-slate-600 dark:text-slate-300">{account?.spread ?? "--"}</div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div
                                                className={clsx("flex items-center justify-center font-medium", {
                                                    "text-success": account.status === "ACTIVE",
                                                    "text-warning": account.status === "PENDING",
                                                    "text-danger": account.status === "SUSPENDED" || account.status === "INACTIVE"
                                                })}
                                            >
                                                <Lucide
                                                    icon={account.status === "ACTIVE" ? "CheckCircle" : account.status === "PENDING" ? "AlertCircle" : "XCircle"}
                                                    className="w-4 h-4 mr-1.5"
                                                />
                                                <span className="capitalize">{account.status.toLowerCase()}</span>
                                            </div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="flex justify-center items-center gap-2">
                                                {account.status === "PENDING" ? (
                                                    <>
                                                        <button
                                                            disabled={actionLoading[`approve-${account.id}`] || actionLoading[`reject-${account.id}`]}
                                                            onClick={(e) => handleApprove(e, account.id)}
                                                            className="flex items-center text-success font-medium hover:underline disabled:opacity-50"
                                                        >
                                                            {actionLoading[`approve-${account.id}`] ? (
                                                                <Lucide icon="Loader" className="w-4 h-4 mr-1 animate-spin" />
                                                            ) : (
                                                                <Lucide icon="Check" className="w-4 h-4 mr-1" />
                                                            )}
                                                            Approve
                                                        </button>
                                                        <button
                                                            disabled={actionLoading[`approve-${account.id}`] || actionLoading[`reject-${account.id}`]}
                                                            onClick={(e) => handleReject(e, account.id)}
                                                            className="flex items-center text-danger font-medium hover:underline disabled:opacity-50"
                                                        >
                                                            {actionLoading[`reject-${account.id}`] ? (
                                                                <Lucide icon="Loader" className="w-4 h-4 mr-1 animate-spin" />
                                                            ) : (
                                                                <Lucide icon="X" className="w-4 h-4 mr-1" />
                                                            )}
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRowClick(account.id, account.leverage.toString());
                                                        }}
                                                        className="flex items-center text-primary font-medium hover:underline"
                                                    >
                                                        <Lucide icon="Eye" className="w-4 h-4 mr-1" /> View
                                                    </button>
                                                )}
                                            </div>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={7} className="text-center py-5 text-slate-500">
                                        No trading accounts found for this user.
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </div>
            </div>

            {/* BEGIN: Create Trading Account Modal */}
            <Dialog open={createModal} onClose={() => setCreateModal(false)} size="md">
                <Dialog.Panel>
                    <div className="p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 className="text-base font-medium">Create New Trading Account</h2>
                    </div>
                    <div className="p-5 flex flex-col gap-4">
                        <div>
                            <FormLabel htmlFor="accountType">Account Type</FormLabel>
                            <FormSelect
                                id="accountType"
                                value={formData.accountType}
                                onChange={(e) => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
                            >
                                <option value="DEMO">DEMO</option>
                                <option value="FUNDED">FUNDED</option>
                            </FormSelect>
                        </div>
                        <div>
                            <FormLabel htmlFor="accountMode">Account Mode</FormLabel>
                            <FormSelect
                                id="accountMode"
                                value={formData.accountMode}
                                disabled
                            >
                                <option value="HEDGING">HEDGING</option>
                            </FormSelect>
                        </div>
                        <div>
                            <FormLabel htmlFor="leverage">Leverage</FormLabel>
                            <FormInput
                                id="leverage"
                                type="number"
                                placeholder="eg. 100"
                                value={formData.leverage}
                                onChange={(e) => setFormData(prev => ({ ...prev, leverage: Number(e.target.value) }))}
                            />
                        </div>
                        <div>
                            <FormLabel htmlFor="amount">Initial Amount</FormLabel>
                            <FormInput
                                id="amount"
                                type="number"
                                placeholder="eg. 1000"
                                value={formData.amount}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                            />
                        </div>
                    </div>
                    <div className="px-5 pb-8 flex items-center justify-end">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => setCreateModal(false)}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-24"
                            onClick={handleCreateAccount}
                            disabled={isCreating}
                        >
                            {isCreating ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Create Trading Account Modal */}
        </>
    );
}

export default UserTraderList;
