import React, { useEffect, useState } from 'react'
import { HandleGetSingleUser, SingleUser } from '@/API/user';
import Lucide from '../Base/Lucide';
import clsx from 'clsx';

function PersonalDetails({ userData }: { userData: SingleUser }) {

    return (
        <>
            {userData ? (
                <div className="grid grid-cols-12 gap-6 mt-5">
                    {/* Basic Info */}
                    <div className="col-span-12 sm:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                        <h4 className="font-medium text-slate-500 mb-2">Basic Info</h4>
                        <div className="mt-3">
                            <div className="text-slate-500 text-xs">Full Name</div>
                            <div className="font-medium">{userData?.firstName} {userData?.lastName}</div>
                        </div>
                        <div className="mt-3">
                            <div className="text-slate-500 text-xs">Email</div>
                            <div className="font-medium">{userData?.email}</div>
                        </div>
                        <div className="mt-3">
                            <div className="text-slate-500 text-xs">Phone</div>
                            <div className="font-medium">{userData?.phone}</div>
                        </div>
                        <div className="mt-3">
                            <div className="text-slate-500 text-xs">Password</div>
                            <div className="font-medium">{userData.password}</div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="col-span-12 sm:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                        <h4 className="font-medium text-slate-500 mb-2">Account Status</h4>
                        <div className="mt-3">
                            <div className="text-slate-500 text-xs">Status</div>
                            <div className={clsx("font-medium", {
                                "text-success": userData?.accountStatus === 'Active' || userData?.accountStatus === 'VERIFIED',
                                "text-danger": userData?.accountStatus === 'Inactive' || userData?.accountStatus === 'UNVERIFIED' || userData?.accountStatus === 'REJECTED',
                                "text-pending": userData?.accountStatus === 'PENDING'
                            })}>
                                {userData?.accountStatus}
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="text-slate-500 text-xs">KYC Status</div>
                            <div className="font-medium">{userData?.kycStatus}</div>
                        </div>
                        <div className="mt-4 border-t border-slate-200/60 dark:border-darkmode-400 pt-4">
                            <div className="text-slate-500 text-xs mb-1">Broker Details</div>
                            {userData?.broker && userData?.broker.name ? (
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
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-slate-500">No user data found</p>
                </div>
            )
            }
        </>
    )
}

export default PersonalDetails