import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; //Helps us redirect to other pages

import { useStateContext } from "./contexts/dataContext";
//import { useHistory } from "react-router-dom";
import $ from "jquery";

//get Date
import * as moment from "moment";

//Components
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { getOurBusinessInfo, getProductData } from "./graphql/queries";

function ItemInfo(props) {
	//const history = useHistory();
	/*const goBack = () => {
		history.goBack();
	};*/
	//console.log(TransactionData);

	let { pId } = useParams();
	pId = parseInt(pId, 10);

	//Import data from Context API
	const [ProductData, setProductData] = useState([]);
	const [Ptransaction_data, setPtData] = useStateContext()[1];
	const [VendorData /*, setVendorData*/] = useStateContext()[2];
	const [InventoryTotal, setInventoryTotal] = useState(0);
	const [Stransaction_data, setStData] = useStateContext()[3];

	const fetchProductInfo = async (pId) => {
		try {
			//console.log("flag");
			const productData = await API.graphql(
				graphqlOperation(getProductData, { id: pId })
			);

			console.log(productData.data.getProductData);
			setProductData(productData.data.getProductData);
		} catch (error) {
			console.log("error on fetchMainBusinessInfo() ", error);
		}
	};

	useEffect(() => {
		fetchProductInfo(pId);
	}, []);

	let realIndex = 0;
	//realIndex = ProductData.find((val, i) => pId === val.pId); //go through JSON and list by pId and not by [index]
	//console.log("yes" + pId);
	//console.log("realIndex -> " + realIndex.pId);

	useEffect(() => {
		function InventoryTotalSum(IndexPar) {
			for (let i = 0; i < Ptransaction_data.length; i++) {
				if (IndexPar === Ptransaction_data[i].tpId) {
					setInventoryTotal(
						(prevState) => prevState + Ptransaction_data[i].purchaseWeight
					);
				}
			}

			for (let i = 0; i < Stransaction_data.length; i++) {
				if (IndexPar === Stransaction_data[i].spId) {
					setInventoryTotal(
						(prevState) => prevState - Stransaction_data[i].saleWeight
					);
				}
			}
		}

		InventoryTotalSum(realIndex.pId);
	}, [Ptransaction_data, Stransaction_data, realIndex.pId]); //edit out

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

	const isNumber = new RegExp("^[0-9]+$");

	function isNotEmpty(parameter) {
		if (parameter.val().length !== 0) return true;
		else return false;
	}

	function addNewSALEDataRow() {
		//Make a pointer of that Error Template HTML tag since we will be using it alot
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", true); //keep it hidden

		if (isNotEmpty($("#input-row-saleInvoiceId"))) {
			if (
				isNotEmpty($("#input-row-saleWeight")) &&
				isNumber.test($("#input-row-saleWeight").val())
			) {
				if (
					isNotEmpty($("#input-row-salePrice")) &&
					isNumber.test($("#input-row-salePrice").val())
				) {
					setStData([
						...Stransaction_data,
						{
							stId: "",
							//spId: parseInt(pId, 10),
							date: $("#input-row-sale-date").val(),
							saleInvoiceId: $("#input-row-saleInvoiceId").val(),
							saleWeight: parseInt($("#input-row-saleWeight").val(), 10),
							salePrice: parseInt($("#input-row-salePrice").val(), 10),
						},
					]);

					setInventoryTotal(
						(prevState) =>
							prevState + parseInt($("#input-row-saleWeight").val())
					);

					$("#input-new-data-row-sale").attr("hidden", true);
					$("#btnSaleUpdate").attr("hidden", true);
				} else {
					errorTemplate.text(
						"Error - El precio de el producto no puede estar vacío / debe de ser un número válido"
					);
					errorTemplate.attr("hidden", false);
				}
			} else {
				errorTemplate.text(
					"Error - El peso de el producto no puede estar vacío / debe de ser un número válido"
				);
				errorTemplate.attr("hidden", false);
			}
		} else {
			errorTemplate.text(
				"Error - El numero de Invoice de el producto no puede estar vacío"
			);
			errorTemplate.attr("hidden", false);
		}
	}

	function addNewPURCHASEDataRow() {
		//Make a pointer of that Error Template HTML tag since we will be using it alot
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", true); //keep it hidden

		//-------->Check for valid [non-empty] PURCHASE info data
		//------------->Display proper error messages if failed check
		if (isNotEmpty($("#input-row-vId"))) {
			let vendorId = $("[list='vendors']").val(); //get the vendor from the [datalist] dropdown
			vendorId = idForName(vendorId); //Convert to proper db data

			//If non-empty
			if (isNotEmpty($("#input-row-purchaseInvoiceId"))) {
				if (
					isNotEmpty($("#input-row-purchaseWeight")) &&
					isNumber.test($("#input-row-purchaseWeight").val())
				) {
					if (
						isNotEmpty($("#input-row-purchasePrice")) &&
						isNumber.test($("#input-row-purchasePrice").val())
					) {
						//then all data is valid, we can add into array
						setPtData([
							...Ptransaction_data,
							{
								tId: 9,
								//tpId: parseInt(pId, 10),
								date: $("#input-row-date").val(),
								vId: vendorId,
								purchaseInvoiceId: $("#input-row-purchaseInvoiceId").val(),
								purchaseWeight: parseInt(
									$("#input-row-purchaseWeight").val(),
									10
								),
								purchasePrice: parseInt(
									$("#input-row-purchasePrice").val(),
									10
								),
							},
						]);

						setInventoryTotal(
							(prevState) =>
								prevState + parseInt($("#input-row-purchaseWeight").val())
						);

						$("#input-new-data-row").attr("hidden", true);
						$("#btnUpdate").attr("hidden", true);
					} else {
						//else, it is empty; Display correct error message to inform user
						errorTemplate.text(
							"Error - El precio de el producto no puede estar vacío / debe de ser un número válido"
						);
						errorTemplate.attr("hidden", false);
					}
				} else {
					errorTemplate.text(
						"Error - El peso de el producto no puede estar vacío / debe de ser un número válido"
					);
					errorTemplate.attr("hidden", false);
				}
			} else {
				errorTemplate.text("Error - El numero de factura no puede estar vacío");
				errorTemplate.attr("hidden", false);
			}
		} else {
			errorTemplate.text(
				"Error - el recuadro del proveedor no puede estar vacío"
			);
			errorTemplate.attr("hidden", false);
		}
		/*
        else
        {
            //-------->Check for valid [non-empty] SALE info data
            //------------->Display proper error messages if failed check

            if($('#input-row-saleInvoiceId').val()!=0)
            {
                if($('#input-row-saleWeight').val()!=0)
                {
                    if($('#input-row-salePrice').val()!=0)
                    {
                        settData([...transaction_data,{ tId:9, tpId:pId, date:$('#input-row-date').val(), vId:null, purchaseInvoiceId:null,
                        purchaseWeight:null, purchasePrice:null, saleInvoiceId: $('#input-row-saleInvoiceId').val(),
                        saleWeight:$('#input-row-saleWeight').val(), salePrice:$('#input-row-salePrice').val()},]);

                        $('#input-new-data-row').attr('hidden',true);
                        $('#btnUpdate').attr('hidden',true);
                    }
                    else
                    {
                        errorTemplate.text("Error - El precio de venta de el producto no puede estar vacío");
                        errorTemplate.attr('hidden',false);
                    }
                }
                else{
                    errorTemplate.text("Error - El peso de venta de el producto no puede estar vacío");
                    errorTemplate.attr('hidden',false);
                }
            }
            else{
                errorTemplate.text("Error - El # de Invoice de el producto no puede estar vacío");
                errorTemplate.attr('hidden',false);
            }
        }
        //settData([...transaction_data,{ tId:9, tpId:1, date:'12/31/2021', vId:null, purchaseInvoiceId:null,
         //purchaseWeight:null, purchasePrice:null, saleInvoiceId: null, saleWeight:null, salePrice:null},]);*/
	}

	function nameForId(vIdPassed) {
		if (vIdPassed > 0 && vIdPassed != null)
			return VendorData.find(({ vId }, i) => vIdPassed === vId).vName;
	}

	function idForName(vNamePassed) {
		if (vNamePassed != null)
			return VendorData.find(({ vName }, i) => vNamePassed === vName).vId;
	}

	function changeInvoiceId(e, lastValue, toChangeId) {
		let newVal = e.target.value;
		if (e.keyCode === 13 || e.keyCode === 9) {
			//if enter or tab is pressed
			setPtData(
				Ptransaction_data.map((val, i) =>
					val.PtId === toChangeId
						? {
								PtId: val.PtId,
								tpId: val.tpId,
								date: val.date,
								vId: val.vId,
								purchaseInvoiceId: newVal,
								purchaseWeight: val.purchaseWeight,
								purchasePrice: val.purchasePrice,
						  }
						: val
				)
			);

			e.target.value = newVal;

			$("#" + e.target.getAttribute("id")).prop("disabled", true);
			$("#" + e.target.getAttribute("id")).prop("disabled", false); //lose focus out of the textbox
		}
	}

	function changePurchaseWeight(e, lastValue, toChangeId) {
		if (e.keyCode === 13 || e.keyCode === 9) {
			//if enter or tab is pressed
			console.log("entered");
			//console.log(e.target.value);
			setPtData(
				Ptransaction_data.map((val, i) =>
					val.tId === toChangeId
						? {
								tId: val.tId,
								tpId: val.tpId,
								date: val.date,
								vId: val.vId,
								purchaseInvoiceId: val.purchaseInvoiceId,
								purchaseWeight: parseInt(e.target.value),
								purchasePrice: val.purchasePrice,
								saleInvoiceId: val.saleInvoiceId,
								saleWeight: val.saleWeight,
								salePrice: val.salePrice,
						  }
						: val
				)
			);

			$("#" + e.target.getAttribute("id")).prop("disabled", true);
			$("#" + e.target.getAttribute("id")).prop("disabled", false); //lose focus out of the textbox
		}

		console.log(Ptransaction_data);
	}

	return (
		<div className="Application">
			<header>
				<div
					className="alert alert-danger"
					role="alert"
					id="error-template"
					onClick={() => {
						$("#error-vendor").attr("hidden", true);
					}}
					hidden
				>
					This is a danger alert—check it out!
				</div>
				<NavBar />
			</header>
			<div className="container">
				<div className="row">
					<div className="col">
						<h1>{ProductData.name}</h1>
						<h4>{ProductData.description}</h4>
						<h4>{ProductData.weightType}</h4>
					</div>
					<div className="col-3 d-flex justify-content-end">
						<h4>Product Id: {ProductData.id}</h4>
					</div>
				</div>
				<div className="row">
					<div className="col-9"></div>
					<div className="col d-flex justify-content-end">
						<h5>Cantidad disponible: {InventoryTotal}</h5>
					</div>
				</div>
				<div className="fair-spacing" />
				<div className="row">
					<div className="col">
						<h4 className="item-table-label">Compra</h4>
					</div>
				</div>
				<div className="row">
					<table className="table table-striped">
						<thead>
							<tr>
								<th scope="col">tId</th>
								<th scope="col">Fecha</th>
								<th scope="col">Proveedor</th>
								<th scope="col"># Factura</th>
								<th scope="col">Peso (Kg)</th>
								<th scope="col">Precio (MXN)</th>
							</tr>
						</thead>
						<tbody>
							{Ptransaction_data.map(
								(
									{
										PtId,
										tpId,
										date,
										vId,
										purchaseInvoiceId,
										purchaseWeight,
										purchasePrice,
									} //Data driven display of rows in data
								) =>
									realIndex.pId === { tpId }.tpId ? ( //if the current page's product id and the db's product id match
										//then  the db's row is supposed to be here, display it
										<tr key={PtId} className="table-row">
											<th scope="row">{PtId}</th>
											<td>
												<input
													type="text"
													id={"row" + PtId + "date"}
													className="tableInput tableDate"
													defaultValue={date}
												/>
											</td>

											<td>
												<input
													type="text"
													id={"row" + PtId + "vId"}
													className="tableInput"
													defaultValue={nameForId(vId)}
												></input>
											</td>
											<td>
												<div className="tableData">
													<input
														type="text"
														id={"row" + PtId + "purchaseInvoiceId"}
														className="tableInput"
														defaultValue={purchaseInvoiceId}
														onKeyDown={(e) => {
															changeInvoiceId(e, purchaseInvoiceId, PtId);
														}}
													/>
												</div>
											</td>
											<td>
												<div className="tableData">
													<input
														type="text"
														id={"row" + PtId + "purchaseWeight"}
														className="tableInput"
														defaultValue={purchaseWeight}
														onKeyDown={(e) => {
															changePurchaseWeight(e, purchaseWeight, PtId);
														}}
													/>
												</div>
											</td>
											<td>
												<div className="tableData">
													<input
														type="text"
														id={"row" + PtId + "purchasePrice"}
														className="tableInput"
														defaultValue={purchasePrice}
													/>
												</div>
											</td>
										</tr>
									) : (
										<></>
									)
							)}
							<tr className="table-row" id="input-new-data-row" hidden>
								<th scope="row">{"->"}</th>
								<td>
									<input
										type="text"
										id="input-row-date"
										className="tableInput tableDate"
										defaultValue={moment().format("MM/DD/YYYY")}
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
										{VendorData.map(({ vId, vName, vNumOfTransactions }) => (
											<option key={vId} value={vName} id={vId} />
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
											type="text"
											id="input-row-purchaseWeight"
											className="tableInput"
										/>
									</div>
								</td>
								<td>
									<div className="tableData">
										<input
											type="text"
											id="input-row-purchasePrice"
											className="tableInput"
										/>
									</div>
								</td>
							</tr>
							<tr hidden></tr>
							{/* just a hidden element to not break the color scheme on the next table row*/}
							<tr>
								<th scope="row">
									<img
										src="https://static.thenounproject.com/png/1649999-200.png"
										id="add-data-btn"
										className="add-data-btn"
										onClick={displayPURCHASEInputFields}
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
										className="btn btn-outline-dark btnUpdate"
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
					<h4 className="item-table-label">Venta</h4>
					<table className="table table-striped">
						<thead>
							<tr>
								<th scope="col">Id</th>
								<th scope="col">Fecha</th>
								<th scope="col"># Invoice</th>
								<th scope="col">Peso (kg)</th>
								<th scope="col">Precio (MXN)</th>
							</tr>
						</thead>
						<tbody>
							{Stransaction_data.map(
								(
									{ stId, spId, date, saleInvoiceId, saleWeight, salePrice } //Data driven display of rows in data
								) =>
									realIndex.pId === { spId }.spId ? (
										<tr key={stId} className="table-row">
											<th scope="row">{stId}</th>
											<td>
												<input
													type="text"
													id={"row" + stId + "date"}
													className="tableInput tableDate"
													defaultValue={date}
												/>
											</td>

											<td>
												<input
													type="text"
													id={"row" + stId + "saleInvoiceId"}
													className="tableInput"
													defaultValue={saleInvoiceId}
												></input>
											</td>
											<td>
												<div className="tableData">
													<input
														type="text"
														id={"row" + stId + "saleWeight"}
														className="tableInput"
														defaultValue={
															saleWeight
														} /*onKeyDown={e =>{changeInvoiceId(e,purchaseInvoiceId,tId)}}*/
													/>
												</div>
											</td>
											<td>
												<div className="tableData">
													<input
														type="text"
														id={"row" + stId + "salePrice"}
														className="tableInput"
														defaultValue={
															salePrice
														} /*onKeyDown={e =>{changePurchaseWeight(e,purchaseWeight,tId)}}*/
													/>
												</div>
											</td>
										</tr>
									) : (
										<></>
									)
							)}
							<tr className="table-row" id="input-new-data-row-sale" hidden>
								<th scope="row">{"->"}</th>
								<td>
									<input
										type="text"
										id="input-row-sale-date"
										className="tableInput tableDate"
										defaultValue={moment().format("MM/DD/YYYY")}
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
							<tr>
								<th scope="row">
									<img
										src="https://static.thenounproject.com/png/1649999-200.png"
										id="add-sale-data-btn"
										className="add-data-btn"
										onClick={displaySALEInputFields}
										alt="add new purchase entry button"
									/>
								</th>
								<td></td>
								<td></td>
								<td></td>
								<td>
									<button
										type="button"
										className="btn btn-outline-dark btnUpdate"
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

			<Footer />
		</div>
	);
}

export default ItemInfo;
