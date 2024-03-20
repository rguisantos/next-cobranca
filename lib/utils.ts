import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as crypto from 'crypto';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encryptPassword(password: string, secretKey: string): string {
    const cipher = crypto.createCipher('aes256', secretKey);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});