export interface CampaignUpdate {
    timestamp: number;
    content: string;
}

export interface Campaign {
    title: string;
    description: string;
    owner: string;
    startDate: number;
    endDate: number;
    updates: CampaignUpdate[];
}