import React from "react";
import $ from "jquery";
import { useHistory } from "react-router-dom";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createVendorData } from "./graphql/mutations";

//Components
import { NavBar } from "./components/NavBar";

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
				history.goBack();
			} catch (error) {
				console.log("ERROR Registering Vendor -> ", error);
			}
		} else {
			displayErrorMsg($("#error-vendor"), "NOMBRE");
		}
	};

	return (
		<div className="Application">
			<header>
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
				<NavBar />
			</header>
			<div className="container">
				<div className="row">
					<h1>Nuevo distribuidor</h1>
				</div>

				<div className="fair-spacing" />
				<div className="row">
					<form>
						<div className="form-group row">
							<label
								htmlFor="vendorNameField"
								className="col-sm-2 col-form-label"
							>
								Nombre
							</label>
							<div className="col-sm-10">
								<input
									type="text"
									className="form-control"
									id="vendorNameField"
									placeholder="Nombre de Negocio/Distribuidor"
								/>
							</div>
						</div>
						<div className="form-group row">
							<label
								htmlFor="vendorRFCField"
								className="col-sm-2 col-form-label"
							>
								RFC
							</label>
							<div className="col-sm-10">
								<input
									type="text"
									className="form-control"
									id="vendorRFCField"
									placeholder="RFC (opcional)"
								/>
							</div>
						</div>
						<div className="form-group row">
							<label
								htmlFor="vendorAddressField"
								className="col-sm-2 col-form-label"
							>
								Direccion
							</label>
							<div className="col-sm-10">
								<input
									type="text"
									className="form-control"
									id="vendorAddressField"
									placeholder="Direccion (opcional)"
								/>
							</div>
						</div>
						<div className="form-group row">
							<label
								htmlFor="vendorCityField"
								className="col-sm-2 col-form-label"
							>
								Ciudad
							</label>
							<div className="col-sm-10">
								<input
									type="text"
									className="form-control"
									id="vendorCityField"
									placeholder="Ciudad (opcional)"
								/>
							</div>
						</div>
						<div className="form-group row">
							<label
								htmlFor="vendorStateField"
								className="col-sm-2 col-form-label"
							>
								Estado
							</label>
							<div className="col-sm-10">
								<input
									type="text"
									className="form-control"
									id="vendorStateField"
									placeholder="Estado (opcional)"
								/>
							</div>
						</div>
						<div className="form-group row">
							<label
								htmlFor="vendorZipCodeField"
								className="col-sm-2 col-form-label"
							>
								Codigo Postal
							</label>
							<div className="col-sm-10">
								<input
									type="text"
									className="form-control"
									id="vendorZipCodeField"
									placeholder="Codigo Postal (opcional)"
								/>
							</div>
						</div>
						<div className="fair-spacing" />
						<div className="form-group row">
							<div className="col-sm-10">
								<button
									type="submit"
									className="btn btn-outline-dark"
									onClick={registerVendor}
								>
									Registrar
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default AddVendor;
