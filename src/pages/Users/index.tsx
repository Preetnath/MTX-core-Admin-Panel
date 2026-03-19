import React, { useEffect, useState } from 'react'
import { HandleGetUsers, UsersData } from '@/API/user';

function index() {

    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState<UsersData | null>(null)

    const getUserData = async () => {
        setLoading(true);
        try {
            const res = await HandleGetUsers();
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
        HandleGetUsers();
    }, []);


    return (
        <div>index</div>
    )
}

export default index