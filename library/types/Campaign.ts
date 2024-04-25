export interface CampaignUpdate {
    timestamp: number;
    content: string;
}

export interface Campaign {
    title: string;
    description: string;
    owner: string;
    currentFundsRaised: number;
    fundingGoal: number;
    deadline: number;
    startDate: number;
    endDate: number;
    updates: CampaignUpdate[];
}