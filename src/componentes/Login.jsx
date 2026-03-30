import './Login.css';
import React from "react";

// Importamos el cliente de Supabase que creamos en credenciales.js
import { supabase } from '../credenciales';

const Login = () => {

    const functAutenticacion = async (e) => {
        e.preventDefault();
        const correo = e.target.email.value;
        const contraseña = e.target.password.value;

        // Supabase usa signInWithPassword y devuelve un objeto con data y error
        const { data, error } = await supabase.auth.signInWithPassword({
            email: correo,
            password: contraseña,
        });

        if (error) {
            // Si hay un error (ej. credenciales inválidas), mostramos la alerta
            alert("El correo o la contraseña son incorrectos");
            console.error("Error de autenticación:", error.message);
        } else {
            // Si el login es exitoso, redirigimos a la página principal
            window.location.href = "https://congregacionevb.github.io/CongregacionEVB/";
        }
    }

    return (
        <div className='container'>
            <div className="row">
                <div className="col-md-4">
                    <div className="padre">
                        <div className="card card-body shadow-lg">
                            <form onSubmit={functAutenticacion}>
                                <input type="email" placeholder="Ingresar Email" className='cajatexto' id='email'/>
                                <input type="password" placeholder="Ingresar Contraseña" className='cajatexto' id='password'/>
                                <button className="btnform">Iniciar sesion</button>
                                <a href="https://congregacionevb.github.io/CongregacionEVB/">
                                    <img className="atras" src="img territorios/atras.png" alt="" />
                                </a>
                            </form>
                        </div>
                    </div>
                </div>   

                <div className="col-md-8">
                    <img id='imgLog' src="img territorios/Login3.png" alt="" className='tamaño-imagen' />
                </div>
            </div>
        </div>
    )
}

export default Login;