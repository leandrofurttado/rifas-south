import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function App() {

  useEffect(() => {
    consultarNumeros();

  }, []);

  const totalNumeros = 200;
  const [numerosSelecionados, setNumerosSelecionados] = useState([]);
  const [numerosVendidos, setNumerosVendidos] = useState([]);
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [numerosAtivos, setNumerosAtivos] = useState([]);
  const apiConsultar = process.env.REACT_APP_API_CONSULTAR.replace(/^"|"$/g, '');
  const apiDesativar = process.env.REACT_APP_API_DESATIVAR.replace(/^"|"$/g, '');



  const chavePix = process.env.REACT_APP_CHAVE_PIX;;

  const handleSelecionarNumero = (numero) => {
    if (!numerosAtivos.includes(numero)) return;

    if (numerosSelecionados.includes(numero)) {
      setNumerosSelecionados(numerosSelecionados.filter(n => n !== numero));
    } else {
      setNumerosSelecionados([...numerosSelecionados, numero]);
    }
  };

  const abrirPagamento = () => {
    if (numerosSelecionados.length === 0) {
      alert('Selecione pelo menos um número antes de finalizar.');
      return;
    }
    setMostrarPagamento(true);
  };

  function removerNumeros(numeros) {
    const form = {
      numeros: numeros  // array de números, ex: [10, 15, 20]
    };

    axios.post(apiDesativar, form)
      .then(response => {
        console.log("Rifas desativadas com sucesso:", response.data);
      })
      .catch(error => {
        console.error("Erro ao desativar rifas:", error);
      });
  }

  function consultarNumeros() {
    axios.get(apiConsultar)
      .then(response => {
        const dados = response.data.dados || [];
        const numerosDisponiveis = dados.map(item => item.numero);
        setNumerosAtivos(numerosDisponiveis);
      })
      .catch(error => {
        console.error("Erro ao desativar rifas:", error);
      });
  }


  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    alert('Chave Pix copiada!');
  };

  const fecharModal = () => {
    setNumerosVendidos([...numerosVendidos, ...numerosSelecionados]);
    //setNumerosSelecionados([]);
    setMostrarPagamento(false);
  };

  const [mostrarAdminModal, setMostrarAdminModal] = useState(false);
  const [senhaAdmin, setSenhaAdmin] = useState('');
  const [numerosAdmin, setNumerosAdmin] = useState('');

  const senhaCorreta = process.env.REACT_APP_SENHA_ADMIN;

  const abrirAdminModal = () => {
    setMostrarAdminModal(true);
    setSenhaAdmin('');
    setNumerosAdmin('');
  };

  const confirmarNumerosVendidos = () => {
    if (senhaAdmin !== senhaCorreta) {
      alert("Senha incorreta!");
      return;
    }

    const numeros = numerosAdmin
      .match(/\d+/g) // Encontra todos os números
      ?.map(n => parseInt(n))
      .filter(n => !isNaN(n) && n >= 1 && n <= totalNumeros) || [];

    if (numeros.length === 0) {
      alert("Informe ao menos um número válido.");
      return;
    }

    removerNumeros(numeros);
    setMostrarAdminModal(false);
    consultarNumeros();
  };

  return (
    <div className="App">
      <h1> Rifa de São João - Escolha seus Números </h1>
      <h1> Valor Unidade: R$5,00 </h1>
      <button onClick={abrirAdminModal} className="admin-btn">Cadastrar Números Vendidos (Admin)</button>

      <div className="grid">
        {Array.from({ length: totalNumeros }, (_, i) => i + 1).map((numero) => {
          const vendido = !numerosAtivos.includes(numero);
          const selecionado = numerosSelecionados.includes(numero);

          return (
            <div
              key={numero}
              className={`numero-card 
          ${vendido ? 'vendido' : ''} 
          ${selecionado ? 'selecionado' : ''}`}
              onClick={() => handleSelecionarNumero(numero)}
            >
              {numero}
            </div>
          );
        })}
      </div>

      {numerosSelecionados.length > 0 && (
        <button className="finalizar" onClick={abrirPagamento}>
          Finalizar e Pagar {numerosSelecionados.length > 1 ? `(${numerosSelecionados.length} números)` : ''}
        </button>
      )}

      {mostrarPagamento && (
        <div className="modal">
          <div className="modal-content">
            <h2> Quase lá!</h2>

            <div className="resumo-numeros">
              <p><strong>Números escolhidos:</strong></p>
              <div className="numeros-selecionados">
                {numerosSelecionados.map((num) => (
                  <span key={num} className="numero-item">{num}</span>
                ))}
              </div>
            </div>

            <p className="valor-total">
              <strong>Valor total:</strong> R${numerosSelecionados.length * 5},00
            </p>

            <div className="info-pix">
              <p>Realize o pagamento via Pix usando a chave abaixo:</p>
              <input type="text" value={chavePix} readOnly />
              <button onClick={copiarPix}>📋 Copiar chave Pix</button>
            </div>

            <div className="qr">
              <p><strong>Ou escaneie o QR Code:</strong></p>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pix%20para%20${chavePix}%20-%20Valor:%20R$${numerosSelecionados.length * 5},00`}
                alt="QR Code Pix"
              />
            </div>

            <div>
              <h4 className="info-pos"><strong>Não esqueça de informar os números que escolheu!</strong></h4>
              <h4 className="info-pos"><strong>Tire um print desta tela se necessário.</strong></h4>
            </div>

            <button className="fechar" onClick={fecharModal}>Fechar</button>
          </div>
        </div>
      )}

      {mostrarAdminModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Cadastro Manual de Números Vendidos</h2>

            <label>Senha:</label>
            <input
              type="password"
              value={senhaAdmin}
              onChange={(e) => setSenhaAdmin(e.target.value)}
            />

            <label>Números vendidos (separados por vírgula):</label>
            <input
              type="text"
              placeholder="Ex: 10, 25, 32"
              value={numerosAdmin}
              onChange={(e) => setNumerosAdmin(e.target.value)}
            />

            <div style={{ marginTop: '10px' }}>
              <button onClick={confirmarNumerosVendidos}>Confirmar</button>
              <button onClick={() => setMostrarAdminModal(false)} style={{ marginLeft: '10px' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
