import $ from "jquery";
import "../css/EditNotes.css";
import { PtransactionDataType, StransactionDataType } from "../types";
import { useEffect, useState } from "react";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";

interface EditNotesProps {
	tId: string;
	notes: string;
	enBodega: boolean;
	setPTransactionData?: React.Dispatch<
		React.SetStateAction<PtransactionDataType[]>
	>;
	setSTransactionData?: React.Dispatch<
		React.SetStateAction<StransactionDataType[]>
	>;
	setViewNotes: React.Dispatch<React.SetStateAction<boolean>>;
	type: string;
}

function EditNotes({
	tId,
	notes,
	enBodega,
	setPTransactionData,
	setViewNotes,
	type,
	setSTransactionData,
}: EditNotesProps) {
	const [localNotes, setLocalNotes] = useState(notes);
	const [localEnBodega, setLocalEnBodega] = useState(false);

	function displayErrorMsg(
		errorBannerId: JQuery<HTMLElement>,
		message: string
	) {
		errorBannerId.removeAttr("hidden");
		errorBannerId.text(message);
	}

	const saveTrigger = async () => {
		$("#error-vendor").attr("hidden", 1);
		if (notes === localNotes && enBodega === localEnBodega) {
			// No changes detected
			setViewNotes(false);
			return;
		}

		// Create an array to store the changed fields
		const changedFields: string[] = [];

		// Compare the new values with the original values
		if (localNotes !== notes) {
			changedFields.push("notes");
		}
		if (localEnBodega !== enBodega) {
			changedFields.push("enBodega");
		}

		try {
			const token = await getAccessToken();
			const user = await getCurrentUserEmail();
			let response;

			if (type === "purchases") {
				response = await fetch(
					`${process.env.REACT_APP_API_URL}/${type}/${encodeURIComponent(
						tId
					)}/notes&enBodega`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							notes: localNotes,
							enBodega: localEnBodega,
							email: user,
							change: changedFields.join(","), // Generate the comma-separated string of changed fields
						}),
					}
				);
			} else {
				response = await fetch(
					`${process.env.REACT_APP_API_URL}/${type}/${encodeURIComponent(
						tId
					)}/notes`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							notes: localNotes,
							email: user,
						}),
					}
				);
			}

			if (response.ok) {
				// Update successful
				setViewNotes(false);

				if (type == "purchases" && setPTransactionData) {
					// Update the PtransactionDataType in state with the updated values
					setPTransactionData((prevData) =>
						prevData.map((pTransaction) =>
							pTransaction.id === tId
								? {
										...pTransaction,
										notes: localNotes,
										enBodega: localEnBodega,
								  }
								: pTransaction
						)
					);
				} else if (setSTransactionData) {
					setSTransactionData((prevData) =>
						prevData.map((sTransaction) =>
							sTransaction.id === tId
								? {
										...sTransaction,
										notes: localNotes,
								  }
								: sTransaction
						)
					);
				}
			} else {
				// Display error message
				displayErrorMsg(
					$("#error-vendor"),
					"no se pudo actualizar la informacion"
				);
			}
		} catch (error) {
			console.error("Error on saveTrigger()", error);
			displayErrorMsg(
				$("#error-vendor"),
				error + "no se pudo actualizar la informacion"
			);
		}
	};

	$(document).click(function (event) {
		//if you click on anything except the modal itself or the "open modal" link, close the modal

		if (
			!$(event.target).closest(".product-modal-content, .edit-trigger-img")
				.length
		) {
			setViewNotes(false);
		}
	});

	useEffect(() => {
		setLocalEnBodega(enBodega);
	}, [enBodega]);

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
					<h1 className="modal-title">Notas</h1>
				</div>

				<div className="modal-data-container">
					<form>
						<div className="form-group">
							<textarea
								className="notes-textarea"
								value={localNotes}
								onChange={(e) => setLocalNotes(e.target.value)}
							/>
						</div>

						{type === "purchases" && (
							<div className="form-check">
								<input
									className="form-check-input"
									type="checkbox"
									value=""
									id="defaultCheck1"
									checked={localEnBodega}
									onChange={(e) => setLocalEnBodega(e.target.checked)}
								/>
								<label className="form-check-label" htmlFor="defaultCheck1">
									En Bodega
								</label>
							</div>
						)}
						<div className="form-group row">
							<button
								type="button"
								className="btn modal-btn save-edit-trigger"
								onClick={saveTrigger}
							>
								Guardar
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditNotes;
