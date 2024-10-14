import { Route, Routes } from 'react-router';

import { PaymentReceipt } from './PaymentReceipt/PaymentReceipt';
import { WalletHome } from './WalletHome';

import { PAYMENT_RECEIPT_PATH } from '@pages/Settings/const';

export function Wallet() {
  return (
    <Routes>
      <Route
        element={<WalletHome />}
        index
      />
      <Route
        element={<PaymentReceipt />}
        path={PAYMENT_RECEIPT_PATH}
      />
    </Routes>
  );
}
