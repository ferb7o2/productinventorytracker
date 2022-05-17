import React from "react";
import $ from "jquery";
import { useStateContext } from "./contexts/dataContext";
import { useHistory } from "react-router-dom";

//Components
import { NavBar } from "./components/NavBar";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createProductData } from "./graphql/mutations";

function AddProduct() {
	//Variables for keeping up with Page's Navigation
	const history = useHistory();

	//Enables the textbox for Bulk information Input
	//both of the next two functions make sure that no two checkboxes are checked at the same time
	function checkedBoxBULTO() {
		if ($("#gridCheckBulto").is(":checked")) {
			//if bulto checkbox is checked
			$("#inputQuantityType").attr("disabled", false); //enable the textbox right next to it
			$("#gridCheckKg").prop("checked", false); //disable the (kg) checkbox
			$("#gridCheckCaja").prop("checked", false); //disable the (caja) checkbox
		} else {
			$("#inputQuantityType").attr("disabled", true); //if not checked, disable textbox next to it
			$("#gridCheckKg").prop("checked", true); //enable the (kg) checkbox
		}
	}

	function checkedBoxCaja() {
		if ($("#gridCheckCaja").is(":checked")) {
			//if bulto checkbox is checked
			$("#inputQuantityType").attr("disabled", false); //enable the textbox right next to it
			$("#gridCheckKg").prop("checked", false); //disable the (kg) checkbox
			$("#gridCheckBulto").prop("checked", false); //disable the (caja) checkbox
		} else {
			$("#inputQuantityType").attr("disabled", true); //if not checked, disable textbox next to it
			$("#gridCheckKg").prop("checked", true); //enable the (kg) checkbox
		}
	}

	function checkedBoxKG() {
		if ($("#gridCheckKg").is(":checked")) {
			//if Kg checkbox is checked
			$("#inputQuantityType").attr("disabled", true); //disable Bulk textbox
			$("#gridCheckBulto").prop("checked", false); //disable bulk checkbox
			$("#gridCheckCaja").prop("checked", false); //disable bulk checkbox
		} else {
			$("#inputQuantityType").attr("disabled", false); //if not checked
			$("#gridCheckKg").prop("checked", false);
		}
	}

	//Triggered when (register) product button is pressed
	//Checks that product name is non-NULL && non-empty
	//Checks that if Bulk checkbox option is pressed, there exists a non-empty numeric value on the textBox
	const registerProduct = async (e) => {
		e.preventDefault();

		//check if both (name and Bulk textbox, if applicable) fields have been entered
		if ($("#productNameField").val().length === 0) {
			//if (product name) field is blank
			$("#error-product").removeAttr("hidden"); //display warning banner
			$("#error-product").text(
				"Error - el NOMBRE del producto no puede estar VACIO"
			); //with custom (no empty name) message
		} else {
			if (
				$("#gridCheckBulto").is(":checked") ||
				$("#gridCheckCaja").is(":checked")
			) {
				//if bulk checkbox is selected
				if ($("#inputQuantityType").val().length !== 0) {
					//check that it's textbox input is non-empty
					if (/^[0-9]+(?:\.[0-9]+)?$/.test($("#inputQuantityType").val())) {
						//REGEX - check if value on (kg) field is a number
						//if non-empty && a valid number, add the new product to our Product data (associative) array
						try {
							const result = await API.graphql(
								graphqlOperation(createProductData, {
									input: {
										name: $("#productNameField").val(),
										description: $("#productDescriptionField").val(),
										weightType: $("#gridCheckBulto").is(":checked")
											? "Bulto"
											: "Caja",
										weightQuantity: $("#inputQuantityType").val(),
									},
								})
							);
							history.goBack();
						} catch (error) {
							console.log("ERROR -> ", error);
						}

						//and return to the home screen
					} //if not a valid number
					else {
						$("#error-product").removeAttr("hidden"); //display error banner - Not a valid number
						$("#error-product").text(
							"Error - Peso de el bulto/caja debe de ser NUMERO"
						);
					}
				} //if (bulk) textbox is empty
				else {
					$("#error-product").removeAttr("hidden");
					$("#error-product").text(
						"Error - PESO de el bulto/caja no puede estar VACIO"
					);
				}
			} //if (kg) checkbox is selected
			else {
				//add Product to DB
				try {
					const result = await API.graphql(
						graphqlOperation(createProductData, {
							input: {
								name: $("#productNameField").val(),
								description: $("#productDescriptionField").val(),
								weightType: "Kg",
								weightQuantity: 1,
							},
						})
					);
					history.goBack();
				} catch (error) {
					console.log("ERROR -> ", error);
				}
			}
		}
	};

	return (
		<div className="Application">
			<head>Registrar Producto</head>
			<header>
				<div
					className="alert alert-danger"
					role="alert"
					id="error-product"
					onClick={() => {
						$("#error-product").attr("hidden", true);
					}}
					hidden
				>
					This is a danger alert—check it out!
				</div>

				<NavBar />
			</header>
			<div className="container">
				<div className="row">
					<h1>Producto Nuevo</h1>
				</div>

				<div className="fair-spacing" />
				<div className="row">
					<form>
						<div className="form-group row">
							<label
								htmlFor="productNameField"
								className="col-sm-2 col-form-label"
							>
								Nombre
							</label>
							<div className="col-sm-10">
								<input
									type="text"
									className="form-control"
									id="productNameField"
									placeholder="Nombre de Producto"
								/>
							</div>
						</div>
						<div className="form-group row">
							<label
								htmlFor="productDescriptionField"
								className="col-sm-2 col-form-label"
							>
								Descripción
							</label>
							<div className="col-sm-10">
								<input
									type="text"
									className="form-control"
									id="productDescriptionField"
									placeholder="Descripción (opcional)"
								/>
							</div>
						</div>
						<div className="form-group row">
							<div className="col-sm-2">Cantidad/Peso</div>
							<div className="col-sm-10">
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										id="gridCheckKg"
										onChange={checkedBoxKG}
										checked
									/>
									<label className="form-check-label" htmlFor="gridCheckKg">
										Kg
									</label>
								</div>
							</div>
						</div>
						<div className="form-group row">
							<div className="col-sm-2"></div>
							<div className="col-sm-1">
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										id="gridCheckBulto"
										onChange={checkedBoxBULTO}
									/>
									<label className="form-check-label" htmlFor="gridCheckBulto">
										Bulto
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										type="checkbox"
										id="gridCheckCaja"
										onChange={checkedBoxCaja}
									/>
									<label className="form-check-label" htmlFor="gridCheckCaja">
										Caja
									</label>
								</div>
							</div>
							<div className="col-sm-2">
								<div className="form-check">
									<input
										type="text"
										className="form-control"
										id="inputQuantityType"
										placeholder="Peso (kg)"
										disabled
									/>
								</div>
							</div>
						</div>
						<div className="fair-spacing" />
						<div className="form-group row">
							<div className="col-sm-10">
								<button
									type="submit"
									className="btn btn-outline-dark"
									onClick={registerProduct}
								>
									Registrar Producto
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default AddProduct;
