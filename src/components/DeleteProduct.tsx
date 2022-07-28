import $ from "jquery";
import { useHistory } from "react-router-dom";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createProductData, deleteProductData } from "../graphql/mutations";

import "../css/homePageStyle.css";
import { ChangeEvent, useEffect, useLayoutEffect } from "react";
import { toDeleteType } from "../types";

export function DeleteProduct(props: { products: toDeleteType[] }) {
	//Variables for keeping up with Page's Navigation
	const history = useHistory();

	function blankAllFields() {}

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(
				".product-modal-content, .deleteProductBtn, .product-cancel-btn"
			).length
		) {
			blankAllFields();
			$("#product-modal-delete").attr("hidden", 1);
		}
	});

	function closeModal() {
		$("#product-modal-delete").attr("hidden", 1);
	}

	const deleteMethod = async () => {
		console.log("DELETE TRIGGER");
		try {
			for (var i = 0; i < props.products.length; ++i) {
				const result = await API.graphql(
					graphqlOperation(deleteProductData, {
						input: {
							id: props.products[i].pId,
						},
					})
				);
			}
			history.push("/");
		} catch (error) {
			console.log("ERROR deleting product -> ", error);
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
					{props.products.length > 1 ? (
						<p className="delete-warning">
							Estas apunto de borrar los {props.products.length} siguientes
							productos:
						</p>
					) : (
						<p className="delete-warning">
							Estas apunto de borrar el siguiente producto:
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
								<tr>
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
