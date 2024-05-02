import Navbar from "@/components/Navbar/Navbar";
import { BrowserProvider, ethers } from "ethers";
import { useEffect, useState } from "react";
import TokenRaise from "@/contracts/TokenRaise.json";
import { useRouter } from "next/router";
import { Campaign } from "@/library/types/Campaign";

export default function Portal() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([])

    useEffect(() => {
        let fetchCampaigns = async () => {
          if (!window.ethereum) return;
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const tokenRaise = new ethers.Contract(
            TokenRaise.address,
            TokenRaise.abi,
            signer
          );
          return tokenRaise.getCampaignsByUser("0x0db27006434aff8b28c47fC6d557CDE5c836c04a")
        };
    
        fetchCampaigns().then(x => setCampaigns(x))
      }, []);

  return (
    <>
      <Navbar />
      {campaigns.map((campaign, index) => <p>{campaign.title}</p>)}
    </>
  );
}
