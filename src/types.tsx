export type ProductDataType = {
	id: string;
	name: string;
	description?: string | null;
	weightType: string;
	weightQty: number;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type VendorDataType = {
	rowNum: number;
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
	productId: string;
	date: string;
	vendorId: string;
	invoiceId: string;
	qty: number;
	price: number;
	pName?: string;
	vName?: string;
};

export type StransactionDataType = {
	id: string;
	productId: string;
	date: string;
	invoiceId: string;
	qty: number;
	price: number;
};

export type toDeleteType = {
	pId: string;
	pName: string;
};

export type toDeleteVendorType = {
	vId: string;
	vName: string;
};

export const allowedWeightTypes = ["Kg", "Caja", "Bulto"];

export type toDeleteSaleType = {
	sId: string;
	sDate: string;
	sInvoiceId: string;
};

export type toDeletePurchaseType = {
	pId: string;
	pDate: string;
	pInvoiceId: string;
};
