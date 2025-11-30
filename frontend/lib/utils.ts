import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTokenExpired(token: string): boolean {
  try {
    // Décoder le payload JWT
    const [, payloadBase64] = token.split('.');
    const payloadJson = atob(payloadBase64); // Décodage base64
    const payload = JSON.parse(payloadJson);

    // Vérifier la date d'expiration
    const now = Math.floor(Date.now() / 1000);
    return now >= payload.exp; // "exp" est la clé d'expiration JWT
  } catch (error) {
    return true; // Considérer invalide si erreur
  }
}
