import "./App.css";
import {
	BrowserRouter as /*Router,*/ HashRouter,
	Route,
	Switch,
} from "react-router-dom";
import { useHistory } from "react-router-dom"; //Helps us redirect to other pages

import "bootstrap/dist/css/bootstrap.min.css"; //Boostrap Import 1/2
import "bootstrap/dist/js/bootstrap.bundle.min"; //Boostrap Import 2/2
import "./homePageStyle.css";

import React, { useEffect, useState } from "react";

//Import external pages in folder (Screens)
import ItemInfo from "./ItemInfo";
import VendorInfo from "./VendorInfo";
import AddVendor from "./addVendor";
import AddProduct from "./addProduct";

//Database- AMPLIFY
import { Amplify, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listProductData, listVendorData } from "./graphql/queries";

//Components
import { NavBar } from "./components/NavBar";
import Footer from "./components/Footer";
import "@aws-amplify/ui-react/styles.css";

//Types
import { ProductDataType, VendorDataType } from "./types";

Amplify.configure(awsconfig);

function Home() {
	const [ProductData, setProductData] = useState<ProductDataType[]>([]);
	const [vData, setvData] = useState<VendorDataType[]>([]);
	const [searchTermProduct, setSearchTermProduct] = useState("");
	const [searchTermVendor, setSearchTermVendor] = useState("");

	const fetchProductData = async () => {
		try {
			const productDatas = (await API.graphql(
				graphqlOperation(listProductData)
			)) as { data: { listProductData: { items: ProductDataType[] } } };

			setProductData(productDatas.data.listProductData.items);
		} catch (error) {
			console.log("Error retrieving vendor data (fetchProductData) ", error);
		}
	};

	const fetchVendorData = async () => {
		try {
			let vendor_data = (await API.graphql(
				graphqlOperation(listVendorData)
			)) as { data: { listVendorData: { items: VendorDataType[] } } };

			setvData(vendor_data.data.listVendorData.items);
		} catch (error) {
			console.log("Error retrieving product data (fetchVendorData) ", error);
		}
	};

	useEffect(() => {
		//fetchMainBusinessInfo();
		fetchProductData();
		fetchVendorData();
	}, []);

	const history = useHistory();

	function itemTableRowClicked(
		e: React.MouseEvent<HTMLTableRowElement>,
		id: string
	) {
		//console.log(e.target.id);
		//console.log("YOU CLICKED ME");
		let path = `/item/${id}`;
		//let path=`/item`;
		history.push(path);
	}

	function vendorTableRowClicked(e: React.ChangeEvent<HTMLInputElement>) {
		console.log(e.target.id);
		console.log("YOU CLICKED ME");
		let path = `/vendor/${e.target.id}`;
		//let path=`/vendor`;
		history.push(path);
	}

	function addVendorBtn() {
		//let path=`/item/:${e.target.id}`;
		let path = `/addVendor`;
		history.push(path);
	}

	function addProductBtn() {
		//let path=`/item/:${e.target.id}`;
		let path = `/addProduct`;
		history.push(path);
	}

	return (
		<div className="Application">
			<header>
				<NavBar />
			</header>
			<head>
				<title>Facturación PJL 2022 </title>
			</head>
			<div className="container">
				<div className="row">
					<div className="col-1" id="logo">
						<img
							src="https://www.coditt.com/images/LogoPlaceholder.png"
							id="logo-image"
							alt="company logo"
						/>
					</div>
					<div className="col-7">
						<div className="row">
							<h2>Pastor Jaramillo Lopez 2022{/*ourBusinessInfo.name*/}</h2>
						</div>
						<div className="row">
							<p className="address-tag">
								C. Juan Aldama 202 Nte Centro{/*ourBusinessInfo.address*/}
							</p>
							<p className="address-tag">
								Calera de Víctor Rosales, Zacatecas 98500
								{/*ourBusinessInfo.city +
									", " +
									ourBusinessInfo.state +
									" " +
	ourBusinessInfo.zipCode*/}
							</p>
							<p className="address-tag">
								RFC: JALPXXXXXXXXXX {/*ourBusinessInfo.rfc*/}
							</p>
						</div>
					</div>
					<div className="col ">
						{/*<div className="row">
                <button type="button" className="btn btn-primary" data-bs-toggle="button" autocomplete="off">Agregar transacción</button>
                  </div>*/}
						<div className="row d-flex justify-content-end">
							<button
								type="button"
								className="btn btn-outline-dark active homePageBtn "
								data-bs-toggle="button"
								id="btn"
								onClick={addProductBtn}
							>
								Producto Nuevo
							</button>
						</div>
						<div className="row d-flex justify-content-end">
							<button
								type="button"
								className="btn btn-outline-dark active homePageBtn"
								data-bs-toggle="button"
								id="btn"
								onClick={addVendorBtn}
							>
								Distribuidor Nuevo
							</button>
						</div>
					</div>
				</div>

				<div className="fair-spacing" />

				<div className="row">
					<div className="col">
						<h3>Lista de Productos</h3>
					</div>
					<div className="col">
						<form className="d-flex">
							<input
								className="form-control me-2"
								type="search"
								placeholder="Buscar producto"
								aria-label="Search"
								onChange={(event) => {
									setSearchTermProduct(event.target.value);
								}}
							/>
							{/*<button className="btn btn-outline-success" id='search-btn' type="submit">Buscar</button>*/}
						</form>
					</div>
				</div>
				<div className="row">
					<div id="productTable">
						<table className="table table-striped">
							<thead>
								<tr>
									<th scope="col"># Producto</th>
									<th scope="col">Producto</th>
									<th scope="col">Tipo</th>
								</tr>
							</thead>
							<tbody>
								{ProductData.filter((val) => {
									if (searchTermProduct === "") return val;
									else if (
										val.name
											.toLowerCase()
											.includes(searchTermProduct.toLowerCase())
									)
										return val;
									else return null;
								}).map(({ id, name, weightType }) => (
									<tr key={id} onClick={(e) => itemTableRowClicked(e, id)}>
										<th scope="row" id={id}>
											{id.length === 1 ? id[0] : id.slice(0, 3)}
										</th>
										<td id={id}>{name}</td>
										<td id={id}>{weightType}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="fair-spacing" />

				<div className="row">
					<div className="col">
						<h3>Lista de Distribuidores</h3>
					</div>
					<div className="col">
						<form className="d-flex">
							<input
								className="form-control me-2"
								type="search"
								placeholder="Buscar Distribuidor"
								aria-label="Search"
								onChange={(event) => {
									setSearchTermVendor(event.target.value);
								}}
							/>
							{/*<button className="btn btn-outline-success" type="submit" id='search-btn'>Buscar</button>*/}
						</form>
					</div>
				</div>
				<div className="row">
					<div id="productTable">
						<table className="table table-striped">
							<thead>
								<tr>
									<th scope="col"># Distribuidor</th>
									<th scope="col">Nombre</th>
								</tr>
							</thead>
							<tbody>
								{vData
									.filter((val) => {
										if (searchTermVendor === "") return val;
										else if (
											val.name
												.toLowerCase()
												.includes(searchTermVendor.toLowerCase())
										)
											return val;
										else return null;
									})
									.map(
										(
											{ id, name } //Data driven display of rows in data
										) => (
											<tr key={id} /*onClick={vendorTableRowClicked}*/>
												<th scope="row" id={id}>
													{id.length === 1 ? id[0] : id.slice(0, 3)}
												</th>
												<td id={id}>{name}</td>
											</tr>
										)
									)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
}

function App() {
	return (
		<HashRouter basename={process.env.PUBLIC_URL}>
			<div className="Application">
				<Switch>
					{" "}
					{/*Makes sure we are only on one route at a time*/}
					<Route exact path="/" component={withAuthenticator(Home)} />
					<Route
						exact
						path="/item/:pId"
						component={withAuthenticator(ItemInfo)}
					/>
					<Route
						exact
						path="/vendor/:vId_global"
						component={withAuthenticator(VendorInfo)}
					/>
					<Route
						exact
						path="/addVendor"
						component={withAuthenticator(AddVendor)}
					/>
					<Route
						exact
						path="/addProduct"
						component={withAuthenticator(AddProduct)}
					/>
				</Switch>
			</div>
		</HashRouter>
	);
}

export default App;
