import { ImplicitAccountUpSellingProvider } from '@common/implicit-account';
import { StreamGameProxyProvider } from '@common/stream';
import { SelectedUIStateProvider } from '@context';
import { StoreItem } from '@pages/Store';

export const StoreItemEmbed = () => {
  return (
    <SelectedUIStateProvider>
      <StreamGameProxyProvider>
        <ImplicitAccountUpSellingProvider>
          <StoreItem />
        </ImplicitAccountUpSellingProvider>
      </StreamGameProxyProvider>
    </SelectedUIStateProvider>
  );
};
