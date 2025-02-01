# @craynetwork/react-pay React Library Documentation

The `useCrayPay` React hook is a powerful and easy-to-use library for integrating cryptocurrency payments into your React application. It provides a seamless way to initiate, process, and handle cryptocurrency payments using the `cray.network` . This documentation will guide you through the installation, usage, and customization of the `useCrayPay` hook.

---

## Installation

```bash
npm install @craynetwork/react-pay
```

Then, import the `useCrayPay` hook into your React component:

```javascript
import useCrayPay from "@craynetwork/react-pay";
```

---

## Usage

### Basic Usage

Here’s a simple example of how to use the `useCrayPay` hook to initiate a payment:

```javascript
import React from "react";
import useCrayPay from "@craynetwork/react-pay";

const PaymentComponent = () => {
  const { pay, status } = useCrayPay();

  const handlePayment = () =>
    pay({
      destinationToken: "0xTokenAddress",
      receiverAddress: "0xReceiverAddress",
      apiKey: "your-api-key",
      testnet: true,
      destinationChain: 1,
      amount: "100",
    });

  return (
    <div>
      <button onClick={handlePayment}>Pay with Crypto</button>
      <p>Payment Status: {status}</p>
    </div>
  );
};

export default PaymentComponent;
```

### Advanced Usage

You can also handle success and error events using the `onSuccess` and `onError` callbacks:

```javascript
const handlePayment = () =>
  pay(
    {
      destinationToken: "0xTokenAddress",
      receiverAddress: "0xReceiverAddress",
      apiKey: "your-api-key",
      testnet: true,
      destinationChain: 1,
      amount: "1.5",
    },
    {
      onSuccess: (event) => {
        console.log("Payment successful:", event);
      },
      onError: (error) => {
        console.error("Payment failed:", error);
      },
    }
  );
```

---

## API Reference

### `useCrayPay` Hook

The `useCrayPay` hook returns an object with the following properties:

- **`pay`**: A function to initiate the payment process.
- **`status`**: A state variable that tracks the current status of the payment.

### `pay` Function

The `pay` function is used to initiate a payment. It accepts two arguments:

1. **Payment Configuration Object**:

   - `destinationToken` (string): Token address of the token to be used for payment.
   - `receiverAddress` (string): The wallet address of the receiver.
   - `apiKey` (string): Your API key for authentication.
   - `testnet` (boolean, optional): Whether to use the testnet. Default is `false`.
   - `destinationChain` (number): The chain ID of the destination blockchain.
   - `amount` (string): The amount to be paid in USD.
   - `action` (object, optional): An object containing `payload` and `gasLimit` for custom actions.

2. **Options Object** (optional):
   - `onSuccess` (function): Callback function triggered on successful payment.
   - `onError` (function): Callback function triggered on payment failure.

### `status` State

The `status` state variable tracks the current status of the payment. It can have one of the following values:

- `IPaymentStatus.idle`: The payment process has not started.
- `IPaymentStatus.initiated`: The payment process has been initiated.
- `IPaymentStatus.processing`: The payment is being processed.
- `IPaymentStatus.completed`: The payment was successful.
- `IPaymentStatus.failed`: The payment failed.

---

## Types

### `IPaymentStatus`

An enum representing the possible payment statuses:

```typescript
enum IPaymentStatus {
  idle = "idle",
  initiated = "initiated",
  processing = "processing",
  completed = "completed",
  failed = "failed",
}
```

### `IPaymentRes`

An interface representing the response object returned on successful payment:

```typescript
interface IPaymentRes {
  _id: string;
  status: string;
  // Additional fields may be present depending on the payment details
}
```

---

## Examples

### Example 1: Basic Payment

```javascript
const { pay, status } = useCrayPay();

const handlePayment = () =>
  pay(
    {
      destinationToken: "USDC",
      receiverAddress: "0xReceiverAddress",
      apiKey: "your-api-key",
      testnet: true,
      destinationChain: 1,
      amount: "1.5",
    },
    {
      onSuccess: (event) => {
        console.log("Payment successful:", event);
      },
      onError: (error) => {
        console.error("Payment failed:", error);
      },
    }
  );
```

### Example 2: Contract

```javascript
import abi from "./your_nft_abi.json";

const handlePayment = () =>
  pay(
    {
      destinationToken: "0xTokenAddress",
      receiverAddress: "0xReceiverAddress",
      apiKey: "your-api-key",
      testnet: true,
      destinationChain: 1,
      amount: "1.5",
      action: {
        abi,
        functionName: "mint",
        args: ["$$senderAddress"],
        /**
         * you can access variables by added `$$`
         * i.e. $$destinationChain, $$receiverAddress, $$senderAddress
         */
      },
    },
    {
      onSuccess: (event) => {
        console.log("Payment successful:", event);
      },
      onError: (error) => {
        console.error("Payment failed:", error);
      },
    }
  );
```

---

## Error Handling

Errors during the payment process can be handled using the `onError` callback. Common errors include:

- Popup blocking by the browser.
- Invalid API key.
- Network issues.
- Payment failure on the blockchain.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/your-repo-link).

---

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/your-repo-link/LICENSE) file for details.

---

For further assistance, please contact [hello@cray.network](mailto:hello@cray.network).

Happy coding! 🚀
