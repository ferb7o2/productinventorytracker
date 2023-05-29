import $ from "jquery";
import { useEffect, useState } from "react";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";
import { VendorDataType } from "../types";

interface AddVendorProps {
	vendorData: VendorDataType;
	setVendorData: React.Dispatch<
		React.SetStateAction<VendorDataType | undefined>
	>;
	setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditVendor({
	vendorData,
	setVendorData,
	setIsEditable,
}: AddVendorProps) {
	const [vendorName, setVendorName] = useState("");
	const [vendorRFC, setVendorRFC] = useState("");
	const [vendorAddress, setVendorAddress] = useState("");
	const [vendorCity, setVendorCity] = useState("");
	const [vendorState, setVendorState] = useState("");
	const [vendorZipCode, setVendorZipCode] = useState("");

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
			if (uppercaseRFC.trim() !== vendorData.rfc?.trim()) {
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
				setIsEditable(false);
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
				setIsEditable(false);
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
			setIsEditable(false);
		}
	});

	useEffect(() => {
		if (vendorData) {
			setVendorName(vendorData?.name);
			setVendorRFC(vendorData.rfc || "");
			setVendorAddress(vendorData.address || "");
			setVendorCity(vendorData.city || "");
			setVendorState(vendorData.state || "");
			setVendorZipCode(vendorData.zipCode || "");
		}
	}, [vendorData]);

	return (
		<div className="product-modal vendor-modal-edit" id="vendor-modal-edit">
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
								autoComplete="off"
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
								autoComplete="off"
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
