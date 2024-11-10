// mockData.ts
export const financeMockData = {
    totalBudget: 100000,
    totalSpent: 45000,
    remainingBudget: 55000,
    pendingApprovals: [
        { project: "Targeting Women Voters", amount: 20000, status: "Pending" },
        { project: "Event Organization", amount: 15000, status: "Pending" },
    ],
    recentTransactions: [
        { project: "Targeting Women Voters", amount: 5000, status: "Approved" },
        { project: "Grievance Resolution", amount: 7000, status: "Approved" },
    ],
};
