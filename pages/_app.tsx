// @ts-nocheck
import { Web3Provider } from "@/components/Web3Auth/Web3Context";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={leagueSpartan.className}>
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </main>
  );
}
