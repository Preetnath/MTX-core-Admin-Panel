const BaseURL = "https://admin-api-backend.mtxcore.com/api/v1";

export let access_token = localStorage.getItem("token") ?? { token: undefined };

export const updateToken = (newToken: string) => (access_token = newToken);

const ALLAPI = {
    //AUTH
    login: {
        url: `${BaseURL}/auth/login`,
        method: "POST",
    },

    //DASHBOARD
    dashboard: {
        url: `${BaseURL}/admin/dashboard`,
        method: "GET",
    },

    //USERS
    getUsers: {
        url: `${BaseURL}/users`,
        method: "GET",
    },
    getSingleUser: {
        url: `${BaseURL}/users/:id`,
        method: "GET",
    },
    approveUser: {
        url: `${BaseURL}/users/:id/approve`,
        method: "PUT",
    },
    rejectUser: {
        url: `${BaseURL}/users/:id/reject`,
        method: "PUT",
    },
    UpdateUserLeverage: {
        url: `${BaseURL}/users/:id/leverage`,
        method: "PUT",
    },


}

export default ALLAPI