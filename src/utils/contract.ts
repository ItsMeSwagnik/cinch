export const CINCH_CONTRACT_ADDRESS = { preview: "5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8" };

export function encodePeriod(period: string): Uint8Array {
  const enc = new TextEncoder().encode(period);
  const out = new Uint8Array(32);
  out.set(enc.slice(0, 32));
  return out;
}

export function encodeCategory(category: string): Uint8Array {
  const enc = new TextEncoder().encode(category.toLowerCase());
  const out = new Uint8Array(32);
  out.set(enc.slice(0, 32));
  return out;
}

export function decodeBytes32(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes).replace(/\0/g, "").trim();
}

export function buildShareableProofUrl(params: {
  contractAddress: string;
  period: string;
  proofType: string;
  threshold: number;
  passed: boolean;
}): string {
  const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const q = new URLSearchParams({ c: params.contractAddress, p: params.period, t: params.proofType, th: String(params.threshold), r: params.passed ? "1" : "0" });
  return `${base}/verify?${q.toString()}`;
}
