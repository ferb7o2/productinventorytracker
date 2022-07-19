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
