//
//  NoiceStreamViewModule.m
//  MobilePlatform
//
//  Created by Tobias Helsing on 24.9.2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(NoiceStreamViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(onHeaderLayoutChanged, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onContentLayoutChanged, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(forcedOrientation, NSString*)
RCT_EXPORT_VIEW_PROPERTY(showOverlay, BOOL)

@end
