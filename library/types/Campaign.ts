export interface CampaignUpdate {
    timestamp: number;
    content: string;
}

export type Metadata = {
    title: string;
    description: string | null;
    image: string | null;
    owner: string;
  }

export interface Campaign {
    id: number;
    creator: string;
    title: string;
    metadataCID: string;
    fundingGoal: number;
    currentFundsRaised: number;
    deadline: number;
    active: boolean;
    campaignToken: string;
}