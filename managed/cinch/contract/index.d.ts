import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getTotalSpend(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getCategorySpend(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
}

export type ImpureCircuits<PS> = {
  proveOverallBudget(context: __compactRuntime.CircuitContext<PS>,
                     period_0: Uint8Array,
                     threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveCategoryBudget(context: __compactRuntime.CircuitContext<PS>,
                      period_0: Uint8Array,
                      category_0: Uint8Array,
                      threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  proveOverallBudget(context: __compactRuntime.CircuitContext<PS>,
                     period_0: Uint8Array,
                     threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveCategoryBudget(context: __compactRuntime.CircuitContext<PS>,
                      period_0: Uint8Array,
                      category_0: Uint8Array,
                      threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  ownerKey(sk_0: Uint8Array): Uint8Array;
}

export type Circuits<PS> = {
  ownerKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  proveOverallBudget(context: __compactRuntime.CircuitContext<PS>,
                     period_0: Uint8Array,
                     threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  proveCategoryBudget(context: __compactRuntime.CircuitContext<PS>,
                      period_0: Uint8Array,
                      category_0: Uint8Array,
                      threshold_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly proofCount: bigint;
  readonly ownerCommitment: Uint8Array;
  readonly lastProofPeriod: Uint8Array;
  readonly lastProofPassed: boolean;
  readonly lastProofType: Uint8Array;
  readonly lastThreshold: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
