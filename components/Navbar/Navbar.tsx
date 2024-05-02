// @ts-nocheck
import Head from "next/head";
import Logo from "../Logo/Logo";
import Web3Auth from "../Web3Auth/Web3Auth";
import { Category, CategoryContainer, NavbarContainer, NavbarGroup } from "./Navbar.styled";

export default function Navbar() {
  return (
    <>
      <Head>
        <title>TokenLaunch</title>
      </Head>
      <NavbarContainer>
        <NavbarGroup>
          <Logo />
          <div className="bg-white/10 w-[1px]" />
          <CategoryContainer>
            <Category href="/">Campaigns</Category>
          </CategoryContainer>
        </NavbarGroup>
        <Web3Auth />
      </NavbarContainer>
    </>
  );
}
