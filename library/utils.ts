// @ts-nocheck
import TokenRaise from "@/contracts/TokenRaise.json";
import { BrowserProvider, ethers } from "ethers";

export function toObject() {
  return JSON.parse(
    JSON.stringify(
      this,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );
}

export const formDataToJSON = (formData) => {
  if (!(formData instanceof FormData)) {
    throw TypeError("formData argument is not an instance of FormData");
  }

  const data = {};
  for (const [name, value] of formData) {
    data[name] = value;
  }

  return JSON.stringify(data);
};

export async function getDataBlob(url) {
  var res = await fetch(url);
  var blob = await res.blob();
  var base64img = await parseURI(blob);
  console.log(base64img);
}

export async function parseURI(d) {
  var reader = new FileReader();
  reader.readAsDataURL(d);
  return new Promise((res, rej) => {
    reader.onload = (e) => {
      res(e.target.result);
    };
  });
}

export const fetchCampaignInfo = async (
  campaignId,
  setCampaignInfo,
  setMetadata,
  setError
) => {
  try {
    const provider = new BrowserProvider(window.ethereum); // Use your provider here
    const contract = new ethers.Contract(
      TokenRaise.address,
      TokenRaise.abi,
      provider
    );
    const info = await contract.getCampaignById(campaignId);
    let metadata;
    if (info.metadataCID) {
      metadata = await (
        await fetch(`https://ipfs.io/ipfs/${info.metadataCID}`)
      ).json();
    } else {
      metadata = null;
    }
    setCampaignInfo(info);
    setMetadata(metadata);
  } catch (error) {
    console.error("Error fetching campaign info:", error);
    setError(String(error));
  }
};
