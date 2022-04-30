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
      createdAt
      updatedAt
    }
  }
`;
