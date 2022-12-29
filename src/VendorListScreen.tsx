import "./App.css";

import { useHistory } from "react-router-dom"; //Helps us redirect to other pages

import "bootstrap/dist/css/bootstrap.min.css"; //Boostrap Import 1/2
import "bootstrap/dist/js/bootstrap.bundle.min"; //Boostrap Import 2/2
import "./css/homePageStyle.css";

import { useEffect, useState } from "react";
import $ from "jquery";

//Import external pages in folder (Screens)
import AddVendor from "./components/AddVendor";

//Database- AMPLIFY
import { Amplify, API, graphqlOperation } from "aws-amplify";
import awsconfig from "./aws-exports";
import { listVendorData } from "./graphql/queries";

//Components
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
		let nextToken = null;
		let tempArray = [] as VendorDataType[];
		try {
			do {
				const vendorData = (await API.graphql(
					graphqlOperation(listVendorData, { nextToken: nextToken })
				)) as {
					data: {
						listVendorData: {
							items: VendorDataType[];
							nextToken: string | null;
						};
					};
				};

				let only_data = vendorData.data.listVendorData.items;

				nextToken = vendorData.data.listVendorData.nextToken;
				tempArray = tempArray.concat(only_data);
			} while (nextToken !== null);

			//console.log(vendorData.data.listVendorData.items);
			setvData(tempArray);
		} catch (error) {
			console.log("error on fetchVendorData() ", error);

			window.alert("ERROR: error al cargar DISTRIBUIDORES de la base de datos");
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

			<title>Facturación PJL 2022 - Distribuidores </title>

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
								Registrar nuevo
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
