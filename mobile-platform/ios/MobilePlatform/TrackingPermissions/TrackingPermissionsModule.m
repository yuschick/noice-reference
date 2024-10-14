//
//  TrackingPermissions.m
//  MobilePlatform
//
//  Created by Tobias Helsing on 17.8.2023.
//

#import <Foundation/Foundation.h>
#import "TrackingPermissionsModule.h"
#import <AppTrackingTransparency/AppTrackingTransparency.h>

@implementation TrackingPermissionsModule

RCT_EXPORT_MODULE(TrackingPermissions);

RCT_EXPORT_METHOD(askATTPermissions: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 14, *)) {
    [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
      NSLog(@"Tracking status %lu", status);
      resolve(@(status));
    }];
  } else {
    // Fallback on earlier versions
    reject(@"ATT tracking is not available for this version of IOS", nil, nil);
  }
}

RCT_EXPORT_METHOD(isAvailable: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if(@available(iOS 14, *)) {
    return resolve(@(YES));
  } else {
    return resolve(@(NO));
  }
}

RCT_EXPORT_METHOD(getAuthorizationStatus: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  if (@available(iOS 14, *)) {
    ATTrackingManagerAuthorizationStatus status = [ATTrackingManager trackingAuthorizationStatus];
    if(status >= 0) {
      resolve(@(status));
    } else {
      reject(@"Failed to get ATTrackingManagerAuthorizationStatus.", nil, nil);
    }
  } else {
    reject(@"Not available on the current iOS version", nil, nil);
  }
}

@end
