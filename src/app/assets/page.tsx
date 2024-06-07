"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ForeverMemoryCollection from "@/smartcontracts/artifacts/ForeverMemoryCollection.json";

const LSP8ContractAddress = "0x6f2C8CF01E143888Ec242886879657F56F3641E9";
const universalProfileAddress = "0x427F1BC7e005dBe3aE3AC07c3FaD05BC50832BCb";

const Assets = () => {
  const [nftList, setNftList] = useState<string[]>([]);

  // useEffect(() => {
  //   const fetchNFTs = async () => {
  //     try {
  //       const provider = new ethers.providers.JsonRpcProvider(
  //         "https://4201.rpc.thirdweb.com/"
  //       );
  //       const contract = new ethers.Contract(
  //         LSP8ContractAddress,
  //         ForeverMemoryCollection.abi,
  //         provider
  //       );

  //       // Get the number of tokens held by the universal profile address
  //       const balance = await contract.balanceOf(universalProfileAddress);
  //       console.log("balance", balance);
  //       console.log("contract", contract);
  //       // const tokenIds: ethers.utils.BytesLike[] = await contract.tokenIdsOf(
  //       //   universalProfileAddress
  //       // );
  //       // console.log("tokenIds", tokenIds);
  //       // Convert bytes32 token IDs to strings (or appropriate format)
  //       // const nfts = tokenIds.map((tokenId: ethers.utils.BytesLike) =>
  //       //   ethers.utils.parseBytes32String(tokenId)
  //       // );

  //       // const nfts: string[] = [];
  //       // for (let i = 0; i < balance; i++) {
  //       //   const tokenId = await contract.tokenOfOwnerByIndex(
  //       //     universalProfileAddress,
  //       //     i
  //       //   );
  //       //   nfts.push(tokenId);
  //       // }

  //       // setNftList(nfts);
  //     } catch (error) {
  //       console.error("Error fetching NFTs:", error);
  //     }
  //   };

  //   fetchNFTs();
  // }, []);

  return (
    <div>
      <h1>NFT List</h1>
      {nftList.length > 0 ? (
        <ul>
          {nftList.map((nft, index) => (
            <li key={index}>{nft}</li>
          ))}
        </ul>
      ) : (
        <p>No NFTs found for this address.</p>
      )}
    </div>
  );
};

export default Assets;
