import $ from "jquery";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";
import { VendorDataType } from "../types";

interface AddVendorProps {
	vendorData: VendorDataType;
	setVendorData: React.Dispatch<
		React.SetStateAction<VendorDataType | undefined>
	>;
}

function EditVendor({ vendorData, setVendorData }: AddVendorProps) {
	const [vendorName, setVendorName] = useState(vendorData?.name);
	const [vendorRFC, setVendorRFC] = useState(vendorData?.rfc);
	const [vendorAddress, setVendorAddress] = useState(vendorData?.address);
	const [vendorCity, setVendorCity] = useState(vendorData?.city);
	const [vendorState, setVendorState] = useState(vendorData?.state);
	const [vendorZipCode, setVendorZipCode] = useState(vendorData?.zipCode);

	function displayErrorMsg(
		errorBannerId: JQuery<HTMLElement>,
		message: string
	) {
		errorBannerId.removeAttr("hidden");
		errorBannerId.text(
			"Error - el " + message + " de el distribuidor no puede estar vacío"
		);
	}

	const updateVendor = async () => {
		$("#error-vendor").attr("hidden", 1);
		let uppercaseRFC = "";

		// Convert RFC to uppercase
		if (vendorRFC) uppercaseRFC = vendorRFC.toUpperCase();

		try {
			// Validate the input values
			if (vendorName.trim() === "") {
				throw new Error("El Nombre del Distribuidor no puede estar vacio");
			}

			const user = await getCurrentUserEmail();
			const token = await getAccessToken();

			// Create an array to store the changed fields
			const changedFields: string[] = [];

			// Compare the new values with the original values and populate the changedFields array
			if (uppercaseRFC.trim() !== vendorData?.rfc?.trim()) {
				changedFields.push("rfc");
			}
			if (vendorName.trim() !== vendorData.name.trim()) {
				changedFields.push("name");
			}
			if (vendorAddress?.trim() !== vendorData.address?.trim()) {
				changedFields.push("address");
			}
			if (vendorCity?.trim() !== vendorData.city?.trim()) {
				changedFields.push("city");
			}
			if (vendorState?.trim() !== vendorData.state?.trim()) {
				changedFields.push("state");
			}
			if (String(vendorZipCode).trim() !== String(vendorData.zipCode).trim()) {
				changedFields.push("zipCode");
			}

			if (changedFields.length === 0) {
				// No changes detected, hide the modal
				console.log("No changes");
				$("#vendor-modal-edit").attr("hidden", 1);
				return;
			}

			// Make the API call only if changes were detected
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/vendors/updateVendor`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						id: vendorData.id,
						rfc: uppercaseRFC,
						name: vendorName,
						address: vendorAddress,
						city: vendorCity,
						state: vendorState,
						zipCode: vendorZipCode,
						userEmail: user,
						changedFields: changedFields.join(","),
					}),
				}
			);

			if (response.ok) {
				// Handle successful response
				setVendorData({
					...vendorData,
					name: vendorName,
					rfc: uppercaseRFC,
					address: vendorAddress,
					city: vendorCity,
					state: vendorState,
					zipCode: vendorZipCode,
				});
				$("#vendor-modal-edit").attr("hidden", 1);
			} else {
				// Handle error response
				throw new Error("No se pudo actualizar el distribuidor");
			}
		} catch (error) {
			console.error("Error updating vendor:", error);
			// Handle error
			$("#error-vendor").text(`${error}`);
			$("#error-vendor").removeAttr("hidden");
		}
	};

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (!$(event.target).closest(".product-modal-content, .edit-btn").length) {
			$("#vendor-modal-edit").attr("hidden", 1);
		}
	});

	return (
		<div
			className="product-modal vendor-modal-edit"
			id="vendor-modal-edit"
			hidden
		>
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
					<h1 className="modal-title">Editar Distribuidor</h1>
				</div>

				<div className="modal-data-container">
					<form>
						<div className="form-group">
							<label htmlFor="vendorNameField" className="modal-text">
								Nombre de negocio/distribuidor
							</label>

							<input
								type="text"
								className="modal-input"
								id="vendorNameField"
								value={vendorName}
								onChange={(e) => {
									setVendorName(e.target.value);
								}}
							/>
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
								value={vendorRFC}
								onChange={(e) => {
									setVendorRFC(e.target.value);
								}}
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
								value={vendorAddress}
								onChange={(e) => {
									setVendorAddress(e.target.value);
								}}
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
								value={vendorCity}
								onChange={(e) => {
									setVendorCity(e.target.value);
								}}
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
								value={vendorState}
								onChange={(e) => {
									setVendorState(e.target.value);
								}}
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
								value={vendorZipCode}
								onChange={(e) => {
									setVendorZipCode(e.target.value);
								}}
							/>
						</div>
						<div className="form-group row">
							<button
								type="button"
								className="btn modal-btn"
								onClick={updateVendor}
							>
								Editar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditVendor;
