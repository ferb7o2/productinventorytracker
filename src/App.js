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
import Amplify, { API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
//import { AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
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

			let productDatas = await API.graphql(graphqlOperation(listProductData));
			//console.log(productDatas.data.listProductData.items);
			setProductData(productDatas.data.listProductData.items);

			const vendor_data = await API.graphql(graphqlOperation(listVendorData));
			//console.log(vendor_data.data.listVendorData.items);
			setvData(vendor_data.data.listVendorData.items);

			//console.log(businessData.data.listOurBusinessInfos.items[0]);
		} catch (error) {
			console.log("error on fetchMainBusinessInfo() ", error);
		}
	};

	useEffect(() => {
		fetchMainBusinessInfo();
	}, []);

	//console.log(ProductData);

	/*const product_data=[
    {pId: 1, pName:'Chile Guajillo', pDescription:' 1 Kg Chile Guajillo', pQuantity:1, pWeightType:'Kg'},
    {pId: 2, pName:'Hoja p/tamal Chisemex', pDescription:'Bulto Hoja p/Tamal c/24 pzs', pQuantity:1, pWeightType:'Bulto'},
    {pId: 3, pName:'Alpiste Bulto 25 kg', pDescription:'Bulto de Alpiste c/25 Kg', pQuantity:1, pWeightType:'Bulto'},
  ]*/

	/*const transaction_data=[
    { tId:1, tpId:1, date:'12/24/2021', vId:1, purchaseInvoiceId:1, purchaseWeight:23, purchasePrice:4322, saleInvoiceId: null, saleWeight:null, salePrice:null},
    { tId:2, tpId:1, date:'12/29/2021', vId:1, purchaseInvoiceId:12, purchaseWeight:44, purchasePrice:4322, saleInvoiceId: null, saleWeight:null, salePrice:null},
    { tId:3, tpId:1, date:'12/31/2021', vId:null, purchaseInvoiceId:null, purchaseWeight:null, purchasePrice:null, saleInvoiceId: 244, saleWeight:67, salePrice:5000},
  ]*/

	/*const vendor_data=[
    {vId: 1, vName:'Chisemex', vRFC:'MELM8305281H0', vNumOfTransactions:32, vAddress:'N/A'},
    {vId: 2, vName:'Distribuidora De Productos Deshidratados SA de CV', vRFC:'JEFC8305281H0', vNumOfTransactions:12, vAddress:'N/A'},
    {vId: 3, vName:'Alfredo Lopez', vRFC:'LANJ8305281H0', vNumOfTransactions:94, vAddress:'Calera de Victor Rosales Zacatecas'}
  ]*/

	// const [data,setData]=useState(product_data);
	//const [vData, setvData]=useState(vendor_data);
	//const [tData, settData]=useState(transaction_data);

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
								Ave. 5 de Mayo 712 Nte.{/*ourBusinessInfo.address*/}
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
								className="btn btn-primary active homePageBtn "
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
								className="btn btn-primary active homePageBtn"
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
						<Route exact path="/" component={MainScreen} />
						<Route exact path="/main" component={Home} />
						<Route exact path="/item/:pId" component={ItemInfo} />
						<Route exact path="/vendor/:vId_global" component={VendorInfo} />
						<Route exact path="/addVendor" component={AddVendor} />
						<Route exact path="/addProduct" component={AddProduct} />
						<Route exact path="/login" component={Login} />
					</Switch>
				</DataProvider>
			</div>
		</HashRouter>
	);
}

export default App;
