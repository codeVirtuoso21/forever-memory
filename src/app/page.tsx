"use client";

import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa6";
import { BsChatLeftTextFill, BsFillShareFill } from "react-icons/bs";
import ForeverMemoryCollection from "@/artifacts/ForeverMemoryCollection.json";
import FMT from "@/artifacts/FMT.json";
import { useConnectWallet } from "@web3-onboard/react";
import { ethers } from "ethers";
import { ERC725 } from "@erc725/erc725.js";
import lsp4Schema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import { generateEncryptionKey, decryptFile } from "@/utils/upload";
import {
  convertUnixTimestampToCustomDate,
  hexToDecimal,
  bytes32ToAddress,
} from "@/utils/format";

export default function Home() {
  const [{ wallet }] = useConnectWallet();

  useEffect(() => {
    fetchNFT();
  }, [wallet]);

  const fetchNFT = async () => {
    if (wallet) {
      // const ethersProvider = new ethers.providers.Web3Provider(
      //   wallet.provider,
      //   "any"
      // );
      // const owner = wallet.accounts[0].address;
      // const signer = ethersProvider.getSigner(owner);

      // const lsp7Contract = new ethers.Contract(
      //   "0x595f83eD5AE1E144b777A04D9853284AF5D5d5bf",
      //   ForeverMemoryCollection.abi,
      //   signer
      // );

      // // const tx = await lsp7Contract.balanceOf("0x15f92621533A9c74c98b5dfDeae4197e3b73563A")

      // const gasLimit = 500000;
      // const tx = await lsp7Contract.transfer(
      //   "0x595f83eD5AE1E144b777A04D9853284AF5D5d5bf",
      //   "0xeedA3543c152168E23D0Df3385b8911A039C69D4",
      //   "0xa46f37632a0b08fb019C101CFE434483f27CD956", 
      //   3,
      //   false, { gasLimit: gasLimit }
      // );
      // console.log("tx", tx);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Home Page
    </main>
  );
}
