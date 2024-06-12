import { ethers } from "ethers";

export function bytes32ToAddress(bytes32: string): string {
  // Ensure the input is a valid bytes32 string
  if (!ethers.utils.isHexString(bytes32) || bytes32.length !== 66) {
    throw new Error("Invalid bytes32 string");
  }

  // Extract the last 40 characters (20 bytes) and prepend '0x'
  const address = "0x" + bytes32.slice(-40);
  return address;
}
