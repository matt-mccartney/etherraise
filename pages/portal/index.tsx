import Navbar from "@/components/Navbar/Navbar";
import { BrowserProvider, ethers } from "ethers";
import { useEffect } from "react";
import TokenRaise from "@/contracts/TokenRaise.json";

export default function Portal() {

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
    
        fetchCampaigns().then(x => console.log(x))
      }, []);

  return (
    <>
      <Navbar />
    </>
  );
}
