import React from "react";
import $ from 'jquery';
import {useStateContext} from './contexts/dataContext'



function AddProduct(){

    function checkedBoxBULK(){
        if($('#gridCheckBulk').is(':checked'))  //if bulk checkbox is checked
        {
            $('#inputQuantityType').attr('disabled',false); //enable the textbox right next to it
            $('#gridCheckKg').prop('checked',false);
        }
        else
        {
            $('#inputQuantityType').attr('disabled',true);  //if not checked, disable it
            $('#gridCheckKg').prop('checked',true);
        }
    }

    function checkedBoxKG(){
        if($('#gridCheckKg').is(':checked'))  //if Kg checkbox is checked
        {
            $('#inputQuantityType').attr('disabled',true); //disable Bulk textbox
            $('#gridCheckBulk').prop('checked',false);     //disable bulk checkbox
        }
        else
        {
            $('#inputQuantityType').attr('disabled',false);  //if not checked
            $('#gridCheckKg').prop('checked',false);        
        }
    }

    

    let index=3;
    const[ProductData, setProductData]= useStateContext()[0];

    function registerProduct(e){
        e.preventDefault();
        console.log(ProductData);

        //check if both fields have been entered
        if($('#productNameField').val().length===0)
        {
            //display error [no blank names]
        }
        else
        {
            if($('#gridCheckBulk').is(':checked'))
            {
                if($('#inputQuantityType').val().length!=0)
                    setProductData([...ProductData,{pId: (index++), pName:$('#productNameField').val(), pDescription:$('#productDescriptionField').val(), pQuantity:parseInt($('#inputQuantityType').val(),10), pWeightType:'Bulto'}])
                else
                    console.log("DISPLAY ERROR [no blank]");
            }
            else
            {
                setProductData([...ProductData,{pId: (index++), pName:$('#productNameField').val(), pDescription:$('#productDescriptionField').val(), pQuantity:1, pWeightType:'Kg'}])
            }
        }

        console.log(ProductData);


    }

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
                                <label for="productNameField" class="col-sm-2 col-form-label">Nombre</label>
                                <div class="col-sm-10">
                                <input type="text" class="form-control" id="productNameField" placeholder="Nombre de Producto"/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="productDescriptionField" class="col-sm-2 col-form-label">Descripcion</label>
                                <div class="col-sm-10">
                                <input type="text" class="form-control" id="productDescriptionField" placeholder="Descripcion (opcional)"/>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-sm-2">[Cantidad]</div>
                                <div class="col-sm-10">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="gridCheckKg" onChange={checkedBoxKG} checked/>
                                    <label class="form-check-label" for="gridCheckKg">
                                    Kg
                                    </label>
                                </div>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-sm-2"></div>
                                <div class="col-sm-1">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="gridCheckBulk" onChange={checkedBoxBULK}/>
                                    <label class="form-check-label" for="gridCheckBulk">
                                    Bulto/Caja
                                    </label>
                                </div>
                                </div>
                                <div class="col-sm-2">
                                <div class="form-check">
                                    <input type="text" class="form-control" id="inputQuantityType" placeholder="Peso (kg)" disabled/>
                                </div>
                                </div>
                            </div>
                            <div className="fair-spacing"/>
                            <div class="form-group row">
                                <div class="col-sm-10">
                                <button type="submit" class="btn btn-primary" onClick={registerProduct}>Registrar Producto</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div> 
        </div>

    );

}

export default AddProduct;