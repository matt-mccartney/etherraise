import Navbar from "@/components/Navbar/Navbar";
import { BrowserProvider, ethers } from "ethers";
import { useEffect, useState } from "react";
import TokenRaise from "@/contracts/TokenRaise.json";
import { Campaign as CampaignType } from "@/library/types/Campaign";
import Campaign from "@/components/Campaign/Campaign";
import { useWeb3 } from "@/components/Web3Auth/Web3Context";

export default function Portal() {
    let {connection} = useWeb3(); 
    const [campaigns, setCampaigns] = useState<CampaignType[]>([])

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
          return tokenRaise.getCampaignsByUser(String(connection))
        };
    
        fetchCampaigns().then(x => setCampaigns(x))
      }, []);

  return (
    <>
      <Navbar />
      <div className="p-8 flex flex-wrap gap-8">
      {campaigns.map((campaign, index) => <Campaign campaign={campaign} key={index} />)}
      </div>
    </>
  );
}
