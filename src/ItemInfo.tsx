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

//Import Components
import { DeleteTransaction } from "./components/DeleteTransaction";
import { PurchaseYearBox } from "./components/PurchaseYearBox";
import { AddPurchaseRow } from "./components/AddPurchaseRow";
import { SaleYearBox } from "./components/SaleYearBox";
import { AddSaleRow } from "./components/AddSaleRow";

//Import AWS Cognito Authentication
import { getAccessToken } from "./Cognito";
import { TransactionNotes } from "./components/TransactionNotes";
import { EditProduct } from "./components/EditProduct";

interface YearList {
	year: number;
}

function ItemInfo() {
	let { pId } = useParams<urlPropType>() || "";

	//Essential display data
	const [productData, setProductData] = useState<ProductDataType>();
	const [purchasesYears, setPurchasesYears] = useState<YearList[]>([]);
	const [salesYears, setSalesYears] = useState<YearList[]>([]);
	const [pTransactionData, setPTransactionData] = useState<
		PtransactionDataType[]
	>([]);
	const [inventoryTotal, setInventoryTotal] = useState<number>(-1);
	const [sTransactionData, setSTransactionData] = useState<
		StransactionDataType[]
	>([]);

	//Auxiliary data, for deleting, recalculating inventory, passing vendor info & checking for data loads
	const [toDeleteSale, setToDeleteSale] = useState<toDeleteSaleType[]>([]);
	const [toDeletePurchase, setToDeletePurchase] = useState<
		toDeletePurchaseType[]
	>([]);
	const [difference, setDifference] = useState<number>(0);
	const [vendorData, setVendorData] = useState<VendorDataType[]>([]);
	const [DataLoaded, setDataLoaded] = useState<boolean>(false);
	const [editMode, setEditMode] = useState(false);

	const fetchProductData = async () => {
		try {
			// Get the user JWT token to query the API
			const token = await getAccessToken();

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/products/${pId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (data.length > 0) {
					setProductData(data[0]);
				}
				setDataLoaded(true);
			} else {
				throw new Error("Failed to fetch product data");
			}
		} catch (error) {
			console.error("Error retrieving product data (fetchProductData):", error);
			window.alert(
				"Error retrieving product data (fetchProductData): " + error
			);
		}
	};

	async function fetchInventoryTotal() {
		try {
			// Get the user JWT token to query the API
			const token = await getAccessToken();

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/products/${pId}/difference`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (data.length > 0) {
					setInventoryTotal(data[0].difference);
				}
			} else {
				throw new Error("Failed to fetch inventory data");
			}
		} catch (error) {
			console.error(
				"Error retrieving inventory data (fetchInventoryTotal):",
				error
			);
		}
	}

	const fetchPurchasesYears = async () => {
		try {
			// Get the user JWT token to query the API
			const token = await getAccessToken();

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases/${pId}/years`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (data.length > 0) {
					setPurchasesYears(data);
				}
			} else {
				throw new Error("Failed to fetch purchase years data");
			}
		} catch (error) {
			console.error("Error retrieving year data (fetchPurchasesYears):", error);
		}
	};

	const fetchSalesYears = async () => {
		try {
			// Get the user JWT token to query the API
			const token = await getAccessToken();

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/sales/${pId}/years`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (response.ok) {
				const data = await response.json();
				if (data.length > 0) {
					setSalesYears(data);
				}
			} else {
				throw new Error("Failed to fetch sales years data");
			}
		} catch (error) {
			console.error("Error retrieving year data (fetchSalesYears):", error);
		}
	};

	const fetchAllVendorData = async () => {
		try {
			// Get the user JWT token to query the API
			const token = await getAccessToken();

			const response = await fetch(`${process.env.REACT_APP_API_URL}/vendors`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setVendorData(data);
			} else {
				throw new Error("Failed to fetch vendor data");
			}
		} catch (error) {
			console.error(
				"Error retrieving vendor data (fetchAllVendorData):",
				error
			);
			window.alert(
				"Error retrieving vendor data (fetchAllVendorData): " + error
			);
		}
	};

	useEffect(() => {
		fetchProductData();
		fetchAllVendorData();
		fetchInventoryTotal();
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
	}, [productData]);

	function focusOut(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.keyCode === 13 || e.keyCode === 9) {
			$("#" + $(e.target).attr("id")).prop("disabled", true);
			$("#" + $(e.target).attr("id")).prop("disabled", false); //lose focus out of the textbox
		}
	}

	const editBtnTrigger = () => {
		setEditMode(true);
	};

	const changeProductInfo = async () => {
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		const name = $("#productTitle").val();
		const desc = $("#productDescription").val();

		if (
			$("#productTitle").val() == productData?.name &&
			$("#productDescription").val() == productData?.description
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
		if (!productData?.description || productData.description == "")
			$("#productDescription").attr("hidden", 1);
		else $("#productDescription").removeAttr("hidden");
	}

	function deleteTransactionBtnTrigger() {
		if (toDeleteSale.length + toDeletePurchase.length > 0) {
			$("#product-item-modal-delete").removeAttr("hidden");
		}
	}

	function transactionNotesBtnTrigger() {
		if (toDeleteSale.length + toDeletePurchase.length > 0) {
			$("#product-item-modal-notes").removeAttr("hidden");
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

		if (type === "purchase") {
			if (currentChecked.checked) {
				// Check if the purchase with the given IdInput is already present in toDeletePurchase array
				const numberOfOccurrences = toDeletePurchase.filter(
					({ pId }) => pId === IdInput
				);

				if (numberOfOccurrences.length === 0) {
					// Add the purchase to toDeletePurchase array if it's not already present
					setToDeletePurchase((oldData) => [
						...oldData,
						{ pId: IdInput, pDate: dateInput, pInvoiceId: invoiceInput },
					]);
				}
			} else {
				// Remove the purchase from toDeletePurchase array if it's unchecked
				const filteredArray = toDeletePurchase.filter(
					({ pId }) => pId !== IdInput
				);
				setToDeletePurchase(filteredArray);
			}

			// Log the contents of toDeletePurchase array
			console.log(toDeletePurchase);
		} else {
			if (currentChecked.checked) {
				// Check if the sale with the given IdInput is already present in toDeleteSale array
				const numberOfOccurrencesSale = toDeleteSale.filter(
					({ sId }) => sId === IdInput
				);

				if (numberOfOccurrencesSale.length === 0) {
					// Add the sale to toDeleteSale array if it's not already present
					setToDeleteSale((oldData) => [
						...oldData,
						{ sId: IdInput, sDate: dateInput, sInvoiceId: invoiceInput },
					]);
				}
			} else {
				// Remove the sale from toDeleteSale array if it's unchecked
				const filteredArraySale = toDeleteSale.filter(
					({ sId }) => sId !== IdInput
				);
				setToDeleteSale(filteredArraySale);
			}

			// Log the contents of toDeleteSale array
			console.log(toDeleteSale);
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
			const sortedData = [...pTransactionData, ...newItems].sort(
				(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
			);

			setPTransactionData(sortedData);
			console.log(sortedData);
			return;
		}
		//else, just add to previous to keep order
		setPTransactionData((prevItems) => [...prevItems, ...newItems]);
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
					break;
				case "date":
					if (item.id === toChangeId) {
						return { ...item, date: newVal };
					}
					break;
				case "vendorId":
					if (item.id === toChangeId) {
						return { ...item, vendorId: newVal };
					}
					break;
				case "invoiceId":
					if (item.id === toChangeId) {
						return { ...item, invoiceId: newVal };
					}
					break;
				case "qty":
					if (item.id === toChangeId) {
						return { ...item, qty: newVal };
					}
					break;
				case "price":
					if (item.id === toChangeId) {
						return { ...item, price: newVal };
					}
					break;
				case "vName":
					if (item.id === toChangeId) {
						return { ...item, vName: newVal };
					}
					break;
			}

			return item;
		});
		setPTransactionData(updatedData);
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
					break;
				case "date":
					if (item.id === toChangeId) {
						return { ...item, date: newVal };
					}
					break;

				case "invoiceId":
					if (item.id === toChangeId) {
						return { ...item, invoiceId: newVal };
					}
					break;
				case "qty":
					if (item.id === toChangeId) {
						return { ...item, qty: newVal };
					}
					break;
				case "price":
					if (item.id === toChangeId) {
						return { ...item, price: newVal };
					}
					break;
			}

			return item;
		});
		setSTransactionData(updatedData);
	};

	function updateProductInfo(
		newName: string,
		newDesc: string,
		newWeightQty: string,
		newWeightType: string
	) {
		const productx = {
			id: productData?.id || "0",
			name: newName,
			description: newDesc,
			weightType: newWeightType,
			weightQty: Number(newWeightQty),
		};
		setProductData(productx);
	}

	return (
		<>
			<div className="Application">
				{productData?.name ? (
					<title>Facturación PJL - {productData?.name}</title>
				) : (
					<title>Facturación PJL - Error al cargar informacion</title>
				)}

				<DeleteTransaction
					purchase={toDeletePurchase}
					sale={toDeleteSale}
					currentItemId={pId || ""}
				/>

				{productData?.id && editMode ? (
					<EditProduct
						productInfo={productData}
						updateInfo={updateProductInfo}
						setEditMode={setEditMode}
					/>
				) : (
					<></>
				)}

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
											defaultValue={productData?.name}
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
												productData?.description ? productData.description : ""
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
										className="btn secondary-btn editBtnProduct"
										data-bs-toggle="button"
										id="editBtnProduct"
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
								Product Id: {productData?.id}
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
										{productData?.weightType}
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
										transactionData={pTransactionData.filter(
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
										{productData?.weightType}
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
