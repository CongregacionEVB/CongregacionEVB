import './Login.css';
import {React, useState} from "react";

import appFirebase from '../credenciales'
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth'
const auth= getAuth(appFirebase)

const Login = () => {

    const functAutenticacion = async(e) => {
        e.preventDefault();
        const correo = e.target.email.value;
        const contraseña = e.target.password.value;

        try{
            await signInWithEmailAndPassword(auth,correo,contraseña)
            window.location.href = "https://congregacionevb.github.io/CongregacionEVB/"
        }
        catch(error){
            alert("El correo o la contraseña son incorrectos")
        }
       
    }



    return (
        <div className = 'container'>
            
           <div className = "row">

                <div className = "col-md-4">
                    <div className="padre">
                        <div className="card card-body shadow-lg">
                            <form onSubmit={functAutenticacion}>
                                <input type = "email" placeholder="Ingresar Email" className='cajatexto' id='email'/>
                                <input type="password" placeholder="Ingresar Contraseña" className='cajatexto' id='password'/>
                                <button className="btnform">Iniciar sesion</button>
                                <a href="https://congregacionevb.github.io/CongregacionEVB/"><img className="atras" src="img territorios/atras.png" alt="" /></a>
                            </form>
                        </div>
                    </div>
                </div>   

                <div className = "col-md-8">
                    <img id='imgLog' src="img territorios/Login3.png" alt="" className='tamaño-imagen' />
                </div>

           </div>

        </div>
    )
}

export default Login;