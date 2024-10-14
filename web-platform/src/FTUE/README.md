# FTUE -First Time User Experience

The system to show all the hints and guides for the user when they are starting to use product.

## What are FTUE components

FTUE component is a box with a content, that will be rendered based on different rules. Only one component can be visible at a time. Each component has an button that closes the FTUE and mark it is seen; it will not been shown again. Component can also has [**an action**](#ftue-action); when user does that action, the FTUE component is marked to be seen and not shown again.

Each FTUE component has [**an anchor**](#ftue-anchor) that gives the placement of the FTUE component. FTUE component can also have [**a criteria**](#ftue-criteria), that gives some statement when the FTUE should been shown. There is also **a priority** that determines which of the FTUE components should be visible if there is multiple based on an anchor and a criteria that could be rendered.

### List of FTUE configs

FTUE components are configured on Google Sheets and exported to yaml file that can be find [here](../../../../tools/ftue-config/ftue-config.yml).

## FTUE Anchor

Each FTUE component has an anchor, that is a HTML element on the code. To make a HTML element to be an anchor, there needs to be `data-ftue-anchor` attribute with the given FTUE value (see [the list of FTUE configs](#list-of-ftue-configs)).

When there is a FTUE component that has `uiElementAnchor` with value `important-shop-button`, the anchor value need to be added to the button like this

```html
<button data-ftue-anchor="important-shop-button">Shop now!</button>
```

## FTUE Criteria

FTUE component can have a criteria field, that is a if statement based on two objects: `uiContext` and `playerStats`. The `uiContext` is based on different events that happens on ui, like have user selected card or not. `playerStats` are fetched from user data. All criteria logic can be found from [this hooks](./hooks/useFTUECriteriaData.hook.ts) and it is the place where to add new criteria when needed

## FTUE Action

FTUE component can have an action, that is extra action that use can do to mark the FTUE as seen when it is visible. For example, when there is a FTUE to say that user should pick a card, picking a card is also sign that user has understood the points of the FTUE message. 

```tsx
export function PickACardButton() {
  const triggerFTUEAction = useTriggerFTUEAction();

  const onClick = () => {
    triggerFTUEAction(FTUEActionType.PickACard);
    pickACad();
  }

  return <button onClick={onClick}>Pick A Card</button>
}
```

All the action types can be found [here](../../../../lib/ts/common-ui/src/classes/FTUEActionsHandler.ts) and it is the place to add new actions when needed.