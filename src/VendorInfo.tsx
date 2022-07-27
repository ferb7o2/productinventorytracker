import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import $ from "jquery";

import { useStateContext } from "./contexts/dataContext";

import { useHistory } from "react-router-dom";

//Queries
import {
	getVendorData,
	listProductData,
	listPurchaseTransactionData2022svId,
} from "./graphql/queries";

//Components
import { NavBar } from "./components/NavBar";

//Types
import {
	urlPropVendorType,
	VendorDataType,
	PtransactionDataType,
	ProductDataType,
} from "./types";
import { updateVendorData } from "./graphql/mutations";
import Footer from "./components/Footer";

function VendorInfo() {
	let { vId_global } = useParams<urlPropVendorType>();

	const [ProductData, setProductData] = useState<ProductDataType[]>([]);
	const [VendorData, setVendorData] = useState<VendorDataType>();
	const [Ptransaction_data, setPtData] = useState<PtransactionDataType[]>([]);

	const fetchVendorData = async () => {
		try {
			const vendorData = (await API.graphql(
				graphqlOperation(getVendorData, { id: vId_global })
			)) as { data: { getVendorData: VendorDataType } };

			//console.log(vendorData.data.listVendorData.items);
			setVendorData(vendorData.data.getVendorData);
		} catch (error) {
			console.log("error on fetchVendorData() ", error);
		}
	};

	const fetchPTransactionData = async () => {
		try {
			const pTransactionData = (await API.graphql(
				graphqlOperation(listPurchaseTransactionData2022svId, {
					vId: vId_global,
				})
			)) as {
				data: {
					listPurchaseTransactionData2022s: { items: PtransactionDataType[] };
				};
			};

			//console.log(pTransactionData.data.listPurchaseTransactionData2022s.items);
			setPtData(pTransactionData.data.listPurchaseTransactionData2022s.items);
		} catch (error) {
			console.log("error on fetchPTransactionData() ", error);
		}
	};

	const fetchProductData = async () => {
		try {
			const productDatas = (await API.graphql(
				graphqlOperation(listProductData)
			)) as { data: { listProductData: { items: ProductDataType[] } } };

			setProductData(productDatas.data.listProductData.items);
		} catch (error) {
			console.log("Error retrieving vendor data (fetchProductData) ", error);
		}
	};

	useEffect(() => {
		fetchVendorData();
		fetchPTransactionData();
		fetchProductData();
		$("#vendorTabBtn").addClass("nav-selected");
		$("#productTabBtn").removeClass("nav-selected");

		checkForMissingInfo();
	}, []);

	function idForName(pIdPassed: string) {
		const product = ProductData.find(({ id }, i) => pIdPassed == id);
		if (product != undefined) return product.name;
	}

	function focusOut(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.keyCode === 13 || e.keyCode === 9) {
			$("#" + e.target.getAttribute("id")).prop("disabled", true);
			$("#" + e.target.getAttribute("id")).prop("disabled", false); //lose focus out of the textbox
		}
	}

	const changeName = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		oldTitle: string | undefined
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = e.target.value;
			if (newVal == oldTitle) return;

			const changeProductName = await API.graphql(
				graphqlOperation(updateVendorData, {
					input: { id: VendorData?.id, name: newVal },
				})
			);
		} catch (error) {
			console.log("error on changeName() ", error);
			errorTemplate.text("Error - al actualizar el Nombre del Distribuidor");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeAddress = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		oldTitle: string | undefined
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = e.target.value;
			if (newVal == oldTitle) return;
			const changeProductName = await API.graphql(
				graphqlOperation(updateVendorData, {
					input: { id: VendorData?.id, address: newVal },
				})
			);
		} catch (error) {
			console.log("error on changeAddress() ", error);
			errorTemplate.text("Error - al actualizar la direccion del Distribuidor");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeCity = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		oldTitle: string | undefined
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = e.target.value;
			if (newVal == oldTitle) return;
			const changeProductName = await API.graphql(
				graphqlOperation(updateVendorData, {
					input: { id: VendorData?.id, city: newVal },
				})
			);
		} catch (error) {
			console.log("error on changeCity() ", error);
			errorTemplate.text("Error - al actualizar la ciudad del Distribuidor");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeState = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		oldTitle: string | undefined
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = e.target.value;
			if (newVal == oldTitle) return;

			const changeProductName = await API.graphql(
				graphqlOperation(updateVendorData, {
					input: { id: VendorData?.id, state: newVal },
				})
			);
		} catch (error) {
			console.log("error on changeState() ", error);
			errorTemplate.text("Error - al actualizar el estado del Distribuidor");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeCountry = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		oldTitle: string | undefined
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = e.target.value;
			if (newVal == oldTitle) return;

			const changeProductName = await API.graphql(
				graphqlOperation(updateVendorData, {
					input: { id: VendorData?.id, country: newVal },
				})
			);
		} catch (error) {
			console.log("error on changeCountry() ", error);
			errorTemplate.text("Error - al actualizar el pais del Distribuidor");
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeZip = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		oldTitle: string | undefined
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = e.target.value;
			if (newVal == oldTitle) return;

			const changeProductName = await API.graphql(
				graphqlOperation(updateVendorData, {
					input: { id: VendorData?.id, zipCode: newVal },
				})
			);
		} catch (error) {
			console.log("error on changeTitle() ", error);
			errorTemplate.text(
				"Error - al actualizar el codigo postal del Distribuidor"
			);
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeRfc = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		oldTitle: string | undefined
	) => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		try {
			let newVal = e.target.value;
			if (newVal == oldTitle) return;

			const changeProductName = await API.graphql(
				graphqlOperation(updateVendorData, {
					input: { id: VendorData?.id, rfc: newVal },
				})
			);
		} catch (error) {
			console.log("error on changeRfc() ", error);
			errorTemplate.text("Error - al actualizar el RFC del Distribuidor");
			errorTemplate.removeAttr("hidden");
		}
	};

	function saveBtnTrigger() {
		$("#vNameInput").attr("readOnly", 1);
		$("#vAddressInput").attr("readOnly", 1);
		$("#vCityInput").attr("readOnly", 1);
		$("#vStateInput").attr("readOnly", 1);
		$("#vCountryInput").attr("readOnly", 1);
		$("#vZipInput").attr("readOnly", 1);
		$("#vRfcInput").attr("readOnly", 1);
		$(".editable-input").css("border", "none");
		$(".editable-input").css("border-radius", "4px");
		$("#saveBtn").attr("hidden", 1);
	}

	const editBtnTrigger = () => {
		$("#vNameInput").removeAttr("readOnly");
		$("#vAddressInput").removeAttr("readOnly");
		$("#vCityInput").removeAttr("readOnly");
		$("#vStateInput").removeAttr("readOnly");
		$("#vCountryInput").removeAttr("readOnly");
		$("#vZipInput").removeAttr("readOnly");
		$("#vRfcInput").removeAttr("readOnly");
		$(".editable-input").css("border", "1px rgb(54, 54, 54, 0.6) solid");
		$(".editable-input").css("border-radius", "4px");
		$("#saveBtn").removeAttr("hidden");

		$("#vAddressInputRow").removeAttr("hidden");
		$("#vCityInputRow").removeAttr("hidden");
		$("#vStateInputRow").removeAttr("hidden");
		$("#vCountryInputRow").removeAttr("hidden");
		$("#vZipInputRow").removeAttr("hidden");
		$("#vRfcInputRow").removeAttr("hidden");
	};

	const history = useHistory();

	function goToProductPage(pId: string) {
		let path = "/item/" + pId;
		//let path=`/vendor`;
		history.push(path);
	}

	function checkForMissingInfo() {
		VendorData?.address ? <></> : $("#vAddressInputRow").attr("hidden", 1);
		VendorData?.city ? <></> : $("#vCityInputRow").attr("hidden", 1);
		VendorData?.state ? <></> : $("#vStateInputRow").attr("hidden", 1);
		VendorData?.country ? <></> : $("#vCountryInputRow").attr("hidden", 1);
		VendorData?.zipCode ? <></> : $("#vZipInputRow").attr("hidden", 1);
		VendorData?.rfc ? <></> : $("#vRfcInputRow").attr("hidden", 1);
	}

	return (
		<div className="Application">
			<header></header>
			<div className="container" id="container">
				<div className="container-top-section">
					<div className="container-top-first-row">
						<div className="vInfo-section">
							<div className="vInfo-row">
								<h1 className="container-title vendor-title edit-primary">
									<input
										type="text"
										id="vNameInput"
										className="editable-input"
										defaultValue={VendorData?.name}
										onBlur={(e) => {
											changeName(e, VendorData?.name);
										}}
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h1>
							</div>

							<div className="vInfo-row">
								<h4
									className="product-description  edit-primary"
									id="vAddressInputRow"
								>
									<input
										type="text"
										id="vAddressInput"
										className="product-description editable-input"
										defaultValue={VendorData?.address}
										placeholder="Direccion"
										onBlur={(e) => {
											changeAddress(e, VendorData?.address);
										}}
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
							</div>
							<div className="vInfo-row vInfo-row-second" id="vCityInputRow">
								<h4 className="product-description ">
									<input
										type="text"
										id="vCityInput"
										className="product-description editable-input city-exemption"
										defaultValue={VendorData?.city}
										placeholder="Ciudad"
										onBlur={(e) => {
											changeCity(e, VendorData?.city);
										}}
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
								{VendorData?.city ? (
									<p className="product-description separator">,</p>
								) : (
									<></>
								)}
								<h4 className="product-description ">
									<input
										type="text"
										id="vStateInput"
										className="product-description editable-input"
										defaultValue={VendorData?.state}
										placeholder="Estado"
										onBlur={(e) => {
											changeState(e, VendorData?.state);
										}}
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
							</div>
							<div className="vInfo-row vInfo-row-second" id="vCountryInputRow">
								<h4 className="product-description">
									<input
										type="text"
										id="vCountryInput"
										className="product-description editable-input city-exemption"
										defaultValue={VendorData?.country}
										placeholder="Pais"
										onBlur={(e) => {
											changeCountry(e, VendorData?.country);
										}}
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
								{VendorData?.zipCode ? (
									<p className="product-description separator">,</p>
								) : (
									<></>
								)}
								<h4 className="product-description">
									<input
										type="text"
										id="vZipInput"
										className="product-description editable-input"
										defaultValue={VendorData?.zipCode}
										placeholder="Codigo Postal"
										onBlur={(e) => {
											changeZip(e, VendorData?.zipCode);
										}}
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
							</div>
							<div className="vInfo-row" id="vRfcInputRow">
								<h4 className="product-description  edit-primary">
									<input
										type="text"
										id="vRfcInput"
										className="product-description editable-input"
										defaultValue={VendorData?.rfc}
										placeholder="RFC"
										onBlur={(e) => {
											changeRfc(e, VendorData?.rfc);
										}}
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
							</div>
						</div>

						<div className="title-button-container vendor-btn vendor-btn-container">
							<button
								type="button"
								className="btn secondary-btn"
								data-bs-toggle="button"
								id="btn"
								onClick={() => editBtnTrigger()}
							>
								editar distribuidor
							</button>

							<button
								type="button"
								className="btn"
								data-bs-toggle="button"
								id="saveBtn"
								onClick={() => saveBtnTrigger()}
								hidden
							>
								Guardar
							</button>
						</div>
					</div>

					<div className="product-third-row">
						<p className="product-id-subtitle">Vendor Id: {VendorData?.id}</p>
						<p className="product-qty-count">
							Numero de compras: {Ptransaction_data?.length}
						</p>
					</div>
					<div className="sub-section-container remove-top-pad">
						<div className="left-pad"></div>
						<div className="selected-under">
							<p className="sub-section-title sub-section-selected">See all</p>
						</div>
						<p className="sub-section-title ">Saved</p>
						<p className="sub-section-title">Ongoing</p>
						<p className="sub-section-title">Archived</p>
					</div>
				</div>
				<div className="fair-spacing" />
				<div className="row">
					<table className="tble">
						<thead>
							<tr>
								<th scope="col" className="thead-row vendor-date">
									Fecha
								</th>
								<th scope="col" className="thead-row vendor-pname">
									Producto
								</th>
								<th scope="col" className="thead-row vendor-invoice">
									# Factura
								</th>
								<th scope="col" className="thead-row vendor-weight">
									Cantidad
								</th>
								<th scope="col" className="thead-row vendor-price">
									Precio (MXN)
								</th>
								<th
									scope="col"
									id="[transaction-id]"
									className="thead-row vendor-ptid"
								>
									Transaccion Id
								</th>
							</tr>
						</thead>

						<tbody>
							{Ptransaction_data.map(
								(
									{
										id,
										pId,
										date,
										purchaseInvoiceId,
										purchaseWeight,
										purchasePrice,
									},
									i
								) => (
									<tr>
										<td scope="col" className="vendor-date">
											{date}
										</td>
										<td
											scope="col"
											className="vendor-pname"
											onClick={() => goToProductPage(pId)}
										>
											{idForName(pId)}
										</td>
										<td scope="col" className="vendor-invoice">
											{purchaseInvoiceId}
										</td>
										<td scope="col" className="vendor-weight">
											{purchaseWeight}
										</td>
										<td scope="col" className="vendor-price">
											{purchaseWeight}
										</td>
										<td
											scope="col"
											id="[transaction-id]"
											className="id-col-data vendor-ptid"
										>
											{id}
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default VendorInfo;
