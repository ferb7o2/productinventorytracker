import React from "react";

function AddProduct(){

    return(
        <div className="Application">
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
                <div className='row'>
                    <div className='col'>
                        <a href='/'>
                            <img src='https://cdn3.iconfinder.com/data/icons/user-interface-731/32/Left_Chevron-512.png' id='left-back-btn'></img>
                        </a>
                    </div>
                    <div className='col'>
                        <a href='/'>
                            <img src='https://icons-for-free.com/iconfiles/png/512/arrow+right+chevron+chevronrightcircle+circle+right+right-1320185732004907921.png' id='right-back-btn'></img>
                        </a>
                    </div>
                </div>
            </header>
            <div className="container">
                    <div className='row'>
                        <h1>Producto Nuevo</h1>
                    </div>
                    
                    <div className='fair-spacing'/>
                    <div className='row'>
                        <form>
                            <div class="form-group row">
                                <label for="inputEmail3" class="col-sm-2 col-form-label">Nombre</label>
                                <div class="col-sm-10">
                                <input type="email" class="form-control" id="inputEmail3" placeholder="Nombre de Producto"/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="inputPassword3" class="col-sm-2 col-form-label">Descripcion</label>
                                <div class="col-sm-10">
                                <input type="password" class="form-control" id="inputPassword3" placeholder="Descripcion (opcional)"/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-sm-2">[Cantidad]</div>
                                <div class="col-sm-10">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="gridCheck1"/>
                                    <label class="form-check-label" for="gridCheck1">
                                    Kg
                                    </label>
                                </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-1">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="gridCheck1"/>
                                    <label class="form-check-label" for="gridCheck1">
                                    Bulto/Caja
                                    </label>
                                </div>
                                </div>
                                <div class="col-sm-2">
                                <div class="form-check">
                                    <input type="email" class="form-control" id="inputQuantityType" placeholder="Peso (kg)" disabled/>
                                </div>
                                </div>
                            </div>
                            <div className="fair-spacing"/>
                            <div class="form-group row">
                                <div class="col-sm-10">
                                <button type="submit" class="btn btn-primary">Registrar Producto</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div> 
        </div>

    );

}

export default AddProduct;