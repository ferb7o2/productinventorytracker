import $ from "jquery";
import { useLayoutEffect, useState } from "react";

//Import CSS Styling
import "../css/homePageStyle.css";

//Import Types
import { toDeletePurchaseType, toDeleteSaleType } from "../types";

//Import AWS Cognito - Authentication
import { getAccessToken } from "../Cognito";

export function DeleteTransaction(props: {
	purchase: toDeletePurchaseType[];
	sale: toDeleteSaleType[];
	currentItemId: string;
}) {
	const [error, setError] = useState("");

	function blankAllFields() {}

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(".product-modal-content, #deleteTransactionBtn")
				.length
		) {
			blankAllFields();
			$("#product-item-modal-delete").attr("hidden", 1);
		}
	});

	function closeModal() {
		$("#product-item-modal-delete").attr("hidden", 1);
	}

	const deleteMethod = async () => {
		try {
			const token = await getAccessToken();

			for (let i = 0; i < props.purchase.length; ++i) {
				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/purchases/${props.purchase[i].pId}`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to delete purchase");
				}
			}

			for (let i = 0; i < props.sale.length; ++i) {
				const response = await fetch(
					`${process.env.REACT_APP_API_URL}/sales/${props.sale[i].sId}`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to delete sale");
				}
			}

			window.location.href = `/item/${props.currentItemId}`;
		} catch (error) {
			console.error("ERROR deleting Transaction -> ", error);
			// Propagate the error or display an error message to the user
			setError(`ERROR al borrar transaccion: ` + error);
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
		<div className="product-modal" id="product-item-modal-delete" hidden>
			<div
				className="alert alert-danger"
				role="alert"
				id="error-product-delete"
				onClick={() => {
					$("#error-product-delete").attr("hidden", 1);
				}}
				hidden
			>
				This is a danger alert—check it out!
			</div>
			<div className="product-modal-content">
				<div className="modal-title-row">
					<h1 className="modal-title">Borrar Transacciones</h1>
				</div>

				<div className="modal-data-container">
					{error ? <p>{error}</p> : <></>}
					{props.purchase.length + props.sale.length > 1 ? (
						<p className="delete-warning">
							Estas apunto de borrar las siguientes{" "}
							{props.purchase.length + props.sale.length} transacciones:
						</p>
					) : (
						<p className="delete-warning">
							Estas apunto de borrar la siguiente transaccion:
						</p>
					)}
				</div>

				{props.purchase.length > 0 ? (
					<>
						<h4 className="item-table-label delete-subtitle">Compra</h4>

						<div className="tble-container">
							<table className="tble-container">
								<thead>
									<tr className="thead-row">
										<th scope="col" className="product-item-date-col">
											Fecha
										</th>
										<th scope="col" className="product-item-invoice-col">
											# Factura
										</th>
										<th
											scope="col"
											className="id-delete-col product-item-id-col"
										>
											Id
										</th>
									</tr>
								</thead>
								<tbody>
									{props.purchase.map(({ pId, pDate, pInvoiceId }) => (
										<tr key={"todelpurchase-" + pId}>
											<td className="product-item-date-col">{pDate}</td>
											<td className="product-item-invoice-col">{pInvoiceId}</td>
											<td className="id-delete-col id-col-data product-item-id-col">
												{pId}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				) : (
					<></>
				)}

				{props.sale.length > 0 ? (
					<>
						<h4 className="item-table-label delete-subtitle">Venta</h4>

						<div className="tble-container">
							<table className="tble-container">
								<thead>
									<tr className="thead-row">
										<th scope="col" className="product-item-date-col">
											Fecha
										</th>
										<th scope="col" className="product-item-invoice-col">
											# Factura
										</th>
										<th
											scope="col"
											className="id-delete-col product-item-id-col"
										>
											Id
										</th>
									</tr>
								</thead>
								<tbody>
									{props.sale.map(({ sId, sDate, sInvoiceId }) => (
										<tr key={"todelsale-" + sId}>
											<td className="product-item-date-col">{sDate}</td>
											<td className="product-item-invoice-col">{sInvoiceId}</td>
											<td className="id-delete-col id-col-data product-item-id-col">
												{sId}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</>
				) : (
					<></>
				)}

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
