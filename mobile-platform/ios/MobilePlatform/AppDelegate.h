#import <RCTAppDelegate.h>
#import <Expo/Expo.h>
#import <UIKit/UIKit.h>
#import <RNAppAuthAuthorizationFlowManager.h>

@interface AppDelegate : EXAppDelegateWrapper<RNAppAuthAuthorizationFlowManager>

//RCTAppDelegate

@property UIInterfaceOrientationMask orientationLock;
@property UIViewController * rootViewController;

@property (nonatomic, weak)
 id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end
