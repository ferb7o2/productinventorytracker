import $ from "jquery";
import { useHistory } from "react-router-dom";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createProductData } from "../graphql/mutations";

import "../css/homePageStyle.css";

export function AddProduct() {
	//Variables for keeping up with Page's Navigation
	const history = useHistory();

	//Enables the textbox for Bulk information Input
	function enableBulkTextBox() {
		$("#inputQuantityType").removeAttr("disabled"); //enable the textbox right next to it
	}

	function disableBulkTextBox() {
		$("#inputQuantityType").attr("disabled", 1); //enable the textbox right next to it
	}

	function blankAllFields() {
		$(".modal-input").val("");
		$(".radio-btn").prop("checked", false);
	}

	//Triggered when (register) product button is pressed
	//Checks that product name is non-NULL && non-empty
	//Checks that if Bulk checkbox option is pressed, there exists a non-empty numeric value on the textBox
	const registerProduct = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		//check if both (name and Bulk textbox, if applicable) fields have been entered
		if ($("#productNameField").val()?.toString()?.length === 0) {
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
				if ($("#inputQuantityType").val()?.toString().length !== 0) {
					//check that it's textbox input is non-empty

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
						history.push("/");
					} catch (error) {
						console.log("ERROR -> ", error);
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
				if ($("#gridCheckKg").is(":checked")) {
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
						history.push("/");
					} catch (error) {
						console.log("ERROR -> ", error);
					}
				} else {
					$("#error-product").removeAttr("hidden");
					$("#error-product").text("Error - Debes escoger un tipo de peso");
				}
			}
		}
	};

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(".product-modal-content, .addProductBtn").length
		) {
			blankAllFields();
			$("#product-modal").attr("hidden", 1);
		}
	});

	return (
		<div className="product-modal" id="product-modal" hidden>
			<div
				className="alert alert-danger"
				role="alert"
				id="error-product"
				onClick={() => {
					$("#error-product").attr("hidden", 1);
				}}
				hidden
			>
				This is a danger alert—check it out!
			</div>
			<div className="product-modal-content">
				<div className="modal-title-row">
					<h1 className="modal-title">Registrar Producto</h1>
				</div>

				<div className="modal-data-container">
					<form>
						<label htmlFor="productNameField" className="modal-text">
							Nombre
						</label>

						<input type="text" className="modal-input" id="productNameField" />
						<div className="form-group">
							<label htmlFor="productDescriptionField" className="modal-text">
								Descripción
							</label>
							<div className="">
								<input
									type="text"
									className="modal-input"
									id="productDescriptionField"
									placeholder=" (opcional)"
								/>
							</div>
						</div>

						<div className="modal-qty-row">
							<div className="">Cantidad/Peso</div>
							<div className="modal-qty-row-left">
								<input
									type="radio"
									id="gridCheckKg"
									name="bulk_type"
									value="kg"
									className="radio-btn"
									onClick={disableBulkTextBox}
								/>
								<label htmlFor="gridCheckKg" className="radio-label">
									Kg
								</label>

								<input
									type="radio"
									id="gridCheckBulto"
									name="bulk_type"
									value="bulto"
									className="radio-btn"
									onClick={enableBulkTextBox}
								/>
								<label htmlFor="gridCheckBulto" className="radio-label">
									Bulto
								</label>

								<input
									type="radio"
									id="gridCheckCaja"
									name="bulk_type"
									value="caja"
									className="radio-btn"
									onClick={enableBulkTextBox}
								/>
								<label htmlFor="gridCheckCaja" className="radio-label">
									Caja
								</label>

								<input
									type="number"
									className="modal-qty-weight modal-input"
									id="inputQuantityType"
									placeholder="Peso (kg)"
									disabled
								/>
							</div>
						</div>

						<div className="fair-spacing" />
						<div className="form-group row">
							<button
								type="submit"
								className="btn modal-btn"
								onClick={registerProduct}
							>
								Registrar Producto
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
