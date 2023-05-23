import $ from "jquery";
import { useHistory } from "react-router-dom";

import "../css/homePageStyle.css";
import { ProductDataType } from "../types";
import { useEffect, useState } from "react";
import { getAccessToken } from "../Cognito";

interface editProductProps {
	productInfo: ProductDataType | undefined;
}

export function EditProduct({ productInfo }: editProductProps) {
	//Variables for keeping up with Page's Navigation
	const history = useHistory();
	const [weightTypes, setWeightTypes] = useState([]);
	const [selectedType, setSelectedType] = useState("");

	//Enables the textbox for Bulk information Input
	function enableBulkTextBox() {
		$("#inputQuantityType").removeAttr("disabled"); //enable the textbox right next to it
	}

	function disableBulkTextBox() {
		$("#inputQuantityType").attr("disabled", 1); //enable the textbox right next to it
	}

	function blankAllFields() {
		$(".modal-input").val("");
		$(".radio-btn").prop("checked", false);
	}

	async function fetchWeightTypes() {
		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(`${process.env.REACT_APP_API_URL}/weightTypes`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			if (data.length > 0) {
				setWeightTypes(data);
			}
			console.log(data);
		} catch (error) {
			console.error(
				`Error retrieving Weight Type data (fechWeightTypes) `,
				error
			);
		}
	}

	useEffect(() => {
		fetchWeightTypes();
	}, []);

	useEffect(() => {
		if (productInfo && productInfo.weightType) {
			setSelectedType(productInfo.weightType);
		}
	}, [productInfo]);

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(".product-modal-content, .editProductBtn").length
		) {
			blankAllFields();
			$("#product-modal").attr("hidden", 1);
		}
	});

	return (
		<div className="product-modal" id="product-modal-edit">
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
					<h1 className="modal-title">Editar Producto</h1>
				</div>

				<div className="modal-data-container">
					<form>
						<label htmlFor="productNameField" className="modal-text">
							Nombre
						</label>

						<input
							type="text"
							className="modal-input"
							id="productNameField"
							value={productInfo?.name}
							required
							onChange={() => {}}
						/>
						<div className="form-group">
							<label htmlFor="productDescriptionField" className="modal-text">
								Descripción
							</label>
							<div className="">
								<input
									type="text"
									className="modal-input"
									id="productDescriptionField"
									placeholder=" (opcional)"
									value={productInfo?.description || ""}
									onChange={() => {}}
								/>
							</div>
						</div>

						<div className="modal-qty-row">
							<div className="">Cantidad/Peso</div>
							<div className="modal-qty-inner-row">
								<div className="modal-qty-row-left">
									{weightTypes.map(({ type }) => (
										<div key={`radio-${type}`}>
											<input
												required
												type="radio"
												id={`gridCheck${type}`}
												name="bulk_type"
												value={type}
												className="radio-btn"
												checked={type === selectedType}
												onChange={() => {
													setSelectedType(type);
												}}
											/>
											<label
												htmlFor={`gridCheck${type}`}
												className="radio-label"
											>
												{type}
											</label>
										</div>
									))}
								</div>
								<input
									type="number"
									className="modal-qty-weight modal-input"
									id="inputQuantityType"
									placeholder="Peso (kg)"
									disabled
								/>
							</div>
						</div>

						<div className="fair-spacing" />
						<div className="form-group row">
							<button type="button" className="btn modal-btn">
								Registrar Producto
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
