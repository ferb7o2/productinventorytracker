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

import React, { useEffect, useState } from "react";

//Import external pages in folder (Screens)
import ItemInfo from "./ItemInfo";
import VendorInfo from "./VendorListScreen";
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

function VendorListScreen() {
	const [vData, setvData] = useState<VendorDataType[]>([]);
	const [searchTermVendor, setSearchTermVendor] = useState("");

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
		fetchVendorData();
	}, []);

	const history = useHistory();

	function vendorTableRowClicked(e: any) {
		console.log(e.target.id);
		let path = `/vendor/${e.target.id}`;
		//let path=`/vendor`;
		history.push(path);
	}

	function addVendorBtn() {
		//let path=`/item/:${e.target.id}`;
		let path = `/addVendor`;
		history.push(path);
	}

	return (
		<div className="Application">
			<header>
				<NavBar products={false} vendors={true} />
			</header>
			<head>
				<title>Facturación PJL 2022 </title>
			</head>
			<div className="container">
				<div className="container-top-section">
					<div className="container-top-first-row">
						<div className="container-title-section">
							<p className="container-title">Distribuidores</p>
							<p className="container-title-count">({vData.length})</p>
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
								className="btn "
								data-bs-toggle="button"
								id="btn"
								onClick={addVendorBtn}
							>
								Agregar distribuidor
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
							placeholder=" Buscar Distribuidor"
							aria-label="Search"
							onChange={(event) => {
								setSearchTermVendor(event.target.value);
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
								<th scope="col" className="vName-col">
									Nombre
								</th>
								<th scope="col" className="vId-col">
									Id
								</th>
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
											<td className="select-col">
												<input
													type="checkbox"
													className="checkbox-table"
													id={id}
												></input>
											</td>
											<td
												id={id}
												className="vName-col"
												onClick={(e) => vendorTableRowClicked(e)}
											>
												{name}
											</td>
											<td
												scope="row"
												id={id}
												className="id-col-data vId-col"
												onClick={(e) => vendorTableRowClicked(e)}
											>
												{id}
											</td>
										</tr>
									)
								)}
						</tbody>
					</table>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default VendorListScreen;
