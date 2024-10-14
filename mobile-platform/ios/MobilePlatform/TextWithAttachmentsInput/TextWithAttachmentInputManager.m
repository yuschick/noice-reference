//
//  TextWithAttachmentInput.m
//  MobilePlatform
//
//  Created by Tobias Helsing on 24.10.2023.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import <React/RCTMultilineTextInputView.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>
#import "TextViewAttachmentInputController.h"

@interface RNTTextWithAttachmentInputManager : RCTViewManager
@end

@implementation RNTTextWithAttachmentInputManager

RCT_EXPORT_MODULE(RNTTextWithAttachmentInput)

- (UIView *) view {
  TextViewAttachmentInputController* inputController = [[TextViewAttachmentInputController alloc] initWithFrame:CGRectZero];
 
  
  return inputController;
}

RCT_EXPORT_VIEW_PROPERTY(onContentSizeChange, RCTDirectEventBlock)

RCT_EXPORT_VIEW_PROPERTY(onTextChange, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(attachmentSources, NSDictionary)

RCT_EXPORT_VIEW_PROPERTY(fontFamily, NSString)
RCT_EXPORT_VIEW_PROPERTY(fontSize, int)
RCT_EXPORT_VIEW_PROPERTY(textColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(placeholderText, NSString)
RCT_EXPORT_VIEW_PROPERTY(placeholderTextColor, UIColor)

RCT_EXPORT_VIEW_PROPERTY(maxCharacterLimit, int)

RCT_EXPORT_METHOD(clear:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,TextViewAttachmentInputController *> *viewRegistry) {
        TextViewAttachmentInputController *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[TextViewAttachmentInputController class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
      
        [view clear];
    }];
}

RCT_EXPORT_METHOD(addAttachment:(nonnull NSNumber*) reactTag tag: (NSString*)tag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,TextViewAttachmentInputController *> *viewRegistry) {
        TextViewAttachmentInputController *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[TextViewAttachmentInputController class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
      
        [view addAttachment:tag];
    }];
}

RCT_EXPORT_METHOD(focus:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,TextViewAttachmentInputController *> *viewRegistry) {
        TextViewAttachmentInputController *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[TextViewAttachmentInputController class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
      
        [view focus];
    }];
}

RCT_EXPORT_METHOD(blur:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,TextViewAttachmentInputController *> *viewRegistry) {
        TextViewAttachmentInputController *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[TextViewAttachmentInputController class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
      
        [view blur];
    }];
}

@end
