import { useEffect, useState } from "react";
import "../css/YearBox.css";
import $ from "jquery";
import { StransactionDataType } from "../types";
import { getAccessToken, getCurrentUserEmail } from "../Cognito";
import EditNotes from "./EditNotes";
import RowLock from "./RowLock";

interface SaleYearBoxProps {
	year: number;
	pId?: string;

	transactionData: StransactionDataType[];
	addItems: (newItems: StransactionDataType[]) => void;
	setDiff: (difference: number) => void;
	updateSale: (
		array: StransactionDataType[],
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
	setSTransactionData: React.Dispatch<
		React.SetStateAction<StransactionDataType[]>
	>;
}

export function SaleYearBox({
	year,
	pId,
	transactionData,
	addItems,
	updateSale,
	addToDeleteArray,
	setDiff,
	setSTransactionData,
}: SaleYearBoxProps) {
	var errorTemplate = $("#error-template");

	const [triggeredOpen, setTriggeredOpen] = useState(false);
	const [rowIndex, setRowIndex] = useState(-1);
	const [hasMore, setHasMore] = useState(true);
	const [viewNotes, setViewNotes] = useState(false);
	const [currNotes, setCurrNotes] = useState("");
	const [currEnBodega, setCurrEnBodega] = useState(false);
	const [currSaleId, setCurrSaleId] = useState("");

	const [selectedRowId, setSelectedRowId] = useState("");

	function focusOut(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.keyCode === 13 || e.keyCode === 9) {
			$("#" + $(e.target).attr("id")).prop("disabled", true);
			$("#" + $(e.target).attr("id")).prop("disabled", false); //lose focus out of the textbox
		}
	}

