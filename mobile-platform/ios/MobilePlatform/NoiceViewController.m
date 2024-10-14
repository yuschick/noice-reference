//
//  NoiceViewController.m
//  MobilePlatform
//
//  Created by Matt Bengston on 19.12.2023.
//

#import <Foundation/Foundation.h>
#import <React/RCTLog.h>

#import "NoiceViewController.h"

@implementation NoiceViewController {
  BOOL _hideIndicator;
}

- (id)init
{
  if (self = [super init])
  {
    _hideIndicator = NO;
  }
  
  return self;
}

- (BOOL)prefersHomeIndicatorAutoHidden
{
  return _hideIndicator;
}

- (UIRectEdge)preferredScreenEdgesDeferringSystemGestures
{
  return _hideIndicator ? UIRectEdgeBottom : UIRectEdgeNone;
}

- (void)setShouldHideHomeIndicator:(BOOL)hide
{
  RCTLogInfo(@"[NoiceViewController] Updating should hide home indicator: %@", hide ? @"Yes" : @"No");
  _hideIndicator = hide;
  dispatch_async(dispatch_get_main_queue(), ^{
    [self setNeedsUpdateOfScreenEdgesDeferringSystemGestures];
    [self setNeedsUpdateOfHomeIndicatorAutoHidden];
  });
}

@end
