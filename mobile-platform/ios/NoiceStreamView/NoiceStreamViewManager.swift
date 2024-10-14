//
//  NoiceStreamViewModule.swift
//  MobilePlatform
//
//  Created by Tobias Helsing on 24.9.2024.
//

import Foundation
import React
import SwiftUI

@objc(NoiceStreamViewManager)
class NoiceStreamViewManager: RCTViewManager {
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func view() -> UIView! {
    let view = NoiceStreamView(bridge: self.bridge)
    return view
  }
  
  @objc func setOnHeaderLayoutChanged(_ view: NoiceStreamView, callback: @escaping RCTBubblingEventBlock) {
     view.onHeaderLayoutChanged = callback
   }
   
   @objc func setOnContentLayoutChanges(_ view: NoiceStreamView, callback: @escaping RCTBubblingEventBlock) {
     view.onContentLayoutChanged = callback
   }
  
}
