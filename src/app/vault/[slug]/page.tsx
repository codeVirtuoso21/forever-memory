"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import ForeverMemoryCollection from "@/smartcontracts/artifacts/ForeverMemoryCollection.json";
import { ethers } from "ethers";
import { useConnectWallet } from "@web3-onboard/react";
import { bytes32ToAddress } from "@/utils/format"; // Adjust the import path as necessary
import { ERC725 } from "@erc725/erc725.js";
import lsp4Schema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import LSP4DigitalAsset from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import { INTERFACE_IDS, ERC725YDataKeys } from "@lukso/lsp-smart-contracts";
import { generateEncryptionKey, decryptFile } from "@/utils/upload";

interface TokenData {
  cid: string;
  tokenSymbol: string;
  tokenName: string;
}

export default function Page({ params }: { params: { slug: string } }) {
  const vaultAddress = params.slug;

  const [tokenDataArray, setTokenDataArray] = useState<TokenData[]>([]);
  const [{ wallet }] = useConnectWallet();

  useEffect(() => {
    fetchNFT();
  }, [wallet]);

  const fetchNFT = async () => {
    if (wallet) {
      // const erc725 = new ERC725(LSP4DigitalAsset, "", "", {});
      // const lsp8CollectionMetadata = {
      //   LSP4Metadata: {
      //     name: "Daily Selfie LSP8 Collection",
      //     headline: "Document Your Journey, Day by Day",
      //     description:
      //       "Daily Selfie is your blockchain-based photo journal, capturing one selfie a day to create a visual timeline of your personal evolution. By securely storing your daily photos on-chain, Daily Selfie crafts a unique visual narrative of your life, reflecting the changes and growth over time. Preserve each moment as part of a timeless digital album that celebrates your journey and leaves a lasting legacy.",
      //     links: [],
      //     icons: [],
      //     images: [],
      //     assets: [],
      //     attributes: [],
      //   },
      // };
      // const lsp8CollectionMetadataCID =
      //   "QmaCvVHwvJT59nbdfU6XB8GgRJwkFC8qkUizBrB8Gu94VQ";
      // const encodeLSP8Metadata = erc725.encodeData([
      //   {
      //     keyName: "LSP4Metadata",
      //     value: {
      //       json: lsp8CollectionMetadata,
      //       url: lsp8CollectionMetadataCID,
      //     },
      //   },
      // ]);
      // console.log("encodeLSP8Metadata", encodeLSP8Metadata.values[0]);

      ///////////////////////////////////////////////

      const ethersProvider = new ethers.providers.Web3Provider(
        wallet.provider,
        "any"
      );
      const owner = wallet.accounts[0].address;
      const signer = ethersProvider.getSigner(owner);

      const ForeverMemoryContract = new ethers.Contract(
        vaultAddress,
        ForeverMemoryCollection.abi,
        signer
      );

      const result = await ForeverMemoryContract.tokenIdsOf(vaultAddress);

      const encryptionKey = await generateEncryptionKey(
        process.env.NEXT_PUBLIC_ENCRYPTION_KEY!
      );
        
      // NFT info
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          let lsp7Contract = new ethers.Contract(
            bytes32ToAddress(result[i]),
            ForeverMemoryCollection.abi,
            signer
          );
          const balance = await lsp7Contract.balanceOf(owner);
          console.log(i, " balance:", balance);
          if(!balance) continue;
          const tokenIdMetadata = await ForeverMemoryContract.getDataForTokenId(
            result[i],
            ERC725YDataKeys.LSP4["LSP4Metadata"]
          );

          const erc725js = new ERC725(lsp4Schema);
          const decodedMetadata = erc725js.decodeData([
            {
              keyName: "LSP4Metadata",
              value: tokenIdMetadata,
            },
          ]);
          const ipfsHash = decodedMetadata[0].value.url;

          const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
          console.log("response", response);
          if (!response.ok) {
            throw new Error("Failed to fetch image from IPFS");
          }
          const encryptedData = await response.arrayBuffer();
          const decryptedData = await decryptFile(
            new Uint8Array(encryptedData),
            encryptionKey
          );
          const blob = new Blob([decryptedData]); // Creating a blob from decrypted data
          const objectURL = URL.createObjectURL(blob);
          console.log("objectURL", objectURL);

          // const encryptedData = await decryptFile(cid, encryptionKey);
          const lspContractAddress = bytes32ToAddress(result[i]);

          const myAsset = new ERC725(
            lsp4Schema,
            lspContractAddress,
            "https://4201.rpc.thirdweb.com",
            {
              ipfsGateway: "https://api.universalprofile.cloud/ipfs",
            }
          );
          const tokenSymbol = await myAsset.getData("LSP4TokenSymbol");
          const tokenName = await myAsset.getData("LSP4TokenName");

          // Extracting value from DecodeDataOutput and updating state with new token data
          setTokenDataArray((prevTokenDataArray) => [
            ...prevTokenDataArray,
            {
              cid: objectURL,
              tokenSymbol: tokenSymbol.value as string,
              tokenName: tokenName.value as string,
            },
          ]);
        }
      }
    }
  };

  return (
    <div className="px-6 bg-gray-200 pt-10 h-[800px]">
      <div className="TopPanel p-2 shadow-lg shadow-gray-500/50 rounded pt-5 bg-white">
        <div className="font-bold text-5xl">Daily Selfie Vault</div>
        <div className="">headline</div>
        <div className="flex gap-2 pt-5">
          <div className="p-1 bg-gray-200 rounded sm">Shared</div>
          <div className="p-1 bg-gray-200 rounded sm">Personal</div>
          <div className="p-1 bg-gray-200 rounded sm">Selfie</div>
        </div>
      </div>

      <div className="List grid grid-cols-4 gap-4 pt-5">
        {tokenDataArray.map((item, idx) => (
          <Link
            href={`/nft/0xsadkfasdflcscs`}
            key={idx}
            className="w-full bg-white rounded cursor-pointer hover:opacity-75 shadow-lg shadow-gray-500/50"
          >
            <img
              className={`rounded carousel-item h-[220px] w-full`}
              src={item.cid}
              alt={item.tokenName}
            />
            <div className="flex justify-between p-2">
              <div className="bg-indigo-300 w-[50px] text-center p-1 rounded">{item.tokenName}</div>
              <div className="bg-pink-300 w-[50px] text-center p-1 rounded">{item.tokenSymbol}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
