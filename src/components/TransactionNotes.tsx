import $ from "jquery";
import { useLayoutEffect, useState } from "react";

//Import CSS Styling
import "../css/homePageStyle.css";

//Import Types
import { toDeletePurchaseType, toDeleteSaleType } from "../types";

//Import AWS Cognito - Authentication
import { getAccessToken } from "../Cognito";

export function TransactionNotes(props: {
	transactionId: string;
	notes: String;
	enBodega: Boolean;
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
		$("#product-item-modal-notes").attr("hidden", 1);
	}

	return (
		<div className="product-modal" id="product-item-modal-notes" hidden>
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

				<div className="modal-data-container"></div>

				<div className="delete-confirm-div">
					<form>
						<label htmlFor="productNameField" className="modal-text">
							Escribe BORRAR para confirmar
						</label>

						<input
							type="text"
							className="modal-input"
							id="product-confirm-field"
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
						>
							Confirmar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
