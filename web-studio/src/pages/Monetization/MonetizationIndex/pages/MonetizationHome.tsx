import { MonetizationCreatorCards } from '../../MonetizationCreatorCards/MonetizationCreatorCard';
import { MonetizationSubscriptions } from '../../MonetizationSubscriptions/pages';
export function MonetizationHome() {
  return (
    <>
      <MonetizationSubscriptions />
      <MonetizationCreatorCards />
    </>
  );
}
