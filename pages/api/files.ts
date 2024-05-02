import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  IpfsHash?: string;
  error?: any;
};

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  response: NextApiResponse<ResponseData>
) {
  if (!(req.method === "POST")) return;
  const body = req.body;
  console.log(body)
  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        "Content-Type": "application/json",
      },
      body: `{"pinataContent": ${JSON.stringify(req.body)}}`,
    });
    console.log(res.status, res.statusText)
    let { IpfsHash } = await res.json();
    response.status(200).send({ IpfsHash });
  } catch (err) {
    console.log(err);
    response.status(500).send({ error: err });
  }
}
