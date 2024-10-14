//
//  TextWithAttachmentInputController.m
//  MobilePlatform
//
//  Created by Tobias Helsing on 25.10.2023.
//

#import <UIKit/UIKit.h>
#import <React/RCTConvert.h>
#import "TextViewAttachmentInputController.h"
#import "TextAttachmentExtended.h"

@implementation TextViewAttachmentInputController

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
  self = [super initWithCoder:aDecoder];
  if (self) {
    self.delegate = self;
  }
  return self;
}

- (instancetype)initWithFrame:(CGRect)frame textContainer:(NSTextContainer *)textContainer {
  self = [super initWithFrame:frame textContainer:textContainer];
  if (self) {
    self.delegate = self;
  }
  
  self.textContainer.lineFragmentPadding = 0;
  
  [self setKeyboardAppearance:UIKeyboardAppearanceDark];
  [self setReturnKeyType:UIReturnKeyDone];
  [self setAutocorrectionType:UITextAutocorrectionTypeYes];
  [self setSpellCheckingType:UITextSpellCheckingTypeYes];
  [self setUserInteractionEnabled:YES];
  [self setEditable:YES];
  
  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(orientationDidChange:)
                                             name:UIDeviceOrientationDidChangeNotification
                                             object:nil];
  
  return self;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                    name:UIDeviceOrientationDidChangeNotification
                                                  object:nil];
}


- (void)orientationDidChange:(NSNotification *)notification {
  UIDeviceOrientation currentOrientation = [[UIDevice currentDevice] orientation];
     
  if (currentOrientation == UIDeviceOrientationFaceUp ||
      currentOrientation == UIDeviceOrientationFaceDown ||
      currentOrientation == UIDeviceOrientationPortrait ||
      currentOrientation == UIDeviceOrientationPortraitUpsideDown) 
  {
    return;
  }
  
  [self blur];
}

- (void)drawRect:(CGRect)rect {
  // Set font
  int fontSize = self.fontSize ? (int)self.fontSize : 16;
  UIFont* customFont = [UIFont fontWithName:self.fontFamily size:fontSize];
  [self setFont:customFont];
  self.fontColorCopy = [self textColor];
  self.fontCopy = [self.font copy];
  
  [self calcViewSize];
  [self showPlaceholder];
}

- (void)setAttachmentSources:(NSDictionary *)attachmentSources {
  self.attachments = [NSMutableDictionary dictionary];
  
  for(NSString* key in attachmentSources) {
    NSString* url = attachmentSources[key];
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
      NSData* imageData = [[NSData alloc] initWithContentsOfURL: [NSURL URLWithString: url]];
      
      if(imageData == nil) {
        return;
      }
      
      dispatch_async(dispatch_get_main_queue(), ^{
        [self.attachments setValue:imageData forKey:key];
      });
    });
  }
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
  UIView *hitView = [super hitTest:point withEvent:event];

  return hitView;
}

- (BOOL)textViewShouldEndEditing:(UITextView *)textView {
  return YES;
}

- (void)addAttachment: (NSString*) tag {
  NSString* rawText = [self replaceAttachmentsWithTags: [self.attributedText mutableCopy]];
  if(rawText.length + tag.length > self.maxCharacterLimit) {
    return;
  }
  
  NSRange cursorPos = [self selectedRange];
  NSMutableAttributedString* attrText = [self.attributedText mutableCopy];
  [attrText replaceCharactersInRange:cursorPos withString:tag];
  [self setAttributedText:attrText];
  [self handleTextChanges];
}

- (void)clear {
  [self setText:@""];
  [self handleTextChanges];
}

- (void)focus {
  [self becomeFirstResponder];
}

- (void)blur {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self resignFirstResponder];
  });
}

