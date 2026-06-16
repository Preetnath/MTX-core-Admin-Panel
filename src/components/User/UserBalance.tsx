import { useEffect, useState } from 'react'
import { Wallet, HandleGetUserWallet, HandleGetUserWalletTransactions, Transactions, pagination, HandleUserDeposit, HandleUserWithdrawal } from '@/API/user'
import Table from '@/components/Base/Table'
import Lucide from '@/components/Base/Lucide'
import clsx from 'clsx'
import { useSearchParams } from 'react-router-dom'
import Pagination from '@/components/Base/Pagination'
import { FormInput } from '@/components/Base/Form'
import { Menu, Dialog } from '@/components/Base/Headless'
import Button from '@/components/Base/Button'
import { ChevronFirst, ChevronLast } from 'lucide-react'
import { toast } from 'react-toastify'

function UserBalance({ accountId }: { accountId: string }) {

    const [params, setParams] = useSearchParams()
    const page = Number(params.get("page")) || 1

    const [wallet, setWallet] = useState<Wallet | null>(null)
    const [transactions, setTransactions] = useState<Transactions[]>([])
    const [pageData, setPageData] = useState<pagination | null>(null)
    const [loading, setLoading] = useState(false)
    const [loadingTransactions, setLoadingTransactions] = useState(false)

    const [amount, setAmount] = useState<number>(0)
    const [depositModal, setDepositModal] = useState(false)
    const [withdrawalModal, setWithdrawalModal] = useState(false)

    const getUserWallet = async () => {
        setLoading(true)
        try {
            const res = await HandleGetUserWallet(accountId)
            if (res) {
                setWallet(res)
            }
        } catch (err) {
            console.error("User wallet data fetch failed", err)
        } finally {
            setLoading(false)
        }
    }

    const getUserWalletTransactions = async () => {
        setLoadingTransactions(true)
        try {
            const res = await HandleGetUserWalletTransactions(accountId, page)
            if (res) {
                setTransactions(res?.transactions)
                setPageData(res?.pagination)
            }
        } catch (err) {
            console.error("User Transactions data fetch failed", err)
        } finally {
            setLoadingTransactions(false)
        }
    }

    const handleUserDeposit = async () => {
        if (amount <= 0) {
            toast.error("Amount must be greater than 0")
            return
        }
        setLoading(true)
        try {
            const res = await HandleUserDeposit(accountId, amount)
            if (res) {
                getUserWallet()
                getUserWalletTransactions()
                setDepositModal(false)
            }
        } catch (err) {
            console.error("User wallet data fetch failed", err)
        } finally {
            setLoading(false)
        }
    }

    const handleUserWithdrawal = async () => {
        if (amount <= 0) {
            toast.error("Amount must be greater than 0")
            return
        }
        setLoading(true)
        try {
            const res = await HandleUserWithdrawal(accountId, amount)
            if (res) {
                getUserWallet()
                getUserWalletTransactions()
                setWithdrawalModal(false)
            }
        } catch (err) {
            console.error("User wallet data fetch failed", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!accountId) return
        getUserWallet()
    }, [accountId])

    useEffect(() => {
        if (!accountId) return
        getUserWalletTransactions()
    }, [accountId, page])

    return (
        <div className="mt-5">
            {loading ? (
                <div className="flex justify-center items-center py-10">
                    <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <div className="flex justify-end gap-2 mb-4">
                        <Button variant="primary" onClick={() => { setAmount(0); setDepositModal(true); }}>
                            <Lucide icon="ArrowDownCircle" className="w-4 h-4 mr-2" /> Deposit
                        </Button>
                        <Button variant="danger" onClick={() => { setAmount(0); setWithdrawalModal(true); }}>
                            <Lucide icon="ArrowUpCircle" className="w-4 h-4 mr-2" /> Withdrawal
                        </Button>
                    </div>

                    {/* Wallet Metric Cards */}
                    {wallet && (
                        <div className="grid grid-cols-12 gap-6 mt-5">
                            <div className="col-span-12 sm:col-span-4 box p-5 flex flex-col justify-center shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                <Lucide icon="Wallet" className="w-8 h-8 text-primary mb-3" />
                                <div className="text-slate-500 font-medium">Available Balance</div>
                                <div className="mt-1 text-2xl font-medium leading-8">
                                    {wallet.currency} {wallet.availableBalance}
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-4 box p-5 flex flex-col justify-center shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                <Lucide icon="Lock" className="w-8 h-8 text-pending mb-3" />
                                <div className="text-slate-500 font-medium">Locked Balance</div>
                                <div className="mt-1 text-2xl font-medium leading-8">
                                    {wallet.currency} {wallet.lockedBalance}
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-4 box p-5 flex flex-col justify-center shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                <Lucide icon="DollarSign" className="w-8 h-8 text-success mb-3" />
                                <div className="text-slate-500 font-medium">Total Balance</div>
                                <div className="mt-1 text-2xl font-medium leading-8">
                                    {wallet.currency} {wallet.balance}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Transactions Table */}
                    <div className="mt-8">
                        <h2 className="text-lg font-medium intro-y mb-4">Transaction Details</h2>
                        <div className="overflow-auto intro-y lg:overflow-visible box p-5 border border-slate-200/60 dark:border-darkmode-400 relative">
                            {loadingTransactions && (
                                <div className="absolute inset-0 bg-white/50 z-20 flex justify-center py-10">
                                    <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            )}

                            {transactions && transactions.length > 0 ? (
                                <Table className="border-spacing-y-[10px] border-separate -mt-2 relative z-10">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th className="border-b-0 whitespace-nowrap">TYPE</Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap text-right">AMOUNT</Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap text-center">BEFORE &rarr; AFTER</Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap">DESCRIPTION</Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap">REFERENCE ID</Table.Th>
                                            <Table.Th className="border-b-0 whitespace-nowrap">DATE</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {transactions.map((transaction) => (
                                            <Table.Tr key={transaction.id} className="intro-x">
                                                <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                                    <div className={clsx("font-medium", {
                                                        "text-success": transaction.type.toUpperCase() === 'CREDIT' || transaction.type.toUpperCase() === 'DEPOSIT',
                                                        "text-danger": transaction.type.toUpperCase() === 'DEBIT' || transaction.type.toUpperCase() === 'WITHDRAWAL'
                                                    })}>
                                                        {transaction.type}
                                                    </div>
                                                </Table.Td>
                                                <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-right shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                                    <div className={`${transaction.amount > 0 ? "text-success" : "text-danger"} font-medium`} >
                                                        {transaction.amount}
                                                    </div>
                                                </Table.Td>
                                                <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <span className="text-slate-500">{transaction.balanceBefore}</span>
                                                        <Lucide icon="ArrowRight" className="w-4 h-4 text-slate-400" />
                                                        <span className="font-medium">{transaction.balanceAfter}</span>
                                                    </div>
                                                </Table.Td>
                                                <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                                    <div className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                        {transaction.description}
                                                    </div>
                                                </Table.Td>
                                                <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                                    <div className="text-slate-500 text-xs">
                                                        {transaction.referenceId}
                                                    </div>
                                                </Table.Td>
                                                <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                                    <div className="text-slate-500 text-xs whitespace-nowrap">
                                                        {new Date(transaction.createdAt).toLocaleString()}
                                                    </div>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <div className="text-center py-10 text-slate-500">
                                    No transactions found for this wallet.
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-wrap mt-5 items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                            {pageData && (
                                <Pagination className="w-full sm:w-auto sm:mr-auto">
                                    <div className="flex justify-center items-center gap-3 ml-5">
                                        <ChevronFirst
                                            className="cursor-pointer text-gray-400 hover:text-primary transition-colors"
                                            onClick={() => {
                                                if (!pageData?.prevPage) return;
                                                const updatedParams = new URLSearchParams(params);
                                                updatedParams.set("page", (pageData.page - 1).toString());
                                                setParams(updatedParams);
                                            }}
                                        />
                                        <div
                                            onClick={() => {
                                                const updatedParams = new URLSearchParams(params);
                                                updatedParams.set("page", "1");
                                                setParams(updatedParams);
                                            }}
                                            className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm hover:bg-slate-300"
                                        >
                                            1
                                        </div>

                                        <h1 className="text-slate-400">...</h1>
                                        <div className="bg-primary text-white cursor-pointer px-3 py-1 rounded-sm shadow-md">
                                            {pageData?.page}
                                        </div>

                                        <h1 className="text-slate-400">...</h1>

                                        <div
                                            onClick={() => {
                                                const updatedParams = new URLSearchParams(params);
                                                updatedParams.set("page", pageData?.totalPages?.toString() || "1");
                                                setParams(updatedParams);
                                            }}
                                            className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm hover:bg-slate-300"
                                        >
                                            {pageData?.totalPages}
                                        </div>

                                        <ChevronLast
                                            className="cursor-pointer text-gray-400 hover:text-primary transition-colors"
                                            onClick={() => {
                                                if (!pageData?.nextPage) return;
                                                const updatedParams = new URLSearchParams(params);
                                                updatedParams.set("page", (pageData.page + 1).toString());
                                                setParams(updatedParams);
                                            }}
                                        />
                                    </div>
                                </Pagination>
                            )}
                            <div className="flex flex-col items-end w-full mt-3 sm:w-auto sm:mt-0">
                                <h1 className="text-slate-500">
                                    Showing{" "}
                                    {pageData && pageData.page && pageData.limit
                                        ? (pageData.page - 1) * pageData.limit + 1
                                        : 0}
                                    {" to "}
                                    {pageData && pageData.page && pageData.limit && pageData.total
                                        ? Math.min(pageData.page * pageData.limit, pageData.total)
                                        : 0}
                                    {" from "}
                                    {pageData?.total ?? 0} results
                                </h1>
                            </div>
                        </div>

                    </div>
                </>
            )}

            {/* Deposit Modal */}
            <Dialog
                open={depositModal}
                onClose={() => {
                    setDepositModal(false);
                }}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="ArrowDownCircle"
                            className="w-16 h-16 mx-auto mt-3 text-primary"
                        />
                        <div className="mt-5 text-3xl">Deposit Funds</div>
                        <div className="mt-2 text-slate-500">
                            Enter the amount to deposit into the user's wallet.
                        </div>
                        <div className="mt-4 text-left">
                            <label className="text-slate-500 text-sm">Amount</label>
                            <FormInput
                                type="number"
                                className="w-full mt-2"
                                placeholder="Enter deposit amount"
                                value={amount === 0 ? "" : amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setDepositModal(false);
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-24 text-white"
                            onClick={() => handleUserDeposit()}
                            disabled={loading}>
                            {loading ? "Processing..." : "Deposit"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>

            {/* Withdrawal Modal */}
            <Dialog
                open={withdrawalModal}
                onClose={() => {
                    setWithdrawalModal(false);
                }}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="ArrowUpCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Withdraw Funds</div>
                        <div className="mt-2 text-slate-500">
                            Enter the amount to withdraw from the user's wallet.
                        </div>
                        <div className="mt-4 text-left">
                            <label className="text-slate-500 text-sm">Amount</label>
                            <FormInput
                                type="number"
                                className="w-full mt-2"
                                placeholder="Enter withdrawal amount"
                                value={amount === 0 ? "" : amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setWithdrawalModal(false);
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            className="w-24 border-none text-white"
                            onClick={() => handleUserWithdrawal()}
                            disabled={loading}>
                            {loading ? "Processing..." : "Withdraw"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    )
}

export default UserBalance