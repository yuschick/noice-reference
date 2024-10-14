import { PageSkeletonLoader } from '@components/PageSkeletonLoader';

export function StreamGameLoadingView() {
  return (
    <PageSkeletonLoader
      listCardCount={1}
      listCardHeight={200}
      listCardPadding={10}
      showTitle={false}
    />
  );
}
