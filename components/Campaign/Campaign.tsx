import { Campaign as CampaignType, Metadata } from "@/library/types/Campaign";
import { ClockIcon } from "@heroicons/react/16/solid";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function getLargestTimeValue(date: Date): string {
  if (date < new Date()) {
    return "0m";
  }
  const largestTime = formatDistanceToNow(date, { addSuffix: false });
  const [largestValue, unit] = largestTime.split(" ");
  const largestValueNumber = parseInt(largestValue);

  let unitAbbreviation;
  if (unit.startsWith("day")) {
    unitAbbreviation = "d";
  } else if (unit.startsWith("hour")) {
    unitAbbreviation = "hr";
  } else if (unit.startsWith("minute")) {
    unitAbbreviation = "m";
  } else {
    unitAbbreviation = "s";
  }

  return `${largestValueNumber}${unitAbbreviation}`;
}

export default function Campaign({ campaign }: { campaign: CampaignType }) {
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
        setMetadata(json);
      });
  }, [campaign.metadataCID]);

  return (
    <div
      onClick={() => router.push(`/campaign/${campaign.id}`)}
      className="mt-[4px] snap-start flex flex-col bg-white/5 drop-shadow select-none rounded hover:bg-white/[0.065] hover:-translate-y-1 transition-all max-w-56"
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
            className={`mb uppercase tracking-widest text-xs font-semibold ${
              campaign.active ? "text-green-500" : "text-red-500"
            }`}
          >
            {campaign.active ? "Active" : "Inactive"}
          </h3>
          <p className="text-white text-md line-clamp-1 font-semibold">
            {campaign.title}
          </p>
          <p className="line-clamp-5 text-white/70">{metadata?.description}</p>
        </div>
        <div className="w-full flex flex-row gap-2 items-center">
          <progress
            className="h-2 w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
            value={
              Number(campaign.currentFundsRaised) / Number(campaign.fundingGoal)
            }
          ></progress>
          <div className="flex flex-row items-center gap-1 text-white/40">
            <ClockIcon className="w-5 h-5" />
            <p className="-mb-[2px]">
              {getLargestTimeValue(new Date(Number(campaign.deadline) * 1000))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
