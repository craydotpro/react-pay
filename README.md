# @craynetwork/react-pay React Library Documentation

The `CrayPayButton` is a powerful and easy-to-use library for integrating cryptocurrency payments into your React application. It provides a seamless way to initiate, process, and handle cryptocurrency payments using the `cray.network` . This documentation will guide you through the installation, usage, and customization of the `CrayPayButton`.

---

## Installation

```bash
npm install @craynetwork/react-pay
```

Then, import the `CrayPayButton` into your React component:

```javascript
import CrayPayButton from "@craynetwork/react-pay";
/** For Nextjs
 const CrayPayButton = dynamic(() => import("@craynetwork/react-pay"), { ssr: false });
*/
```

---

## Usage

### Basic Usage

Here’s a simple example of how to use the `CrayPayButton` to initiate a payment:

```javascript
import React from "react";
import CrayPayButton from "@craynetwork/react-pay";
/** For Nextjs
 const CrayPayButton = dynamic(() => import("@craynetwork/react-pay"), { ssr: false });
*/
const PaymentComponent = () => {
  return (
    <div>
      <CrayPayButton
        testnet={true}
        apiKey={API_KEY}
        onPaymentStarted={(e) => console.log("paymentStarted", e)}
        onPaymentCompleted={(e) => console.log("paymentCompeted", e)}
        onPaymentFailed={(e) => console.log("paymentFailed", e)}
        onPaymentRejected={(e) => console.log("paymentRejected", e)}
        payload={{
          destinationAddress: "0xdestinationAddress",
          destinationChain: 1,
          amount: "100",
        }}
      />
    </div>
  );
};

export default PaymentComponent;
```

---

## API Reference

### `CrayPayButton`

It accepts These arguments:

- `testnet` (boolean, optional): Whether to use the testnet. Default is `false`.
- `apiKey` (string): Your API key for authentication.
- payload
  - `destinationAddress` (string): The wallet address of the receiver.
  - `destinationChain` (number): The chain ID of the destination blockchain.
  - `amount` (string): The amount to be paid in USD.
  - `action` (object, optional): An object containing `payload` and `gasLimit` for custom actions.

---

## Types

### `SubOrder`

An interface representing the SubOrder Schema:

```typescript
enum SubOrder {
  type: "INPUT" | "OUTPUT";
  amount: string;
  chainId: number;
  hash: strign;
  status: "success" | "reverted";
  gasUsed: number;
  gasPrice: number;
}
```

### `OrderStatus`

An enum representing the possible payment statuses:

```typescript
enum OrderStatus {
  INITIALIZED = "Initialized",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  FAILED = "Failed",
  CANCELLED = "Cancelled",
}
```

### `OrderStage`

An enum representing the possible payment stages:

```typescript
enum OrderStage {
  INITIALIZED = "INITIALIZED",
  SIGNED = "SIGNED",
  DECLINED = "DECLINED",
  CREATED = "CREATED",
  ASSIGNED = "ASSIGNED",
  CREATED_FAILED = "CREATED_FAILED",
  FULFILLED = "FULFILLED",
  FULFILLED_FAILED = "FULFILLED_FAILED",
  SETTLED = "SETTLED",
  SETTLE_FAILED = "SETTLE_FAILED",
  FAILED = "FAILED",
}
```

### `Order`

An interface representing the response object returned on onPaymentCompleted/onPaymentStarted callback:

```typescript
interface IPaymentRes {
  _id: string;
  id: string; // alias of _id
  destinationAddress: string;
  senderAddress: string;
  receiverAddress: string;
  destinationChain: number;
  destinationToken: string;
  amount: string;
  minAmountOut: string;
  orderHash: string;
  status: OrderStatus;
  readableStatus: string;
  destinationPayload: string;
  destinationGasLimit: number;
  apiId: string;
  solverApiId: string;
  assignedTo: string;
  assignedAt: string; // ISO timestamp
  signedAt: string; // ISO timestamp
  signedOrder: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  orderData: string; // JSON string
  isSponsered: boolean;
  subOrders: SubOrder[];
  // Additional fields may be present depending on the payment details
}
```

---

## Examples

### Example 1: Basic Payment

```javascript
const PaymentComponent = () => {
  return (
    <div>
      <CrayPayButton
        testnet={true}
        apiKey={API_KEY}
        onPaymentStarted={(e) => console.log("paymentStarted", e)}
        onPaymentCompleted={(e) => console.log("paymentCompeted", e)}
        onPaymentFailed={(e) => console.log("paymentFailed", e)}
        onPaymentRejected={(e) => console.log("paymentRejected", e)}
        payload={{
          destinationAddress: "0xdestinationAddress",
          destinationChain: 1,
          amount: "100",
        }}
      >
        <button>Your custom Pay button/>
      </CrayPayButton>
    </div>
  );
};
```

### Example 2: Contract

```javascript
import abi from "./your_nft_abi.json";

const PaymentComponent = () => {
  return (
    <div>
      <CrayPayButton
        testnet={true}
        apiKey={API_KEY}
        onPaymentStarted={(e) => console.log("paymentStarted", e)}
        onPaymentCompleted={(e) => console.log("paymentCompeted", e)}
        onPaymentFailed={(e) => console.log("paymentFailed", e)}
        onPaymentRejected={(e) => console.log("paymentRejected", e)}
        payload={{
          destinationAddress: "0xdestinationAddress",
          destinationChain: 1,
          amount: "100",
          action: {
            payload: {
              abi: abi,
              functionName: "buy",
              args: ["$$senderAddress", "120000"],
              /** you can access senderAddress by `$$senderAddress` variable */
            },
            gasLimit: 200000,
          },
        }}
      >
        <button>Your custom Pay button/>
      </CrayPayButton>
    </div>
  );
};
```

---

## Error Handling

Errors during the payment process can be handled using the `onPaymentFailed` and `onPaymentRejected`

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/your-repo-link).

---

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/your-repo-link/LICENSE) file for details.

---

For further assistance, please contact [hello@cray.network](mailto:hello@cray.network).

Happy coding! 🚀
