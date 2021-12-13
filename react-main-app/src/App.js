import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';  //Boostrap Import 1/2
import 'bootstrap/dist/js/bootstrap.bundle.min';  //Boostrap Import 2/2


import {Helmet} from "react-helmet"; //Helps us update metadata, <head> and child <title tag>s
import React, { Component } from 'react';

function App() {
  return (
    <div className="Application">
      <header>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Facturacion Mexico [2021 An~o]</a>
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
        <div class="row">
          <div class="col">
            [LOGO.png]
          </div>
          <div class="col-7">
            <h2>Pastor Jaramillo Lopez [2005 founding date]</h2>
          </div>
          <div class="col-4">
            <div className="row">
              <button type="button" class="btn btn-primary" data-bs-toggle="button" autocomplete="off">Agregar transacción</button>
            </div>
            <div className="row">
              <button type="button" class="btn btn-primary active" data-bs-toggle="button" autocomplete="off" aria-pressed="true">Nuevo producto</button>
            </div>
            <div className="row">
              <button type="button" class="btn btn-primary" disabled data-bs-toggle="button" autocomplete="off">Nuevo Distribuidor</button>
            </div>
          </div>
        </div>

        <div className="row">
          <p>[Placeholder Text]</p>
        </div>

        <div className="row">
          <div className="col">  
            <h3>Lista de Productos</h3>
          </div>
          <div className="col">
            <form class="d-flex">
             <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
        <div className="row">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col"># Producto</th>
                <th scope="col">Producto</th>
                <th scope="col">Disponible (kg)</th>
                <th scope="col">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">26</th>
                <td>Chile Guajillo</td>
                <td>6682.36</td>
                <td>12/12/2021</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Hoja p/Tamal Chisemex</td>
                <td>3,024</td>
                <td>09/28/2021</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Alpistle Bulto 25kg</td>
                <td>0</td>
                <td>12/24/2021</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="row">
          <div className="col">  
            <h3>Lista de Distribuidores</h3>
          </div>
          <div className="col">
            <form class="d-flex">
             <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
        </div>
        <div className="row">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col"># Distribuidor</th>
                <th scope="col">Nombre</th>
                <th scope="col">Compras</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Chisemex</td>
                <td>6682.36</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Dry Produce Divison LLC</td>
                <td>3,024</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Placeholder</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
        </div>

        
      
      </div>


      

      
    </div>
  );
}

export default App;
