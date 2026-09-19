import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  createConstructorContext,
  CostModel,
} from "@midnight-ntwrk/compact-runtime";
import { Contract, type Ledger, ledger } from "../managed/cinch/contract/index.js";
import { type CinchPrivateState, witnesses } from "../src/witnesses.js";

export class CinchSimulator {
  readonly contract: Contract<CinchPrivateState>;
  circuitContext: CircuitContext<CinchPrivateState>;

  constructor(secretKey: Uint8Array, totalSpend = 0n, categorySpend = 0n) {
    this.contract = new Contract<CinchPrivateState>(witnesses);
    const privateState: CinchPrivateState = { secretKey, totalSpend, categorySpend };
    const { currentPrivateState, currentContractState, currentZswapLocalState } =
      this.contract.initialState(createConstructorContext(privateState, "0".repeat(64)));
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      costModel: CostModel.initialCostModel(),
      currentQueryContext: new QueryContext(currentContractState.data, sampleContractAddress()),
    };
  }

  setSpend(totalSpend: bigint, categorySpend: bigint) {
    this.circuitContext.currentPrivateState = { ...this.circuitContext.currentPrivateState, totalSpend, categorySpend };
  }

  getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  proveOverallBudget(period: Uint8Array, threshold: bigint): Ledger {
    this.circuitContext = this.contract.impureCircuits.proveOverallBudget(this.circuitContext, period, threshold).context;
    return this.getLedger();
  }

  proveCategoryBudget(period: Uint8Array, category: Uint8Array, threshold: bigint): Ledger {
    this.circuitContext = this.contract.impureCircuits.proveCategoryBudget(this.circuitContext, period, category, threshold).context;
    return this.getLedger();
  }
}
