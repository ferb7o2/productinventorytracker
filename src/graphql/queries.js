/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOurBusinessInfo = /* GraphQL */ `
	query GetOurBusinessInfo($id: ID!) {
		getOurBusinessInfo(id: $id) {
			id
			name
			address
			rfc
			city
			state
			zipCode
		}
	}
`;
export const listOurBusinessInfos = /* GraphQL */ `
	query ListOurBusinessInfos(
		$filter: ModelOurBusinessInfoFilterInput
		$limit: Int
		$nextToken: String
	) {
		listOurBusinessInfos(
			filter: $filter
			limit: $limit
			nextToken: $nextToken
		) {
			items {
				id
				name
				address
				rfc
				city
				state
				zipCode
			}
			nextToken
		}
	}
`;
export const getProductData = /* GraphQL */ `
	query GetProductData($id: ID!) {
		getProductData(id: $id) {
			id
			name
			description
			weightType
			weightQuantity
		}
	}
`;
export const listProductData = /* GraphQL */ `
	query ListProductData(
		$filter: ModelProductDataFilterInput
		$limit: Int = 99999
		$nextToken: String
	) {
		listProductData(filter: $filter, limit: $limit, nextToken: $nextToken) {
			items {
				id
				name
				description
				weightType
				weightQuantity
			}
			nextToken
		}
	}
`;
export const getPurchaseTransactionData2022 = /* GraphQL */ `
	query GetPurchaseTransactionData2022($id: ID!) {
		getPurchaseTransactionData2022(id: $id) {
			id
			pId
			date
			vId
			purchaseInvoiceId
			purchaseWeight
			purchasePrice
		}
	}
`;
export const listPurchaseTransactionData2022s = /* GraphQL */ `
	query ListPurchaseTransactionData2022s($pId: String) {
		listPurchaseTransactionData2022s(
			limit: 999999
			filter: { pId: { eq: $pId } }
		) {
			nextToken
			items {
				date
				id
				pId
				purchaseInvoiceId
				purchasePrice
				purchaseWeight
				vId
			}
		}
	}
`;
export const getSaleTransactionData2022 = /* GraphQL */ `
	query GetSaleTransactionData2022($id: ID!) {
		getSaleTransactionData2022(id: $id) {
			id
			pId
			date
			saleInvoiceId
			saleWeight
			salePrice
		}
	}
`;
export const listSaleTransactionData2022s = /* GraphQL */ `
	query ListSaleTransactionData2022s($pId: String!) {
		listSaleTransactionData2022s(
			limit: 9999999
			filter: { pId: { eq: $pId } }
		) {
			items {
				date
				id
				pId
				saleInvoiceId
				salePrice
				saleWeight
			}
		}
	}
`;
export const getVendorData = /* GraphQL */ `
	query GetVendorData($id: ID!) {
		getVendorData(id: $id) {
			id
			name
			rfc
			address
			city
			state
			country
			zipCode
		}
	}
`;
export const listVendorData = /* GraphQL */ `
	query ListVendorData(
		$filter: ModelVendorDataFilterInput
		$limit: Int = 99999999
		$nextToken: String
	) {
		listVendorData(filter: $filter, limit: $limit, nextToken: $nextToken) {
			items {
				id
				name
				rfc
				address
				city
				state
				country
				zipCode
			}
			nextToken
		}
	}
`;
