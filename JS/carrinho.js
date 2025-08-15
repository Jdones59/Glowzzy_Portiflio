import { formatarPreco, mostrarMensagem } from './utils.js';
import { getState, setState } from './state.js';
import { publish, subscribe } from './events.js';
import { obterProdutos } from './produtos.js';

// Seleção de elementos do DOM
const modalCarrinho = document.getElementById('modalCarrinho');
const listaCarrinho = document.getElementById('listaCarrinho');
const btnCarrinhoFlutuante = document.getElementById('carrinhoFlutuante');
const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
const contadorCarrinho = document.getElementById('contador-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');
const limparCarrinho = document.getElementById('limpar-carrinho');

/**
 * Inicializa o carrinho e seus eventos.
 */
export function inicializarCarrinho() {
    if (!modalCarrinho || !listaCarrinho || !btnCarrinhoFlutuante || !btnFinalizarCompra || !totalCarrinho || !limparCarrinho) {
        console.error('Elementos do carrinho não encontrados:', {
            modalCarrinho: !!modalCarrinho,
            listaCarrinho: !!listaCarrinho,
            btnCarrinhoFlutuante: !!btnCarrinhoFlutuante,
            btnFinalizarCompra: !!btnFinalizarCompra,
            totalCarrinho: !!totalCarrinho,
            limparCarrinho: !!limparCarrinho
        });
        mostrarMensagem('Erro ao carregar o carrinho. Tente recarregar a página.', 'error');
        return;
    }

    listaCarrinho.setAttribute('aria-live', 'polite');

    btnCarrinhoFlutuante.addEventListener('click', () => {
        modalCarrinho.classList.add('ativo');
        modalCarrinho.querySelector('.conteudo-modal').classList.add('magical-open');
        listaCarrinho.focus();
    });

    modalCarrinho.querySelector('.fechar').addEventListener('click', () => {
        modalCarrinho.classList.remove('ativo');
        modalCarrinho.querySelector('.conteudo-modal').classList.remove('magical-open');
    });

    modalCarrinho.addEventListener('click', (e) => {
        if (e.target === modalCarrinho) {
            modalCarrinho.classList.remove('ativo');
            modalCarrinho.querySelector('.conteudo-modal').classList.remove('magical-open');
        }
    });

    limparCarrinho.addEventListener('click', () => {
        setState({ carrinho: [] });
        mostrarMensagem('Carrinho limpo com sucesso!');
    });

    btnFinalizarCompra.addEventListener('click', finalizarCompra);

    subscribe('adicionarAoCarrinho', ({ id, quantidade, observacao }) => {
        const produto = obterProdutos().find(p => p.id === id);
        if (produto) {
            adicionarAoCarrinho(produto, quantidade, observacao);
        } else {
            console.warn(`Produto com ID ${id} não encontrado.`);
            mostrarMensagem('Produto não encontrado.', 'error');
        }
    });

    subscribe('cart:updated', atualizarUI);
    atualizarUI();
}

/**
 * Adiciona um produto ao carrinho.
 */
export function adicionarAoCarrinho(produto, quantidade = 1, comentario = '') {
    const { carrinho } = getState();
    const itemExistente = carrinho.find(item => item.id === produto.id && item.comentario === comentario);
    let novoCarrinho;

    if (itemExistente) {
        novoCarrinho = carrinho.map(item =>
            item.id === produto.id && item.comentario === comentario
                ? { ...item, quantidade: item.quantidade + quantidade }
                : item
        );
    } else {
        novoCarrinho = [...carrinho, { ...produto, quantidade, comentario }];
    }

    setState({ carrinho: novoCarrinho });
    mostrarMensagem(`${produto.nome} adicionado ao carrinho!`);
}

/**
 * Atualiza a interface do carrinho.
 */
function atualizarUI() {
    const { carrinho } = getState() || { carrinho: [] };
    listaCarrinho.innerHTML = '';

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<li class="carrinho-vazio-msg">Seu carrinho está vazio</li>';
        if (contadorCarrinho) contadorCarrinho.textContent = '0';
        totalCarrinho.textContent = 'Total: R$ 0,00';
        return;
    }

    let total = 0;
    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" class="item-carrinho-img" onerror="this.src='img/placeholder.webp'"/>
            <span class="item-carrinho-nome">${item.nome}</span>
            <span class="item-carrinho-preco">${formatarPreco(item.preco * item.quantidade)}</span>
            <button class="remover-item-carrinho" data-id="${item.id}" aria-label="Remover ${item.nome} do carrinho">X</button>
        `;
        listaCarrinho.appendChild(li);
    });

    totalCarrinho.textContent = `Total: ${formatarPreco(total)}`;
    if (contadorCarrinho) {
        contadorCarrinho.textContent = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    }

    document.querySelectorAll('.remover-item-carrinho').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removerDoCarrinho(parseInt(e.target.dataset.id));
        });
    });
}

/**
 * Remove um item do carrinho.
 */
function removerDoCarrinho(id) {
    setState({ carrinho: getState().carrinho.filter(item => item.id !== id) });
    mostrarMensagem('Item removido do carrinho!');
}

/**
 * Finaliza a compra e limpa o carrinho.
 */
function finalizarCompra() {
    const { carrinho } = getState();
    if (carrinho.length === 0) {
        mostrarMensagem('Carrinho vazio!', 'error');
        return;
    }
    mostrarMensagem('Compra finalizada com sucesso!');
    setState({ carrinho: [] });
    modalCarrinho.classList.remove('ativo');
    modalCarrinho.querySelector('.conteudo-modal').classList.remove('magical-open');
}