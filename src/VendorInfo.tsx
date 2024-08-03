import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import $ from "jquery";

import { useHistory } from "react-router-dom";

//Types
import {
	urlPropVendorType,
	VendorDataType,
	PtransactionDataType,
} from "./types";
import { updateVendorData } from "./graphql/mutations";
import { getAccessToken } from "./Cognito";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import EditVendor from "./components/EditVendor";

function VendorInfo() {
	let { vId_global } = useParams<urlPropVendorType>();

	const [transactionCount, setTransactionCount] = useState(-1);
	const [vendorData, setVendorData] = useState<VendorDataType>();
	const [Ptransaction_data, setPtData] = useState<PtransactionDataType[]>([]);
	const [DataLoaded, setDataLoaded] = useState<boolean>(false);
	const [isEditable, setIsEditable] = useState<boolean>(false);

	//auxiliary variables - for pagination
	const [lastRowNum, SetLastRow] = useState(0);
	const [hasMore, setHasMore] = useState(false);

	const fetchVendorData = async () => {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/vendors/info/${vId_global}`,
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

			if (data.length > 0) setVendorData(data[0]);
		} catch (error) {
			console.error("Error retrieving Vendor data (fetchVendorData) ", error);
			window.alert("Error retrieving Vendor data (fetchVendorData) " + error);
		}
	};

	const fetchTransactionCount = async () => {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/vendors/info/${vId_global}/count`,
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
				setTransactionCount(data[0].COUNT);
			}
		} catch (error) {
			console.log(
				"Error retrieving COUNT data (fetchTransactionCount) ",
				error
			);
		}
	};

	const fetchPTransactionData = async () => {
		//we use local rowIndex variable to prevent delays on global
		//if we triggered search, start searching from index 0 else, keep pagination from last variable's index
		var rowIndex = lastRowNum;

		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/vendors/info/${vId_global}/transactions?rowNum=${rowIndex}`,
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
				//for pagination, remember which index was the last one queried so new query can start from there
				SetLastRow(data[data.length - 1].rowNum);
				setPtData((prevData) => [...prevData, ...data]);
			}
			setHasMore(data.length > 0);
		} catch (error) {
			console.error(
				"Error retrieving Product data (fetchPTransactionsData) ",
				error
			);
			window.alert(
				"Error retrieving Product data (fetchPTransactionsData) " + error
			);
		}
	};

	useEffect(() => {
		fetchVendorData();
		fetchPTransactionData();
		fetchTransactionCount();
		$("#vendorTabBtn").addClass("nav-selected");
		$("#productTabBtn").removeClass("nav-selected");
	}, []);

	useEffect(() => {
		if (DataLoaded) {
			checkForMissingInfo();
		}
	}, [DataLoaded]);

	function focusOut(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.keyCode === 13 || e.keyCode === 9) {
			$("#" + $(e.target).attr("id")).prop("disabled", true);
			$("#" + $(e.target).attr("id")).prop("disabled", false); //lose focus out of the textbox
		}
	}

	const editBtnTrigger = () => {
		setIsEditable(true);
	};

	const history = useHistory();

	function goToProductPage(pId: string) {
		let path = "/item/" + pId;
		//let path=`/vendor`;
		history.push(path);
	}

	function checkForMissingInfo() {
		vendorData?.address ? <></> : $("#vAddressInputRow").attr("hidden", 1);
		vendorData?.city ? <></> : $("#vCityInputRow").attr("hidden", 1);
		vendorData?.state ? <></> : $("#vStateInputRow").attr("hidden", 1);
		vendorData?.country ? <></> : $("#vCountryInputRow").attr("hidden", 1);
		vendorData?.zipCode ? <></> : $("#vZipInputRow").attr("hidden", 1);
		vendorData?.rfc ? <></> : $("#vRfcInputRow").attr("hidden", 1);
	}

	return (
		<div className="Application">
			<title>Facturación PJL - {vendorData?.name}</title>
			<div className="container" id="container">
				{vendorData && vendorData.name && isEditable ? (
					<EditVendor
						vendorData={vendorData}
						setVendorData={setVendorData}
						setIsEditable={setIsEditable}
					/>
				) : (
					<></>
				)}
				<div className="container-top-section">
					<div className="container-top-first-row">
						<div className="vInfo-section">
							<div className="vInfo-row">
								<h1 className="container-title vendor-title edit-primary">
									<input
										type="text"
										id="vNameInput"
										className="editable-input"
										defaultValue={vendorData?.name}
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
										defaultValue={vendorData?.address}
										placeholder="Direccion"
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
										defaultValue={vendorData?.city}
										placeholder="Ciudad"
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
								{vendorData?.city ? (
									<p className="product-description separator">,</p>
								) : (
									<></>
								)}
								<h4 className="product-description ">
									<input
										type="text"
										id="vStateInput"
										className="product-description editable-input"
										defaultValue={vendorData?.state}
										placeholder="Estado"
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
										defaultValue={vendorData?.country}
										placeholder="Pais"
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
								{vendorData?.zipCode ? (
									<p className="product-description separator">,</p>
								) : (
									<></>
								)}
								<h4 className="product-description">
									<input
										type="text"
										id="vZipInput"
										className="product-description editable-input"
										defaultValue={vendorData?.zipCode}
										placeholder="Codigo Postal"
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
										defaultValue={vendorData?.rfc}
										placeholder="RFC"
										onKeyDown={(e) => focusOut(e)}
										readOnly
									/>
								</h4>
							</div>
						</div>

						<div className="title-button-container vendor-btn vendor-btn-container">
							<button
								type="button"
								className="btn secondary-btn edit-btn"
								data-bs-toggle="button"
								id="btn"
								onClick={editBtnTrigger}
							>
								editar distribuidor
							</button>

							<button
								type="button"
								className="btn"
								data-bs-toggle="button"
								id="saveBtn"
								hidden
							>
								Guardar
							</button>
						</div>
					</div>

					<div className="product-third-row">
						<p className="product-id-subtitle">Vendor Id: {vendorData?.id}</p>
						<p className="product-qty-count">
							Numero de compras: {transactionCount}
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
				<div
					className="alert alert-danger alert-body"
					role="alert"
					id="error-template-vendor"
					onClick={() => {
						$("#error-template-vendor").attr("hidden", 1);
					}}
					hidden
				>
					This is a danger alert—check it out!
				</div>
				<div className="fair-spacing" />
				<InfiniteScroll
					dataLength={Ptransaction_data.length}
					next={() => {
						fetchPTransactionData();
					}}
					hasMore={hasMore}
					loader={<h4>Loading...</h4>}
					className="row"
				>
					<table className="tble">
						<thead>
							<tr key={"heading-row"}>
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
								({ id, productId, date, invoiceId, qty, price, pname }, i) => (
									<tr key={"vInfo-" + id}>
										<td scope="col" className="vendor-date">
											{moment(date).format("YYYY-MM-DD")}
										</td>
										<td
											scope="col"
											className="vendor-pname"
											onClick={() => goToProductPage(productId)}
										>
											{pname}
										</td>
										<td scope="col" className="vendor-invoice">
											{invoiceId}
										</td>
										<td scope="col" className="vendor-weight">
											{qty}
										</td>
										<td scope="col" className="vendor-price">
											{price}
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
				</InfiniteScroll>
			</div>
		</div>
	);
}

export default VendorInfo;
