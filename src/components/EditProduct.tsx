import $ from "jquery";
import React, { useEffect, useState } from "react";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";
import { ProductDataType } from "../types";

interface EditProductProps {
	productInfo: ProductDataType;
	updateInfo: (
		newName: string,
		newDesc: string,
		newWeightQty: string,
		newWeightType: string
	) => void;
	setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditProduct({
	productInfo,
	updateInfo,
	setEditMode,
}: EditProductProps) {
	const [weightTypes, setWeightTypes] = useState([]);
	const [selectedType, setSelectedType] = useState("");
	const [newName, setNewName] = useState("");
	const [newDesc, setNewDesc] = useState("");
	const [newWeightQty, setNewWeightQty] = useState("");

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

	const updateProduct = async () => {
		// Check if required fields are empty
		if (!newName || !newWeightQty || !selectedType) {
			console.error("Favor de llenar toda la informacion necesaria");
			return;
		}

		// Create an array to store the changed fields
		const changedFields: string[] = [];

		// Compare the new values with the original values
		if (newName !== productInfo.name) {
			changedFields.push("name");
		}
		if (newDesc !== productInfo.description) {
			changedFields.push("description");
		}
		if (newWeightQty !== productInfo.weightQty.toString()) {
			changedFields.push("weightQty");
		}
		if (selectedType !== productInfo.weightType) {
			changedFields.push("weightType");
		}

		// Check if any fields have changed
		if (changedFields.length === 0) {
			console.log("No changes detected");
			setEditMode(false);
			return;
		}

		try {
			const token = await getAccessToken();
			const user = await getCurrentUserEmail();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/products/${encodeURI(
					productInfo?.id
				)}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						name: newName,
						desc: newDesc,
						weightQty: newWeightQty,
						weightType: selectedType,
						userEmail: user,
						change: changedFields.join(", "), // Generate the comma-separated string of changed fields
					}),
				}
			).then((res) => res.json());

			// Assuming a successful update
			setEditMode(false);

			updateInfo(newName, newDesc, newWeightQty, selectedType);
		} catch (error) {
			console.error("Error on updateProduct()", error);
		}
	};

	useEffect(() => {
		fetchWeightTypes();
	}, []);

	useEffect(() => {
		if (productInfo) {
			setNewName(productInfo.name);
			setNewDesc(productInfo.description || "");
			setNewWeightQty(String(productInfo.weightQty));
			setSelectedType(productInfo.weightType);
			console.log(productInfo);
		}
	}, [productInfo]);

	if (!productInfo) {
		return null;
	}

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(".product-modal-content, #editBtnProduct").length
		) {
			setEditMode(false);
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
							id="productNameFieldEdit"
							value={newName}
							onChange={(e) => {
								setNewName(e.target.value);
							}}
						/>
						<div className="form-group">
							<label htmlFor="productDescriptionField" className="modal-text">
								Descripción
							</label>
							<div className="">
								<input
									type="text"
									className="modal-input"
									id="productDescriptionFieldEdit"
									placeholder=" (opcional)"
									value={newDesc}
									onChange={(e) => {
										setNewDesc(e.target.value);
									}}
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
									id="inputQuantityType-edit"
									placeholder="Peso (kg)"
									value={newWeightQty}
									onChange={(e) => {
										setNewWeightQty(e.target.value);
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
								onClick={updateProduct}
							>
								Editar Producto
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
