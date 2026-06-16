import React from 'react';
import { TraderAccount } from '@/API/user';
import clsx from 'clsx';

function TraderAccountDetails({ accountData }: { accountData: TraderAccount }) {
    return (
        <div className="grid grid-cols-12 gap-6 mt-5">
            {/* Account Info */}
            <div className="col-span-12 lg:col-span-4 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
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
                    <div className="font-medium truncate" title={accountData?.brokerId}>{accountData?.brokerId}</div>
                </div>
            </div>

            {/* Account Settings */}
            <div className="col-span-12 lg:col-span-4 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
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
                <div className="mt-3">
                    <div className="text-slate-500 text-xs">Symbol Spreads</div>
                    <div className="font-medium text-xs truncate" title={accountData?.symbolSpreads}>{accountData?.symbolSpreads || "--"}</div>
                </div>
            </div>

            {/* Security Details */}
            <div className="col-span-12 lg:col-span-4 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
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
        </div>
    );
}

export default TraderAccountDetails;
