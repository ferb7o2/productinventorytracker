import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; //Helps us redirect to other pages

import $ from "jquery";

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
import { getAccessToken } from "./Cognito";
import { PurchaseYearBox } from "./components/PurchaseYearBox";
import { AddPurchaseRow } from "./components/AddPurchaseRow";
import { SaleYearBox } from "./components/SaleYearBox";
import { AddSaleRow } from "./components/AddSaleRow";

interface YearList {
	year: number;
}

function ItemInfo() {
	let { pId } = useParams<urlPropType>() || "";

	const [ProductData, setProductData] = useState<ProductDataType>();
	const [purchasesYears, setPurchasesYears] = useState<YearList[]>([]);
	const [salesYears, setSalesYears] = useState<YearList[]>([]);
	const [pTransaction_data, setPTransaction_Data] = useState<
		PtransactionDataType[]
	>([]);
	const [vendorData, setVendorData] = useState<VendorDataType[]>([]);
	const [inventoryTotal, setInventoryTotal] = useState<number>(-1);
	const [sTransactionData, setSTransactionData] = useState<
		StransactionDataType[]
	>([]);
	const [DataLoaded, setDataLoaded] = useState<boolean>(false);
	const [toDeleteSale, setToDeleteSale] = useState<toDeleteSaleType[]>([]);
	const [toDeletePurchase, setToDeletePurchase] = useState<
		toDeletePurchaseType[]
	>([]);
	const [difference, setDifference] = useState<number>(0);

	const fetchProductData = async () => {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			console.log(token);
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/products/${pId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			if (data.length > 0) setProductData(data[0]);
			setDataLoaded(true);
		} catch (error) {
			console.error("Error retrieving Vendor data (fetchVendorData) ", error);
			window.alert("Error retrieving Vendor data (fetchVendorData) " + error);
		}
	};

	async function fetchInventorytotal() {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/products/${pId}/difference`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			if (data.length > 0) {
				setInventoryTotal(data[0].difference);
			}
		} catch (error) {
			console.error(
				`Error retrieving Inventory data (fechInventoryToral()) `,
				error
			);
		}
	}

	const fetchPurchasesYears = async () => {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases/${pId}/years`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			if (data.length > 0) {
				setPurchasesYears(data);
			}
		} catch (error) {
			console.error("Error retrieving Year data (fetchPurchasesYears) ", error);
		}
	};

	const fetchSalesYears = async () => {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/sales/${pId}/years`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			if (data.length > 0) {
				setSalesYears(data);
			}
		} catch (error) {
			console.error("Error retrieving Year data (fetchSalesYears) ", error);
		}
	};

	const fetchAllVendorData = async () => {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(`${process.env.REACT_APP_API_URL}/vendors`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			setVendorData(data);
		} catch (error) {
			console.error(
				"Error retrieving Vendor data (fetchAllVendorData()) ",
				error
			);
			window.alert(
				"Error retrieving Vendor data (fetchAllVendorData) " + error
			);
		}
	};

	useEffect(() => {
		fetchProductData();
		fetchAllVendorData();
		fetchInventorytotal();
		fetchPurchasesYears();
		fetchSalesYears();
		fetchAllVendorData();
		$("#vendorTabBtn").removeClass("nav-selected");
		$("#productTabBtn").addClass("nav-selected");
	}, []);

	useEffect(() => {
		if (DataLoaded) {
			checkForMissingInfo();
		}
	}, [DataLoaded]);

	useEffect(() => {
		checkForMissingInfo();
	}, [ProductData]);

	function focusOut(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.keyCode === 13 || e.keyCode === 9) {
			$("#" + $(e.target).attr("id")).prop("disabled", true);
			$("#" + $(e.target).attr("id")).prop("disabled", false); //lose focus out of the textbox
		}
	}

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

		const name = $("#productTitle").val();
		const desc = $("#productDescription").val();

		if (
			$("#productTitle").val() == ProductData?.name &&
			$("#productDescription").val() == ProductData?.description
		)
			return;

		try {
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/products/${pId}?name=${name}&desc=${desc}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});
		} catch (error) {
			console.error("error on changeTitle() ", error);
			errorTemplate.text("Error - al actualizar el Nombre del producto");
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

	const addItemPurchase = (
		newItems: PtransactionDataType[],
		newAdded?: Boolean,
		newYear?: String
	) => {
		//if it's a new Transaction added by the AddPurchaseRow (not fetched)
		if (newAdded) {
			const isYearPresent = purchasesYears.some(
				(obj) => obj.year == Number(newYear)
			);
			//if the year does not exist already
			if (!isYearPresent) {
				//we add the year to the array so it can display
				const updatedYears = purchasesYears.concat({ year: Number(newYear) });
				setPurchasesYears(updatedYears);
				return;
			}
			//if it's a newly added product (YEAR DOES EXIST), then we sort to make sure we add it at it's correct position
			const sortedData = [...pTransaction_data, ...newItems].sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			);

			setPTransaction_Data(sortedData);
			console.log(sortedData);
			return;
		}
		//else, just add to previous to keep order
		setPTransaction_Data((prevItems) => [...prevItems, ...newItems]);
	};

	const setDifferenceFUNC = (differenceReceived: number) => {
		setDifference((prevVal) => prevVal + differenceReceived);
	};

	const addItemSale = (
		newItems: StransactionDataType[],
		newAdded?: Boolean,
		newYear?: String
	) => {
		//if it's a newly added product, then we sort to make sure we add it at it's correct position
		if (newAdded) {
			const isYearPresent = salesYears.some(
				(obj) => obj.year == Number(newYear)
			);

			if (!isYearPresent) {
				const updatedYears = salesYears.concat({ year: Number(newYear) });
				setSalesYears(updatedYears);
				return;
			}

			const sortedData = [...sTransactionData, ...newItems].sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			);
			setSTransactionData(sortedData);
			return;
		}
		//else, just add to previous to keep order
		setSTransactionData((prevItems) => [...prevItems, ...newItems]);
	};

	const updatePurchase = (
		array: PtransactionDataType[],
		newVal: any,
		toChangeVar: string,
		toChangeId: string
	) => {
		const updatedData = array.map((item) => {
			switch (toChangeVar) {
				case "productId":
					if (item.id === toChangeId) {
						return { ...item, productId: newVal };
					}
				case "date":
					if (item.id === toChangeId) {
						return { ...item, date: newVal };
					}
				case "vendorId":
					if (item.id === toChangeId) {
						return { ...item, vendorId: newVal };
					}
				case "invoiceId":
					if (item.id === toChangeId) {
						return { ...item, invoiceId: newVal };
					}
				case "qty":
					if (item.id === toChangeId) {
						return { ...item, qty: newVal };
					}
				case "price":
					if (item.id === toChangeId) {
						return { ...item, price: newVal };
					}
				case "vName":
					if (item.id === toChangeId) {
						return { ...item, vName: newVal };
					}
			}

			return item;
		});
		setPTransaction_Data(updatedData);
	};

	const updateSale = (
		array: StransactionDataType[],
		newVal: any,
		toChangeVar: string,
		toChangeId: string
	) => {
		const updatedData = array.map((item) => {
			switch (toChangeVar) {
				case "productId":
					if (item.id === toChangeId) {
						return { ...item, productId: newVal };
					}
				case "date":
					if (item.id === toChangeId) {
						return { ...item, date: newVal };
					}

				case "invoiceId":
					if (item.id === toChangeId) {
						return { ...item, invoiceId: newVal };
					}
				case "qty":
					if (item.id === toChangeId) {
						return { ...item, qty: newVal };
					}
				case "price":
					if (item.id === toChangeId) {
						return { ...item, price: newVal };
					}
			}

			return item;
		});
		setSTransactionData(updatedData);
	};

	return (
		<>
			<div className="Application">
				{ProductData?.name ? (
					<title>Facturación PJL - {ProductData?.name}</title>
				) : (
					<title>Facturación PJL - Error al cargar informacion</title>
				)}

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
								Cantidad disponible:{" "}
								{(Number(inventoryTotal) + difference).toFixed(3)}
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
								{purchasesYears.map(({ year }) => (
									<PurchaseYearBox
										key={year + "box"}
										year={year}
										pId={pId}
										vendorData={vendorData}
										transactionData={pTransaction_data.filter(
											(item) => item.date.slice(0, 4) == String(year)
											//passes only the transactions that match the year of the YearBox
										)}
										addItems={addItemPurchase}
										setDiff={setDifferenceFUNC}
										updatePurchase={updatePurchase}
										addToDeleteArray={addToDeleteArray}
									/>
								))}
								<AddPurchaseRow
									vendorData={vendorData}
									pId={pId}
									addItems={addItemPurchase}
									setDiff={setDifferenceFUNC}
								/>
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
								{salesYears.map(({ year }) => (
									<SaleYearBox
										key={year + "box"}
										year={year}
										pId={pId}
										transactionData={sTransactionData.filter(
											(item) => item.date.slice(0, 4) == String(year)
											//passes only the transactions that match the year of the YearBox
										)}
										addItems={addItemSale}
										updateSale={updateSale}
										setDiff={setDifferenceFUNC}
										addToDeleteArray={addToDeleteArray}
									/>
								))}
								<AddSaleRow
									pId={pId}
									addItems={addItemSale}
									setDiff={setDifferenceFUNC}
								/>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}

export default ItemInfo;
