#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import "NoiceViewController.h"
#import <WebRTC/WebRTC.h>
#import <Firebase.h>

#import <React/RCTRootView.h>
#if RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#endif

#import "Orientation.h"

#import "ExpoModulesCore-Swift.h"

#import <Singular-React-Native/SingularBridge.h>

static UIColor * kNoiceDefaultAppBackground = [[UIColor alloc] initWithRed:0.04 green:0.04 blue:0.05 alpha:1];

@implementation AppDelegate

#pragma mark - Config

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

#pragma mark - Lifecycle

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"MobilePlatform";
  self.initialProps = @{};
  
  // Set WebRTC config to playback-only to disable implicit requesting of hardware input.
  // Only works thanks to our patched version of webrtc
  RTC_OBJC_TYPE(RTCAudioSessionConfiguration) *webRTCConfiguration = [[RTC_OBJC_TYPE(RTCAudioSessionConfiguration) alloc] init];
  webRTCConfiguration.mode = AVAudioSessionModeMoviePlayback;
  webRTCConfiguration.category = AVAudioSessionCategoryPlayback;
  webRTCConfiguration.categoryOptions = AVAudioSessionCategoryOptionDuckOthers; // Or AVAudioSessionCategoryOptionMixWithOthers depending on taste
  [RTC_OBJC_TYPE(RTCAudioSessionConfiguration) setWebRTCConfiguration:webRTCConfiguration];
  
  // Init Singular bridge
  [SingularBridge startSessionWithLaunchOptions:launchOptions];
  
  // init Firebase
  [FIRApp configure];
  
  // Save initial orientation lock
  _orientationLock = UIInterfaceOrientationMaskPortrait;
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}
 
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


- (void)customizeView:(UIView *)view forBridge:(RCTBridge *)bridge withModuleName:(NSString *)moduleName initialProperties:(NSDictionary *)initialProperties {
#if RCT_NEW_ARCH_ENABLED
  RCTFabricSurfaceHostingProxyRootView * rootView = (RCTFabricSurfaceHostingProxyRootView *)view;
#else
  RCTRootView * rootView = (RCTRootView *)view;
#endif
  
  // Set default background
  dispatch_async(dispatch_get_main_queue(), ^{
    [rootView setBackgroundColor:kNoiceDefaultAppBackground];
  });
}

// Cache the root view controller whenever it is made
- (UIViewController *)createRootViewController
{
  NSLog(@"[Noice] Creating root view controller");
  _rootViewController = [NoiceViewController new];
  return _rootViewController;
}

// universal linking
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  [SingularBridge startSessionWithUserActivity:userActivity];
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}


@end
