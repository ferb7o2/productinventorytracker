import "./App.css";
import {
	BrowserRouter as /*Router,*/ HashRouter,
	Route,
	Switch,
} from "react-router-dom";
import { useHistory } from "react-router-dom"; //Helps us redirect to other pages

import "bootstrap/dist/css/bootstrap.min.css"; //Boostrap Import 1/2
import "bootstrap/dist/js/bootstrap.bundle.min"; //Boostrap Import 2/2
import "./css/homePageStyle.css";

import React, { useEffect, useState, useMemo } from "react";

//Import external pages in folder (Screens)
import ItemInfo from "./ItemInfo";
import VendorInfo from "./VendorInfo";
import AddVendor from "./addVendor";
import VendorListScreen from "./VendorListScreen";

//Database- AMPLIFY
import { Amplify, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { listProductData, listVendorData } from "./graphql/queries";

//Components
import { NavBar } from "./components/NavBar";
import Footer from "./components/Footer";
import "@aws-amplify/ui-react/styles.css";
import { AddProduct } from "./components/AddProduct";

//Types
import { ProductDataType, VendorDataType } from "./types";

import $ from "jquery";

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
		fetchProductData();
		$("#vendorTabBtn").removeClass("nav-selected");
		$("#productTabBtn").addClass("nav-selected");
		////////////////fetchVendorData();
	}, []);

	const history = useHistory();

	function itemTableRowClicked(id: string) {
		//console.log(e.target.id);
		//console.log("YOU CLICKED ME");
		let path = `/item/${id}`;
		//let path=`/item`;
		history.push(path);
	}

	function addVendorBtn() {
		//let path=`/item/:${e.target.id}`;
		let path = `/addVendor`;
		history.push(path);
	}

	function addProductBtnTrigger() {
		console.log("Triggered");
		$("#product-modal").removeAttr("hidden");
	}

	return (
		<div className="Application">
			<header></header>
			<head>
				<title>Facturación PJL 2022 </title>
			</head>
			<div className="container">
				<AddProduct />
				<div className="container-top-section">
					<div className="container-top-first-row">
						<div className="container-title-section">
							<p className="container-title">Productos</p>
							<p className="container-title-count">({ProductData.length})</p>
						</div>
						<div className="title-button-container">
							<button
								type="button"
								className="btn secondary-btn"
								data-bs-toggle="button"
								id="btn"
								disabled
							>
								Borrar
							</button>
							<button
								type="button"
								className="btn addProductBtn"
								data-bs-toggle="button"
								id="addProductBtn"
								onClick={addProductBtnTrigger}
							>
								Agregar producto
							</button>
						</div>
					</div>

					<div className="sub-section-container">
						<div className="left-pad"></div>
						<div className="selected-under">
							<p className="sub-section-title sub-section-selected">See all</p>
						</div>
						<p className="sub-section-title ">Saved</p>
						<p className="sub-section-title">Ongoing</p>
						<p className="sub-section-title">Archived</p>
					</div>
				</div>

				<div className="container-top-third-row">
					<div className="dropdown-section">
						<button
							className="dropdown-btn dropdown-toggle"
							type="button"
							id="dropdownMenuButton1"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Sort by
						</button>
						<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
							<li>
								<a className="dropdown-item" href="#">
									Action
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#">
									Another action
								</a>
							</li>
							<li>
								<a className="dropdown-item" href="#">
									Something else here
								</a>
							</li>
						</ul>
					</div>

					<div className="search-container">
						<button className="search-btn">
							<img
								className="search-icon"
								src={require("./assets/icons/search-attributed.png")}
							></img>
						</button>
						<input
							className="search-bar"
							type="search"
							placeholder=" Buscar producto"
							aria-label="Search"
							onChange={(event) => {
								setSearchTermProduct(event.target.value);
							}}
						/>
						{/*<button className="btn btn-outline-success" id='search-btn' type="submit">Buscar</button>*/}
					</div>
				</div>

				<div className="row">
					<table className="tble">
						<thead>
							<tr className="thead-row">
								<th scope="col" className="select-col">
									<input type="checkbox" className="checkbox-table"></input>
								</th>
								<th scope="col" className="name-col">
									Nombre del producto
								</th>
								<th scope="col" className="type-col">
									Tipo
								</th>
								<th scope="col" className="tax-col">
									Impuesto
								</th>
								<th scope="col" className="id-col">
									Id
								</th>
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
								<tr key={id}>
									<td className="select-col">
										<input
											type="checkbox"
											className="checkbox-table"
											id={id}
										></input>
									</td>
									<td
										id={id}
										className="name-col name-col-data"
										onClick={() => itemTableRowClicked(id)}
									>
										{name}
									</td>
									<td
										id={id}
										className="type-col"
										onClick={() => itemTableRowClicked(id)}
									>
										{weightType}
									</td>
									<td
										className="tax-col"
										onClick={() => itemTableRowClicked(id)}
									></td>
									<td
										scope="row"
										id={id}
										className="id-col id-col-data"
										onClick={() => itemTableRowClicked(id)}
									>
										{id}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

function App() {
	return (
		<HashRouter basename={process.env.PUBLIC_URL}>
			<div className="Application">
				{useMemo(
					() => (
						<NavBar />
					),
					[0]
				)}

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
						path="/vendor"
						component={withAuthenticator(VendorListScreen)}
					/>
				</Switch>
				<Footer />
			</div>
		</HashRouter>
	);
}

export default App;
