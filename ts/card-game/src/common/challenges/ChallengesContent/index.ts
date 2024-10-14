export { ChallengesContent } from './ChallengesContent';
// Lawok: Exporting this hook is questionable, but atm gotta go fast
// and at least its a common component.
// The component does not handle its own data atm, because we need
// to merge resolution data in the matchend with the data from the hooks.
export { useChallengesData } from './hooks';
export type { ChallengeContentType } from './hooks';
export * from './mocks';
