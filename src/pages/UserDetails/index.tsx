import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { HandleGetSingleUser, SingleUser } from '@/API/user';
import Lucide from '@/components/Base/Lucide';

const topTab = [
    "Personal Details",
    "Leveead",
    "Spread",
    "Spike",
    "Swip",
    "Commission",
    "Trade",
    "Wallet",
]

function index() {
    const [params, setParams] = useSearchParams();
    const userId = params.get("userId") as string;
    const activeTab = params.get("tab") || "Personal Details";
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<SingleUser | null>(null);

    const handleTopTabChange = (value: string) => {
        const newParams = new URLSearchParams(params);
        newParams.set("tab", value);
        setParams(newParams);
    };

    const getUserData = async () => {
        setLoading(true);
        try {
            const res = await HandleGetSingleUser(userId ?? "");
            if (res) {
                setUserData(res);
            }
        } catch (err) {
            console.error("Dashboard data fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId && activeTab === "Personal Details") {
            getUserData();
        }
    }, [userId, activeTab]);

    return (
        <div className="mt-4">
            <div className="flex flex-wrap items-center mt-5 mb-5 intro-y gap-4 border-b border-slate-200/60 dark:border-darkmode-400">
                {topTab.map((tab) => (
                    <div
                        key={tab}
                        onClick={() => handleTopTabChange(tab)}
                        className={clsx([
                            "cursor-pointer px-4 py-2 font-medium transition-colors whitespace-nowrap",
                            activeTab === tab
                                ? "border-b-2 border-primary text-primary"
                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-b-2 border-transparent"
                        ])}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            <div className="intro-y box p-5">
                <h3 className="text-base font-medium mb-3">{activeTab}</h3>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    activeTab === "Personal Details" && userData ? (
                        <div className="grid grid-cols-12 gap-6 mt-5">
                            {/* Basic Info */}
                            <div className="col-span-12 md:col-span-12 lg:col-span-12 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                <h4 className="font-medium text-slate-500 mb-2">Basic Info</h4>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Full Name</div>
                                    <div className="font-medium">{userData.firstName} {userData.lastName}</div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Email</div>
                                    <div className="font-medium">{userData.email}</div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Phone</div>
                                    <div className="font-medium">{userData.phone}</div>
                                </div>
                                <div className="mt-4 border-t border-slate-200/60 dark:border-darkmode-400 pt-4">
                                    <div className="text-slate-500 text-xs mb-1">Broker Details</div>
                                    {userData.broker && userData.broker.name ? (
                                        <>
                                            <div className="font-medium text-primary">{userData.broker.name}</div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                                <a href={userData.broker.websiteLink} target="_blank" rel="noreferrer" className="underline">{userData.broker.websiteLink}</a>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">Access Server: {userData.broker.accessServer}</div>
                                        </>
                                    ) : (
                                        <div className="font-medium text-slate-400">No Broker Linked</div>
                                    )}
                                </div>
                            </div>

                            {/* Account Status */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                <h4 className="font-medium text-slate-500 mb-2">Account Status</h4>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Status</div>
                                    <div className={clsx("font-medium", {
                                        "text-success": userData.accountStatus === 'Active' || userData.accountStatus === 'VERIFIED',
                                        "text-danger": userData.accountStatus === 'Inactive' || userData.accountStatus === 'UNVERIFIED' || userData.accountStatus === 'REJECTED',
                                        "text-pending": userData.accountStatus === 'PENDING'
                                    })}>
                                        {userData.accountStatus}
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Account Type</div>
                                    <div className="font-medium">{userData.accountType}</div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">KYC Status</div>
                                    <div className="font-medium">{userData.kycStatus}</div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Leverage</div>
                                    <div className="font-medium">1:{userData.leverage}</div>
                                </div>
                            </div>

                            {/* Security & Broker Details */}
                            <div className="col-span-12 md:col-span-6 lg:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                                <h4 className="font-medium text-slate-500 mb-2">Security & Broker</h4>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Username</div>
                                    <div className="font-medium">{userData.generatedUsername}</div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Password</div>
                                    <div className="font-medium">{userData.password || "N/A"}</div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-slate-500 text-xs">Investor Password</div>
                                    <div className="font-medium">{userData.investorPassword || "N/A"}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-slate-500">
                            {activeTab} features coming soon...
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default index