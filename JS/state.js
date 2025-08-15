import { publish } from './events.js';
import { mostrarMensagem } from './utils.js';

/**
 * Estado global da aplicação.
 */
const state = {
    carrinho: [],
    favoritos: [],
    filtroAtual: 'todos',
    termoBusca: '',
};

/**
 * Valida e inicializa o estado a partir do localStorage.
 */
try {
    const carrinhoSalvo = JSON.parse(localStorage.getItem('carrinho'));
    if (Array.isArray(carrinhoSalvo) && carrinhoSalvo.every(item => item.id && item.nome && item.preco && item.imagem)) {
        state.carrinho = carrinhoSalvo;
    } else {
        console.warn('Dados do carrinho no localStorage são inválidos. Limpando carrinho.');
        localStorage.removeItem('carrinho');
    }
    const favoritosSalvo = JSON.parse(localStorage.getItem('favoritos'));
    if (Array.isArray(favoritosSalvo) && favoritosSalvo.every(id => typeof id === 'number')) {
        state.favoritos = favoritosSalvo;
    } else {
        console.warn('Dados de favoritos no localStorage são inválidos. Limpando favoritos.');
        localStorage.removeItem('favoritos');
    }
} catch (error) {
    // Se houver erro ao carregar do localStorage, limpa dados corrompidos e avisa o usuário
    console.warn('Erro ao carregar estado do localStorage:', error);
    localStorage.removeItem('carrinho');
    localStorage.removeItem('favoritos');
    mostrarMensagem('Erro ao carregar dados salvos. O carrinho e favoritos foram reiniciados.', 'error');
}

/**
 * Atualiza o estado e persiste alterações.
 * @param {object} newState - Novo estado a ser mesclado.
 */
function setState(newState) {
    const oldState = { ...state };
    Object.assign(state, newState);

    try {
        if (newState.carrinho !== undefined) {
            localStorage.setItem('carrinho', JSON.stringify(state.carrinho));
            publish('cart:updated', state.carrinho);
        }
        if (newState.favoritos !== undefined) {
            localStorage.setItem('favoritos', JSON.stringify(state.favoritos));
            publish('favoritos:updated', state.favoritos);
        }
        if (newState.filtroAtual !== undefined) {
            publish('filtro:updated', state.filtroAtual);
        }
        if (newState.termoBusca !== undefined) {
            publish('busca:atualizada', state.termoBusca);
        }
    } catch (error) {
        // Se houver erro ao salvar no localStorage, avisa no console e mostra mensagem ao usuário
        console.warn('Erro ao salvar estado no localStorage:', error);
        mostrarMensagem('Erro ao salvar dados. Algumas alterações podem não ser persistidas.', 'error');
    }
}

/**
 * Retorna uma cópia do estado atual.
 * @returns {object} Estado atual.
 */
function getState() {
    return { ...state };
}

export { getState, setState };