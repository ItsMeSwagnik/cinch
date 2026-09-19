import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";
import { Ledger } from "../../managed/cinch/contract/index.js";

export type CinchPrivateState = {
  readonly secretKey: Uint8Array;
  readonly totalSpend: bigint;
  readonly categorySpend: bigint;
};

export const createCinchPrivateState = (
  secretKey: Uint8Array,
  totalSpend: bigint = 0n,
  categorySpend: bigint = 0n,
): CinchPrivateState => ({ secretKey, totalSpend, categorySpend });

export const witnesses = {
  localSecretKey: ({ privateState }: WitnessContext<Ledger, CinchPrivateState>): [CinchPrivateState, Uint8Array] =>
    [privateState, privateState.secretKey],

  getTotalSpend: ({ privateState }: WitnessContext<Ledger, CinchPrivateState>): [CinchPrivateState, bigint] =>
    [privateState, privateState.totalSpend],

  getCategorySpend: ({ privateState }: WitnessContext<Ledger, CinchPrivateState>): [CinchPrivateState, bigint] =>
    [privateState, privateState.categorySpend],
};
