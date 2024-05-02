import { CTAButton } from "@/components/common";
import Navbar from "@/components/Navbar/Navbar";
import Showcase from "@/components/Showcase/Showcase";
import { BrowserProvider, ethers } from "ethers";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import TokenRaise from "@/contracts/TokenRaise.json";
import Campaign from "@/components/Campaign/Campaign";
import { Campaign as CampaignType } from "@/library/types/Campaign";

const PageSection = tw.div<any>`max-w-[1200px] mx-auto py-8`;

export default function Home() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);

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
      return tokenRaise.getAllCampaigns();
    };

    fetchCampaigns().then((x) => setCampaigns(x));
  }, []);

  return (
    <>
      <main>
        <Navbar />
        <section className="p-8 py-16 justify-center text-center">
          <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-2">
            Your <span className="text-violet-500">decentralized</span>{" "}
            fundraising home.
          </h1>
          <h3 className="text-gray-200 mb-8">
            TokenLaunch is where early adopters fund the future, one token at a
            time.
          </h3>
          <CTAButton onClick={() => router.push("/#campaigns")}>
            View Campaigns
          </CTAButton>
        </section>
        <PageSection>
          <Showcase data={campaigns} />
        </PageSection>
        <PageSection id="campaigns">
          <h1 className="text-white text-3xl font-semibold">
            Popular Projects
          </h1>
          <div className="flex flex-row gap-8 mt-2">
            {campaigns.map((campaign, index) => {
              console.log(campaign);
              return <Campaign key={index} i={index+1} campaign={campaign} />;
            })}
          </div>
        </PageSection>
        <PageSection></PageSection>
        <PageSection></PageSection>
      </main>
    </>
  );
}