- (BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text {
  NSString* rawText = [self replaceAttachmentsWithTags: [self.attributedText mutableCopy]];
  NSUInteger newTextLength = rawText.length - range.length + text.length;
  if(newTextLength <= 0) {
    [self showPlaceholder];
  }
  
  if(newTextLength > 0) {
    [self removePlaceholder];
  }
  
  if([text isEqualToString:@"\n"]) {
    [self blur];
    return NO;
  }

  return newTextLength <= self.maxCharacterLimit ? YES : NO;
}

- (void)textViewDidChange:(UITextView *)textView{
  [self handleTextChanges];
}

- (void)copy:(id)sender {
  [super copy:sender];
  
  NSMutableAttributedString* attrStr = [[self.attributedText attributedSubstringFromRange:self.selectedRange] mutableCopy];
  NSString* textWithTags = [self replaceAttachmentsWithTags:attrStr];
  
  UIPasteboard* pasteboard = [UIPasteboard generalPasteboard];
  [pasteboard setString:textWithTags];
}

- (NSString *)replaceAttachmentsWithTags:(NSMutableAttributedString *)mutableAttributedString {
  [mutableAttributedString enumerateAttribute:NSAttachmentAttributeName inRange:NSMakeRange(0, mutableAttributedString.length) options:0 usingBlock:^(id attachment, NSRange range, BOOL *stop) {
    if ([attachment isKindOfClass:[TextAttachmentExtended class]]) {
      TextAttachmentExtended *extendedAttachment = (TextAttachmentExtended *)attachment;
      [mutableAttributedString replaceCharactersInRange:NSMakeRange(range.location, 1) withString:extendedAttachment.tag];
    }
  }];
  
  return [mutableAttributedString string];
}

- (NSMutableAttributedString *)replaceTagsWithAttachments:(NSAttributedString *)attributedText {
  NSMutableAttributedString *updatedAttributedString = [attributedText mutableCopy];
  NSString* textStr = attributedText.string;
  
  NSError *error = NULL;
  NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@":[a-zA-Z0-9_-]+:" options:NSRegularExpressionCaseInsensitive error:&error];
  
  if (!error) {
    NSArray *matches = [
      regex matchesInString:textStr options:0
      range:NSMakeRange(0, [textStr length])
    ];
    
    // We need to offset each subsequent matchRange because everytime we mutate the attr string value
    // The string length will change to tag.length of n will be replaced by a single unicode of length 1
    NSInteger offset = 0;
    NSInteger unicodeLength = 1;
    
    for (NSTextCheckingResult* match in matches) {
      NSRange matchRange = [match range];
      NSString* matchedString = [textStr substringWithRange:matchRange];

      NSData* attachmentSource = self.attachments[matchedString];
      
      if(attachmentSource == nil) {
        continue;
      }
      
      TextAttachmentExtended* attachment = [[TextAttachmentExtended alloc] init];
      attachment.image = [UIImage imageWithData:attachmentSource];
      attachment.bounds = CGRectMake(0, -6, 20, 20);
      attachment.tag = matchedString;
      
      NSAttributedString *attachmentString = [NSAttributedString attributedStringWithAttachment:attachment];
      
      NSRange offsetRange = NSMakeRange(matchRange.location - offset, matchRange.length);
      [updatedAttributedString replaceCharactersInRange:offsetRange withAttributedString:attachmentString];
      
      offset += matchRange.length - unicodeLength;
    }
  }
  
  return updatedAttributedString;
}

- (void) calcViewSize {
  CGFloat fixedWidth = self.frame.size.width;
  CGSize newSize = [self sizeThatFits: CGSizeMake(fixedWidth, CGFLOAT_MIN)];
  CGRect newFrame = self.frame;
  newFrame.size = CGSizeMake(MAX(newSize.width, fixedWidth), newSize.height);
  
  if (self.onContentSizeChange) {
    self.onContentSizeChange(@{
      @"contentSize": @{
        @"width": @(newFrame.size.width),
        @"height": @(newFrame.size.height)
      }
    });
  }
}

- (void) showPlaceholder {
  if(_placeholderTextView != nil || self.text.length > 0) {
    return;
  }
  
  // Create a UITextView
  _placeholderTextView = [[UITextView alloc] initWithFrame:self.bounds];
  _placeholderTextView.text = _placeholderText;
  _placeholderTextView.textColor = _placeholderTextColor;
  _placeholderTextView.font = self.font;
  _placeholderTextView.backgroundColor = nil;
  _placeholderTextView.textContainer.lineFragmentPadding = 0;
  _placeholderTextView.translatesAutoresizingMaskIntoConstraints = YES;
  _placeholderTextView.editable = false;
  _placeholderTextView.userInteractionEnabled = NO;
  
  // Add the UITextView as a subview to the parent view
  [self addSubview:_placeholderTextView];
}

- (void) removePlaceholder {
  if(!self.placeholderTextView) {
    return;
  }
  
  [self.placeholderTextView removeFromSuperview];
  self.placeholderTextView = nil;
}

- (void) handleTextChanges {
  NSMutableAttributedString *newAttrText = [self replaceTagsWithAttachments:self.attributedText];
  
  // Update the text in the UITextView
  self.attributedText = newAttrText;
  
  // Hack: font is reset after each new attachment
  [self setFont:self.fontCopy];
  [self setTextColor:self.fontColorCopy];
  
  // calc new size
  [self calcViewSize];
  
  // show/hide placeholder based on input text
  if(self.text.length <= 0) {
    [self showPlaceholder];
  }
  
  if(self.text.length > 0) {
    [self removePlaceholder];
  }
  
  NSMutableAttributedString* copyAttr = [self.attributedText mutableCopy];
  NSString* rawText = [self replaceAttachmentsWithTags:copyAttr];
  
  if(self.onTextChange) {
    self.onTextChange(@{ @"text": rawText});
  }
}

@end
