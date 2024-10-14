<a href="https://pages.dev.noice.com/client/storybook/" target="_blank"><img src="https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg"></a>

# @noice-client/web-platform

This workspace contains the main code for the Noice web client and UI.

## Build environments

- [Production](https://noice.com/)
- [Staging](https://mvp.int.stg.noice.com/)
- [Development](https://mvp.int.dev.noice.com/)

## Getting started

### Prerequisites

All clients share the same prerequisites that can be found [here](../docs/prerequisites.md), you need to add them only once

### Commands

The most common way to develop on the client is running a local client against the staging backend:

````sh
$ yarn watch-serve-stg
````

All commands are listed [here](../docs/commands.md) and they are the same between every client

### Dependency Maintenance

To ensure we keep the codebase up-to-date, we update the workspace dependencies monthly. To read about the process, check the [docs](../docs/dependency-updates.md).

### Esbuild issues

In case of the following issue:

```
Error:
[1] ➤ YN0000: [@noice-com/web-app]: You installed esbuild on another platform than the one you're currently using.
[1] ➤ YN0000: [@noice-com/web-app]: This won't work because esbuild is written with native code and needs to
[1] ➤ YN0000: [@noice-com/web-app]: install a platform-specific binary executable.
```

just run `yarn` again and then the command again.

## .env files

We use `.env` files to easily change global variables per environment. These configs can be seen in the `./package/app/.env` directory, and can be updated for your local environment as long as the changes are not committed to the codebase.

For example, if the verbose logging option is spamming your local environment too much, you can disable it by editing `local.env` and setting `VERBOSE_LOGGING` to `false`.

```diff
- VERBOSE_LOGGING=true
+ VERBOSE_LOGGING=false
```

The values of this file will be available in the `window.NOICE` namespace. You can see the types of the current variables in the [global types declaration](./src/types/globals.d.ts).

> ⚠️ **Note about adding env variables!** ⚠️
> When adding new env variables, it is important to not only add them to the .env files, but also to the [global types declaration](./src/types/globals.d.ts), [workspace file](./noice_workspace.yml), and [config](./config.js). The workspace variables should be defined in [variables.yml](../../variables.yml). If it gets injected by docker, and only matters in deployed/containerized environments, you should be able to add it to just the [dockerfile](./Dockerfile) and workspace file.

## TypeScript Code style

Please check the [codestyle](./CODESTYLE.md) document for information on rules for our codebase.
