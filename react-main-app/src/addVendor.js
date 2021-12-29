import React from "react";
import $ from 'jquery';
import{useHistory} from 'react-router-dom'

import {useStateContext} from './contexts/dataContext'

function AddVendor(){

    const history=useHistory();
    const goBack=()=>{
        history.goBack();
    }

    const[VendorData, setVendorData]= useStateContext()[2];


    function registerVendor(e){
        e.preventDefault();
        let uppercaseRFC='';

        if($('#vendorNameField').val().length!==0)
        {
            if($('#vendorRFCField').val().length!==0)
            {
                    uppercaseRFC=$('#vendorRFCField').val().toUpperCase();
                    setVendorData([...VendorData, {vId: 1, vName:$('#vendorNameField').val(), vRFC:uppercaseRFC, vNumOfTransactions:0, vAddress:$('#vendorAddressField').val()},]);
                    history.goBack();
            }
            else
            {
                $('#error-vendor').removeAttr('hidden');
                $('#error-vendor').text("Error - el RFC de el DISTRIBUIDOR no puede estar vacio")
            }
               
        }
        else
        {
            $('#error-vendor').removeAttr('hidden');
            $('#error-vendor').text("Error - el NOMBRE de el DISTRIBUIDOR no puede estar vacio");
        }



        console.log(VendorData);
    }

    return(
        <div className="Application">
            <header>
                <div class="alert alert-danger" role="alert" id='error-vendor' onClick={()=>{$('#error-vendor').attr('hidden',true)}} hidden>
                    This is a danger alert—check it out!
                </div>
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
                        <h1>Nuevo distribuidor</h1>
                    </div>
                    
                    <div className='fair-spacing'/>
                    <div className='row'>
                        <form>
                            <div class="form-group row">
                                <label for="vendorNameField" class="col-sm-2 col-form-label">Nombre</label>
                                <div class="col-sm-10">
                                <input type="text" class="form-control" id="vendorNameField" placeholder="Nombre de Negocio"/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="vendorRFCField" class="col-sm-2 col-form-label">RFC</label>
                                <div class="col-sm-10">
                                <input type="text" class="form-control" id="vendorRFCField" placeholder="RFC"/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="vendorAddressField" class="col-sm-2 col-form-label">Direccion</label>
                                <div class="col-sm-10">
                                <input type="text" class="form-control" id="vendorAddressField" placeholder="Direccion (opcional)"/>
                                </div>
                            </div>
                            <div className="fair-spacing"/>
                            <div class="form-group row">
                                <div class="col-sm-10">
                                <button type="submit" class="btn btn-primary" onClick={registerVendor}>Registrar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div> 
        </div>

    );

}

export default AddVendor;