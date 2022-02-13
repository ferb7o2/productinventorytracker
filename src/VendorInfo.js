import React from "react";
import { useParams } from "react-router-dom";

import { useStateContext } from "./contexts/dataContext";

//import { useHistory } from "react-router-dom";

//Components
import { NavBar } from "./components/NavBar";

function CustomerInfo(props) {
	let { vId_global } = useParams();
	vId_global = parseInt(vId_global, 10);

	let tempIndex = parseInt(vId_global, 10);

	const [vendor_dataFIRST /*, setProductDataFIRST*/] = useStateContext()[2];
	let vendor_data = vendor_dataFIRST[tempIndex - 1];
	const [transaction_data /*, settData*/] = useStateContext()[1];
	const [ProductData /*, setProductData*/] = useStateContext()[0];

	vendor_data = vendor_dataFIRST.find((val, i) => vId_global === val.vId); //go through JSON and list by pId and not by [index]
	//console.log('yes' +pId);
	//console.log('realIndex -> '+realIndex.pId);

	function nameForId(ProductList, i) {
		console.log("thisis" + i);
		return ProductList.find(({ pId }) => pId === i).pName;
	}

	return (
		<div className="Application">
			<header>
				<div className="alert alert-warning" role="alert">
					Desafortunadamente, este lado de la página web no está completamente
					terminado. Algunas funciones (el boton de "+" y la suma del total de
					compras) no están terminadas
				</div>
				<NavBar />
			</header>
			<div className="container">
				<div className="row">
					<div className="col">
						<h1>{vendor_data.vName}</h1>
						<h4>{vendor_data.vAddress}</h4>
						<h4>RFC: {vendor_data.vRFC}</h4>
					</div>
					<div className="col-3" id="right-align">
						<h4>Distribuidor Id: {vId_global}</h4>
					</div>
				</div>
				<div className="row">
					<div className="col-9"></div>
					<div className="col">
						<h5>Total de Compras: {vendor_data.vNumOfTransactions}</h5>
					</div>
				</div>
				<div className="fair-spacing" />
				<div className="row">
					<table className="table table-striped">
						<thead>
							<tr>
								<th scope="col" id="[transaction-id]">
									Transaccion Id
								</th>
								<th scope="col">Fecha</th>
								<th scope="col"># Factura</th>
								<th scope="col">Producto</th>
								<th scope="col">Peso (Kg)</th>
								<th scope="col">Precio (MXN)</th>
							</tr>
						</thead>
						<tbody>
							{transaction_data.map(
								(
									{
										PtId,
										tpId,
										date,
										vId,
										purchaseInvoiceId,
										purchaseWeight,
										purchasePrice,
										saleInvoiceId,
										saleWeight,
										salePrice,
									},
									i
								) =>
									({ vId }.vId !== null ? (
										vId_global === transaction_data[i].vId ? (
											<tr key={PtId}>
												<th scope="row">{transaction_data[i].PtId}</th>
												<td>{transaction_data[i].date}</td>
												<td>{transaction_data[i].purchaseInvoiceId}</td>
												<td>
													{nameForId(ProductData, transaction_data[i].tpId)}
												</td>
												<td>{transaction_data[i].purchaseWeight}</td>
												<td>{transaction_data[i].purchasePrice}</td>
											</tr>
										) : (
											<></>
										)
									) : (
										<></>
									))
							)}

							<tr onClick={console.log("yay")}>
								<th scope="row">
									<img
										className="add-data-btn"
										src="https://static.thenounproject.com/png/1649999-200.png"
										id="add-data-btn"
										alt="add new purchase entry button"
									/>
								</th>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
								<td></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default CustomerInfo;
