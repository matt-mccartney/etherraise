import { Campaign as CampaignType, Metadata } from "@/library/types/Campaign";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Campaign({
  campaign,
}: {
  campaign: CampaignType;
}) {
  const [metadata, setMetadata] = useState<Metadata | null>();
  const router = useRouter();

  useEffect(() => {
    if (!campaign?.metadataCID) {
      setMetadata(null);
      return;
    }
    console.log(`https://ipfs.io/ipfs/${campaign.metadataCID}`)
    fetch(`https://ipfs.io/ipfs/${campaign.metadataCID}`)
      .then((resp) => resp.json())
      .then((json) => {
        console.log(json);
        setMetadata(json);
      });
  }, [campaign.metadataCID]);

  return (
    <div
      onClick={() => router.push(`/campaign/${campaign.id}`)}
      className="flex flex-col bg-white/5 drop-shadow rounded hover:-translate-y-1 transition-all max-w-56"
    >
      <div
        style={{
          backgroundImage: `url(${metadata?.image ? metadata.image : ""})`,
        }}
        className="rounded-t bg-cover bg-center w-56 min-h-48 bg-gray-200"
      />
      <div className="p-4 h-full w-full flex flex-col justify-between gap-2">
        <div>
          <h3
            className={`mb-2 uppercase tracking-widest text-xs font-semibold ${
              campaign.active ? "text-green-500" : "text-red-500"
            }`}
          >
            {campaign.active ? "Active" : "Inactive"}
          </h3>
          <p className="text-white text-md line-clamp-1 font-semibold">{campaign.title}</p>
          <p className="line-clamp-5 text-white/70">{metadata?.description}</p>
        </div>
        <progress
          className="h-2 w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
          value={
            Number(campaign.currentFundsRaised) / Number(campaign.fundingGoal)
          }
        ></progress>
      </div>
    </div>
  );
}
