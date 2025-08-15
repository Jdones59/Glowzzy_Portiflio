import { inicializarVitrine } from './cards.js';
import { inicializarBusca } from './busca.js';
import { inicializarCarrossel } from './carrosel.js';
import { inicializarCarrinho } from './carrinho.js';
import { inicializarModal } from './modalcard.js';
import { inicializarDropdown } from './dropdown.js';
import './events.js';
import './state.js';
import { mostrarMensagem } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Iniciando aplicação -', new Date().toLocaleString());
  try {
    console.log('1. Estado global carregado.');
    console.log('2. Inicializando dropdown...');
    inicializarDropdown();
    console.log('3. Dropdown inicializado com sucesso.');
    console.log('4. Inicializando vitrine de produtos...');
    inicializarVitrine();
    console.log('5. Vitrine inicializada com sucesso.');
    console.log('6. Inicializando barra de busca...');
    inicializarBusca();
    console.log('7. Busca inicializada com sucesso.');
    console.log('8. Inicializando carrossel...');
    inicializarCarrossel();
    console.log('9. Carrossel inicializado com sucesso.');
    console.log('10. Inicializando modal de produto...');
    inicializarModal();
    console.log('11. Modal inicializado com sucesso.');
    console.log('12. Inicializando carrinho...');
    inicializarCarrinho();
    console.log('13. Carrinho inicializado com sucesso.');
    console.log('✅ Aplicação inicializada com sucesso!');
  } catch (error) {
    // Se ocorrer qualquer erro durante a inicialização, exibe no console e mostra mensagem ao usuário
    console.error('Erro na inicialização:', error.message, error.stack);
    mostrarMensagem('Erro ao inicializar a aplicação. Tente recarregar a página.', 'error');
  }
});