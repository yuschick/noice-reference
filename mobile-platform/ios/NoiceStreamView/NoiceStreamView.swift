import UIKit
import SwiftUI
import React

@objc(NoiceStreamView)
class NoiceStreamView: RCTView { //UIView 
  public var bridge: RCTBridge?
  private var headerView = RCTView()
  private var contentView = RCTView()
  private var overlayView = RCTView()
  private var hostingController: UIHostingController<StreamView>?
  
  @objc var onHeaderLayoutChanged: RCTBubblingEventBlock?
  @objc var onContentLayoutChanged: RCTBubblingEventBlock?
  @objc var forcedOrientation: String = "" {
    didSet {
      guard let streamView = self.hostingController?.rootView else { return }
      streamView.setForceOrientation(newForcedOrientation: forcedOrientation)
    }
  }
  @objc var showOverlay: Bool = false {
    didSet {
      guard let streamView = self.hostingController?.rootView else { return }
      streamView.setShowOverlay(showOverlay: showOverlay)
    }
  }
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect(
      x: 0,
      y: 0,
      width: UIScreen.main.bounds.width,
      height: UIScreen.main.bounds.height)
    )
    self.bridge = bridge
    setupHostingController()
  }
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    setupHostingController()
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  public func setupHostingController() {
    guard let bridge = self.bridge else {
      return;
    }
    
    let streamView = StreamView(
      headerView: headerView,
      contentView: contentView,
      overlayView: overlayView,
      bridge: bridge,
      onHeaderLayoutChanged: { layout in
        if let onHeaderLayoutChanged = self.onHeaderLayoutChanged {
          onHeaderLayoutChanged(layout)
        }
      },
      onContentLayoutChanged: { layout in
        if let onContentLayoutChanged = self.onContentLayoutChanged {
          onContentLayoutChanged(layout)
        }
      }
    )
    hostingController = UIHostingController(rootView: streamView)
    guard let hostingView = self.hostingController?.view else { return }
    
    hostingView.translatesAutoresizingMaskIntoConstraints = false
    self.addSubview(hostingView)
    
    NSLayoutConstraint.activate([
      hostingView.topAnchor.constraint(equalTo: self.topAnchor),
      hostingView.leadingAnchor.constraint(equalTo: self.leadingAnchor),
      hostingView.trailingAnchor.constraint(equalTo: self.trailingAnchor),
      hostingView.bottomAnchor.constraint(equalTo: self.bottomAnchor)
    ])
    
  }
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    guard let hostingController = self.hostingController else {return}
    
    if let nativeID = subview.nativeID {
      if nativeID == "NoiceStreamViewHeader" {
        if let subview = subview as? RCTView {
          print("Headerview is of type rctview")
          headerView = subview
          hostingController.rootView.headerView = headerView
        } else {
          print("Headerview is not of type")
        }
      } else if nativeID == "NoiceStreamViewContent" {
        if let subview = subview as? RCTView {
          contentView = subview
          hostingController.rootView.contentView = contentView
        } else {
          print("Contentview is not of type")
        }
      } else if nativeID == "NoiceStreamViewOverlay" {
        if let subview = subview as? RCTView {
          overlayView = subview
          hostingController.rootView.overlayView = overlayView
        } else {
          print("Overlay view is not of type")
        }
      }
    }
  }
  
  override func addSubview(_ subview: UIView) {
    super.addSubview(subview)
  }
  
  override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }
}
