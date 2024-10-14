//
//  UndimmableView.m
//  MobilePlatform
//
//  Created by Matt Bengston on 11.1.2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import "UndimmableView.h"

static int k_ViewCount = 0;

@implementation UndimmableView

- (instancetype)init
{
  if (self = [super init]) {
    k_ViewCount++;
    [[UIApplication sharedApplication] setIdleTimerDisabled:YES];
    RCTLogInfo(@"[NoiceUndimmableView] Disabling screen idle timer");
  }
  return self;
}

- (void)dealloc
{
  k_ViewCount -= 1;
  if (k_ViewCount <= 0) {
    k_ViewCount = 0;
    [[UIApplication sharedApplication] setIdleTimerDisabled:NO];
    RCTLogInfo(@"[NoiceUndimmableView] Re-enabling screen idle timer");
  }
}

@end

@implementation UndimmableViewManager

RCT_EXPORT_MODULE(NoiceUndimmableView);

- (UIView *)view
{
  return [[UndimmableView alloc] init];
}

@end
