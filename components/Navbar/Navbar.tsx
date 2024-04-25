// @ts-nocheck
import Head from "next/head";
import Logo from "../Logo/Logo";
import Web3Auth from "../Web3Auth/Web3Auth";
import { NavbarContainer } from "./Navbar.styled";
import { Web3Provider } from "../Web3Auth/Web3Context";

export default function Navbar() {
  return (
    <Web3Provider>
      <Head>
        <title>TokenLaunch</title>
      </Head>
      <NavbarContainer>
        <Logo />
        <Web3Auth />
      </NavbarContainer>
    </Web3Provider>
  );
}
