// @ts-nocheck
import Navbar from "@/components/Navbar/Navbar";
import tw from "tailwind-styled-components";
import { useState } from "react";
import { ethers, parseEther } from "ethers";
import TokenRaise from "@/contracts/TokenRaise.json";
import { BrowserProvider } from "ethers";
import { useWeb3 } from "@/components/Web3Auth/Web3Context";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { formDataToJSON, parseURI } from "@/library/utils";
import { Input } from "@/components/common";

const FileUpload = tw.input<any>`hidden`;
const FileUploadLabel = tw.label<any>`flex justify-center items-center rounded w-96 h-96 border border-dashed hover:border-solid hover:bg-white/5 border-white/10`;
const FormLabel = tw.label<any>`mt-3 text-medium font-medium`;

export default function InvestorPortal() {
  const { connection } = useWeb3();
  const [uploading, setUploading] = useState(false);
  const [campaignImg, setCampaignImg] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignDesc, setCampaignDesc] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  const uploadFile = async (title, desc, owner, image) => {
    try {
      setUploading(true);
      const data = new FormData();
      data.append("title", title);
      data.append("description", desc);
      data.append("owner", owner);
      data.append("image", await parseURI(image));
      const res = await fetch("/api/files", {
        method: "POST",
        body: formDataToJSON(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resData = await res.json();
      setUploading(false);
      return resData.IpfsHash;
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCampaignImg(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadToIPFS = async () => {
    if (!campaignImg) return;
    const immutableAddress = uploadFile(
      campaignTitle,
      campaignDesc,
      String(connection),
      campaignImg
    );
    return immutableAddress;
  };

  const createCampaign = async () => {
    const metadataCID = (await uploadToIPFS())?.toString();
    console.log("THIS IS CID", metadataCID);
    if (!metadataCID) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenRaise = new ethers.Contract(
        TokenRaise.address,
        TokenRaise.abi,
        signer
      );
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
        className="flex flex-col gap-12 text-white p-8 rounded-lg max-w-[1000px] mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          createCampaign();
        }}
      >
        <div className="flex flex-row gap-12">
          <div className="flex flex-col">
            <FileUploadLabel>
              <FileUpload
                id="campaignImg"
                type="file"
                onChange={handleFileChange}
              ></FileUpload>
              {campaignImg === null && (
                <div className="flex flex-col items-center justify-center gap-2">
                  <ArrowUpTrayIcon className="w-8 h-8"></ArrowUpTrayIcon>
                  <div className="text-center">
                    <p>Drag and drop media</p>
                    <p className="text-xs text-violet-500">Browse Files</p>
                    <p className="text-xs text-white/50">
                      JPG, PNG, GIF, SVG, MP4
                    </p>
                  </div>
                </div>
              )}
              {campaignImg && (
                <div className="group relative bg-black rounded">
                <Image
                  src={imageDataUrl || ""}
                  alt="Uploaded Campaign Image"
                  width={96*4}
                  height={96*4}
                  className="rounded hover:opacity-50"
                />
                <p className="hidden group-hover:flex absolute top-48 right-24 left-32 bottom-48">Click to change image</p>
                </div>
              )}
            </FileUploadLabel>
          </div>
          <div className="flex flex-col w-full">
            <FormLabel className={`mt-0`} htmlFor="campaignTitle">
              Title
            </FormLabel>
            <Input
              id="campaignTitle"
              type="text"
              value={campaignTitle}
              onChange={(e: any) => setCampaignTitle(e.target.value)}
              required
            ></Input>
            <FormLabel htmlFor="campaignDesc">Description</FormLabel>
            <Input
              id="campaignDesc"
              value={campaignDesc}
              onChange={(e: any) => setCampaignDesc(e.target.value)}
            ></Input>
            <FormLabel htmlFor="fundingGoal">Funding Goal (ETH)</FormLabel>
            <Input
              id="fundingGoal"
              type="number"
              value={fundingGoal}
              onChange={(e: any) => setFundingGoal(e.target.value)}
              required
            ></Input>
            <FormLabel htmlFor="durationDays">Duration (Days)</FormLabel>
            <Input
              id="durationDays"
              type="number"
              value={durationDays}
              onChange={(e: any) => setDurationDays(e.target.value)}
              required
            ></Input>
            <FormLabel htmlFor="tokenName">Token Name</FormLabel>
            <Input
              id="tokenName"
              type="text"
              value={tokenName}
              onChange={(e: any) => setTokenName(e.target.value)}
              required
            ></Input>
            <FormLabel htmlFor="tokenSymbol">Token Symbol</FormLabel>
            <Input
              id="tokenSymbol"
              type="text"
              value={tokenSymbol}
              onChange={(e: any) => setTokenSymbol(e.target.value)}
              required
            ></Input>
          </div>
        </div>
        <input
          className="p-2 rounded bg-violet-500 float-right"
          type="submit"
        ></input>
      </form>
    </>
  );
}
