import $ from "jquery";
import { useHistory } from "react-router-dom";

import "../css/homePageStyle.css";
import { useLayoutEffect, useState } from "react";
import { VendorDataType, toDeleteVendorType } from "../types";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";

interface DeleteVendorProps {
	vendors: toDeleteVendorType[];
	setvData: React.Dispatch<React.SetStateAction<VendorDataType[]>>;
	setVendorCount: React.Dispatch<React.SetStateAction<number>>;
}

export function DeleteVendor({
	vendors,
	setvData,
	setVendorCount,
}: DeleteVendorProps) {
	const [failedDeletions, setFailedDeletions] = useState<string[]>([]);

	function blankAllFields() {}

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(".product-modal-content, #deleteVendorBtn")
				.length
		) {
			blankAllFields();
			$("#vendor-modal-delete").attr("hidden", 1);
		}
	});

	function closeModal() {
		$("#vendor-modal-delete").attr("hidden", 1);
	}

	const deleteMethod = async () => {
		console.log("DELETE TRIGGER");
		try {
			const token = await getAccessToken(); // Assuming you have a function to retrieve the authentication token
			const user = await getCurrentUserEmail();
			const failedDeletionsX: string[] = [];
			const updatedVendors: toDeleteVendorType[] = [];

			for (let i = 0; i < vendors.length; i++) {
				const { id, vname } = vendors[i];

				try {
					// Perform the delete operation for each vendor
					const response = await fetch(
						`${process.env.REACT_APP_API_URL}/vendors/${encodeURI(id)}`,
						{
							method: "DELETE",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ userEmail: user }),
						}
					);

					if (response.status >= 400 && response.status <= 599) {
						// Vendor deletion failed
						failedDeletionsX.push(vname);
					} else {
						// Vendor deletion was successful
						updatedVendors.push(vendors[i]);
					}
				} catch (error) {
					console.error(error);
					// Vendor deletion failed
					failedDeletionsX.push(vname);
				}
			}

			// Remove the successfully deleted vendors from the state
			setvData((prevData) =>
				prevData.filter(
					(vendor) =>
						!updatedVendors.some((updated) => updated.id === vendor.id)
				)
			);

			setVendorCount((prevCount) => prevCount - updatedVendors.length);

			if (failedDeletionsX.length > 0) {
				console.error(
					"Failed to delete the following vendors:",
					failedDeletions
				);
				setFailedDeletions(failedDeletionsX);
			} else {
				closeModal();
			}
		} catch (error) {
			console.error("ERROR deleting vendor -> ", error);
		}
	};

	useLayoutEffect(() => {
		(
			document.getElementById("confirm-product-btn") as HTMLInputElement
		).disabled = true;
	}, []);

	function checkIfCanErase() {
		let textBox = $("#product-confirm-field");
		if (textBox.val() == "BORRAR") {
			$("#confirm-product-btn").removeAttr("disabled");
		} else {
			(
				document.getElementById("confirm-product-btn") as HTMLInputElement
			).disabled = true;
		}
	}

	return (
		<div className="product-modal" id="vendor-modal-delete" hidden>
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
					<h1 className="modal-title">Borrar Distribuidor</h1>
				</div>

				<div className="modal-data-container">
					{failedDeletions.length > 0 && (
						<>
							<p>Ocurrió un error al borrar:</p>
							{failedDeletions.map((vendorName) => (
								<p key={`failed-map-item-${vendorName}`}>{vendorName}</p>
							))}
						</>
					)}
					{vendors.length > 1 ? (
						<p className="delete-warning">
							Estas apunto de borrar los {vendors.length} siguientes
							distribuidores:
						</p>
					) : (
						<p className="delete-warning">
							Estas apunto de borrar el siguiente distribuidor:
						</p>
					)}
				</div>

				<div className="tble-container">
					<table className="tble-container">
						<thead>
							<tr className="thead-row">
								<th scope="col" className="product-delete-col">
									Nombre
								</th>
								<th scope="col" className="id-delete-col">
									Id
								</th>
							</tr>
						</thead>
						<tbody>
							{vendors.map(({ id, vname }) => (
								<tr key={"todelvendor-" + id}>
									<td className="product-delete-col">{vname}</td>
									<td className="id-delete-col id-col-data">{id}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="delete-confirm-div">
					<form>
						<label htmlFor="productNameField" className="modal-text">
							Escribe BORRAR para confirmar
						</label>

						<input
							type="text"
							className="modal-input"
							id="product-confirm-field"
							onChange={checkIfCanErase}
						/>
					</form>

					<div className="delete-confirm-btn-div">
						<p className="product-cancel-btn" onClick={closeModal}>
							Cancelar
						</p>
						<button
							type="submit"
							className="btn modal-btn confirm-product-btn"
							id="confirm-product-btn"
							onClick={deleteMethod}
						>
							Confirmar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
