import { useState, useCallback } from "react";

export type ContractState = {
  address: string | null;
  proofCount: bigint;
  lastProofPassed: boolean;
  lastProofType: string;
  lastThreshold: bigint;
  lastProofPeriod: string;
};

const INITIAL: ContractState = {
  address: null,
  proofCount: 0n,
  lastProofPassed: false,
  lastProofType: "",
  lastThreshold: 0n,
  lastProofPeriod: "",
};

export function useMidnight() {
  const [contractState, setContractState] = useState<ContractState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deployContract = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: replace with real Midnight.js deployment
      // const deployed = await CinchAPI.deploy(providers);
      // setContractState({ address: deployed.deployTxData.public.contractAddress, ...INITIAL });
      await new Promise((r) => setTimeout(r, 1800));
      setContractState((s) => ({ ...s, address: "cinch_preprod_[paste_address_here]" }));
    } catch (e: any) {
      setError(e?.message ?? "Deployment failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const setContractAddress = useCallback((address: string) => {
    setContractState((s) => ({ ...s, address }));
  }, []);

  return { contractState, loading, error, deployContract, setContractAddress };
}
