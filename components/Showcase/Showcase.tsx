import { Campaign } from "@/library/types/Campaign";
import { useEffect, useState } from "react";
import { ShowcaseContainer, ShowcaseInfo, ShowcaseTitle } from "./Showcase.styled";
import { CTAButton } from "../common";

type ShowcaseProps = {
    data: Campaign[];
}

export default function Showcase({ data } : ShowcaseProps) {
    const numCampaigns = data.length;

    const [currentCampaign, setCurrentCampaign] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCampaign((prevIndex : any) => (prevIndex + 1) % numCampaigns);
        }, 10000);

        return () => clearInterval(interval);
    }, [numCampaigns]);

    return (
        <ShowcaseContainer>
            <ShowcaseInfo>
                <h2 className="text-white underline decoration-solid text-md">Featured Project</h2>
                <ShowcaseTitle>{data[currentCampaign]?.title}</ShowcaseTitle>
                <CTAButton className="text-xs">View Campaign</CTAButton>
            </ShowcaseInfo>
        </ShowcaseContainer>
    );
}