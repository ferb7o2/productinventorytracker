import $ from "jquery";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";
import { VendorDataType } from "../types";

interface AddVendorProps {
	setVData: React.Dispatch<React.SetStateAction<VendorDataType[]>>;
	setVendorCount: React.Dispatch<React.SetStateAction<number>>;
}

function AddVendor({ setVData, setVendorCount }: AddVendorProps) {
	const history = useHistory();
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

	function blankAllFields() {
		$(".modal-input").val("");
	}

	const registerVendor = async () => {
		$("#error-vendor").attr("hidden", 1);
		let uppercaseRFC: string;

		// Convert RFC to uppercase
		uppercaseRFC = vendorRFC.toUpperCase();

		try {
			// Validate the input values
			if (vendorName.trim() === "") {
				throw new Error("El Nombre del Distribuidor no puede estar vacio");
			}

			const user = await getCurrentUserEmail();
			const token = await getAccessToken();

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/vendors/registerVendor`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						rfc: uppercaseRFC,
						name: vendorName,
						address: vendorAddress,
						city: vendorCity,
						state: vendorState,
						zipCode: vendorZipCode,
						userEmail: user,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				// Handle successful response
				setVendorCount((prevState) => prevState + 1);
				setVData((prevState) => [
					{
						id: data.id,
						name: vendorName,
						rfc: uppercaseRFC,
						address: vendorAddress,
						city: vendorCity,
						state: vendorState,
						zipCode: vendorZipCode,
						rowNum: 0, // Add the missing property
					},
					...prevState,
				]);

				//clear fields
				setVendorName("");
				setVendorRFC("");
				setVendorAddress("");
				setVendorCity("");
				setVendorState("");
				setVendorZipCode("");
				$("#vendor-modal").attr("hidden", 1);
			} else {
				// Handle error response
				throw new Error("No se pudo registrar el distribuidor");
			}
		} catch (error) {
			console.error("Error registering vendor:", error);
			// Handle error
			$("#error-vendor").text(`${error}`);
			$("#error-vendor").removeAttr("hidden");
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
