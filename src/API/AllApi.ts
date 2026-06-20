const BaseURL = "https://admin-api-backend.mtxcore.com/api/v1";
export const LiveTradesSocket = "https://admin-api-backend.mtxcore.com/admin";

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

    //SYMBOLS
    getSymbols: {
        url: `${BaseURL}/symbols`,
        method: "GET",
    },
    updateSymbolSpread: {
        url: `${BaseURL}/symbols/:id`,
        method: "PUT",
    },
    updateSymbolSpikk: {
        url: `${BaseURL}/symbols/:id/override`,
        method: "POST",
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


    // USER TRADING ACCOUNTS
    getUserTradingAccounts: {
        url: `${BaseURL}/users/:userId/trader-accounts`,
        method: "GET",
    },
    getUserSingleTradingAccounts: {
        url: `${BaseURL}/users/:userId/trader-accounts/:accountId`,
        method: "GET",
    },
    CreateUserTradingAccount: {
        url: `${BaseURL}/users/:userId/trader-accounts`,
        method: "POST",
    },
    ApproveUserTradingAccount: {
        url: `${BaseURL}/users/:userId/trader-accounts/:accountId/approve`,
        method: "PUT",
    },
    RejectUserTradingAccount: {
        url: `${BaseURL}/users/:userId/trader-accounts/:accountId/reject`,
        method: "PUT",
    },
    UpdateTraderAccountLeverage: {
        url: `${BaseURL}/users/:userId/trader-accounts/:id`,
        method: "PUT",
    },
    UpdateTraderAccountSpread: {
        url: `${BaseURL}/users/:userId/trader-accounts/:id`,
        method: "PUT",
    },
    CleanTraderAccount: {
        url: `${BaseURL}/users/:userId/trader-accounts/:accountId/clean`,
        method: "DELETE",
    },


    // TRADING ACCOUNT WALLET
    getUserWallet: {
        url: `${BaseURL}/users/:userId/wallet`,
        method: "GET",
    },
    getUserWalletTransactions: {
        url: `${BaseURL}/users/:userId/wallet/transactions`,
        method: "GET",
    },
    UserDeposit: {
        url: `${BaseURL}/users/:userId/wallet/deposit`,
        method: "POST",
    },
    UserWithdrawal: {
        url: `${BaseURL}/users/:userId/wallet/withdraw`,
        method: "POST",
    },


    //TRADES
    getTraderPendingTrades: {
        url: `${BaseURL}/users/:userId/orders`,
        method: "GET",
    },
    updateTraderTrades: {
        url: `${BaseURL}/users/:userId/trader-accounts/:traderAccountId/positions/:posiId`,
        method: "PUT",
    },
    closeTraderTrade: {
        url: `${BaseURL}/users/:userId/trader-accounts/:traderAccountId/positions/:posiId/close`,
        method: "PUT",
    },

    //TRADE HISTORY 
    getTraderTradeHistory: {
        url: `${BaseURL}/users/:userId/trader-accounts/:traderAccountId/positions/history`,
        method: "GET",
    },

    //BROKERS
    getBrokers: {
        url: `${BaseURL}/brokers`,
        method: "GET",
    },
    getSingleBroker: {
        url: `${BaseURL}/brokers/:id`,
        method: "GET",
    },
    createBroker: {
        url: `${BaseURL}/brokers`,
        method: "POST",
    },
    updateBroker: {
        url: `${BaseURL}/brokers/:id`,
        method: "PUT",
    },

    //DEPOSIT 
    GetAllDepositMethods: {
        url: `${BaseURL}/deposits/methods`,
        method: "GET",
    },
    CreateDepositMethod: {
        url: `${BaseURL}/deposits/methods`,
        method: "POST",
    },
    UpdateDepositMethod: {
        url: `${BaseURL}/deposits/methods/:id`,
        method: "PUT",
    },
    DisableDepositMethod: {
        url: `${BaseURL}/deposits/methods/:id/disable`,
        method: "PUT",
    },
    EnableDepositMethod: {
        url: `${BaseURL}/deposits/methods/:id/enable`,
        method: "PUT",
    },

    GetAllDepositRequest: {
        url: `${BaseURL}/deposits/history`,
        method: "GET",
    },
    CreateManuleDeposit: {
        url: `${BaseURL}/deposits/manual`,
        method: "POST",
    },
    ApproveDepositRequest: {
        url: `${BaseURL}/deposits/requests/:id/approve`,
        method: "POST",
    },
    RejectDepositRequest: {
        url: `${BaseURL}/deposits/requests/:id/reject`,
        method: "PUT",
    },
}

export default ALLAPI