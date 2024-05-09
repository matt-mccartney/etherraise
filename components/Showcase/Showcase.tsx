import { Metadata } from "@/library/types/Campaign";
import { useEffect, useState } from "react";
import {
  ShowcaseContainer,
  ShowcaseInfo,
  ShowcaseTitle,
} from "./Showcase.styled";
import { CTAButton } from "../common";
import { useRouter } from "next/router";

type ShowcaseProps = {
  data: any[];
};

export default function Showcase({ data }: ShowcaseProps) {
  const router = useRouter();
  const numCampaigns = data.length;
  const [currentCampaign, setCurrentCampaign] = useState<number>(0);
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  const fetchMetadata = (currentCampaign: number) => {
    if (!(data[currentCampaign]?.metadataCID)) {
      setMetadata(null);
      return;
    }
    fetch(`https://ipfs.io/ipfs/${data[currentCampaign].metadataCID}`)
      .then((resp) => resp.json())
      .then((json) => setMetadata(json));
  };

  useEffect(() => {
    fetchMetadata(currentCampaign);
  }, [currentCampaign]);

  useEffect(() => {
    fetchMetadata(0);
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCampaign((prevIndex: any) => (prevIndex + 1) % numCampaigns);
    }, 10000);

    return () => clearInterval(interval);
  }, [numCampaigns, currentCampaign]);

  return (
    <ShowcaseContainer
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${metadata?.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ShowcaseInfo>
        <h2 className="text-white underline decoration-solid text-md">
          Featured Project
        </h2>
        <ShowcaseTitle>{data[currentCampaign]?.title}</ShowcaseTitle>
        <CTAButton
          onClick={() => router.push(`/campaign/${currentCampaign + 1}`)}
          className="text-xs"
        >
          View Campaign
        </CTAButton>
      </ShowcaseInfo>
    </ShowcaseContainer>
  );
}
