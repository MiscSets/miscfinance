// app.js - Motor de Lógica (Frontend) - MiscSets Finance

// CONFIGURAÇÃO: Insira aqui a mesma URL gerada no seu Apps Script (/exec) para fazer a ponte de API
const API_URL = 'https://script.google.com/macros/s/AKfycbyyLKSu0G44xex8kio48IyUoYKim4xP5Sg0qz7Pd22ajRwr_rO1sHi89NRjllRMSkwY/exec';

// Executa automaticamente assim que a página carrega no navegador
window.addEventListener('load', () => {
  carregarSaldosDoPainel();
  
  // Registro automático do Service Worker para o PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker do Finance registrado com sucesso!'))
      .catch(err => console.error('Erro ao registrar Service Worker:', err));
  }
});

// Busca os saldos consolidados na API do Apps Script e atualiza os cards neon
async function carregarSaldosDoPainel() {
  try {
    const response = await fetch(`${API_URL}?action=obterSaldosPainel`);
    const saldos = await response.json();
    document.getElementById('valEntradas').innerText = saldos.entradas || '...';
    document.getElementById('valDespesas').innerText = saldos.despesas || '...';
    document.getElementById('valInvestido').innerText = saldos.investido || '...';
    document.getElementById('valSaldo').innerText = saldos.saldo || '...';
  } catch (error) {
    console.error('Erro ao buscar saldos do painel:', error);
  }
}

// Funções de controle dos Modais Overlay (Telas flutuantes)
function abrirModal(id) { 
  document.getElementById(id).style.display = 'flex'; 
}

function fecharModal(id) { 
  document.getElementById(id).style.display = 'none'; 
}

// Envia os dados do formulário para a planilha via POST (Modo No-Cors otimista)
async function enviarDados(event) {
  event.preventDefault();
  const btn = document.getElementById('btnAcao');
  const statusDiv = document.getElementById('status');
  
  btn.disabled = true;
  btn.innerText = "SALVANDO...";
  statusDiv.className = "";
  statusDiv.innerText = "";
  
  const dados = {
    valor: document.getElementById('valor').value,
    descricao: document.getElementById('descricao').value,
    categoria: document.getElementById('categoria').value
  };
  
  try {
    await fetch(API_URL, {
      method: 'POST',
      mode: 'no-cors', // Evita problemas de redirecionamento/CORS nativos do Apps Script
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    // Tratamento otimista padrão para requisições no-cors com Apps Script
    statusDiv.className = "sucesso";
    statusDiv.innerText = "Lançamento enviado com sucesso!";
    document.getElementById('financeForm').reset();
    
    // Aguarda um pequeno delay para a planilha processar e recarrega os saldos na tela
    setTimeout(carregarSaldosDoPainel, 1500);

  } catch (error) {
    statusDiv.className = "erro";
    statusDiv.innerText = "Erro crítico ao conectar com o servidor.";
    console.error('Erro no envio:', error);
  } finally {
    btn.disabled = false;
    btn.innerText = "SALVAR LANÇAMENTO";
  }
}
