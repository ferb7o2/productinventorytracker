import * as moment from "moment";
import $ from "jquery";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";

interface AddSaleRowProps {
	pId?: string;
	addItems: (newItems: any, newAdded: Boolean, newYear?: String) => void;
	setDiff: (difference: number) => void;
}

export function AddSaleRow(props: AddSaleRowProps) {
	const { pId, addItems, setDiff } = props;

	function displaySALEInputFields() {
		$("#input-row-sId").val("");
		$("#input-row-saleInvoiceId").val("");
		$("#input-row-saleWeight").val("");

		$("#input-new-data-row-sale").removeAttr("hidden");
		$("#btnSaleUpdate").removeAttr("hidden");
	}

	const addNewSaleDataRow = async () => {
		//Make a pointer of that Error Template HTML tag since we will be using it alot
		var errorTemplate = $("#error-template");
		errorTemplate.attr("hidden", 1); //keep it hidden

		const sale = {
			id: "",
			productId: pId,
			date: $("#input-row-sale-date").val()?.toString(),
			invoiceId: $("#input-row-saleInvoiceId").val(),
			qty: $("#input-row-saleWeight").val(),
			price: $("#input-row-salePrice").val(),
			notes: "",
		};

		try {
			if (sale.date?.length == 0) throw Error("Checa que la fecha sea valida");
			if (Number(sale.qty) <= 0)
				throw Error("Checa que la cantidad sea valida");
			if (Number(sale.price) <= 0)
				throw Error("Checa que el precio sea valido");
			const token = await getAccessToken();
			const user = await getCurrentUserEmail();
			const response = await fetch(`${process.env.REACT_APP_API_URL}/sales`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					userEmail: user,
					productId: sale.productId,
					date: sale.date,
					invoiceId: sale.invoiceId,
					price: sale.price,
					qty: sale.qty,
				}),
			});
			if (response.ok) {
				const datax = await response.json();
				// Access the new record information from `datax` here

				let item = datax.sale;
				addItems([item], true, item.date?.substring(0, 4));
			} else {
				throw Error("Failed to add Sale");
			}

			$("#input-new-data-row-sale").attr("hidden", 1);
			$("#btnSaleUpdate").attr("hidden", 1);

			if (sale.qty) setDiff(-Number(sale.qty));
		} catch (error) {
			window.scrollTo(0, 0);
			console.error("ERROR Adding into SaleTransaction DB -> ", error);
			errorTemplate.text("Error - al agregar venta - " + error);
			errorTemplate.removeAttr("hidden");
		}
	};

	return (
		<>
			<tr
				className="table-row input-new-data-row"
				id="input-new-data-row-sale"
				hidden
			>
				<th scope="row"></th>
				<td className="none-col"></td>
				<td>
					<input
						type="text"
						id="input-row-sale-date"
						className="tableInput"
						defaultValue={moment.default().format("YYYY-MM-DD")}
					/>
				</td>
				<td>
					<input
						type="text"
						id="input-row-saleInvoiceId"
						className="tableInput"
					/>
				</td>
				<td>
					<div className="tableData">
						<input
							type="number"
							id="input-row-saleWeight"
							className="tableInput"
						/>
					</div>
				</td>
				<td>
					<div className="tableData">
						<input
							type="number"
							id="input-row-salePrice"
							className="tableInput"
						/>
					</div>
				</td>
			</tr>
			<tr hidden></tr>
			{/* just a hidden element to not break the color scheme on the next table row*/}
			<tr className="input-new-data-row">
				<td className="none-col"></td>
				<th scope="row">
					<img
						src={require("../assets/icons/add-attributed.png")}
						id="add-sale-data-btn"
						className="add-data-btn"
						onClick={displaySALEInputFields}
						alt="add new purchase entry button"
					/>
				</th>
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td>
					<button
						type="button"
						className="btn btn-contain"
						id="btnSaleUpdate"
						onClick={addNewSaleDataRow}
						hidden
					>
						Actualizar
					</button>
				</td>
			</tr>
		</>
	);
}
