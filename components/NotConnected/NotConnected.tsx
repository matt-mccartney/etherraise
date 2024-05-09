"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useWeb3 } from "../Web3Auth/Web3Context";
import { useRouter } from "next/router";
import { useEffect } from "react";

type NotConnectedProps = {
    redirect?: boolean;
}
export default function NotConnected({redirect = false} : NotConnectedProps) {
  const { connection } = useWeb3();
  const router = useRouter();

  useEffect(() => {
    if (redirect && (connection === null || connection === "")) router.push("/")
  }, [])

  return (
    <>
      {(connection === null || connection === "") && (
        <div className="flex justify-center w-full items-center p-8">
          <p className="text-red-500 text-center flex flex-row gap-2">
            <span className="text-red-500">
              <ExclamationCircleIcon className="w-5 h-5" />
            </span>
            TokenRaise is powered by Web3. Please connect with your Metamask
            wallet to interact and view campaigns.
          </p>
        </div>
      )}
    </>
  );
}
