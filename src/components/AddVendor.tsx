import React from "react";
import $ from "jquery";
import { useHistory } from "react-router-dom";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createVendorData } from "./../graphql/mutations";

//Components
import { NavBar } from "./../components/NavBar";

function AddVendor() {
	const history = useHistory();

	function displayErrorMsg(
		errorBannerId: JQuery<HTMLElement>,
		message: string
	) {
		errorBannerId.removeAttr("hidden");
		errorBannerId.text(
			"Error - el " + message + " de el distribuidor no puede estar vacío"
		);
	}

	function validateStringInput(input: string) {
		//is it empty?
		if (input.length === 0) return false;
		return true;
	}

	function blankAllFields() {
		$(".modal-input").val("");
	}

	const registerVendor = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		let uppercaseRFC;

		if (validateStringInput($("#vendorNameField").val()?.toString() || "")) {
			if (validateStringInput($("#vendorRFCField").val()?.toString() || "")) {
				uppercaseRFC = $("#vendorRFCField").val()?.toString()?.toUpperCase();
			}

			try {
				const result = await API.graphql(
					graphqlOperation(createVendorData, {
						input: {
							name: $("#vendorNameField").val(),
							rfc: uppercaseRFC,
							address: $("#vendorAddressField").val(),
							city: $("#vendorCityField").val(),
							state: $("#vendorStateField").val(),
							zipCode: $("#vendorZipCodeField").val(),
						},
					})
				);
				history.push("./vendor");
			} catch (error) {
				console.log("ERROR Registering Vendor -> ", error);
			}
		} else {
			displayErrorMsg($("#error-vendor"), "NOMBRE");
		}
	};

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(".product-modal-content, .addVendorBtn").length
		) {
			blankAllFields();
			$("#vendor-modal").attr("hidden", 1);
		}
	});

	return (
		<div className="product-modal vendor-modal" id="vendor-modal" hidden>
			<div
				className="alert alert-danger"
				role="alert"
				id="error-vendor"
				onClick={() => {
					$("#error-vendor").attr("hidden", 1);
				}}
				hidden
			>
				This is a danger alert—check it out!
			</div>
			<div className="product-modal-content">
				<div className="modal-title-row">
					<h1 className="modal-title">Registrar Distribuidor</h1>
				</div>

				<div className="modal-data-container">
					<form>
						<div className="form-group">
							<label htmlFor="vendorNameField" className="modal-text">
								Nombre de negocio/distribuidor
							</label>

							<input type="text" className="modal-input" id="vendorNameField" />
						</div>
						<div className="form-group">
							<label htmlFor="vendorRFCField" className="modal-text">
								RFC
							</label>

							<input
								type="text"
								className="modal-input"
								id="vendorRFCField"
								placeholder="(opcional)"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="vendorAddressField" className="modal-text">
								Direccion
							</label>

							<input
								type="text"
								className="modal-input"
								id="vendorAddressField"
								placeholder="(opcional)"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="vendorCityField" className="modal-text">
								Ciudad
							</label>

							<input
								type="text"
								className="modal-input"
								id="vendorCityField"
								placeholder="(opcional)"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="vendorStateField" className="modal-text">
								Estado
							</label>

							<input
								type="text"
								className="modal-input"
								id="vendorStateField"
								placeholder="(opcional)"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="vendorZipCodeField" className="modal-text">
								Codigo Postal
							</label>

							<input
								type="number"
								className="modal-input"
								id="vendorZipCodeField"
								placeholder="(opcional)"
							/>
						</div>
						<div className="form-group row">
							<button
								type="submit"
								className="btn modal-btn"
								onClick={registerVendor}
							>
								Registrar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default AddVendor;
