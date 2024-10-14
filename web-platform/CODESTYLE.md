# TypeScript Codestyle

Now that we have moved to typescript, there are certain conventions we have taken into place to provide an easy to understand, cohesive codebase. 

## File naming

We use verbose file naming/extensions to make things easier to find and easier to determine what a file is just from the name and extension.

### General naming
- Single functionality/class implementations use Pascal Case: `MyClass.ts`
- Multi-functional/namespace modules (think utils/helpers) use kebab-case: `my-helper-module.ts` <sup id="a1">[1](#f1)</sup>
- Type declaration modules use kebab-case: `external-globals.d.ts`

### React-specific naming
- If it contains **JSX** use PascalCase with `.tsx`: `ComponentName.tsx`
- If it contains **a single react hook** use camelCase with `.hook.ts`: `useHookName.hook.ts`
- If it contains **multiple react hooks/context management** use PascalCase with `.hook.ts`: `ContextName.hook.ts`
- If it contains **postcss styles** use PascalCase with `.module.css`: `ComponentName.module.css`

## Avoid default exports where possible

We use named exports for better tracking of functions, better visibility, and more control on imports.

```tsx
// Yes
export function MyComponent() {}
import { MyComponent } from './MyComponent';

// No
export default function MyComponent() {}
import Component from './MyComponent';
```

Default exports allow you to implicity rename/mask functions and variables, which is something we want to avoid in the interests of keeping things easy and clear to follow. It also makes refactoring much easier and safer, as you can't miss something due to it being implicitly renamed somewhere.

## Add types to any function arguments, function returns, interfaces, and variables that can not easily be inferred.

```ts
// Nullable states
const [error, setError] = useState<Nullable<string>>(null);
```

Let's try to limit the amount of anonymous, 1-time-use interfaces so that we don't end up in a situation where data structures are inconsistent and unpredictable throughout the codebase.

## Migrate components from `PropTypes` to use an explicit `Props` interface

Use functions for components unless you need to use `React.FC` or something similar for a reason.

> ℹ We use don't use `React.FC` so that we are far more portable if we decide to move to another framework (like preact), since it implicitly allows a lot of pre-baked functionality that is very react (and react version) specific. 


```tsx
interface Props {
  name: string;
  onClick(id: string): void;
}

export function MyComponent({ name, onClick }: Props) {
    return <div onClick={onClick}>Hello {name}</div>;
}

```

## Use enums rather than object maps where possible:

```diff
- const Sizes = {
-    small: "small",
-    medium: "medium",
-    large: "large",
- };
+ enum Sizes {
+    Small,
+    Medium,
+    Large
+ }
```

If you need it to translate into a string or number (for things such as routes):

```ts
enum Sizes {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg',
}
```

<b id="f1">1</b> If we decide we want to unify and not have as many naming conventions, we can change multi-functional/namespace modules to use PascalCase as well, to keep in line with the rest of the naming. Feel free to make a poll in #code-client and we can figure out a solid answer for this one! [↩](#a1)