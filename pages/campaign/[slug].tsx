// @ts-nocheck
import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/router";
import { formatRelative } from "date-fns";

import { useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";
import TokenRaise from "@/contracts/TokenRaise.json";
import { BrowserProvider } from "ethers";
import { Campaign } from "@/library/types/Campaign";
import { createHelia } from "helia";
import { Tab } from "@headlessui/react";
import tw from "tailwind-styled-components";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@/components/common";
import { fetchCampaignInfo } from "@/library/utils";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DonationContainer = tw.div<any>`border-white/10 border rounded flex flex-row w-full`
const CampaignContainer = tw.div<any>`text-white max-w-[1000px] flex flex-col-reverse md:flex-row gap-8`;
const CampaignContentRow = tw.div<any>`flex-col flex gap-8 w-full`;
const InfoContainer = ({ title, canCollapse, children, icon = null }) => {
  return (
    <div className={`rounded bg-black/5 border border-white/10`}>
      {title && (
        <div class={`border-b border-white/10 p-4 flex flex-row gap-2`}>
          {icon}
          <p>{title}</p>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};

function CampaignInfo({ campaignId }: { campaignId: number }) {
  const [donation, setDonation] = useState<number>(0);
  const [campaignInfo, setCampaignInfo] = useState<Campaign | null>(null);
  const [metadata, setMetadata] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (campaignId) {
      fetchCampaignInfo(campaignId, setCampaignInfo, setMetadata, setError);
    }

    return () => {
      setCampaignInfo(null); // Clear campaign info when unmounting or changing campaign ID
    };
  }, [campaignId]);

  if (error) return <p>{error}</p>;

  if (!campaignInfo) {
    return <div>Loading...</div>;
  }

  return (
    <CampaignContainer>
      <CampaignContentRow>
        <img src={metadata.image} className="rounded"></img>
        <InfoContainer
          icon={<Bars3BottomLeftIcon className="h-5 w-5" />}
          title={`Description`}
        >
          <p className="text-white/70">{metadata.description}</p>
        </InfoContainer>
      </CampaignContentRow>
      <CampaignContentRow>
        <div>
          <h2
            className={
              `font-semibold uppercase tracking-widest text-xs ` +
              (campaignInfo.active ? `text-green-500` : `text-red-500`)
            }
          >
            {campaignInfo.active ? `Active` : `Inactive`}
          </h2>
          <h1 className="text-2xl font-bold">{campaignInfo.title}</h1>
          <p className="text-xs text-violet-500 font-extralight">
            Launched by {campaignInfo.creator}
          </p>
        </div>
        <InfoContainer
          icon={<ClockIcon className="w-5 h-5" />}
          title={`Fundraising ends ${formatRelative(
            new Date(Number(campaignInfo.deadline) * 1000),
            new Date()
          )}`}
        >
          <div className="mb-2">
            <progress
              className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-violet-500 [&::-moz-progress-bar]:bg-violet-500"
              value={
                Number(campaignInfo.currentFundsRaised) /
                Number(campaignInfo.fundingGoal)
              }
            ></progress>
            <p className="text-xs text-white/70">
              {formatEther(campaignInfo.currentFundsRaised)}/
              {formatEther(campaignInfo.fundingGoal)} ETH
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <DonationContainer>
              <Input
                type="number"
                className={`border-none w-full p-none`}
                value={donation}
                onChange={(e: any) => setDonation(e.target.value)}
              ></Input>
              <p className="text-white/70 p-2">ETH</p>
            </DonationContainer>
            <Button>Donate</Button>
          </div>
        </InfoContainer>
        <InfoContainer
          title={`Recent Contributions`}
          icon={<BanknotesIcon className="w-5 h-5" />}
        >Coming soon!</InfoContainer>
      </CampaignContentRow>
    </CampaignContainer>
  );
}

export default function Page() {
  const router = useRouter();
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center p-12">
        <CampaignInfo campaignId={Number(router.query.slug)}></CampaignInfo>
      </div>
    </>
  );
}
