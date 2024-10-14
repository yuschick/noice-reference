//
//  StreamView.swift
//  MobilePlatform
//
//  Created by Tobias Helsing on 24.9.2024.
//

import SwiftUI
import React
import yoga

enum ActualOrientation {
  case portrait
  case landscapeRight
  case landscapeLeft
}

final class OrientationManager: ObservableObject {
  @Published var actualOrientation: ActualOrientation = .portrait
  @Published var deviceOrientation = UIDeviceOrientation.portrait
  @Published var canRotateDevice: Bool = true
}

final class DisplayManager: ObservableObject {
  @Published var showOverlay: Bool = false
}

struct StreamView: View {
  @ObservedObject private var orientationManager = OrientationManager()
  @ObservedObject private var displayManager = DisplayManager()
  
  var headerView: RCTView
  var contentView: RCTView
  var overlayView: RCTView
  var bridge: RCTBridge
  
  var onHeaderLayoutChanged: (([String: Any]) -> Void)?
  var onContentLayoutChanged: (([String: Any]) -> Void)?
  
  var body: some View {
    GeometryReader { geometry in
      VStack(spacing: 0) {
        // MARK: Stream view content
        if !displayManager.showOverlay {
          if orientationManager.actualOrientation == .portrait {
            Spacer()
              .frame(height: safeAreaInsets().top)
              .animation(.easeOut, value: orientationManager.actualOrientation)
          }
          
          UIViewWrapper(
            view: headerView,
            bridge: bridge,
            size: CGSize(
              width: orientationManager.actualOrientation == .portrait ?
              geometry.size.width :
                geometry.size.height,
              height: orientationManager.actualOrientation == .portrait ?
              geometry.size.width * (9 / 16) :
                geometry.size.width
            )
          )
          .frame(
            width: orientationManager.actualOrientation == .portrait ?
            geometry.size.width :
              geometry.size.height,
            height: orientationManager.actualOrientation == .portrait ?
            geometry.size.width * (9 / 16) :
              geometry.size.width
          )
          
          if orientationManager.actualOrientation == .portrait {
            UIViewWrapper(
              view: contentView,
              bridge: bridge,
              size: CGSize.zero
            )
            .animation(.easeIn, value: orientationManager.actualOrientation)
          }
        // MARK: Show Overlay
        } else {
          UIViewWrapper(
            view: overlayView,
            bridge: bridge,
            size: CGSize(
              width: orientationManager.actualOrientation == .portrait ?
              geometry.size.width :
                geometry.size.height,
              height: orientationManager.actualOrientation == .portrait ?
              geometry.size.height :
                geometry.size.width
            )
          )
          .frame(
            width: orientationManager.actualOrientation == .portrait ?
            geometry.size.width :
              geometry.size.height,
            height: orientationManager.actualOrientation == .portrait ?
            geometry.size.height :
              geometry.size.width
          )
        }
      }
      .frame(
        width: orientationManager.actualOrientation == .portrait ? geometry.size.width : geometry.size.height,
        height: orientationManager.actualOrientation == .portrait ?
        geometry.size.height:
          geometry.size.width
      )
      .background(.black)
      .rotationEffect(rotationAngle(for: orientationManager.actualOrientation))
      .animation(.easeInOut, value: orientationManager.actualOrientation)
      .edgesIgnoringSafeArea(.all)
      .offset(x: offsetX(for: orientationManager.actualOrientation, size: geometry.size),
              y: offsetY(for: orientationManager.actualOrientation, size: geometry.size))
      .onOrientationChange($orientationManager.deviceOrientation)
      .onAppear {
        emitLayoutChanges(size: geometry.size)
      }
      .onChange(of: orientationManager.deviceOrientation) { targetOrientation in
        if !orientationManager.canRotateDevice {
          orientationManager.actualOrientation = .landscapeRight
          return;
        }
        
        switch targetOrientation {
        case .portrait:
          orientationManager.actualOrientation = .portrait
        case .landscapeRight:
          orientationManager.actualOrientation = .landscapeRight
        case .landscapeLeft:
          orientationManager.actualOrientation = .landscapeLeft
        default:
          orientationManager.actualOrientation = .portrait
        }
      }
      .onChange(of: orientationManager.actualOrientation) { newOrientation in
        emitLayoutChanges(size: geometry.size);
      }
    }
  }
  
  func setForceOrientation(newForcedOrientation: String) {
    if newForcedOrientation == "landscape" {
      orientationManager.actualOrientation = .landscapeRight
    } else {
      orientationManager.actualOrientation = .portrait
    }
  }
  
  func setShowOverlay(showOverlay: Bool) {
    print("SHOW OVERLAY: ", showOverlay)
    displayManager.showOverlay = showOverlay;
    print("SHOW OVERLAY SET: ", displayManager.showOverlay)
  }
  
  func emitLayoutChanges(size: CGSize) {
    let insets = safeAreaInsets();
    
    let headerLayoutChange: [String: Any] = [
      "x": 0,
      "y": 0,
      "width": orientationManager.actualOrientation == .portrait ? size.width : size.height,
      "height": orientationManager.actualOrientation == .portrait ? size.width * (9 / 16) : size.width
    ]
    
    let contentLayoutChange: [String: Any] = [
      "x": 0,
      "y": 0,
      "width": orientationManager.actualOrientation == .portrait ? size.width : 0,
      "height": orientationManager.actualOrientation == .portrait ? size.height - size.width * (9 / 16) - insets.top : 0
    ]
    
    onHeaderLayoutChanged?(headerLayoutChange)
    onContentLayoutChanged?(contentLayoutChange)
    
  }
  
  func safeAreaInsets() -> UIEdgeInsets {
    let defaultInsets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: 0)
    guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
      return defaultInsets
    }
    
    return windowScene.keyWindow?.safeAreaInsets ?? defaultInsets
  }
}


private func rotationAngle(for orientation: ActualOrientation) -> Angle {
  switch orientation {
  case .landscapeLeft:
    return Angle(degrees: 90)
  case .landscapeRight:
    return Angle(degrees: -90)
  default:
    return Angle(degrees: 0)
  }
}

private func offsetX(for orientation: ActualOrientation, size: CGSize) -> CGFloat {
  orientation == .landscapeLeft || orientation == .landscapeRight ? (size.width - size.height) / 2 : 0
}

private func offsetY(for orientation: ActualOrientation, size: CGSize) -> CGFloat {
  orientation == .landscapeLeft || orientation == .landscapeRight ? (size.height - size.width) / 2 : 0
}

struct OrientationViewModifier: ViewModifier {
  @Binding var orientation: UIDeviceOrientation
  
  func body(content: Content) -> some View {
    content
      .onAppear(perform: detectOrientation)
      .onReceive(NotificationCenter.default.publisher(for: UIDevice.orientationDidChangeNotification)) { _ in
        detectOrientation()
      }
  }
  
  func detectOrientation() {
    // Ignore flat orientation changes
    if(UIDevice.current.orientation.isFlat) {
      return
    }
    
    orientation = UIDevice.current.orientation
  }
}

extension View {
  func onOrientationChange(_ orientation: Binding<UIDeviceOrientation>) -> some View {
    self.modifier(OrientationViewModifier(orientation: orientation))
  }
}

struct UIViewWrapper: UIViewRepresentable {
  typealias UIViewType = UIView
  let view: RCTView
  let bridge: RCTBridge
  let size: CGSize
  
  func makeUIView(context: Context) -> UIView {
    bridge.uiManager.setSize(CGSize(width: size.width, height: size.height), for: view)
    
    return view
  }
  
  func updateUIView(_ uiView: UIView, context: Context) {
  }
}
