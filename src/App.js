import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { useHistory, useParams } from 'react-router-dom';    //Helps us redirect to other pages

import 'bootstrap/dist/css/bootstrap.min.css';  //Boostrap Import 1/2
import 'bootstrap/dist/js/bootstrap.bundle.min';  //Boostrap Import 2/2
import './homePageStyle.css'


//import {Helmet} from "react-helmet"; //Helps us update metadata, <head> and child <title tag>s
import React ,{ useEffect, useState } from 'react';
//import {Routes, Route, Link} from 'react-router-dom'  //for moving between pages

//Import external pages in folder
import ItemInfo from './ItemInfo'   
import VendorInfo from './VendorInfo';  
import AddVendor from './addVendor';  
import AddProduct from './addProduct'; 


//context
import { DataProvider } from './contexts/dataContext';

import { useStateContext } from './contexts/dataContext';


function Home(){

  const[ProductData, setProductData]= useStateContext()[0];
  const [vData, setvData]=useStateContext()[2];
  const[searchTermProduct, setSearchTermProduct]= useState('');
  const[searchTermVendor, setSearchTermVendor]= useState('');

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


  const history=useHistory();
  

  function itemTableRowClicked(e){
    console.log(e.target.id);
    console.log("YOU CLICKED ME");
    let path=`/item/${e.target.id}`;
    //let path=`/item`;
    history.push(path);

  }

  function vendorTableRowClicked(e){
    console.log(e.target.id);
    console.log("YOU CLICKED ME");
    let path=`/vendor/${e.target.id}`;
    //let path=`/vendor`;
    history.push(path);
  }

  function addVendorBtn(){
    //let path=`/item/:${e.target.id}`;
    let path=`/addVendor`;
    history.push(path);
  }

  function addProductBtn(){
    //let path=`/item/:${e.target.id}`;
    let path=`/addProduct`;
    history.push(path);
  }
  
  return (
    <div className='Application'>
      <header>
          <nav className="navbar navbar-dark bg-dark">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">Facturacion Mexico [2021 Año]</a>
              <a> HEY</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Features</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Pricing</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link disabled">Disabled</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <div className="container">
          <div className="row">
            <div className="col-1" id='logo'>
              <img src='https://www.coditt.com/images/LogoPlaceholder.png' id="logo-image" />
            </div>
            <div className="col-7">
              <div className='row'>
                <h2>Pastor Jaramillo Lopez [2005 founding date]</h2>
              </div>
              <div className='row'>
                <p className='address-tag'>Ave. 5 de Mayo 712 Nte.</p>
                <p className='address-tag'>Calera de Víctor Rosales, Zacatecas 98500</p>
                <p className='address-tag'>RFC: [RFC data]</p>
              </div>
            </div>
            <div className="col ">
              {/*<div className="row">
                <button type="button" className="btn btn-primary" data-bs-toggle="button" autocomplete="off">Agregar transacción</button>
                  </div>*/}
              <div className="row d-flex justify-content-end">
                
                <button type="button" className="btn btn-primary active homePageBtn " data-bs-toggle="button" autocomplete="off" id="btn" onClick={addProductBtn}>Producto Nuevo</button>
              </div>
              <div className="row d-flex justify-content-end">
                <button type="button" className="btn btn-primary active homePageBtn" data-bs-toggle="button" autocomplete="off" id="btn" onClick={addVendorBtn}>Distribuidor Nuevo</button>
              </div>
            </div>
          </div>

          <div className='fair-spacing'/>

          <div className="row">
            <div className="col">  
              <h3>Lista de Productos</h3>
            </div>
            <div className="col">
              <form className="d-flex">
              <input className="form-control me-2" type="search" placeholder="Buscar producto" aria-label="Search" onChange={event => {setSearchTermProduct(event.target.value)}}/>
                {/*<button className="btn btn-outline-success" id='search-btn' type="submit">Buscar</button>*/}
              </form>
            </div>
          </div>
          <div className="row">
            <div id='productTable'>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col"># Producto</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Disponible</th>
                    <th scope="col">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {ProductData.filter((val)=>{
                    if(searchTermProduct=='')
                      return val;
                    else if(val.pName.toLowerCase().includes(searchTermProduct.toLowerCase()))
                      return val;
                  }).map(({pId, pName, pQuantity,pWeightType},i) => //Data driven display of rows in data 
                      <tr onClick={itemTableRowClicked}>
                        <th scope="row" id={pId}>{pId}</th>
                        <td id={pId}>{pName}</td>
                        <td id={pId}>{pQuantity}</td>
                        <td id={pId}>{pWeightType}</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className='fair-spacing'/>

          <div className="row">
            <div className="col">  
              <h3>Lista de Distribuidores</h3>
            </div>
            <div className="col">
              <form className="d-flex">
              <input className="form-control me-2" type="search" placeholder="Buscar Distribuidor" aria-label="Search" onChange={event => {setSearchTermVendor(event.target.value)}}/>
                {/*<button className="btn btn-outline-success" type="submit" id='search-btn'>Buscar</button>*/}
              </form>
            </div>
          </div>
          <div className="row">
           <div id='productTable'>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col"># Distribuidor</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Compras</th>
                  </tr>
                </thead>
                <tbody>
                {vData.filter((val)=>{
                    if(searchTermVendor=='')
                      return val;
                    else if(val.vName.toLowerCase().includes(searchTermVendor.toLowerCase()))
                      return val;
                  }).map(({vId, vName, vNumOfTransactions}) => //Data driven display of rows in data 
                    <tr onClick={vendorTableRowClicked}>
                      <th scope="row" id={vId}>{vId}</th>
                      <td id={vId}>{vName}</td>
                      <td id={vId}>{vNumOfTransactions}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='footer-spacing'/>


        <footer class="bg-dark text-center text-white">

  <div class="text-center p-3" >
    © 2021 Copyright:
    <a class="text-white" href="https://mdbootstrap.com/"> Fernando Jaramillo</a>
  </div>
</footer>
      </div>
  );
}


function App() {
  return (
    <Router>
      <div className="Application">
        <DataProvider>
          <Switch>    {/*Makes sure we are only on one route at a time*/}
            <Route exact path='/' component={Home} />
            <Route exact path='/item/:pId' component={ItemInfo} />
            <Route exact path='/vendor/:vId_global' component={VendorInfo} />
            <Route exact path='/addVendor' component={AddVendor}/>
            <Route exact path='/addProduct' component={AddProduct}/>
          </Switch>
        </DataProvider>
      </div>
    </Router>
  );
}

export default App;
