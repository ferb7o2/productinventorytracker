import $ from "jquery";

import "../css/homePageStyle.css";
import { useEffect, useState } from "react";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";
import { ProductDataType } from "../types";

interface AddProductProps {
	addProductTrigger: (product: ProductDataType) => void;
}

export function AddProduct({ addProductTrigger }: AddProductProps) {
	const [weightTypes, setWeightTypes] = useState([]);

	async function fetchWeightTypes() {
		try {
			const token = await getAccessToken();
			const data = await fetch(`${process.env.REACT_APP_API_URL}/weightTypes`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then((res) => res.json());

			if (data.length > 0) {
				setWeightTypes(data);
			}
		} catch (error) {
			console.error(
				"Error retrieving Weight Type data (fetchWeightTypes)",
				error
			);
		}
	}

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

	const registerProduct = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		$("#error-product").attr("hidden", 1);

		const productName = (
			document.getElementById("productNameField") as HTMLInputElement
		)?.value;
		const productDescription = (
			document.getElementById("productDescriptionField") as HTMLInputElement
		)?.value;
		const selectedType = (
			document.querySelector(
				'input[name="bulk_type"]:checked'
			) as HTMLInputElement
		)?.value;
		const weightQuantity = (
			document.getElementById("inputQuantityType-edit") as HTMLInputElement
		)?.value;

		try {
			if (!productName || !selectedType) {
				throw new Error("Favor de llenar toda la informacion necesaria");
			}

			const user = await getCurrentUserEmail();
			const token = await getAccessToken();
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/products/registerProduct`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						name: productName,
						description: productDescription,
						weightType: selectedType,
						weightQty: weightQuantity ? weightQuantity : "1",
						userEmail: user,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				const product = {
					id: data.id,
					name: productName,
					description: productDescription,
					weightType: selectedType,
					weightQty: weightQuantity ? Number(weightQuantity) : 1,
				};
				addProductTrigger(product);
				blankAllFields();
				$("#product-modal").attr("hidden", 1);
			} else {
				// Product registration failed, handle the error
				throw new Error("No se pudo registrar el producto");
			}
		} catch (error) {
			console.error("Error registering product:", error);
			$("#error-product").text(`${error}`);
			$("#error-product").removeAttr("hidden");
		}
	};

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(".product-modal-content, .addProductBtn").length
		) {
			blankAllFields();
			$("#product-modal").attr("hidden", 1);
		}
	});

	useEffect(() => {
		fetchWeightTypes();
	}, []);

	return (
		<div className="product-modal" id="product-modal" hidden>
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
					<h1 className="modal-title">Registrar Producto</h1>
				</div>

				<div className="modal-data-container">
					<form>
						<label htmlFor="productNameField" className="modal-text">
							Nombre
						</label>

						<input type="text" className="modal-input" id="productNameField" />
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
												onChange={() => {
													//setSelectedType(type);
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
									id="inputQuantityType-edit"
									placeholder="Peso (kg)"
									onChange={(e) => {
										//setNewWeightQty(e.target.value);
									}}
									required
								/>
							</div>
						</div>

						<div className="fair-spacing" />
						<div className="form-group row">
							<button
								type="button"
								className="btn modal-btn"
								onClick={registerProduct}
							>
								Registrar Producto
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
