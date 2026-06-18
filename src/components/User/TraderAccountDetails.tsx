import { useState } from 'react';
import { TraderAccount, HandleCleanUserTradingAccount } from '@/API/user';
import clsx from 'clsx';
import Button from '../Base/Button';
import { toast } from 'react-toastify';
import { Dialog } from '@/components/Base/Headless';
import Lucide from '@/components/Base/Lucide';

function TraderAccountDetails({ accountData }: { accountData: TraderAccount }) {
    const [cleaning, setCleaning] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const handleClean = async () => {
        if (!accountData) return;
        setCleaning(true);
        try {
            const res = await HandleCleanUserTradingAccount(
                accountData.userId,
                accountData.id.toString()
            );
            if (res) {
                toast.success("Account cleaned successfully");
                setConfirmModalOpen(false);
                window.location.reload();
            }
        } catch (err) {
            console.error("Failed to clean account", err);
        } finally {
            setCleaning(false);
        }
    };

    return (
        <div className="grid grid-cols-12  gap-6 mt-5">
            <div className='col-span-12 flex justify-end'>
                <Button
                    variant="danger"
                    onClick={() => setConfirmModalOpen(true)}
                >
                    Clean Account
                </Button>
            </div>
            {/* Account Info */}
            <div className="col-span-10 lg:col-span-4 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                <h4 className="font-medium text-slate-500 mb-2">Account Info</h4>
                <div className="mt-3">
                    <div className="text-slate-500 text-xs">Username</div>
                    <div className="font-semibold text-primary text-base">{accountData?.generatedUsername}</div>
                </div>
                <div className="mt-3">
                    <div className="text-slate-500 text-xs">Account Type</div>
                    <div className={clsx("font-medium capitalize", {
                        "text-warning": accountData?.accountType === "DEMO",
                        "text-success": accountData?.accountType === "FUNDED"
                    })}>
                        {accountData?.accountType}
                    </div>
                </div>
                <div className="mt-3">
                    <div className="text-slate-500 text-xs">Account Mode</div>
                    <div className="font-medium capitalize">{accountData?.accountMode}</div>
                </div>
                <div className="mt-3">
                    <div className="text-slate-500 text-xs">Broker ID</div>
                    <div className="font-medium break-words" title={accountData?.brokerId}>{accountData?.brokerId}</div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="col-span-10 lg:col-span-4 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400 min-w-0">
                <h4 className="font-medium text-slate-500 mb-2">Account Settings</h4>
                <div className="mt-3">
                    <div className="text-slate-500 text-xs">Status</div>
                    <div className={clsx("font-medium capitalize", {
                        "text-success": accountData?.status === 'ACTIVE',
                        "text-warning": accountData?.status === 'PENDING',
                        "text-danger": accountData?.status === 'SUSPENDED' || accountData?.status === 'INACTIVE'
                    })}>
                        {accountData?.status?.toLowerCase()}
                    </div>
                </div>
                <div className="mt-3">
                    <div className="text-slate-500 text-xs">Leverage</div>
                    <div className="font-medium">1:{accountData?.leverage}</div>
                </div>
                <div className="mt-3">
                    <div className="text-slate-500 text-xs">Spread</div>
                    <div className="font-medium">{accountData?.spread ?? "--"}</div>
                </div>
            </div>

            {/* Security Details */}
            <div className="col-span-10 lg:col-span-4 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400 min-w-0">
                <h4 className="font-medium text-slate-500 mb-2">Security Details</h4>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 mt-2">
                        <div className="text-slate-500 text-xs">Password</div>
                        <div className="font-mono bg-slate-100 dark:bg-darkmode-800 px-3 py-1.5 rounded-md mt-1 font-medium select-all break-all">
                            {accountData?.password || "N/A"}
                        </div>
                    </div>
                    <div className="col-span-12 mt-2">
                        <div className="text-slate-500 text-xs">Investor Password</div>
                        <div className="font-mono bg-slate-100 dark:bg-darkmode-800 px-3 py-1.5 rounded-md mt-1 font-medium select-all break-all">
                            {accountData?.investorPassword || "N/A"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Dialog
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="AlertTriangle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl font-semibold">Clean Trading Account</div>
                        <div className="mt-2 text-slate-500">
                            Are you sure you want to clean this trading account? <br />
                            <span className="text-danger font-semibold">This action cannot be undone.</span>
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => setConfirmModalOpen(false)}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            className="w-32 text-white"
                            onClick={handleClean}
                            disabled={cleaning}
                        >
                            {cleaning ? "Cleaning..." : "Confirm Clean"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    );
}

export default TraderAccountDetails;
