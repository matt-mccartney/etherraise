// @ts-nocheck
import Navbar from "@/components/Navbar/Navbar";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";
import TokenRaise from "@/contracts/TokenRaise.json";
import { BrowserProvider } from "ethers";
import { Campaign } from "@/library/types/Campaign";
import { createHelia } from "helia";
import { Tab } from "@headlessui/react";
import tw from "tailwind-styled-components";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const InfoContainer = ({title, canCollapse, children}) => {
  return (
    <div className={`rounded bg-black/5 border border-white/10`}>
      {children}
    </div>
  )
}


function CampaignInfo({ campaignId }: { campaignId: number }) {
  const [campaignInfo, setCampaignInfo] = useState<Campaign | null>(null);
  const [metadata, setMetadata] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCampaignInfo = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum); // Use your provider here
        const contract = new ethers.Contract(
          TokenRaise.address,
          TokenRaise.abi,
          provider
        );
        const info = await contract.getCampaignById(campaignId);
        const metadata = await (
          await fetch(`https://ipfs.io/ipfs/${info.metadataCID}`)
        ).json();
        setCampaignInfo(info);
        setMetadata(metadata);
      } catch (error) {
        console.error("Error fetching campaign info:", error);
        setError(String(error));
      }
    };

    if (campaignId) {
      fetchCampaignInfo();
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
    <div className="text-white max-w-[1000px] flex flex-row gap-4">
      <div className="flex-col flex gap-4">
        <img src={metadata.image} className="rounded w-[500px]"></img>
        <InfoContainer>
          <p className="p-4">Description: {metadata.description}</p>
        </InfoContainer>
      </div>
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
        <p className="text-xs text-violet-500 font-extralight">Launched by {campaignInfo.creator}</p>
        <p>Funding Goal: {formatEther(campaignInfo.fundingGoal)} ETH</p>
        <p>
          Current Funds Raised: {formatEther(campaignInfo.currentFundsRaised)}{" "}
          ETH
        </p>
        <p>
          Deadline:{" "}
          {new Date(Number(campaignInfo.deadline) * 1000).toLocaleDateString()}
        </p>
        <progress
          className=""
          value={
            Number(campaignInfo.currentFundsRaised) /
            Number(campaignInfo.fundingGoal)
          }
        ></progress>
      </div>
    </div>
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
