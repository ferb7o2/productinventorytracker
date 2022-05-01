/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOurBusinessInfo = /* GraphQL */ `
  mutation CreateOurBusinessInfo(
    $input: CreateOurBusinessInfoInput!
    $condition: ModelOurBusinessInfoConditionInput
  ) {
    createOurBusinessInfo(input: $input, condition: $condition) {
      id
      name
      address
      rfc
      city
      state
      zipCode
      createdAt
      updatedAt
    }
  }
`;
export const updateOurBusinessInfo = /* GraphQL */ `
  mutation UpdateOurBusinessInfo(
    $input: UpdateOurBusinessInfoInput!
    $condition: ModelOurBusinessInfoConditionInput
  ) {
    updateOurBusinessInfo(input: $input, condition: $condition) {
      id
      name
      address
      rfc
      city
      state
      zipCode
      createdAt
      updatedAt
    }
  }
`;
export const deleteOurBusinessInfo = /* GraphQL */ `
  mutation DeleteOurBusinessInfo(
    $input: DeleteOurBusinessInfoInput!
    $condition: ModelOurBusinessInfoConditionInput
  ) {
    deleteOurBusinessInfo(input: $input, condition: $condition) {
      id
      name
      address
      rfc
      city
      state
      zipCode
      createdAt
      updatedAt
    }
  }
`;
export const createProductData = /* GraphQL */ `
  mutation CreateProductData(
    $input: CreateProductDataInput!
    $condition: ModelProductDataConditionInput
  ) {
    createProductData(input: $input, condition: $condition) {
      id
      name
      description
      weightType
      createdAt
      updatedAt
    }
  }
`;
export const updateProductData = /* GraphQL */ `
  mutation UpdateProductData(
    $input: UpdateProductDataInput!
    $condition: ModelProductDataConditionInput
  ) {
    updateProductData(input: $input, condition: $condition) {
      id
      name
      description
      weightType
      createdAt
      updatedAt
    }
  }
`;
export const deleteProductData = /* GraphQL */ `
  mutation DeleteProductData(
    $input: DeleteProductDataInput!
    $condition: ModelProductDataConditionInput
  ) {
    deleteProductData(input: $input, condition: $condition) {
      id
      name
      description
      weightType
      createdAt
      updatedAt
    }
  }
`;
export const createPurchaseTransactionData2022 = /* GraphQL */ `
  mutation CreatePurchaseTransactionData2022(
    $input: CreatePurchaseTransactionData2022Input!
    $condition: ModelPurchaseTransactionData2022ConditionInput
  ) {
    createPurchaseTransactionData2022(input: $input, condition: $condition) {
      id
      pId
      date
      vId
      purchaseInvoiceId
      purchaseWeight
      purchasePrice
      createdAt
      updatedAt
    }
  }
`;
export const updatePurchaseTransactionData2022 = /* GraphQL */ `
  mutation UpdatePurchaseTransactionData2022(
    $input: UpdatePurchaseTransactionData2022Input!
    $condition: ModelPurchaseTransactionData2022ConditionInput
  ) {
    updatePurchaseTransactionData2022(input: $input, condition: $condition) {
      id
      pId
      date
      vId
      purchaseInvoiceId
      purchaseWeight
      purchasePrice
      createdAt
      updatedAt
    }
  }
`;
export const deletePurchaseTransactionData2022 = /* GraphQL */ `
  mutation DeletePurchaseTransactionData2022(
    $input: DeletePurchaseTransactionData2022Input!
    $condition: ModelPurchaseTransactionData2022ConditionInput
  ) {
    deletePurchaseTransactionData2022(input: $input, condition: $condition) {
      id
      pId
      date
      vId
      purchaseInvoiceId
      purchaseWeight
      purchasePrice
      createdAt
      updatedAt
    }
  }
`;
export const createSaleTransactionData2022 = /* GraphQL */ `
  mutation CreateSaleTransactionData2022(
    $input: CreateSaleTransactionData2022Input!
    $condition: ModelSaleTransactionData2022ConditionInput
  ) {
    createSaleTransactionData2022(input: $input, condition: $condition) {
      id
      pId
      date
      saleInvoiceId
      saleWeight
      salePrice
      createdAt
      updatedAt
    }
  }
`;
export const updateSaleTransactionData2022 = /* GraphQL */ `
  mutation UpdateSaleTransactionData2022(
    $input: UpdateSaleTransactionData2022Input!
    $condition: ModelSaleTransactionData2022ConditionInput
  ) {
    updateSaleTransactionData2022(input: $input, condition: $condition) {
      id
      pId
      date
      saleInvoiceId
      saleWeight
      salePrice
      createdAt
      updatedAt
    }
  }
`;
export const deleteSaleTransactionData2022 = /* GraphQL */ `
  mutation DeleteSaleTransactionData2022(
    $input: DeleteSaleTransactionData2022Input!
    $condition: ModelSaleTransactionData2022ConditionInput
  ) {
    deleteSaleTransactionData2022(input: $input, condition: $condition) {
      id
      pId
      date
      saleInvoiceId
      saleWeight
      salePrice
      createdAt
      updatedAt
    }
  }
`;
export const createVendorData = /* GraphQL */ `
  mutation CreateVendorData(
    $input: CreateVendorDataInput!
    $condition: ModelVendorDataConditionInput
  ) {
    createVendorData(input: $input, condition: $condition) {
      id
      name
      rfc
      address
      city
      state
      country
      zipCode
      createdAt
      updatedAt
    }
  }
`;
export const updateVendorData = /* GraphQL */ `
  mutation UpdateVendorData(
    $input: UpdateVendorDataInput!
    $condition: ModelVendorDataConditionInput
  ) {
    updateVendorData(input: $input, condition: $condition) {
      id
      name
      rfc
      address
      city
      state
      country
      zipCode
      createdAt
      updatedAt
    }
  }
`;
export const deleteVendorData = /* GraphQL */ `
  mutation DeleteVendorData(
    $input: DeleteVendorDataInput!
    $condition: ModelVendorDataConditionInput
  ) {
    deleteVendorData(input: $input, condition: $condition) {
      id
      name
      rfc
      address
      city
      state
      country
      zipCode
      createdAt
      updatedAt
    }
  }
`;
