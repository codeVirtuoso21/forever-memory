import { ethers } from "ethers";
import { format } from 'date-fns';

export function bytes32ToAddress(bytes32: string): string {
  // Ensure the input is a valid bytes32 string
  if (!ethers.utils.isHexString(bytes32) || bytes32.length !== 66) {
    throw new Error("Invalid bytes32 string");
  }

  // Extract the last 40 characters (20 bytes) and prepend '0x'
  const address = "0x" + bytes32.slice(-40);
  return address;
}

/**
 * Convert a Unix timestamp to a custom formatted date string.
 * @param unixTimestamp - The Unix timestamp to convert.
 * @param dateFormat - The format string for the date.
 * @returns A formatted date string.
 */
export function convertUnixTimestampToCustomDate(unixTimestamp: number, dateFormat: string): string {
  const date = new Date(unixTimestamp * 1000);
  return format(date, dateFormat);
}


/**
 * Convert a hexadecimal string to a decimal number.
 * @param hexString - The hexadecimal string to convert.
 * @returns The decimal number.
 */
export function hexToDecimal(hexString: string): number {
  // Use parseInt with base 16 to convert hex to decimal
  return parseInt(hexString, 16);
}

