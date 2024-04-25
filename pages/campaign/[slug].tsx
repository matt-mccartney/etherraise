// @ts-nocheck
import Navbar from '@/components/Navbar/Navbar'
import { useRouter } from 'next/router'

import { useEffect, useState } from "react";
import { ethers, formatEther } from "ethers";
import TokenRaise from "@/contracts/TokenRaise.json";
import { BrowserProvider } from 'ethers';
import { Campaign } from '@/library/types/Campaign';
import { createHelia } from 'helia';

function CampaignInfo({ campaignId } : { campaignId: number }) {
  const [campaignInfo, setCampaignInfo] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchCampaignInfo = async () => {
      try {
        const helia = createHelia();
        const provider = new BrowserProvider((window.ethereum)); // Use your provider here
        const contract = new ethers.Contract(TokenRaise.address, TokenRaise.abi, provider);
        const info = await contract.getCampaignById(campaignId);
        setCampaignInfo(info);
      } catch (error) {
        console.error("Error fetching campaign info:", error);
        setError(String(error))
      }
    };

    if (campaignId) {
      fetchCampaignInfo();
    }

    return () => {
      setCampaignInfo(null); // Clear campaign info when unmounting or changing campaign ID
    };
  }, [campaignId]);

  if (error) return <p>{error}</p>

  if (!campaignInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className='text-white'>
      <h1>{campaignInfo.title}</h1>
      <p>Description: {campaignInfo.description}</p>
      <p>Funding Goal: {formatEther(campaignInfo.fundingGoal)} ETH</p>
      <p>Current Funds Raised: {formatEther(campaignInfo.currentFundsRaised)} ETH</p>
      <p>Deadline: {new Date(Number(campaignInfo.deadline) * 1000).toLocaleDateString()}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default function Page() {
  const router = useRouter()
  return (
    <>
    <Navbar/>
    <CampaignInfo campaignId={Number(router.query.slug)}></CampaignInfo>
    </>
  )
}