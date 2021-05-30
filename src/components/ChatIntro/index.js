import React from 'react';
import './style.css';

export default() => {

    return (
        <div className="chatIntro">
            <img class="chatIntro__img" src="https://web.whatsapp.com/img/intro-connection-light_c98cc75f2aa905314d74375a975d2cf2.jpg" alt="whatsapp-intro" /> 
            <h1>Mantenha seu celular conectado</h1>
            <h2>O Whatsapp conecta ao seu telefone para sincronizar suas mensagens.<br/>Para reduzir o uso de dados, conecte seu telefone em uma rede wi-fi.</h2>
        </div>
    );
}