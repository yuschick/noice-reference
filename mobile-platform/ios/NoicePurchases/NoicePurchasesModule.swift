//
//  NoicePurchasesModule.swift
//  MobilePlatform
//
//  Created by Tobias Helsing on 22.8.2024.
//

import Foundation

@objc(NoicePurchasesModule)
class NoicePurchasesModule : NSObject {
  
  let iosVersionNotSupportedError = NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey : "Not supported on this version of iOS"])
  
  @objc(getProducts:resolver:rejecter:)
  func getProducts(_ productIdentifiers: [String], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 15.0, *) {
      Task {
        do {
          let products = try await NoicePurchaseManager.shared.getProducts(productIdentifiers)
          resolver(products)
        } catch {
          rejecter("GET_PRODUCT_ERROR", "Failed to fetch products from AppStore", error)
        }
      }
    } else {
      rejecter("GET_PRODUCT_ERROR", "This method is not supported on this version of iOS", iosVersionNotSupportedError)
    }
  }
  
  @objc(purchaseProduct:tokenId:resolver:rejecter:)
  func purchaseProduct(_ productId: String, tokenId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    if #available(iOS 15.0, *) {
      Task {
        do {
          let result = try await NoicePurchaseManager.shared.purchase(productId, token: tokenId)
          resolver(result?.rawValue)
        } catch {
          print(error);
          rejecter("PURCHASE_PRODUCT_ERROR", "Failed to purchase product", error)
        }
      }
    } else {
      rejecter("PURCHASE_PRODUCT_ERROR", "This method is not supported on this version of iOS", iosVersionNotSupportedError)
    }
  }
  
}
