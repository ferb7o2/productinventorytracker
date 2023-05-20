import * as moment from "moment";
import $ from "jquery";
import { PtransactionDataType, VendorDataType } from "../types";
import { getAccessToken } from "../Cognito";
import { Response } from "node-fetch";

interface AddPurchaseRowProps {
	vendorData: VendorDataType[];
	pId?: string;
	addItems: (
		newItems: PtransactionDataType[],
		newAdded: Boolean,
		newYear: string
	) => void;
	setDiff: (difference: number) => void;
}

export function AddPurchaseRow(props: AddPurchaseRowProps) {
	const { vendorData, pId, addItems, setDiff } = props;

	function displayPURCHASEInputFields() {
		$("#input-row-vId").val("");
		//Delete all data on fields just incase it is already filled

		$("#input-row-vId").val("");
		$("#input-row-purchaseInvoiceId").val("");
		$("#input-row-purchaseWeight").val("");
		$("#input-row-purchasePrice").val("");

		$("#btnUpdate").removeAttr("hidden");
		$("#input-new-data-row").removeAttr("hidden");
	}

	function nameForId(
		vNamePassed: string | number | string[] | null | undefined
	) {
		if (vNamePassed != null) {
			const vendor = vendorData.find(({ name }, i) => vNamePassed == name);
			if (vendor != undefined) return vendor.id;
		}
		return "error";
	}

	const addNewPURCHASEDataRow = async () => {
		//Make a pointer of that Error Template HTML tag since we will be using it alot
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden
		let vendorId = "error";
		vendorId = nameForId($("#input-row-vId").val());

		if (vendorId === "error") {
			errorTemplate.text(
				"Error - el nombre del distribuidor no es valido, asegurate de que lo escojas de la lista"
			);
			errorTemplate.removeAttr("hidden");
			return;
		}

		const purchase = {
			id: "we dont use it",
			productId: pId || "0",
			date: $("#input-row-date").val()?.toString(),
			invoiceId: $("#input-row-purchaseInvoiceId").val(),
			qty: $("#input-row-purchaseWeight").val(),
			price: $("#input-row-purchasePrice").val(),
			vendorId: vendorId,
			notes: "",
			enBodega: 1, //change in the future
		};

		try {
			if (Number(purchase.qty) <= 0)
				throw Error("Checa que la cantidad sea valida");
			const token = await getAccessToken();
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases?productId=${purchase.productId}&date=${purchase.date}&invoiceId=${purchase.invoiceId}&price=${purchase.price}&qty=${purchase.qty}&vendorId=${purchase.vendorId}&enBodega=${purchase.enBodega}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (response.ok) {
				const datax = await response.json();
				// Access the new record information from `datax` here

				let item = datax.purchase;
				addItems([item], true, datax.purchase.date?.substring(0, 4));
			}

			$("#input-new-data-row").attr("hidden", 1);
			$("#btnUpdate").attr("hidden", 1);

			if (purchase.qty) setDiff(Number(purchase.qty));
		} catch (error) {
			window.scrollTo(0, 0);
			console.error("ERROR Adding into PurchaseTransaction DB -> ", error);
			errorTemplate.text("Error - al agregar compra - " + error);
			errorTemplate.removeAttr("hidden");
		}
	};

	return (
		<>
			<tr
				className="table-row input-new-data-row"
				id="input-new-data-row"
				hidden
			>
				<th scope="row"></th>
				<td>
					<input
						required
						type="text"
						id="input-row-date"
						className="tableInput tableDate"
						defaultValue={moment.default().format("YYYY-MM-DD")}
					/>
				</td>
				<td>
					<input
						required
						list="vendors"
						type="text"
						id="input-row-vId"
						className="tableInput"
					/>

					<datalist id="vendors">
						{vendorData.map(({ id, name }) => (
							<option key={id} value={name} id={id} />
						))}
					</datalist>
				</td>
				<td>
					<div className="tableData">
						<input
							required
							type="text"
							id="input-row-purchaseInvoiceId"
							className="tableInput"
						/>
					</div>
				</td>
				<td>
					<div className="tableData">
						<input
							required
							type="number"
							id="input-row-purchaseWeight"
							className="tableInput"
						/>
					</div>
				</td>
				<td>
					<div className="tableData">
						<input
							required
							type="number"
							id="input-row-purchasePrice"
							className="tableInput"
						/>
					</div>
				</td>

				<td></td>
				<td></td>
			</tr>
			<tr hidden></tr>
			{/* just a hidden element to not break the color scheme on the next table row*/}
			<tr className="input-new-data-row">
				<td scope="row" className="select-col">
					<img
						src={require("../assets/icons/add-attributed.png")}
						id="add-data-btn"
						className=""
						onClick={displayPURCHASEInputFields}
						alt="add new purchase entry button"
					/>
				</td>
				<td className="table-filler"></td>
				<td className="table-filler"></td>
				<td className="table-filler"></td>
				<td className="table-filler"></td>
				<td className="table-filler"></td>
				<td className="btn-col">
					<button
						type="button"
						className="btn"
						id="btnUpdate"
						onClick={addNewPURCHASEDataRow}
						hidden
					>
						Actualizar
					</button>
				</td>
			</tr>
		</>
	);
}