	const changeSaleWeight = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: number,
		toChangeId: string
	) => {
		errorTemplate.attr("hidden", 1); //keep it hidden
		let newVal = parseFloat(e.target.value);

		try {
			if (isNaN(newVal) || newVal < 0)
				throw new Error("numero negativo / numero invalido");
			if (newVal == lastValue) return;
			const token = await getAccessToken();
			const user = await getCurrentUserEmail();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/sales/${encodeURI(
					toChangeId
				)}/weight`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userEmail: user,
						newWeight: newVal,
					}),
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});

			const diff = newVal - lastValue;
			setDiff(-diff);
			updateSale(transactionData, newVal, "qty", toChangeId);
		} catch (error) {
			window.scrollTo(0, 0);
			console.error("error on changeSaleWeight() ", error);
			errorTemplate.text("Error - al actualizar el Peso - " + error);
			errorTemplate.removeAttr("hidden");
			$(`#${e.target.id}`).val(lastValue);
		}
	};

	const changeSalePrice = async (
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
			const user = await getCurrentUserEmail();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/sales/${encodeURI(toChangeId)}/price`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userEmail: user,
						newPrice: newVal,
					}),
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});
			updateSale(transactionData, newVal, "price", toChangeId);
		} catch (error) {
			window.scrollTo(0, 0);
			console.error("error on changeSalePrice() ", error);
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
			const user = await getCurrentUserEmail();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/sales/${encodeURI(
					toChangeId
				)}/invoiceId`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userEmail: user,
						newId: newVal,
					}),
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});
			updateSale(transactionData, newVal, "invoiceId", toChangeId);
		} catch (error) {
			window.scrollTo(0, 0);
			console.error("error on changeInvoiceId() - Sale", error);
			errorTemplate.text("Error - al actualizar el numero de Invoice");
			errorTemplate.removeAttr("hidden");
			$(`#${e.target.id}`).val(lastValue);
		}
	};

	const changeSaleDate = async (
		e: React.FocusEvent<HTMLInputElement, Element>,
		lastValue: string,
		toChangeId: string
	) => {
		errorTemplate.attr("hidden", 1); //keep it hidden

		let newVal = e.target.value;
		if (newVal === lastValue) return;
		try {
			const token = await getAccessToken();
			const user = await getCurrentUserEmail();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/sales/${encodeURI(toChangeId)}/date`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userEmail: user,
						newDate: newVal,
					}),
				}
			)
				.then((res) => res.json())
				.then((datax) => {
					return datax;
				});
			updateSale(transactionData, newVal, "date", toChangeId);
		} catch (error) {
			window.scrollTo(0, 0);
			console.error("error on changeSaleDate() ", error);
			errorTemplate.text("Error - al actualizar la fecha");
			errorTemplate.removeAttr("hidden");
			//revert to previous value if failed
			$(`#${e.target.id}`).val(lastValue);
		}
	};

	async function fetchSTransactionsByYear() {
		if (!hasMore) return;
		setTriggeredOpen(true);

		try {
			//get user jwst token to query our API
			const token = await getAccessToken();
			const data = await fetch(
				`${process.env.REACT_APP_API_URL}/sales/${pId}/years/${year}?rowNum=${rowIndex}`,
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

	function notesBtnTrigger(notes: string, tId: string) {
		setViewNotes(true);
		setCurrNotes(notes);
		setCurrSaleId(tId);
	}

	useEffect(() => {
		const currYear = new Date().getFullYear();
		if (Number(year) === currYear) {
			fetchSTransactionsByYear();
		}
	}, []);

	return (
		<>
			{viewNotes && (
				<EditNotes
					tId={currSaleId}
					notes={currNotes}
					enBodega={false}
					setSTransactionData={setSTransactionData}
					setViewNotes={setViewNotes}
					type="sales"
				/>
			)}
			{hasMore ? (
				<tr className="yearbox">
					{triggeredOpen ? (
						<td
							colSpan={8}
							className="yearbox-title"
							onClick={fetchSTransactionsByYear}
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
							onClick={fetchSTransactionsByYear}
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
						{ id, date, invoiceId, qty, price, notes } //Data driven display of rows in data
					) => (
						<tr key={"s" + id} className="table-row">
							<RowLock
								key={"rowlock-" + id}
								isLocked={!(id === selectedRowId)}
								onEditClick={() => setSelectedRowId(id)}
							>
								<td scope="col" className="select-col">
									<input
										type="checkbox"
										className="checkbox-table"
										id={"tid-" + id}
										onChange={() =>
											addToDeleteArray(id, date, invoiceId, "sale")
										}
									/>
								</td>
								<td className="sale-date-col" scope="col">
									<input
										type="text"
										id={"row" + id + "Sdate"}
										className="tableInput"
										defaultValue={date}
										onBlur={(e) => {
											changeSaleDate(e, date, id);
										}}
										onKeyDown={(e) => focusOut(e)}
									/>
								</td>

								<td className="sale-invoice-col" scope="col">
									<input
										type="text"
										id={"row" + id + "saleInvoiceId"}
										className="tableInput vendor-col"
										defaultValue={invoiceId}
										onBlur={(e) => {
											changeInvoiceId(e, invoiceId, id);
										}}
										onKeyDown={(e) => focusOut(e)}
									/>
								</td>
								<td className="sale-weight-col" scope="col">
									<input
										type="number"
										id={"row" + id + "saleWeight"}
										className="tableInput"
										defaultValue={qty}
										onBlur={(e) => {
											changeSaleWeight(e, qty, id);
										}}
										onKeyDown={(e) => focusOut(e)}
									/>
								</td>
								<td className="sale-price-col" scope="col">
									<input
										type="number"
										id={"row" + id + "salePrice"}
										className="tableInput vendor-col"
										defaultValue={price}
										onBlur={(e) => {
											changeSalePrice(e, price, id);
										}}
										onKeyDown={(e) => focusOut(e)}
									/>
								</td>
								<td className="pId-col id-col-data" scope="col">
									{id}
								</td>
								<td className="notes-col" scope="col">
									<img
										className="edit-trigger-img"
										style={{ opacity: notes ? 1 : 0.175 }}
										onClick={() => notesBtnTrigger(notes, id)}
										src={require("../assets/icons/blank-notes-attributed.png")}
									/>
								</td>
							</RowLock>
						</tr>
					)
				)}
		</>
	);
}
