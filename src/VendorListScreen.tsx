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
import $ from "jquery";

//Import external pages in folder (Screens)
import ItemInfo from "./ItemInfo";
import VendorInfo from "./VendorListScreen";
import AddVendor from "./components/AddVendor";

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
import { toDeleteVendorType, VendorDataType } from "./types";
import { DeleteVendor } from "./components/DeleteVendor";

Amplify.configure(awsconfig);

function VendorListScreen() {
	const [vData, setvData] = useState<VendorDataType[]>([]);
	const [searchTermVendor, setSearchTermVendor] = useState("");
	const [toDelete, setToDelete] = useState<toDeleteVendorType[]>([]);

	const fetchVendorData = async () => {
		try {
			let vendor_data = (await API.graphql(
				graphqlOperation(listVendorData)
			)) as { data: { listVendorData: { items: VendorDataType[] } } };

			let only_data = vendor_data.data.listVendorData.items;

			only_data = only_data.sort((a, b) => a.name.localeCompare(b.name));
			setvData(only_data);
		} catch (error) {
			console.log("Error retrieving product data (fetchVendorData) ", error);
		}
	};

	useEffect(() => {
		fetchVendorData();
		$("#vendorTabBtn").addClass("nav-selected");
		$("#productTabBtn").removeClass("nav-selected");
	}, []);

	const history = useHistory();

	function vendorTableRowClicked(e: any) {
		console.log(e.target.id);
		let path = `/vendor/${e.target.id}`;
		//let path=`/vendor`;
		history.push(path);
	}

	function addVendorBtn() {
		$("#vendor-modal").removeAttr("hidden");
	}

	function deleteVendorBtnTrigger() {
		if (toDelete.length > 0) {
			$("#vendor-modal-delete").removeAttr("hidden");
		}
	}

	function addToDeleteArray(vIdInput: string, vNameInput: string) {
		const currentChecked = document.getElementById(
			"vname-" + vNameInput
		) as HTMLInputElement;

		if (currentChecked.checked) {
			var numberOfOcurrences = toDelete.filter(
				({ vId, vName }) => vId == vIdInput
			);
			if (numberOfOcurrences.length == 0) {
				setToDelete((toDelete) => [
					...toDelete,
					{ vId: vIdInput, vName: vNameInput },
				]);
			}
		} else {
			let filtered_array = toDelete.filter(({ vId, vName }) => vId != vIdInput);
			setToDelete(filtered_array);
		}
		let display = toDelete;

		console.log(display);
	}

	return (
		<div className="Application">
			<header>
				<AddVendor />
				<DeleteVendor vendors={toDelete} />
			</header>
			<head>
				<title>Facturación PJL 2022 </title>
			</head>

			<div className="container" id="container">
				<div className="container-top-section">
					<div className="container-top-first-row">
						<div className="container-title-section">
							<p className="container-title">Distribuidores</p>
							<p className="container-title-count">({vData.length})</p>
						</div>
						<div className="title-button-container">
							<button
								type="button"
								className="btn secondary-btn deleteVendorBtn"
								data-bs-toggle="button"
								id="deleteVendorBtn"
								onClick={deleteVendorBtnTrigger}
							>
								Borrar
							</button>
							<button
								type="button"
								className="btn addVendorBtn"
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
									{/*<input type="checkbox" className="checkbox-table"></input>*/}
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
										<tr key={"v-" + id} /*onClick={vendorTableRowClicked}*/>
											<td className="select-col">
												<input
													type="checkbox"
													className="checkbox-table"
													name={id}
													onChange={() => addToDeleteArray(id, name)}
													id={"vname-" + name}
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
		</div>
	);
}

export default VendorListScreen;
