// @ts-nocheck
import Navbar from "@/components/Navbar/Navbar";
import tw from "tailwind-styled-components";
import { useEffect, useState } from "react";
import { createHelia } from 'helia';
import { json } from '@helia/json'
import { ethers, parseEther } from "ethers";
import TokenRaise from "@/contracts/TokenRaise.json";
import { BrowserProvider } from "ethers";

const Input = tw.input<any>`p-px px-2 rounded-full bg-opacity-20 outline-none border-2 border-gray-400 focus:border-violet-500 bg-white`;

export default function InvestorPortal() {
  const [campaignImg, setCampaignImg] = useState<File | null>(null);
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignDesc, setCampaignDesc] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCampaignImg(e.target.files[0]);
    }
  };

  const uploadToIPFS = async () => {
    if (!campaignImg) return;
    const helia = await createHelia()
    const j = json(helia)
    const fileContent = await campaignImg.arrayBuffer();
    const immutableAddress = await j.add({
        title: campaignTitle, description: campaignDesc, image: fileContent
    });
    return immutableAddress;
  };

  const createCampaign = async () => {
    const metadataCID = (await uploadToIPFS())?.toString();
    console.log("THIS IS CID", metadataCID)
    if (!metadataCID) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenRaise = new ethers.Contract(TokenRaise.address, TokenRaise.abi, signer);
      await tokenRaise.createCampaign(
        campaignTitle,
        metadataCID,
        parseEther(fundingGoal),
        parseInt(durationDays),
        tokenName,
        tokenSymbol
      );
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <>
      <Navbar />
      <form
        className="flex flex-col text-white p-8 rounded-lg bg-opacity-5 bg-white max-w-[1400px] mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          createCampaign();
        }}
      >
        <label htmlFor="campaignImg">Campaign Image</label>
        <input id="campaignImg" type="file" onChange={handleFileChange}></input>
        <label htmlFor="campaignTitle">Title</label>
        <Input id="campaignTitle" type="text" value={campaignTitle} onChange={(e : any) => setCampaignTitle(e.target.value)}></Input>
        <label htmlFor="campaignDesc">Description</label>
        <Input id="campaignDesc" value={campaignDesc} onChange={(e : any) => setCampaignDesc(e.target.value)}></Input>
        <label htmlFor="fundingGoal">Funding Goal (ETH)</label>
        <Input id="fundingGoal" type="number" value={fundingGoal} onChange={(e : any) => setFundingGoal(e.target.value)}></Input>
        <label htmlFor="durationDays">Duration (Days)</label>
        <Input id="durationDays" type="number" value={durationDays} onChange={(e : any) => setDurationDays(e.target.value)}></Input>
        <label htmlFor="tokenName">Token Name</label>
        <Input id="tokenName" type="text" value={tokenName} onChange={(e : any) => setTokenName(e.target.value)}></Input>
        <label htmlFor="tokenSymbol">Token Symbol</label>
        <Input id="tokenSymbol" type="text" value={tokenSymbol} onChange={(e : any) => setTokenSymbol(e.target.value)}></Input>
        <input type="submit"></input>
      </form>
    </>
  );
}
