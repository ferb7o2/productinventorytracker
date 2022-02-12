import React from "react";
import { useParams } from "react-router-dom";

import { useStateContext } from "./contexts/dataContext";

import { useHistory } from "react-router-dom";

function CustomerInfo(props) {
	const history = useHistory();
	const goBack = () => {
		history.goBack();
	};

	let { vId_global } = useParams();

	let tempIndex = parseInt(vId_global, 10);

	const [vendor_dataFIRST, setProductDataFIRST] = useStateContext()[2];
	let vendor_data = vendor_dataFIRST[tempIndex - 1];
	const [transaction_data, settData] = useStateContext()[1];
	const [ProductData, setProductData] = useStateContext()[0];

	let realIndex = 0;
	vendor_data = vendor_dataFIRST.find((val, i) => vId_global == val.vId); //go through JSON and list by pId and not by [index]
	//console.log('yes' +pId);
	//console.log('realIndex -> '+realIndex.pId);

	function nameForId(ProductList, i) {
		console.log("thisis" + i);
		return ProductList.find(({ pId }) => pId === i).pName;
	}

	return (
		<div className="Application">
			<header>
				<div class="alert alert-warning" role="alert">
					Desafortunadamente, este lado de la página web no está completamente
					terminado. Algunas funciones (el boton de "+" y la suma del total de compras) no están terminadas
				</div>
				<nav className="navbar navbar-dark bg-dark">
					<div className="container-fluid">
						<a className="navbar-brand" href="#">
							Facturacion Mexico [2021 Año]
						</a>
						<a> HEY</a>
						<button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarNav"
							aria-controls="navbarNav"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarNav">
							<ul className="navbar-nav">
								<li className="nav-item">
									<a className="nav-link active" aria-current="page" href="#">
										Home
									</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="#">
										Features
									</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="#">
										Pricing
									</a>
								</li>
								<li className="nav-item">
									<a className="nav-link disabled">Disabled</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				<div className="row">
					<div className="col">
						<img
							src="https://cdn3.iconfinder.com/data/icons/user-interface-731/32/Left_Chevron-512.png"
							id="left-back-btn"
							onClick={goBack}
						></img>
					</div>
					<div className="col">
						<img
							src="https://icons-for-free.com/iconfiles/png/512/arrow+right+chevron+chevronrightcircle+circle+right+right-1320185732004907921.png"
							id="right-back-btn"
							onClick={goBack}
						></img>
					</div>
				</div>
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
								<th scope="col">
									Peso <bold>(Kg)</bold>
								</th>
								<th scope="col">
									Precio <bold>(MXN)</bold>
								</th>
							</tr>
						</thead>
						<tbody>
							{transaction_data.map(
								(
									{
										tId,
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
										vId_global == transaction_data[i].vId ? (
											<tr>
												{console.log(transaction_data[i])}
												<th scope="row">{transaction_data[i].tId}</th>
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
