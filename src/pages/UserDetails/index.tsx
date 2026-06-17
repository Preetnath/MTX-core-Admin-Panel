import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { HandleGetSingleUser, HandleGetSingleUserTradingAccount, SingleUser, TraderAccount } from '@/API/user';
import UpdateLeverage from '@/components/User/UpdateLeverage';
import UserBalance from '@/components/User/UserBalance';
import TraderAccountDetails from '@/components/User/TraderAccountDetails';
import TraderSpreadUpdate from '@/components/User/TraderSpreadUpdate';
import Pendingtrades from '@/components/User/Pendingtrades';

const topTab = [
    "Info",
    "Leverage",
    "Balance",
    "Spread",
    "Pending",
    "Swap",
    "Commission",
    "Trade",
    "Wallet",
]

function index() {
    const [params, setParams] = useSearchParams();
    const userId = params.get("userId") as string;
    const accountId = params.get("accountId") as string;
    const leverage = params.get("leverage") as string;
    const activeTab = params.get("tab") || "Info";


    const [userData, setUserData] = useState<TraderAccount | null>(null);
    const [loading, setLoading] = useState(false);


    const handleTopTabChange = (value: string) => {
        const newParams = new URLSearchParams(params);
        newParams.set("tab", value);
        setParams(newParams);
    };


    const getUserData = async () => {
        setLoading(true);
        try {
            const res = await HandleGetSingleUserTradingAccount(userId, accountId);
            if (res) {
                setUserData(res);
            }
        } catch (err) {
            console.error("User data fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserData();
    }, [userId]);

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

                {activeTab === "Info" && (
                    loading ? (
                        <div className="text-center py-10">
                            <p className="text-slate-500">Loading...</p>
                        </div>
                    ) : (
                        userData && <TraderAccountDetails accountData={userData} />
                    )
                )}

                {activeTab === "Leverage" && (
                    loading ? (
                        <div className="text-center py-10">
                            <p className="text-slate-500">Loading...</p>
                        </div>
                    ) : (
                        <UpdateLeverage accountId={accountId} currentLeverage={Number(leverage)} />
                    )
                )}
                {activeTab === "Balance" && (
                    loading ? (
                        <div className="text-center py-10">
                            <p className="text-slate-500">Loading...</p>
                        </div>
                    ) : (
                        <UserBalance accountId={accountId} />
                    )
                )}
                {activeTab === "Spread" && (
                    loading ? (
                        <div className="text-center py-10">
                            <p className="text-slate-500">Loading...</p>
                        </div>
                    ) : (
                        <TraderSpreadUpdate accountId={accountId} initialSpreads={userData?.symbolSpreads} />
                    )
                )}
                {activeTab === "Pending" && (
                    loading ? (
                        <div className="text-center py-10">
                            <p className="text-slate-500">Loading...</p>
                        </div>
                    ) : (
                        <Pendingtrades accountId={accountId} />
                    )
                )}
            </div>
        </div>
    )
}

export default index