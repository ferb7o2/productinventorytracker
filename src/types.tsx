export type ProductDataType = {
	id: string;
	name: string;
	description?: string | null;
	weightType: string;
	weightQuantity: number;
};

export type VendorDataType = {
	id: string;
	name: string;
	rfc?: string;
	address?: string;
	city?: string;
	state?: string;
	country?: string;
	zipCode?: string;
};

export type urlPropType = {
	pId?: string;
	vId?: string;
};

export type urlPropVendorType = {
	vId_global: string;
};

export type PtransactionDataType = {
	id: string;
	pId: string;
	date: string;
	vId: string;
	purchaseInvoiceId: string;
	purchaseWeight: number;
	purchasePrice: number;
};

export type StransactionDataType = {
	id: string;
	pId: string;
	date: string;
	saleInvoiceId: string;
	saleWeight: number;
	salePrice: number;
};

export type toDeleteType = {
	pId: string;
	pName: string;
};
