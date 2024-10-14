//
//  NoicePurchasesModule.m
//  MobilePlatform
//
//  Created by Tobias Helsing on 22.8.2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NoicePurchasesModule, NSObject)

RCT_EXTERN_METHOD(getProducts:(NSArray*)productIdentifiers resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(purchaseProduct:(NSString*)productId tokenId:(NSString*)tokenId resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)


@end
