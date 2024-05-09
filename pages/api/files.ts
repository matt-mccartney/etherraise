import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  IpfsHash?: string;
  status?: any;
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
  switch (req.method) {
    case "POST":
      const body = req.body;
      console.log(body);
      try {
        const res = await fetch(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.PINATA_JWT}`,
              "Content-Type": "application/json",
            },
            body: `{"pinataContent": ${JSON.stringify(req.body)}}`,
          }
        );
        console.log(res.status, res.statusText);
        let { IpfsHash } = await res.json();
        response.status(200).send({ IpfsHash });
      } catch (err) {
        console.log(err);
        response.status(500).send({ status: err });
      }
      return;
    case "DELETE":
      try {
        let hash = req.body.cid
        const res = await fetch(
          `https://api.pinata.cloud/pinning/unpin/${hash}`,
          {
            method: "DELETE",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
          }
        );
        response.status(200).send({ status: "Success!" });
      } catch (err) {
        response.status(500).send({ status: err });
      }
      return;
  }
}
