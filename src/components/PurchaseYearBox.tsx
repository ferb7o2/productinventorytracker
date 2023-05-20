import { useEffect, useState } from "react";
import "../css/YearBox.css";
import $ from "jquery";
import { PtransactionDataType, VendorDataType } from "../types";
import { getAccessToken } from "../Cognito";

interface PurchaseYearBoxProps {
	year: number;
	pId?: string;
	vendorData: VendorDataType[];
	transactionData: PtransactionDataType[];
	addItems: (newItems: PtransactionDataType[]) => void;

	setDiff: (difference: number) => void;
	updatePurchase: (
		array: PtransactionDataType[],
		newVal: any,
		toChangeVar: string,
		toChangeId: string
	) => void;
	addToDeleteArray: (
		IdInput: string,
		dateInput: string,
		invoiceInput: string,
		type: string
	) => void;
}

export function PurchaseYearBox({
	year,
	pId,
	vendorData,
	transactionData,
	addItems,
	setDiff,
	updatePurchase,
	addToDeleteArray,
}: PurchaseYearBoxProps) {
	var errorTemplate = $("#error-template");

	const [triggeredOpen, setTriggeredOpen] = useState(false);
	const [rowIndex, setRowIndex] = useState(-1);
	const [hasMore, setHasMore] = useState(true);

	function focusOut(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.keyCode === 13 || e.keyCode === 9) {
			$("#" + $(e.target).attr("id")).prop("disabled", true);
			$("#" + $(e.target).attr("id")).prop("disabled", false); //lose focus out of the textbox
		}
	}

	const changePurchaseWeight = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: number,
		toChangeId: string
	) => {
		let newVal = parseFloat(e.target.value);

		try {
			if (isNaN(newVal) || newVal < 0)
				throw new Error("numero negativo / numero invalido");
			if (newVal == lastValue) return;
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases/${toChangeId}/weight?newWeight=${newVal}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			const diff = newVal - lastValue;
			setDiff(diff);
			updatePurchase(transactionData, newVal, "qty", toChangeId);
		} catch (error) {
			console.error("error on changePurchaseWeight() ", error);
			errorTemplate.text("Error - al actualizar el Peso - " + error);
			errorTemplate.removeAttr("hidden");
			$(`#${e.target.id}`).val(lastValue);
		}
	};

	const changePurchasePrice = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: number,
		toChangeId: string
	) => {
		errorTemplate.attr("hidden", 1); //keep it hidden

		let newVal = parseFloat(e.target.value);
		if (newVal == lastValue) return;

		try {
			if (isNaN(newVal)) throw new Error("numero invalido");
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases/${toChangeId}/price?newPrice=${newVal}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});
			updatePurchase(transactionData, newVal, "price", toChangeId);
		} catch (error) {
			console.error("error on changePurchasePrice() ", error);
			errorTemplate.text("Error - al actualizar el Precio - " + error);
			errorTemplate.removeAttr("hidden");
		}
	};

	const changeInvoiceId = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: string,
		toChangeId: string
	) => {
		errorTemplate.attr("hidden", 1); //keep it hidden
		let newVal = e.target.value;
		if (newVal === lastValue) return;

		try {
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases/${toChangeId}/InvoiceId?newId=${newVal}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});
			updatePurchase(transactionData, newVal, "invoiceId", toChangeId);
		} catch (error) {
			console.log("error on changeInvoiceId() ", error);
			errorTemplate.text("Error - al actualizar el numero de Invoice");
			errorTemplate.removeAttr("hidden");
			$(`#${e.target.id}`).val(lastValue);
		}
	};

	const changePurchaseDate = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: string,
		toChangeId: string
	) => {
		errorTemplate.attr("hidden", 1); //keep it hidden

		let newVal = e.target.value;
		if (newVal === lastValue) return;
		try {
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases/${toChangeId}/date?newDate=${newVal}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});
			updatePurchase(transactionData, newVal, "date", toChangeId);
		} catch (error) {
			console.error("error on changePurchaseDate() ", error);
			errorTemplate.text("Error - al actualizar la fecha");
			errorTemplate.removeAttr("hidden");
			//revert to previous value if failed
			$(`#${e.target.id}`).val(lastValue);
		}
	};

	async function fetchPTransactionsByYear() {
		if (!hasMore) return;
		setTriggeredOpen(true);

		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases/${pId}/years/${year}?rowNum=${rowIndex}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			if (data.length > 0) {
				addItems(data);
				//for pagination, remember which index was the last one queried so new query can start from there
				setRowIndex(data[data.length - 1].rowNum);
			}

			setHasMore(data.length >= 5);
		} catch (error) {
			console.error(
				`Error retrieving Transaction data (fechPTransactionsByYear(${year})) `,
				error
			);
		}
	}

	function getIdByName(
		vNamePassed: string | number | string[] | null | undefined
	) {
		if (vNamePassed != null) {
			const vendor = vendorData.find(({ name }, i) => vNamePassed == name);
			if (vendor != undefined) return vendor.id;
		}
		return "error";
	}

	function getNameById(
		idPassed: string | number | string[] | null | undefined
	) {
		if (idPassed != null) {
			const vendor = vendorData.find(({ id }, i) => idPassed == id);
			if (vendor != undefined) return vendor.name;
		}
		return "error";
	}

	const changeVendor = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		toChangeId: string,
		lastValue?: string
	) => {
		errorTemplate.attr("hidden", 1); //keep it hidden

		let newVal = e.target.value;
		let vendorId = getIdByName(e.target.value);
		if (vendorId === "error") {
			errorTemplate.text(
				"Error - el nombre del distribuidor no es valido, asegurate de que lo escojas de la lista"
			);
			errorTemplate.removeAttr("hidden");
			$(`#${e.target.id}`).val(lastValue ? lastValue : "ERROR");
			return;
		}
		if (newVal === lastValue) return;

		try {
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/purchases/${toChangeId}/vendor?newVendor=${vendorId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});
			updatePurchase(transactionData, newVal, "vName", toChangeId);
		} catch (error) {
			console.error("error on changeVendor() ", error);
			errorTemplate.text("Error - al actualizar el proveedor");
			errorTemplate.removeAttr("hidden");
			$(`#${e.target.id}`).val(lastValue ? lastValue : "ERROR");
		}
	};

	useEffect(() => {
		const currYear = new Date().getFullYear();
		if (Number(year) === currYear) {
			fetchPTransactionsByYear();
		}
	}, []);

	return (
		<>
			{hasMore ? (
				<tr className="yearbox">
					{triggeredOpen ? (
						<td
							colSpan={8}
							className="yearbox-title "
							onClick={fetchPTransactionsByYear}
						>
							<div className="yearbox-title-alternative">
								<span className="yearbox-title-1">{year}</span>
								<span className="yearbox-title-2">(cargar mas)</span>
							</div>
						</td>
					) : (
						<td
							colSpan={8}
							className="yearbox-title"
							onClick={fetchPTransactionsByYear}
						>
							- {year} -
						</td>
					)}
				</tr>
			) : (
				<></>
			)}

			{transactionData
				.slice()
				.reverse()
				.map(
					(
						{ id, date, invoiceId, qty, price, vName, vendorId } //Data driven display of rows in data
					) => (
						<tr key={id} className="table-row">
							<td className="select-col select-vendor">
								<input
									type="checkbox"
									className="checkbox-table"
									id={"tid-" + id}
									onChange={() => {
										addToDeleteArray(id, date, invoiceId, "purchase");
									}}
								/>
							</td>
							<td className="date-col">
								<input
									required
									type="text"
									id={"row" + id + "date"}
									className="tableInput tableDate"
									defaultValue={date}
									onBlur={(e) => {
										changePurchaseDate(e, date, id);
									}}
									onKeyDown={(e) => focusOut(e)}
								/>
							</td>

							<td className="vendor-col">
								<input
									required
									type="text"
									id={"row" + id + "vId"}
									className="tableInput vendor-input"
									defaultValue={vName ? vName : getNameById(vendorId)}
									list="vendors"
									onBlur={(e) => {
										changeVendor(e, id, vName);
									}}
									onKeyDown={(e) => focusOut(e)}
								/>
								<datalist id="vendors">
									{vendorData.map(({ id, name }) => (
										<option key={id} value={name} id={id} />
									))}
								</datalist>
							</td>
							<td className="factura-col">
								<div className="tableData">
									<input
										type="text"
										id={"row" + id + "purchaseInvoiceId"}
										className="tableInput"
										defaultValue={invoiceId}
										onBlur={(e) => {
											changeInvoiceId(e, invoiceId, id);
										}}
										onKeyDown={(e) => focusOut(e)}
									/>
								</div>
							</td>
							<td className="weight-col">
								<div className="tableData">
									<input
										required
										type="number"
										id={"row" + id + "purchaseWeight"}
										className="tableInput"
										defaultValue={qty}
										onBlur={(e) => {
											changePurchaseWeight(e, qty, id);
										}}
										onKeyDown={(e) => focusOut(e)}
									/>
								</div>
							</td>
							<td className="price-col">
								<div className="tableData">
									<input
										required
										type="number"
										id={"row" + id + "purchasePrice"}
										className="tableInput"
										defaultValue={price}
										onBlur={(e) => {
											changePurchasePrice(e, qty, id);
										}}
										onKeyDown={(e) => focusOut(e)}
									/>
								</div>
							</td>
							<td className="pId-col id-col-data">{id}</td>
							<td className="notes-col">
								<img
									src={require("../assets/icons/blank-notes-attributed.png")}
								></img>
							</td>
						</tr>
					)
				)}
		</>
	);
}
