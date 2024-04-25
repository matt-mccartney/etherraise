import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({ weight: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={leagueSpartan.className}>
      <Component {...pageProps} />
    </main>
  );
}
