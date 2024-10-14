//
//  TextViewAttachmentInputController.h
//  MobilePlatform
//
//  Created by Tobias Helsing on 25.10.2023.
//

#ifndef TextViewAttachmentInputController_h
#define TextViewAttachmentInputController_h
#import <React/RCTComponent.h>

@interface TextViewAttachmentInputController : UITextView<UITextViewDelegate>

@property (nonatomic, copy) RCTDirectEventBlock onContentSizeChange;
@property (nonatomic, copy) RCTBubblingEventBlock onTextChange;

@property (nonatomic, copy) NSDictionary* attachmentSources;
@property int maxCharacterLimit;

// Typography
@property (nonatomic, copy) NSString* placeholderText;
@property (nonatomic, copy) UIColor* placeholderTextColor;
@property (nonatomic, copy) UITextView* placeholderTextView;
@property int placeholderFontSize;
@property (nonatomic, copy) NSString* fontFamily;
@property int fontSize;

// Local
@property (nonatomic, copy) NSString* lastTextWithTags;
@property (nonatomic, strong) UITextPosition* tempCursorPosition;
@property (nonatomic, strong) NSMutableDictionary<NSString*, NSData*> *attachments;

@property (nonatomic, copy) UIColor* fontColorCopy;
@property (nonatomic, copy) UIFont* fontCopy;

- (void)addAttachment: (NSString*) tag;
- (void)clear;
- (void)focus;
- (void)blur;

@end

#endif /* TextViewAttachmentInputController_h */
