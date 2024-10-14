# @noice-com/mobile-platform

This package contains the React Native mobile app for Noice.

- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Commands](#commands)
	- [Targeting](#targeting)
- [Env variables](#env-variables)
	- [Updating env variables](#updating-env-variables)
- [Building for Android](#building-for-android)
- [Releasing for iOS](#releasing-for-ios)
	- [iOS releasing @todo](#ios-releasing-todo)
- [Releasing for Android](#releasing-for-android)
	- [Android releasing @todo](#android-releasing-todo)
- [WebRTC Note](#webrtc-note)

## Prerequisites

Outside of the [normal prerequisites](../docs/prerequisites.md), you need to ensure your machine is set up for React Native development. You can find these on the [RN documentation](https://reactnative.dev/docs/environment-setup?guide=native), but here is a quick summary:

**Mac/ios:**
- [Homebrew](https://brew.sh/)
- [Watchman](https://facebook.github.io/watchman/)
- [Ruby](https://www.ruby-lang.org/en/) / [RVM](https://rvm.io/)
- [CocoaPods](https://cocoapods.org/)
- [Xcode](https://developer.apple.com/xcode/) / [Xcode command line tools](https://mac.install.guide/commandlinetools/index.html)
- [iOS Simulator](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device/)

> ℹ️ You will likely need to manually run `pod install` in `./ios/` to install the ios build dependencies.

**Windows/Android:**
- [Chocolatey](https://chocolatey.org/)
- [Open JDK11](https://openjdk.java.net/projects/jdk/11/)
- [Android Studio](https://developer.android.com/studio/index.html)
- [Android 13 SDK](https://reactnative.dev/docs/environment-setup?guide=native&os=windows&platform=android#android-sdk)
- [Android device simulator](https://developer.android.com/studio/run/managing-avds.html)

## Quick start

```sh
# First start...
$ yarn
$ cd ios && pod install

# Normal running
$ yarn start
```

## Commands

- `yarn android`: Run the project on android. Defaults to target staging.
- `yarn ios`: Run the project on ios. Defaults to target staging.
- `yarn clean`: Runs `react-native start --reset-cache`. Since env vars might not work like expected, just use this to clean the cache.
- `yarn clean:ios`: Cleans ios artefacts and re-installs yarn + pods for a fresh build.
- `yarn lint`: Lint the codebase.
- `yarn test`: Test the codebase.
- `yarn assets:link`: Link any new non-js assets to the native projects.
- `yarn dependencies:check`: Check if any dependencies need to be syncronised. ([Info](https://microsoft.github.io/rnx-kit/docs/dependencies))
- `yarn dependencies:fix`: Fix any unsynced dependencies.

### Targeting

To target different environments, you can use the `ios` or `android` command followed by the environment, like so:

```bash
$ yarn ios:{env}
# or...
$ yarn android:{env}
```

Where `{env}` can be one of the following:

- `dev`: Dev (ie. `platform.int.dev.noice.com`)
- `stg`: Staging (ie. `platform.int.stg.noice.com`)
- `prd`: Production (ie. `platform.int.prd.noice.com`)

Example:

```bash
$ yarn ios:stg
```

## Env variables

Env variables are handled via [`react-native-config`](https://github.com/luggit/react-native-config) and are available both in native code and js code. Please refer to their documentation for more info.

### Updating env variables

You can update the env variables by following these steps:

1. Update the [`envs/*.env`](./envs/) files.
2. Update the config interface in [`types/env-config.d.ts`](./src/types/env-config.d.ts).

Once those two are done, you should have access to the variable via **after a fresh build**.

```ts
import Config from 'react-native-config';
Config.MY_ENV_VAR;
```

> **NOTE!** `react-native-config` copies an env file to the root directory as `.env`, you can feel free to ignore that file and don't worry about it when adding new configs (or just delete it whenever you see it, but you can also just leave it).

## Building for Android

If you need to build a release for Android, the process is slightly more involved than Xcode.

You will need to get the upload keystore and credentials from the [shared Noice 1Password](https://start.1password.com/open/i?a=DWMHM2AUZZDKDOC6PCTPGKWSDU&v=bmjsglctdznybyth45j5wgf4km&i=6zqw3cldug2eyvuewg5lxxrloe&h=my.1password.com) (or ask someone for them) and then do the following steps:

1. Download the `.keystore` file into [`./android/app`](./android/app/).
2. Create or update your global gradle properties (`~/.gradle/gradle.properties`) file with the following credentials:
```gradle
NOICE_UPLOAD_STORE_FILE="same as .keystore file"
NOICE_UPLOAD_KEY_ALIAS="found in 1password"
NOICE_UPLOAD_STORE_PASSWORD="found in 1password"
NOICE_UPLOAD_KEY_PASSWORD="found in 1password"
```

Now you shuold be able to create a new Android build. For more info on the process, you can check out the [rn docs](https://reactnative.dev/docs/signed-apk-android#generating-an-upload-key).

## Releasing for iOS

Our current release process is a mixture of manual and automation. To create a release, please do the following:

- Create a new branch
- Bump the build number (optionally the build version if necessary) by either
  - Updating all instances of `CURRENT_PROJECT_VERSION` in [ios/MobilePlatform.xcodeproj/project.pbxproj](./ios/MobilePlatform.xcodeproj/project.pbxproj)
  - Bumping it via xcode
- Create a PR with this new build number bump
- Run the [`build_mobile_client` github action](https://github.com/noice-com/platform/actions/workflows/build_mobile_client.yml) either against your branch, or against main after your branch has been merged
- Once the action is complete, check App Store Connect to make sure the bundle is there, and answer any questions required to deploy to test flight users
- Post in both `#code-mobile` and `#code-mobile-pr` about the release.
	- the `#code-mobile-pr` post is mostly to make changelog creation easier, so make sure the post is visible. Something like:
> 🚀🚀🚀🚀🚀 X.X.X / Build X Released 🚀🚀🚀🚀🚀

### iOS releasing @todo

- Add react-native-version
  - Add controls to action to specify either updating the build version AND number, or just bumping build number
  - Update action to create a new commit with the new build version/number and commit back to main
- Figure out if we need an encryption cert, and adjust our Info.plist so we don't have to manually answer that question on App Store Connect every build

## Releasing for Android

> ⛔️ This flow is currently broken because the github action was migrated to run on our own GCP self-hosted runners, which don't have everything the Github linux runners have; so the build fails quite early. For now, you have to manually create a build in Android Studio (See requirements above) and upload it to Google Play Console.

- Create a new branch
- Bump the build number in [build.gradle](./android/app/build.gradle)
- Create a PR with this new build number bump
- Run the [`build_android_client` github action](https://github.com/noice-com/platform/actions/workflows/build_android_client.yml) either against your branch, or against main after your branch has been merged
- Once the action is complete, check Google Play Console to make sure the bundle is there
- TODO

### Android releasing @todo

- Fix github action
  - This action was built for Github linux runners, and is incompatible with our self-hosted GCP runners. It was moved to the self-hosted because of LFS calls; which are handled special in GCP to not bankrupt us. Unfortunately, it now errors when trying to install yarn so this action needs to be reimplemented to work within GCP.
- Configure auto-upload to Google Play Console
  - This requires a service json from our Google Cloud and additional setup for tracks in Google Play Console, but has not been done yet since the action does not build
- Add react-native-version
  - Add controls to action to specify either updating the build version AND number, or just bumping build number
  - Update action to create a new commit with the new build version/number and commit back to main
- Figure out if we need an encryption cert

## WebRTC Note

We use a patched version of WebRTC because it does some very odd things out of the box. On iOS, this patched version gets included via patching the webrtc dependency in `react-native-webrtc` to use our own patched WebRTC library. You can find more information about this, as well as the patched library at [noice-com/patched-webrtc](https://github.com/noice-com/patched-webrtc).
