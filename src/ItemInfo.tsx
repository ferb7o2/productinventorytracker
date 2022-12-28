import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; //Helps us redirect to other pages

import $ from "jquery";

//get Date
import * as moment from "moment";

import { API, graphqlOperation } from "aws-amplify";
import {
	getProductData,
	listPurchaseTransactionData2022s,
	listSaleTransactionData2022s,
	listVendorData,
} from "./graphql/queries";
import {
	createPurchaseTransactionData2022,
	createSaleTransactionData2022,
	updateProductData,
	updatePurchaseTransactionData2022,
	updateSaleTransactionData2022,
} from "./graphql/mutations";

//Types
import {
	urlPropType,
	ProductDataType,
	VendorDataType,
	PtransactionDataType,
	StransactionDataType,
	toDeleteSaleType,
	toDeletePurchaseType,
} from "./types";
import { DeleteTransaction } from "./components/DeleteTransaction";

function ItemInfo() {
	let { pId } = useParams<urlPropType>();

	const [ProductData, setProductData] = useState<ProductDataType>();
	const [Ptransaction_data, setPtData] = useState<PtransactionDataType[]>([]);
	const [VendorData, setVendorData] = useState<VendorDataType[]>([]);
	const [InventoryTotal, setInventoryTotal] = useState<number>(0);
	const [Stransaction_data, setStData] = useState<StransactionDataType[]>([]);
	const [DataLoaded, setDataLoaded] = useState<boolean>(false);
	const [toDeleteSale, setToDeleteSale] = useState<toDeleteSaleType[]>([]);
	const [toDeletePurchase, setToDeletePurchase] = useState<
		toDeletePurchaseType[]
	>([]);

	const fetchProductInfo = async () => {
		try {
			const productData = (await API.graphql(
				graphqlOperation(getProductData, { id: pId })
			)) as { data: { getProductData: ProductDataType } };

			setProductData(productData.data.getProductData);
			setDataLoaded(true);
		} catch (error) {
			console.log("error on fetchMainBusinessInfo() ", error);
		}
	};

	const fetchPTransactionData = async () => {
		try {
			const pTransactionData = (await API.graphql(
				graphqlOperation(listPurchaseTransactionData2022s, { pId: pId })
			)) as {
				data: {
					listPurchaseTransactionData2022s: { items: PtransactionDataType[] };
				};
			};

			let only_data =
				pTransactionData.data.listPurchaseTransactionData2022s.items.sort(
					(a, b) => a.date.localeCompare(b.date)
				);

			//console.log(pTransactionData.data.listPurchaseTransactionData2022s.items);
			setPtData(only_data);
		} catch (error) {
			console.log("error on fetchPTransactionData() ", error);
			window.alert("ERROR: error al cargar COMPRAS de la base de datos");
		}
	};

	const fetchVendorData = async () => {
		try {
			const vendorData = (await API.graphql(
				graphqlOperation(listVendorData)
			)) as { data: { listVendorData: { items: VendorDataType[] } } };

			//console.log(vendorData.data.listVendorData.items);
			setVendorData(vendorData.data.listVendorData.items);
		} catch (error) {
			console.log("error on fetchVendorData() ", error);

			window.alert("ERROR: error al cargar DISTRIBUIDORES de la base de datos");
		}
	};

	const fetchSaleTData = async () => {
		try {
			const saleData = (await API.graphql(
				graphqlOperation(listSaleTransactionData2022s, { pId: pId })
			)) as {
				data: {
					listSaleTransactionData2022s: { items: StransactionDataType[] };
				};
			};

			let only_data = saleData.data.listSaleTransactionData2022s.items.sort(
				(a, b) => a.date.localeCompare(b.date)
			);

			setStData(only_data);
		} catch (error) {
			console.log("error on fetchVendorData() ", error);
			window.alert("ERROR: error al cargar VENTAS de la base de datos");
		}
	};

	useEffect(() => {
		fetchProductInfo();
		fetchPTransactionData();
		fetchVendorData();
		fetchSaleTData();
		$("#vendorTabBtn").removeClass("nav-selected");
		$("#productTabBtn").addClass("nav-selected");
	}, []);

	let realIndex = 0;

	useEffect(() => {
		function InventoryTotalSum() {
			setInventoryTotal(0);
			for (let i = 0; i < Ptransaction_data.length; i++) {
				setInventoryTotal(
					(prevState) => prevState + Ptransaction_data[i].purchaseWeight
				);
			}

			for (let i = 0; i < Stransaction_data.length; i++) {
				setInventoryTotal(
					(prevState) => prevState - Stransaction_data[i].saleWeight
				);
			}
		}

		InventoryTotalSum();
	}, [Ptransaction_data, Stransaction_data]);

	useEffect(() => {
		if (DataLoaded) {
			checkForMissingInfo();
		}
	}, [DataLoaded]);

	useEffect(() => {
		checkForMissingInfo();
	}, [ProductData]);

	function displayPURCHASEInputFields() {
		$("#input-row-vId").val("");
		//Delete all data on fields just incase it is already filled

		$("#input-row-vId").val("");
		$("#input-row-purchaseInvoiceId").val("");
		$("#input-row-purchaseWeight").val("");
		$("#input-row-purchasePrice").val("");

		$("#btnUpdate").removeAttr("hidden");
		$("#input-new-data-row").removeAttr("hidden");
	}

	function displaySALEInputFields() {
		$("#input-row-sId").val("");
		$("#input-row-saleInvoiceId").val("");
		$("#input-row-saleWeight").val("");

		$("#input-new-data-row-sale").removeAttr("hidden");
		$("#btnSaleUpdate").removeAttr("hidden");
	}

	const isNumber = new RegExp("^[0-9]*.[0-9]*");

	function isNotEmpty(parameter: any) {
		//Guaranteed that the element will be there, as it is generated based on real data
		if (typeof parameter === "undefined") {
			throw new Error(
				`Expected element, ERROR on isNotEmpty() parameter is undefined`
			);
		}

		if (parameter.val().length !== 0) return true;
		else return false;
	}

	const addNewSALEDataRow = async () => {
		//Make a pointer of that Error Template HTML tag since we will be using it alot
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		if (isNotEmpty($("#input-row-saleInvoiceId"))) {
			if (
				isNotEmpty($("#input-row-saleWeight")) &&
				isNumber.test(
					$("#input-row-saleWeight").val()?.toString() || "false"
				) &&
				($("#input-row-saleWeight").val() || -1) > 0
			) {
				if (
					isNotEmpty($("#input-row-salePrice")) &&
					isNumber.test(
						$("#input-row-salePrice").val()?.toString() || "false"
					) &&
					($("#input-row-salePrice").val() || -1) > 0
				) {
					try {
						const result = (await API.graphql(
							graphqlOperation(createSaleTransactionData2022, {
								input: {
									pId: pId,
									date: $("#input-row-sale-date").val(),
									saleInvoiceId: $("#input-row-saleInvoiceId").val(),
									saleWeight: $("#input-row-saleWeight").val(),
									salePrice: $("#input-row-salePrice").val(),
								},
							})
						)) as {
							data: {
								createSaleTransactionData2022: StransactionDataType;
							};
						};

						setStData([
							...Stransaction_data,
							result.data.createSaleTransactionData2022,
						]);
					} catch (error) {
						console.log("ERROR Adding into SaleTransaction DB -> ", error);
					}

					$("#input-new-data-row-sale").attr("hidden", 1);
					$("#btnSaleUpdate").attr("hidden", 1);
				} else {
					errorTemplate.text(
						"Error - El precio de el producto no puede estar vacío / debe de ser un número válido"
					);
					errorTemplate.removeAttr("hidden");
				}
			} else {
				errorTemplate.text(
					"Error - El peso de el producto no puede estar vacío / debe de ser un número válido"
				);
				errorTemplate.removeAttr("hidden");
			}
		} else {
			errorTemplate.text(
				"Error - El numero de Invoice de el producto no puede estar vacío"
			);
			errorTemplate.removeAttr("hidden");
		}
	};

	const addNewPURCHASEDataRow = async () => {
		//Make a pointer of that Error Template HTML tag since we will be using it alot
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden
		let vendorId = "error";
		vendorId = idForName($("#input-row-vId").val());

		//-------->Check for valid [non-empty] PURCHASE info data
		//------------->Display proper error messages if failed check
		if (isNotEmpty($("#input-row-vId")) && vendorId !== "error") {
			//Convert to proper db data

			//If non-empty
			if (isNotEmpty($("#input-row-purchaseInvoiceId"))) {
				if (
					isNotEmpty($("#input-row-purchaseWeight")) &&
					isNumber.test(
						$("#input-row-purchaseWeight").val()?.toString() || "false"
					) &&
					($("#input-row-purchaseWeight").val() || -1) > 0
				) {
					if (
						isNotEmpty($("#input-row-purchasePrice")) &&
						isNumber.test(
							$("#input-row-purchasePrice").val()?.toString() || "false"
						) &&
						($("#input-row-purchasePrice").val() || -1) > 0
					) {
						//then all data is valid, we can add into array

						try {
							const result = (await API.graphql(
								graphqlOperation(createPurchaseTransactionData2022, {
									input: {
										pId: pId,
										date: $("#input-row-date").val(),
										vId: vendorId,
										purchaseInvoiceId: $("#input-row-purchaseInvoiceId").val(),
										purchaseWeight: $("#input-row-purchaseWeight").val(),
										purchasePrice: $("#input-row-purchasePrice").val(),
									},
								})
							)) as {
								data: {
									createPurchaseTransactionData2022: PtransactionDataType;
								};
							};

							setPtData([
								...Ptransaction_data,
								result.data.createPurchaseTransactionData2022,
							]);
						} catch (error) {
							console.log(
								"ERROR Adding into PurchaseTransaction DB -> ",
								error
							);
						}

						$("#input-new-data-row").attr("hidden", 1);
						$("#btnUpdate").attr("hidden", 1);
					} else {
						//else, it is empty; Display correct error message to inform user
						errorTemplate.text(
							"Error - El precio de el producto no puede estar vacío / debe de ser un número válido"
						);
						errorTemplate.removeAttr("hidden");
					}
				} else {
					errorTemplate.text(
						"Error - El peso de el producto no puede estar vacío / debe de ser un número válido"
					);
					errorTemplate.removeAttr("hidden");
				}
			} else {
				errorTemplate.text("Error - El numero de factura no puede estar vacío");
				errorTemplate.removeAttr("hidden");
			}
		} else {
			errorTemplate.text(
				"Error - el recuadro del proveedor no puede estar vacío / debe ser un nombre valido"
			);
			errorTemplate.removeAttr("hidden");
		}
	};

	function nameForId(vIdPassed: string) {
		if (VendorData.length != 0) {
			return VendorData.find(({ id }, i) => vIdPassed === id)?.name;
		} else return "";
	}

	function idForName(
		vNamePassed: string | number | string[] | null | undefined
	) {
		if (vNamePassed != null) {
			const vendor = VendorData.find(({ name }, i) => vNamePassed == name);
			if (vendor != undefined) return vendor.id;
		}
		return "error";
	}

	const changeInvoiceId = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: string,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden
		let newVal = e.target.value;
		if (newVal === lastValue) return;
		try {
			const changeInvoiceId = await API.graphql(
				graphqlOperation(updatePurchaseTransactionData2022, {
					input: { id: toChangeId, purchaseInvoiceId: newVal },
				})
			);
			setPtData(
				Ptransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.pId,
								date: val.date,
								vId: val.vId,
								purchaseInvoiceId: newVal,
								purchaseWeight: val.purchaseWeight,
								purchasePrice: val.purchasePrice,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar el numero de Invoice");
			errorTemplate.removeAttr("hidden");
		}
	};

	function focusOut(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.keyCode === 13 || e.keyCode === 9) {
			$("#" + $(e.target).attr("id")).prop("disabled", true);
			$("#" + $(e.target).attr("id")).prop("disabled", false); //lose focus out of the textbox
		}
	}

	const changePurchaseWeight = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: number,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = parseFloat(e.target.value.replace(",", ""));
			if (isNaN(newVal)) throw new Error("No valid value");
			if (newVal == lastValue) return;
			const changeInvoiceId = await API.graphql(
				graphqlOperation(updatePurchaseTransactionData2022, {
					input: { id: toChangeId, purchaseWeight: newVal },
				})
			);
			setPtData(
				Ptransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.pId,
								date: val.date,
								vId: val.vId,
								purchaseInvoiceId: val.purchaseInvoiceId,
								purchaseWeight: newVal,
								purchasePrice: val.purchasePrice,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar el Peso");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changePurchasePrice = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: number,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = parseFloat(e.target.value.replace(",", ""));
			if (newVal == lastValue) return;
			if (isNaN(newVal)) throw new Error("No valid value");
			const changeInvoiceId = await API.graphql(
				graphqlOperation(updatePurchaseTransactionData2022, {
					input: { id: toChangeId, purchasePrice: newVal },
				})
			);
			setPtData(
				Ptransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.pId,
								date: val.date,
								vId: val.vId,
								purchaseInvoiceId: val.purchaseInvoiceId,
								purchaseWeight: val.purchaseWeight,
								purchasePrice: newVal,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar el Precio");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changePurchaseDate = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: string,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = e.target.value;
			if (newVal === lastValue) return;
			const changeInvoiceId = await API.graphql(
				graphqlOperation(updatePurchaseTransactionData2022, {
					input: { id: toChangeId, date: newVal },
				})
			);
			setPtData(
				Ptransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.pId,
								date: newVal,
								vId: val.vId,
								purchaseInvoiceId: val.purchaseInvoiceId,
								purchaseWeight: val.purchaseWeight,
								purchasePrice: val.purchasePrice,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar la fecha");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeVendor = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: string,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = idForName(e.target.value);
			if (newVal === lastValue || newVal === "error") {
				errorTemplate.text("Error - proveedor no registrado");
				errorTemplate.removeAttr("hidden");
				return;
			}
			const changeInvoiceId = await API.graphql(
				graphqlOperation(updatePurchaseTransactionData2022, {
					input: { id: toChangeId, vId: newVal },
				})
			);
			setPtData(
				Ptransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.id,
								date: val.date,
								vId: newVal,
								purchaseInvoiceId: val.purchaseInvoiceId,
								purchaseWeight: val.purchaseWeight,
								purchasePrice: val.purchasePrice,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar el proveedor");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeSaleDate = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: string,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden
		let newVal = e.target.value;
		if (newVal === lastValue) return;
		try {
			const changeSaleDate = await API.graphql(
				graphqlOperation(updateSaleTransactionData2022, {
					input: { id: toChangeId, date: newVal },
				})
			);
			setStData(
				Stransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.pId,
								date: newVal,
								saleInvoiceId: val.saleInvoiceId,
								saleWeight: val.saleWeight,
								salePrice: val.salePrice,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar la fecha de venta");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeSaleInvoiceId = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: string,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden
		let newVal = e.target.value;
		if (newVal === lastValue) return;
		try {
			const changeSaleInvoice = await API.graphql(
				graphqlOperation(updateSaleTransactionData2022, {
					input: { id: toChangeId, saleInvoiceId: newVal },
				})
			);
			setStData(
				Stransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.pId,
								date: val.date,
								saleInvoiceId: newVal,
								saleWeight: val.saleWeight,
								salePrice: val.salePrice,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar el numero de Invoice de venta");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeSaleWeight = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: number,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = parseFloat(e.target.value.replace(",", ""));
			if (newVal === lastValue) return;

			const changeSaleWeight = await API.graphql(
				graphqlOperation(updateSaleTransactionData2022, {
					input: { id: toChangeId, saleWeight: newVal },
				})
			);
			setStData(
				Stransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.pId,
								date: val.date,
								saleInvoiceId: val.saleInvoiceId,
								saleWeight: newVal,
								salePrice: val.salePrice,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar el peso de venta");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeSalePrice = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: number,
		toChangeId: string
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = parseFloat(e.target.value.replace(",", ""));
			if (newVal === lastValue) return;

			const changeSaleWeight = await API.graphql(
				graphqlOperation(updateSaleTransactionData2022, {
					input: { id: toChangeId, salePrice: newVal },
				})
			);
			setStData(
				Stransaction_data.map((val, i) =>
					val.id === toChangeId
						? {
								id: val.id,
								pId: val.pId,
								date: val.date,
								saleInvoiceId: val.saleInvoiceId,
								saleWeight: val.saleWeight,
								salePrice: newVal,
						  }
						: val
				)
			);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar el precio de venta");
			errorTemplate.removeAttr("hidden");
		}
	};

	const editBtnTrigger = () => {
		$("#productTitle").removeAttr("readOnly");

		$("#productDescription").removeAttr("readOnly");
		$(".editable-input").css("border", "1px rgb(54, 54, 54, 0.6) solid");
		$(".editable-input").css("border-radius", "4px");
		$("#saveBtnProduct").removeAttr("hidden");
		$("#productDescription").removeAttr("hidden");

		$("#pDescriptionRow").removeAttr("hidden");
	};

	const changeProductInfo = async () => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		if ($("#productTitle").val() != "") {
			if (
				$("#productTitle").val() == ProductData?.name &&
				$("#productDescription").val() == ProductData?.description
			)
				return;

			try {
				const changeProductName = (await API.graphql(
					graphqlOperation(updateProductData, {
						input: {
							id: ProductData?.id,
							name: $("#productTitle").val(),
							description: $("#productDescription").val(),
						},
					})
				)) as {
					data: {
						updateProductData: ProductDataType;
					};
				};
				console.log(changeProductName);
				setProductData(changeProductName.data.updateProductData);
			} catch (error) {
				console.log("error on changeTitle() ", error);
				errorTemplate.text("Error - al actualizar el Nombre del producto");
				errorTemplate.removeAttr("hidden");
			}
		} else {
			console.log("error on changeTitle(), title cannot e empty ");
			$("#productTitle").val(ProductData?.name || "");
			errorTemplate.text(
				"Error - al actualizar el Nombre del producto, el nombre no puede estar vacio"
			);
			errorTemplate.removeAttr("hidden");
		}
	};

	function saveTrigger() {
		changeProductInfo();
		$("#saveBtnProduct").attr("hidden", 1);
		$(".editable-input").css("border", "none");
		$(".editable-input").css("border-radius", "4px");
		$("#productTitle").attr("readOnly", 1);

		$("#productDescription").attr("readOnly", 1);
		if ($("#productDescription").val() == "")
			$("#productDescription").attr("hidden", 1);
	}

	function checkForMissingInfo() {
		if (!ProductData?.description || ProductData.description == "")
			$("#productDescription").attr("hidden", 1);
		else $("#productDescription").removeAttr("hidden");
	}

	function deleteTransactionBtnTrigger() {
		if (toDeleteSale.length + toDeletePurchase.length > 0) {
			$("#product-item-modal-delete").removeAttr("hidden");
		}
	}

	function addToDeleteArray(
		IdInput: string,
		dateInput: string,
		invoiceInput: string,
		type: string
	) {
		const currentChecked = document.getElementById(
			"tid-" + IdInput
		) as HTMLInputElement;

		if (type == "purchase") {
			if (currentChecked.checked) {
				var numberOfOcurrences = toDeletePurchase.filter(
					({ pId }) => pId == IdInput
				);
				if (numberOfOcurrences.length == 0) {
					setToDeletePurchase((oldData) => [
						...oldData,
						{ pId: IdInput, pDate: dateInput, pInvoiceId: invoiceInput },
					]);
				}
			} else {
				let filtered_array = toDeletePurchase.filter(
					({ pId }) => pId !== IdInput
				);
				setToDeletePurchase(filtered_array);
			}
			let display = toDeletePurchase;

			console.log(display);
		} else {
			if (currentChecked.checked) {
				var numberOfOcurrencesSale = toDeleteSale.filter(
					({ sId }) => sId == IdInput
				);
				if (numberOfOcurrencesSale.length == 0) {
					setToDeleteSale((oldData) => [
						...oldData,
						{ sId: IdInput, sDate: dateInput, sInvoiceId: invoiceInput },
					]);
				}
			} else {
				let filtered_arraySale = toDeleteSale.filter(
					({ sId }) => sId !== IdInput
				);
				setToDeleteSale(filtered_arraySale);
			}
			let display = toDeletePurchase;

			console.log(display);
		}
	}

	return (
		<>
			<div className="Application">
				<title>Facturación PJL - {ProductData?.name}</title>
				<DeleteTransaction
					purchase={toDeletePurchase}
					sale={toDeleteSale}
					currentItemId={pId || ""}
				/>

				<div className="container" id="container">
					<div className="container-top-section">
						<div className="container-top-first-row">
							<div className="vInfo-section">
								<div className="vInfo-row">
									<h1 className="container-title vendor-title edit-primary">
										<input
											type="text"
											id="productTitle"
											className="container-title vendor-title editable-input"
											defaultValue={ProductData?.name}
											onKeyDown={(e) => focusOut(e)}
											readOnly
										/>
									</h1>
								</div>

								<div className="vInfo-row" id="pDescriptionRow">
									<h4 className="product-description edit-primary">
										<input
											type="text"
											id="productDescription"
											className="product-description editable-input"
											defaultValue={
												ProductData?.description ? ProductData.description : ""
											}
											placeholder="Descripcion"
											onKeyDown={(e) => focusOut(e)}
											readOnly
										/>
									</h4>
								</div>
							</div>

							<div className="vendor-btn-container">
								<div className="title-button-container vendor-btn">
									<button
										type="button"
										className="btn secondary-btn"
										data-bs-toggle="button"
										id="btn"
										onClick={editBtnTrigger}
									>
										editar producto
									</button>
									<button
										type="button"
										className="btn "
										data-bs-toggle="button"
										id="deleteTransactionBtn"
										onClick={deleteTransactionBtnTrigger}
									>
										Borrar venta
									</button>
								</div>
								<button
									type="button"
									className="btn"
									data-bs-toggle="button"
									id="saveBtnProduct"
									onClick={saveTrigger}
									hidden
								>
									Guardar
								</button>
							</div>
						</div>

						<div className="product-third-row">
							<p className="product-id-subtitle">
								Product Id: {ProductData?.id}
							</p>
							<p className="product-qty-count">
								Cantidad disponible: {InventoryTotal.toFixed(3)}
							</p>
						</div>
						<div className="sub-section-container remove-top-pad">
							<div className="left-pad"></div>
							<div className="selected-under">
								<p className="sub-section-title sub-section-selected">
									See all
								</p>
							</div>
							<p className="sub-section-title ">Saved</p>
							<p className="sub-section-title">Ongoing</p>
							<p className="sub-section-title">Archived</p>
						</div>
					</div>
					<div
						className="alert alert-danger alert-body"
						role="alert"
						id="error-template"
						onClick={() => {
							$("#error-template").attr("hidden", 1);
						}}
						hidden
					>
						This is a danger alert—check it out!
					</div>
					<div className="row">
						<div className="col">
							<h4 className="item-table-label">Compra</h4>
						</div>
					</div>
					<div className="row">
						<table className="tble">
							<thead>
								<tr>
									<th
										scope="col"
										className="thead-row select-col select-vendor"
									>
										{/*<input type="checkbox" className="checkbox-table" />*/}
									</th>
									<th scope="col" className="thead-row date-col">
										Fecha
									</th>
									<th scope="col" className="thead-row vendor-col">
										Proveedor
									</th>
									<th scope="col" className="thead-row factura-col">
										# Factura
									</th>
									<th scope="col" className="thead-row weight-col">
										{ProductData?.weightType}
									</th>
									<th scope="col" className="thead-row price-col">
										Precio (MXN)
									</th>
									<th scope="col" className="thead-row pId-col">
										Id de transaccion
									</th>

									<th scope="col" className="thead-row notes-col">
										Notas
									</th>
								</tr>
							</thead>
							<tbody>
								{Ptransaction_data.map(
									(
										{
											id,
											date,
											vId,
											purchaseInvoiceId,
											purchaseWeight,
											purchasePrice,
										} //Data driven display of rows in data
									) => (
										<tr key={id} className="table-row">
											<td className="select-col select-vendor">
												<input
													type="checkbox"
													className="checkbox-table"
													id={"tid-" + id}
													onChange={() =>
														addToDeleteArray(
															id,
															date,
															purchaseInvoiceId,
															"purchase"
														)
													}
												/>
											</td>
											<td className="date-col">
												<input
													type="text"
													id={"row" + id + "date"}
													className="tableInput tableDate"
													defaultValue={date}
													onBlur={(e) => {
														changePurchaseDate(e, date, id);
													}}
													onKeyDown={(e) => focusOut(e)}
												/>
											</td>

											<td className="vendor-col">
												<input
													type="text"
													id={"row" + id + "vId"}
													className="tableInput vendor-input"
													defaultValue={nameForId(vId)}
													list="vendors"
													onBlur={(e) => {
														changeVendor(e, vId, id);
													}}
													onKeyDown={(e) => focusOut(e)}
												/>
												<datalist id="vendors">
													{VendorData.map(({ id, name }) => (
														<option key={id} value={name} id={id} />
													))}
												</datalist>
											</td>
											<td className="factura-col">
												<div className="tableData">
													<input
														type="text"
														id={"row" + id + "purchaseInvoiceId"}
														className="tableInput"
														defaultValue={purchaseInvoiceId}
														onBlur={(e) => {
															changeInvoiceId(e, purchaseInvoiceId, id);
														}}
														onKeyDown={(e) => focusOut(e)}
													/>
												</div>
											</td>
											<td className="weight-col">
												<div className="tableData">
													<input
														type="text"
														id={"row" + id + "purchaseWeight"}
														className="tableInput"
														defaultValue={purchaseWeight}
														onBlur={(e) => {
															changePurchaseWeight(e, purchaseWeight, id);
														}}
														onKeyDown={(e) => focusOut(e)}
													/>
												</div>
											</td>
											<td className="price-col">
												<div className="tableData">
													<input
														type="text"
														id={"row" + id + "purchasePrice"}
														className="tableInput"
														defaultValue={purchasePrice}
														onBlur={(e) => {
															changePurchasePrice(e, purchaseWeight, id);
														}}
														onKeyDown={(e) => focusOut(e)}
													/>
												</div>
											</td>
											<td className="pId-col id-col-data">{id}</td>
											<td className="notes-col">
												<img
													src={require("./assets/icons/blank-notes-attributed.png")}
												></img>
											</td>
										</tr>
									)
								)}
								<tr
									className="table-row input-new-data-row"
									id="input-new-data-row"
									hidden
								>
									<th scope="row"></th>
									<td>
										<input
											type="text"
											id="input-row-date"
											className="tableInput tableDate"
											defaultValue={moment.default().format("YYYY-MM-DD")}
										/>
									</td>
									<td>
										<input
											list="vendors"
											type="text"
											id="input-row-vId"
											className="tableInput"
										/>

										<datalist id="vendors">
											{VendorData.map(({ id, name }) => (
												<option key={id} value={name} id={id} />
											))}
										</datalist>
									</td>
									<td>
										<div className="tableData">
											<input
												type="text"
												id="input-row-purchaseInvoiceId"
												className="tableInput"
											/>
										</div>
									</td>
									<td>
										<div className="tableData">
											<input
												type="number"
												id="input-row-purchaseWeight"
												className="tableInput"
											/>
										</div>
									</td>
									<td>
										<div className="tableData">
											<input
												type="number"
												id="input-row-purchasePrice"
												className="tableInput"
											/>
										</div>
									</td>

									<td></td>
									<td></td>
								</tr>
								<tr hidden></tr>
								{/* just a hidden element to not break the color scheme on the next table row*/}
								<tr className="input-new-data-row">
									<td scope="row" className="select-col">
										<img
											src={require("./assets/icons/add-attributed.png")}
											id="add-data-btn"
											className=""
											onClick={displayPURCHASEInputFields}
											alt="add new purchase entry button"
										/>
									</td>
									<td className="table-filler"></td>
									<td className="table-filler"></td>
									<td className="table-filler"></td>
									<td className="table-filler"></td>
									<td className="table-filler"></td>
									<td className="btn-col">
										<button
											type="button"
											className="btn"
											id="btnUpdate"
											onClick={addNewPURCHASEDataRow}
											hidden
										>
											Actualizar
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="fair-spacing"></div>
					<div className="row">
						<div className="tble-title">
							<h4 className="item-table-label item-table-label-sale">Venta</h4>
						</div>
					</div>

					<div className="row">
						<table className="tble">
							<thead>
								<tr className="table-row">
									<th scope="col" className="thead-row select-col">
										{/*<input type="checkbox" className="checkbox-table" />*/}
									</th>
									<th scope="col" className="thead-row sale-date-col">
										Fecha
									</th>
									<th scope="col" className="thead-row sale-invoice-col">
										# Invoice
									</th>
									<th scope="col" className="thead-row sale-weight-col">
										{ProductData?.weightType}
									</th>
									<th scope="col" className="thead-row sale-price-col">
										Precio (MXN)
									</th>
									<th scope="col" className="head-row pId-col">
										Id de transaccion
									</th>
									<th scope="col" className="thead-row notes-col">
										Notas
									</th>
								</tr>
							</thead>
							<tbody>
								{Stransaction_data.map(
									(
										{ id, pId, date, saleInvoiceId, saleWeight, salePrice } //Data driven display of rows in data
									) => (
										<tr key={"s" + id} className="table-row">
											<td scope="col" className="select-col">
												<input
													type="checkbox"
													className="checkbox-table"
													id={"tid-" + id}
													onChange={() =>
														addToDeleteArray(id, date, saleInvoiceId, "sale")
													}
												/>
											</td>
											<td className="sale-date-col" scope="col">
												<input
													type="text"
													id={"row" + id + "Sdate"}
													className="tableInput"
													defaultValue={date}
													onBlur={(e) => {
														changeSaleDate(e, date, id);
													}}
													onKeyDown={(e) => focusOut(e)}
												/>
											</td>

											<td className="sale-invoice-col" scope="col">
												<input
													type="text"
													id={"row" + id + "saleInvoiceId"}
													className="tableInput vendor-col"
													defaultValue={saleInvoiceId}
													onBlur={(e) => {
														changeSaleInvoiceId(e, saleInvoiceId, id);
													}}
													onKeyDown={(e) => focusOut(e)}
												/>
											</td>
											<td className="sale-weight-col" scope="col">
												<input
													type="text"
													id={"row" + id + "saleWeight"}
													className="tableInput"
													defaultValue={saleWeight}
													onBlur={(e) => {
														changeSaleWeight(e, saleWeight, id);
													}}
													onKeyDown={(e) => focusOut(e)}
												/>
											</td>
											<td className="sale-price-col" scope="col">
												<input
													type="text"
													id={"row" + id + "salePrice"}
													className="tableInput vendor-col"
													defaultValue={salePrice}
													onBlur={(e) => {
														changeSalePrice(e, salePrice, id);
													}}
													onKeyDown={(e) => focusOut(e)}
												/>
											</td>
											<td className="pId-col id-col-data" scope="col">
												{id}
											</td>
											<td className="notes-col" scope="col">
												<img
													src={require("./assets/icons/blank-notes-attributed.png")}
												/>
											</td>
										</tr>
									)
								)}
								<tr
									className="table-row input-new-data-row"
									id="input-new-data-row-sale"
									hidden
								>
									<th scope="row"></th>
									<td>
										<input
											type="text"
											id="input-row-sale-date"
											className="tableInput"
											defaultValue={moment.default().format("YYYY-MM-DD")}
										/>
									</td>
									<td>
										<input
											type="text"
											id="input-row-saleInvoiceId"
											className="tableInput"
										/>
									</td>
									<td>
										<div className="tableData">
											<input
												type="number"
												id="input-row-saleWeight"
												className="tableInput"
											/>
										</div>
									</td>
									<td>
										<div className="tableData">
											<input
												type="text"
												id="input-row-salePrice"
												className="tableInput"
											/>
										</div>
									</td>
								</tr>
								<tr hidden></tr>
								{/* just a hidden element to not break the color scheme on the next table row*/}
								<tr className="input-new-data-row">
									<th scope="row">
										<img
											src={require("./assets/icons/add-attributed.png")}
											id="add-sale-data-btn"
											className="add-data-btn"
											onClick={displaySALEInputFields}
											alt="add new purchase entry button"
										/>
									</th>
									<td></td>
									<td></td>
									<td></td>
									<td></td>
									<td>
										<button
											type="button"
											className="btn btn-contain"
											id="btnSaleUpdate"
											onClick={addNewSALEDataRow}
											hidden
										>
											Actualizar
										</button>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}

export default ItemInfo;
