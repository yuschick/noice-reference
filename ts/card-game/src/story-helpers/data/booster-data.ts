import { GameLogicBooster } from '@game-gen';

const boosters = [
  {
    id: 4,
    name: 'Hype',
    description:
      "Card SUCCEEDS in next 60 SECONDS:/n{list}Card: +50% points/nUsed on teammate: you also score 50% of card's value{/list}",
    descriptionCondition: 'Card SUCCEEDS in next 60s',
    descriptionTargetSelf: 'Card +50% Points',
    descriptionDefaultBenefit: 'Card +50% Points',
    descriptionOtherBenefit: "{playerName} also scores 50% of card's current points",
    descriptionTargetNoneBenefit: "You score 50% of card's current points",
    image: 'LetsGooo.svg',
    valueSelf: 50,
    valueOther: 50,
    timeActive: 60000,
    canTargetSelf: true,
    isAvailableSolo: true,
    triggersOn: ['success'],
    removeOn: ['time', 'fail'],
    isSelfAndOtherEffect: true,
  },
  {
    id: 5,
    name: 'Downtime',
    description:
      "Card does NOT SUCCEED or FAIL in next 60 SECONDS:/n{list}You score points worth 15% of the card's value/nCard points increases by 10%{/list}",
    descriptionCondition: 'Card does NOT SUCCEED or FAIL in next 60s',
    descriptionTargetSelf: "You score 15% of card's current points",
    descriptionDefaultBenefit: "{playerName} scores 15% of card's current points",
    descriptionOtherBenefit: '{targetName} Card points is increased by 10%',
    descriptionTargetNoneBenefit: 'Card points is increased by 10%',
    image: 'Doubt.svg',
    valueSelf: 15,
    valueOther: 10,
    timeActive: 60000,
    canTargetSelf: true,
    isAvailableSolo: true,
    triggersOn: ['time'],
    removeOn: ['success', 'fail'],
    isSelfAndOtherEffect: true,
  },
  {
    id: 6,
    name: 'You First',
    description:
      "Card SUCCEEDS before yours:/n{list}Card: +25% points/nYou score points worth 50% of the card's value{/list}",
    descriptionCondition: 'Card SUCCEEDS before YOURS!',
    descriptionTargetSelf: '',
    descriptionDefaultBenefit: 'Card +25% points',
    descriptionOtherBenefit: "{playerName} scores 50% of card's current points",
    descriptionTargetNoneBenefit: "You score 50% of card's current points",
    image: 'NextUp.svg',
    valueSelf: 50,
    valueOther: 25,
    timeActive: 0,
    canTargetSelf: false,
    isAvailableSolo: false,
    triggersOn: ['success'],
    removeOn: ['fail', 'successSelf'],
    isSelfAndOtherEffect: true,
  },
  {
    id: 1,
    name: 'Speed Up',
    description:
      "{list}Own Card: Point Speed +200%/nTeammate's Card: Points Speed +500%{/list}/n{note}Effect lasts 10 seconds{/note}",
    descriptionCondition: 'Increase speed of Card for 10s',
    descriptionTargetSelf: 'Speed +200%',
    descriptionDefaultBenefit: 'Speed +200%',
    descriptionOtherBenefit: '',
    descriptionTargetNoneBenefit: 'Speed +500%',
    image: 'SpeedUp.svg',
    valueSelf: 200,
    valueOther: 500,
    timeActive: 10000,
    canTargetSelf: true,
    isAvailableSolo: true,
    triggersOn: ['instant'],
    removeOn: ['time'],
    isSelfAndOtherEffect: false,
  },
  {
    id: 2,
    name: 'Scavenge',
    description:
      'Card FAILS or is SWITCHED OUT:/n{list}You get 15% of the points/nCard Owner gets 15% of the points{/list}',
    descriptionCondition: 'Card FAILS or is SWITCHED OUT',
    descriptionTargetSelf: "You score 15% of card's current points",
    descriptionDefaultBenefit: "{playerName} scores 15% of card's current points",
    descriptionOtherBenefit: "{targetName} also scores 15% of the card's current points",
    descriptionTargetNoneBenefit: "They also score 15% of the card's current points",
    image: 'Scavenge.svg',
    valueSelf: 15,
    valueOther: 15,
    timeActive: 0,
    canTargetSelf: true,
    isAvailableSolo: true,
    triggersOn: ['fail', 'switch'],
    removeOn: ['success'],
    isSelfAndOtherEffect: true,
  },
  {
    id: 3,
    name: 'Good Call',
    description:
      "Card SUCCEEDS:/n{list}Card: +25% points/nUsed on teammate: you also score 25% of card's value{/list}",
    descriptionCondition: 'Card SUCCEEDS',
    descriptionTargetSelf: 'Card +25% Points',
    descriptionDefaultBenefit: 'Card +25% Points',
    descriptionOtherBenefit: "{playerName} also scores 25% of card's current points",
    descriptionTargetNoneBenefit: "You score 25% of card's current points",
    image: 'GoodCall.svg',
    valueSelf: 25,
    valueOther: 25,
    timeActive: 0,
    canTargetSelf: true,
    isAvailableSolo: true,
    triggersOn: ['success'],
    removeOn: ['fail'],
    isSelfAndOtherEffect: true,
  },
];

function* boostersGenFn(): Generator<GameLogicBooster> {
  let index = 0;

  while (true) {
    yield boosters[index++ % boosters.length];
  }
}

const boosterGen = boostersGenFn();

// The function always gets the next profile from the array above. If last one asked
// was the last, then first one is returned again
export const getNewBooster = (): GameLogicBooster => ({
  __typename: 'GameLogicBooster',
  ...boosterGen.next().value,
});
