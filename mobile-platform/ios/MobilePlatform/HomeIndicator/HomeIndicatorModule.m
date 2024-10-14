//
//  HomeIndicatorModule.m
//  MobilePlatform
//
//  Created by Matt Bengston on 19.12.2023.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>

#import "HomeIndicatorModule.h"
#import "NoiceViewController.h"
#import "AppDelegate.h"

@implementation HomeIndicatorModule {
  NoiceViewController * _root;
}

RCT_EXPORT_MODULE(HomeIndicatorModule);

RCT_EXPORT_METHOD(setHomeIndicatorPreference:(BOOL)shouldHide)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    if (self->_root == nil) {
      AppDelegate * delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
      self->_root = (NoiceViewController *)[delegate rootViewController];
    }
    
    if (self->_root == nil) {
      RCTLogWarn(@"[HomeIndicatorModule] cannot change home indicator preference, could not find root view controller");
      return;
    }
  
    [self->_root setShouldHideHomeIndicator:shouldHide];
  });
}

@end
