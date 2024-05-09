import { Campaign as CampaignType, Metadata } from "@/library/types/Campaign";
import { EllipsisVerticalIcon, PencilIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { formatEther, parseEther } from "ethers";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function CampaignRow({ campaign }: { campaign: CampaignType }) {
  const [metadata, setMetadata] = useState<Metadata | null>();
  const router = useRouter();

  useEffect(() => {
    if (!campaign?.metadataCID) {
      setMetadata(null);
      return;
    }
    console.log(`https://ipfs.io/ipfs/${campaign.metadataCID}`);
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
      className="group text-white font-extralight p-2 grid gap-2 grid-cols-5 justify-between items-center drop-shadow rounded-lg transition-all w-full hover:bg-white/5"
    >
      <div className="flex flex-row gap-4 items-center">
        <div
          style={{
            backgroundImage: `url(${metadata?.image ? metadata.image : ""})`,
          }}
          className="ring-white/10 ring-[1px] rounded bg-cover bg-center min-w-8 min-h-8 bg-gray-200"
        />
        <div className="">
          <h3
            className={`uppercase tracking-widest text-[8px] font-semibold ${
              campaign.active ? "text-green-500" : "text-red-500"
            }`}
          >
            {campaign.active ? "Active" : "Inactive"}
          </h3>
          <p className="text-xs line-clamp-1 font-extralight">
            {campaign.title}
          </p>
        </div>
      </div>
      <p className="line-clamp-1">
        {format(new Date(Number(campaign.deadline) * 1000), "PPpp")}
      </p>
      <div>
        <p className="line-clamp-1">
          {parseFloat(formatEther(campaign.currentFundsRaised)).toFixed(2)}/
          {parseFloat(formatEther(campaign.fundingGoal)).toFixed(2)}
        </p>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <progress
          className="w-full h-2 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
          value={
            Number(campaign.currentFundsRaised) / Number(campaign.fundingGoal)
          }
        ></progress>
        <p className="text-[12px] w-8 line-clamp-1 -mb-[1px]">
          {Math.round((Number(campaign.currentFundsRaised) / Number(campaign.fundingGoal)) * 100)}%
        </p>
      </div>
      <div className="flex flex-row gap-2 justify-end items-center">
        <PencilIcon className="w-4 h-4 hidden group-hover:flex float-right" />
        <EllipsisVerticalIcon className="w-5 h-5 float-right" />
      </div>
    </div>
  );
}
