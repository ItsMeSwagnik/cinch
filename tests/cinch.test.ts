import { describe, it, expect } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { CinchSimulator } from "./cinch-simulator.js";

setNetworkId("undeployed");

const randomBytes = (n: number): Uint8Array => { const b = new Uint8Array(n); crypto.getRandomValues(b); return b; };
const pad32 = (s: string): Uint8Array => { const enc = new TextEncoder().encode(s); const out = new Uint8Array(32); out.set(enc.slice(0, 32)); return out; };

describe("Cinch contract", () => {
  it("initialises with zero proofCount and default values", () => {
    const sim = new CinchSimulator(randomBytes(32));
    expect(sim.getLedger().proofCount).toEqual(0n);
    expect(sim.getLedger().lastProofPassed).toEqual(false);
    expect(sim.getLedger().lastThreshold).toEqual(0n);
  });

  it("overall budget proof passes when spend <= threshold", () => {
    const sim = new CinchSimulator(randomBytes(32), 800n, 0n);
    const l = sim.proveOverallBudget(pad32("2026-10"), 1000n);
    expect(l.lastProofPassed).toEqual(true);
    expect(l.lastThreshold).toEqual(1000n);
    expect(l.proofCount).toEqual(1n);
  });

  it("overall budget proof fails when spend > threshold", () => {
    const sim = new CinchSimulator(randomBytes(32), 1500n, 0n);
    const l = sim.proveOverallBudget(pad32("2026-10"), 1000n);
    expect(l.lastProofPassed).toEqual(false);
    expect(l.proofCount).toEqual(1n);
  });

  it("category budget proof passes when category spend <= threshold", () => {
    const sim = new CinchSimulator(randomBytes(32), 0n, 180n);
    const l = sim.proveCategoryBudget(pad32("2026-10"), pad32("dining"), 250n);
    expect(l.lastProofPassed).toEqual(true);
    expect(l.lastThreshold).toEqual(250n);
    expect(l.proofCount).toEqual(1n);
  });

  it("category budget proof fails when category spend > threshold", () => {
    const sim = new CinchSimulator(randomBytes(32), 0n, 300n);
    const l = sim.proveCategoryBudget(pad32("2026-10"), pad32("dining"), 250n);
    expect(l.lastProofPassed).toEqual(false);
  });

  it("proofCount increments across multiple proofs", () => {
    const sim = new CinchSimulator(randomBytes(32), 500n, 100n);
    sim.proveOverallBudget(pad32("2026-10"), 1000n);
    sim.proveCategoryBudget(pad32("2026-10"), pad32("subscriptions"), 75n);
    expect(sim.getLedger().proofCount).toEqual(2n);
  });

  it("ownerCommitment is deterministic for the same secret key", () => {
    const key = randomBytes(32);
    const sim1 = new CinchSimulator(key, 500n, 0n);
    const sim2 = new CinchSimulator(key, 500n, 0n);
    sim1.proveOverallBudget(pad32("2026-10"), 1000n);
    sim2.proveOverallBudget(pad32("2026-10"), 1000n);
    expect(sim1.getLedger().ownerCommitment).toEqual(sim2.getLedger().ownerCommitment);
  });
});
