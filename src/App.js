import "./App.css";
import {
	BrowserRouter as /*Router,*/ HashRouter,
	Route,
	Switch,
} from "react-router-dom";
import { useHistory /*, useParams*/ } from "react-router-dom"; //Helps us redirect to other pages

import "bootstrap/dist/css/bootstrap.min.css"; //Boostrap Import 1/2
import "bootstrap/dist/js/bootstrap.bundle.min"; //Boostrap Import 2/2
import "./homePageStyle.css";

//import {Helmet} from "react-helmet"; //Helps us update metadata, <head> and child <title tag>s
import React, { /*useEffect,*/ useEffect, useState } from "react";
//import {Routes, Route, Link} from 'react-router-dom'  //for moving between pages

//Import external pages in folder (Screens)
import ItemInfo from "./ItemInfo";
import VendorInfo from "./VendorInfo";
import AddVendor from "./addVendor";
import AddProduct from "./addProduct";
import Login from "./screens/Login";

//Database- AMPLIFY
import { Amplify, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator, withAuthenticator } from "@aws-amplify/ui-react";
import {
	listOurBusinessInfos,
	getOurBusinessInfo,
	listProductData,
	listVendorData,
} from "./graphql/queries";

//context
import { DataProvider } from "./contexts/dataContext";

import { useStateContext } from "./contexts/dataContext";

//Components
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import MainScreen from "./MainScreen";
import "@aws-amplify/ui-react/styles.css";
//import awsmobile from "./aws-exports";

Amplify.configure(awsconfig);

function Home() {
	const [ProductData, setProductData] = useState([]);
	const [vData, setvData] = useState([]);
	const [searchTermProduct, setSearchTermProduct] = useState("");
	const [searchTermVendor, setSearchTermVendor] = useState("");

	const [ourBusinessInfo, setOurBusinessInfo] = useState([]);

	const fetchMainBusinessInfo = async () => {
		try {
			//console.log("flag");
			//const businessData = await API.graphql(
			//	graphqlOperation(listOurBusinessInfos)
			//);
			//setOurBusinessInfo(businessData.data.listOurBusinessInfos.items[0]);
			//console.log(businessData.data.listOurBusinessInfos.items[0]);
		} catch (error) {
			console.log("error on fetchMainBusinessInfo() ", error);
		}
	};

	const fetchProductData = async () => {
		try {
			const vendor_data = await API.graphql(graphqlOperation(listVendorData));

			setvData(vendor_data.data.listVendorData.items);
		} catch (error) {
			console.log("Error retrieving vendor data (fetchVendorData) ", error);
		}
	};

	const fetchVendorData = async () => {
		try {
			let productDatas = await API.graphql(graphqlOperation(listProductData));

			setProductData(productDatas.data.listProductData.items);
		} catch (error) {
			console.log("Error retrieving product data (fetchProductData) ", error);
		}
	};

	useEffect(() => {
		//fetchMainBusinessInfo();
		fetchProductData();
		fetchVendorData();
	}, []);

	const history = useHistory();

	function itemTableRowClicked(e) {
		console.log(e.target.id);
		console.log("YOU CLICKED ME");
		let path = `/item/${e.target.id}`;
		//let path=`/item`;
		history.push(path);
	}

	function vendorTableRowClicked(e) {
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
								autoComplete="off"
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
								autoComplete="off"
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
									<tr key={id} onClick={itemTableRowClicked}>
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
				<DataProvider>
					<Switch>
						{" "}
						{/*Makes sure we are only on one route at a time*/}
						<Route exact path="/PJL" component={withAuthenticator(Home)} />
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
						<Route exact path="/login" component={Login} />
					</Switch>
				</DataProvider>
			</div>
		</HashRouter>
	);
}

export default App;
