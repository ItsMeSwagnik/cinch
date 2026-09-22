# Product Proposal

## What is the product, and who uses it?

Cinch is a confidential personal spending tracker built on the Midnight Network. It allows users to record expenses such as subscriptions, purchases, bills, dining, and entertainment privately on their own device, and generate zero-knowledge proofs about their spending without revealing the underlying financial data.

The core use case is proving a financial claim without exposing the evidence behind it. For example, a user can prove that their total spending for a particular month is below a chosen threshold such as $1,500, or prove that their spending in a specific category such as dining is below a chosen budget. The verifier can confirm that the claim is valid without learning the user's exact spending amount, individual transactions, merchant names, or transaction history.

Cinch is intended for individuals who want to demonstrate financial discipline while retaining control over sensitive financial information. Potential use cases include personal budgeting and accountability, financial wellness programs, budgeting challenges, and other situations where someone needs to demonstrate that they satisfy a spending requirement without submitting complete financial records.

Expense data remains client-side and is never transmitted to the application backend or stored on-chain. When a user generates a proof, the relevant spending total is supplied to the zero-knowledge circuit as private data. The resulting proof can then be verified on-chain and shared through a verification link without requiring the verifier to connect a wallet.

The current implementation supports two proof types:

- Overall Budget Proof — proves that total spending for a selected period is below a chosen threshold.
- Category Budget Proof — proves that spending within a selected category is below a chosen threshold.

Proofs are also tied to a specific period, such as a month, so a proof generated for one period cannot simply be presented as evidence for another period.

## Why Midnight specifically?

Cinch requires two properties at the same time: verifiable financial claims and strong privacy.

A conventional transparent blockchain can provide publicly verifiable transactions, but that transparency is unsuitable for personal spending data. Publishing individual expenses, transaction amounts, wallet addresses, or transaction history would expose sensitive financial information. Encrypting the data in a conventional application would protect the data from public access, but the verifier would still have to trust the application or another intermediary to calculate and report the user's spending correctly.

Midnight's zero-knowledge capabilities allow Cinch to separate the truth of a financial claim from the financial information used to establish that claim.

For example, when a user wants to prove:

«"My total spending for this month is under $1,500."»

Cinch provides the actual spending total to the ZK circuit as private input. The circuit verifies the relationship between the private spending amount and the publicly committed threshold, while the resulting proof allows the claim to be verified without revealing the actual amount.

The same model is used for category-specific claims such as:

«"My dining spending for this month is under $300."»

The blockchain can therefore provide independently verifiable evidence that the budget condition was satisfied, while the underlying transactions remain private.

This is important because the privacy requirement is not simply about hiding information from the public. The verifier itself should not need access to the user's financial records. Midnight allows Cinch to make the proof verifiable without making the underlying financial data visible.

The application's owner commitment also avoids directly associating proofs with a wallet address. A cryptographic commitment derived from the user's secret key is used instead, while the secret itself remains private.

## Data Model

| Data Point | Type | Disclosed To |
|---|---|---|
| Proof pass/fail result | Public ledger | Everyone |
| Threshold chosen by user | Public ledger | Everyone |
| Period tag (e.g. "2026-10") | Public ledger | Everyone |
| Category label (category proofs) | Public ledger | Everyone |
| Pseudonymous owner commitment | Public ledger | Everyone |
| Proof count | Public ledger | Everyone |
| Actual total spend amount | Private witness | No one |
| Actual category spend amount | Private witness | No one |
| Individual transactions | Client-side only | No one |
| Merchant names / notes | Client-side only | No one |
| User secret key | Private witness | No one |

## Mainnet Feasibility

Cinch is structured as a Mainnet-oriented application and is technically feasible to progress toward Mainnet by Level 6, subject to Midnight Mainnet availability, compatibility requirements, security review, and final deployment validation.

The current implementation already demonstrates the core components required for a Mainnet deployment:

- A Compact smart contract implementing the budget-proof logic.
- A deployed contract on the Midnight Preprod network.
- Zero-knowledge proof generation using the Midnight proof server.
- Contract tests covering initialization, successful and failed overall budget proofs, successful and failed category proofs, proof-count accumulation, and owner commitment behavior.
- A production-style Next.js and TypeScript frontend.
- Lace and 1AM wallet integration through the Midnight DApp Connector API.
- Network validation to prevent accidental interaction with an unsupported network.
- Client-side storage of expense information, keeping individual financial records off-chain.
- Period-scoped proofs that bind a claim to a specific spending period.
- A wallet-independent verification page that allows third parties to verify a proof without connecting their own wallet.
- Environment-based network, contract, node, indexer, and proof-server configuration.
- GitHub Actions CI that compiles the Compact contract, executes the test suite, and builds the application.

The current Preprod deployment therefore provides an end-to-end foundation that can be carried forward to Mainnet rather than requiring a fundamental redesign of the product.

Before a Mainnet release, the following work would be required:

1. Deploy the audited and finalized Compact contract to Midnight Mainnet.
2. Update the application configuration from Preprod to Mainnet endpoints and network identifiers.
3. Verify compatibility with the Mainnet versions of Midnight.js, the DApp Connector, Compact compiler, proof infrastructure, and supported wallets.
4. Perform a security review of the Compact contract, witnesses, owner commitment mechanism, and proof-verification logic.
5. Review client-side expense storage and secret-key handling to ensure that private financial data and ownership credentials are not unintentionally exposed.
6. Test proof generation and verification under realistic usage and infrastructure conditions.
7. Perform end-to-end testing of Mainnet wallet connection, transaction submission, proof generation, and verification.
8. Add production operational safeguards such as monitoring, error handling, abuse prevention, backup/recovery guidance, and deployment procedures.
9. Clearly communicate the privacy model and its limitations to users, particularly the fact that losing locally stored expense data or the required secret can affect a user's ability to generate or manage proofs.

The existing architecture keeps the Mainnet transition focused primarily on deployment, compatibility, security hardening, and operational readiness. The fundamental product model — private expense data combined with publicly verifiable zero-knowledge budget claims — is already implemented and demonstrated on Preprod.

Cinch can therefore progress toward a Mainnet release without changing its fundamental privacy architecture: expense records remain client-side, sensitive spending amounts remain private inputs to the ZK circuits, and the blockchain provides independently verifiable evidence of the resulting budget claims.
