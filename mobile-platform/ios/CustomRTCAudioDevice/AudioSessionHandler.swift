import Foundation
import AVFAudio

protocol AudioSessionHandler: AnyObject {
  var audioSession: AVAudioSession { get }
  
  func handleInterruptionBegan(applicationWasSuspended: Bool)
  
  func handleInterruptionEnd(shouldResume: Bool)
  
  func handleAudioRouteChange()
  
  func handleMediaServerWereReset()
  
  func handleMediaServerWereLost()
}

extension AudioSessionHandler {
  func subscribeAudioSessionNotifications() -> [Any] {
    let center = NotificationCenter.default
    let interruptionNotificationSubscribtion = center.addObserver(forName: AVAudioSession.interruptionNotification,
                                                                  object: audioSession,
                                                                  queue: nil) { [weak self] notification in
      guard let self = self else {
        return
      }
      guard let type = notification.userInfo?[AVAudioSessionInterruptionTypeKey] as? NSNumber,
            let interruptionType: AVAudioSession.InterruptionType = .init(rawValue: type.uintValue) else {
        return
      }
      switch interruptionType {
      case .began:
        var applicationWasSuspended: Bool = false
        if #available(iOS 14.5, *) {
          if let rawReason = notification.userInfo?[AVAudioSessionInterruptionReasonKey] as? NSNumber,
             let reason: AVAudioSession.InterruptionReason = .init(rawValue: rawReason.uintValue) {
            applicationWasSuspended = reason == .appWasSuspended
          }
        } else {
          if let wasSuspended = notification.userInfo?[AVAudioSessionInterruptionWasSuspendedKey] as? NSNumber, wasSuspended.boolValue {
            applicationWasSuspended = true
          }
        }
        self.handleInterruptionBegan(applicationWasSuspended: applicationWasSuspended)
      case .ended:
        var shouldResume = false
        if let type = notification.userInfo?[AVAudioSessionInterruptionOptionKey] as? NSNumber {
          let interruptionOptions: AVAudioSession.InterruptionOptions = .init(rawValue: type.uintValue)
          shouldResume = interruptionOptions.contains(.shouldResume)
        }
        self.handleInterruptionEnd(shouldResume: shouldResume)
      @unknown default:
        return
      }
      
    }
    let routeChangeNotificationSubscribtion = center.addObserver(forName: AVAudioSession.routeChangeNotification,
                                                                 object: audioSession,
                                                                 queue: nil) { [weak self] notification in
      guard let self = self else {
        return
      }
      self.handleAudioRouteChange()
    }
    
    let mediaServicesWereLostNotificationSubscribtion = center.addObserver(forName: AVAudioSession.mediaServicesWereLostNotification,
                                                                           object: audioSession,
                                                                           queue: nil) { [weak self] notification in
      guard let self = self else {
        return
      }
      self.handleMediaServerWereLost()
    }
    let mediaServicesWereResetNotificationSubscribtion = center.addObserver(forName: AVAudioSession.mediaServicesWereResetNotification,
                                                                            object: audioSession,
                                                                            queue: nil) { [weak self] notification in
      guard let self = self else {
        return
      }
      self.handleMediaServerWereReset()
    }
    
    return [
      interruptionNotificationSubscribtion,
      routeChangeNotificationSubscribtion,
      mediaServicesWereLostNotificationSubscribtion,
      mediaServicesWereResetNotificationSubscribtion
    ]
  }
  
  func unsubscribeAudioSessionNotifications(observers: [Any]) {
    let center = NotificationCenter.default
    for observer in observers {
      center.removeObserver(observer)
    }
  }

  func configureStereoRecording() {
    // Find the built-in microphone input.
    guard let availableInputs = audioSession.availableInputs,
          let builtInMicInput = availableInputs.first(where: { $0.portType == .builtInMic }) else {
      return
    }
    
    // Make the built-in microphone input the preferred input.
    do {
      try audioSession.setPreferredInput(builtInMicInput)
    } catch {
      return
    }
    
    
    guard let preferredInput = audioSession.preferredInput,
          let dataSources = preferredInput.dataSources,
          let frontStereo = dataSources.first(where: { $0.orientation == .front }),
          let supportedPolarPatterns = frontStereo.supportedPolarPatterns else {
      return
    }
    var isStereoSupported = false
    do {
      isStereoSupported = supportedPolarPatterns.contains(.stereo)
      // If the data source supports stereo, set it as the preferred polar pattern.
      if isStereoSupported {
        // Set the preferred polar pattern to stereo.
        try frontStereo.setPreferredPolarPattern(.stereo)
      }
      
      // Set the preferred data source and polar pattern.
      try preferredInput.setPreferredDataSource(frontStereo)
      
      // Update the input orientation to match the current user interface orientation.
      try audioSession.setPreferredInputOrientation(.portrait)
      
    } catch {
      fatalError("Unable to select the \(frontStereo.dataSourceName) data source.")
    }
  }
}

