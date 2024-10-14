//
//  NoicePurchaseManager.swift
//  MobilePlatform
//
//  Created by Tobias Helsing on 22.8.2024.
//

import Foundation
import StoreKit

@available(iOS 15.0, *)
typealias Transaction = StoreKit.Transaction

@available(iOS 15.0, *)
public enum StoreError: Error {
  case failedVerification
}

@available(iOS 15.0, *)
public enum PurchaseResult: String {
  case complete = "COMPLETE"
  case userCancelled = "USER_CANCELLED"
  case pending = "PENDING"
  case failed = "FAILED"
}

@available(iOS 15.0, *)
class NoicePurchaseManager {
  static let shared = NoicePurchaseManager()
  
  var updateListenerTask: Task<Void, Error>? = nil
  var allProducts: [Product] = []
  
  init() {
    updateListenerTask = listenForTransactions()
  }
  
  deinit {
    updateListenerTask?.cancel()
  }
  
  func getProductTypeToString(type: Product.ProductType) -> String {
    switch (type) {
    case .autoRenewable:
      return "AUTO_RENEWABLE"
    case .consumable:
      return "CONSUMABLE"
    case .nonConsumable:
      return "NON_CONSUMABLE"
    case .nonRenewable:
      return "NON_RENEWABLE"
    default:
      return "UNKNOWN"
    }
  }
  
  func getProducts(_ productIdentifiers: [String]) async throws -> [[String: Any]] {
    allProducts = try await Product.products(for: productIdentifiers);
    
    let sortedProducts = sortByPrice(allProducts)
    
    let productsFormatted = sortedProducts.map { product in
      let productDict: [String: Any] = [
        "id": product.id,
        "description": product.description,
        "displayName": product.displayName,
        "isFamilyShareable": product.isFamilyShareable,
        "displayPrice": product.displayPrice,
        "price": product.price,
        "type": getProductTypeToString(type: product.type),
      ]
      
      return productDict
    }
    
    return productsFormatted
  }
  
  func purchase(_ productId: String, token: String) async throws -> PurchaseResult? {
    guard let product = allProducts.first(where: { $0.id == productId }) else {
      return .failed;
    }
    
    guard let appAccountTokenUUID = UUID(uuidString: token) else {
      return .failed;
    }
    
    let result = try await product.purchase(options: [.appAccountToken(appAccountTokenUUID)])
    
    switch result {
    case .success(let verification):
      let transactions = try checkVerified(verification)
      await transactions.finish()
      return .complete
    case .userCancelled:
      return .userCancelled
    case .pending:
      return .pending
    default:
      return nil
    }
  }
  
  func listenForTransactions() -> Task<Void, Error> {
    return Task.detached {
      for await result in Transaction.updates {
        do {
          let transaction = try self.checkVerified(result)
          
          // TODO: Listen to pending transactions
          
          await transaction.finish()
        } catch {
          print("[NoicePurchaseManager]: Transaction failed verification.")
        }
      }
    }
  }
  
  func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
    switch result {
    case .unverified:
      throw StoreError.failedVerification
    case .verified(let safe):
      return safe
    }
  }
  
  func sortByPrice(_ products: [Product]) -> [Product] {
    return products.sorted(by: { return $0.price < $1.price })
  }
  
}
