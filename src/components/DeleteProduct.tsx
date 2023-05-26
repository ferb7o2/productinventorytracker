import $ from "jquery";

import "../css/homePageStyle.css";
import { useLayoutEffect, useState } from "react";
import { toDeleteType } from "../types";
import { getAccessToken } from "../Cognito";

export function DeleteProduct(props: {
	products: toDeleteType[];
	removeProductsByIds: (idsToRemove: { pId: string; pName: string }[]) => void;
}) {
	const [failedDeletions, setFailedDeletions] = useState<string[]>([]);

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(
				".product-modal-content, .deleteProductBtn, .product-cancel-btn"
			).length
		) {
			$("#product-modal-delete").attr("hidden", 1);
		}
	});

	function closeModal() {
		$("#product-modal-delete").attr("hidden", 1);
	}

	const deleteMethod = async () => {
		const testProducts = [
			{ pName: "Hoja P/Tamal Chisemex", pId: "2aes" },
			{ pName: "Caja Cacahuate Cantinero 8 Kg.", pId: "324sd5" },
			{ pName: "Hoja P/isemex", pId: "2aes" },
		];

		try {
			const token = await getAccessToken();
			console.log(token);
			const failedDeletions: string[] = [];
			const updatedProducts: toDeleteType[] = [];

			for (let i = 0; i < props.products.length; i++) {
				const { pId, pName } = props.products[i];

				try {
					const response = await fetch(
						`${process.env.REACT_APP_API_URL}/products/${pId}/delete`,
						{
							method: "PUT",
							headers: {
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (!response.ok) {
						failedDeletions.push(pName);
					} else {
						updatedProducts.push(props.products[i]);
					}
				} catch (error) {
					console.error(error);
					failedDeletions.push(pName);
				}
			}

			setFailedDeletions(failedDeletions);
			props.removeProductsByIds(updatedProducts);

			if (failedDeletions.length > 0) {
				console.error(
					"Failed to delete the following products:",
					failedDeletions
				);
			} else {
				closeModal();
			}
		} catch (error) {
			console.error("ERROR deleting product -> ", error);
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
		<div className="product-modal" id="product-modal-delete" hidden>
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
					<h1 className="modal-title">Borrar Producto</h1>
				</div>

				<div className="modal-data-container">
					{failedDeletions.length > 0 && (
						<>
							<p>Ocurrió un error al borrar:</p>
							{failedDeletions.map((productName) => (
								<p key={`failed-map-item-${productName}`}>{productName}</p>
							))}
						</>
					)}
					{props.products.length > 1 ? (
						<p className="delete-warning">
							Estás a punto de borrar los {props.products.length} siguientes
							productos:
						</p>
					) : (
						<p className="delete-warning">
							Estás a punto de borrar el siguiente producto:
						</p>
					)}
				</div>

				<div className="tble-container">
					<table className="tble-container">
						<thead>
							<tr className="thead-row">
								<th scope="col" className="product-delete-col">
									Producto
								</th>
								<th scope="col" className="id-delete-col">
									Id
								</th>
							</tr>
						</thead>
						<tbody>
							{props.products.map(({ pId, pName }) => (
								<tr key={"prod-" + pId}>
									<td className="product-delete-col">{pName}</td>
									<td className="id-delete-col id-col-data">{pId}</td>
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
