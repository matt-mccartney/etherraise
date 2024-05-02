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
    active: boolean;
    title: string;
    description: string;
    owner: string;
    currentFundsRaised: number;
    fundingGoal: number;
    deadline: number;
    metadataCID: string;
}