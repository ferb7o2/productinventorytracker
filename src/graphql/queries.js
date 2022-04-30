/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOurBusinessInfo = /* GraphQL */ `
	query GetOurBusinessInfo($id: ID!) {
		getOurBusinessInfo(id: $id) {
			id
			name
			address
			rfc
			createdAt
			updatedAt
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
			}
			nextToken
		}
	}
`;
