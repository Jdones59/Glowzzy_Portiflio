import { obterProdutoPorId } from './produtos.js';
import { adicionarAoCarrinho } from './carrinho.js';
import { mostrarMensagem } from './utils.js';
import { publish } from './events.js';

// Seleção de elementos do modal
const modalProduto = document.getElementById('modalCard');
const fecharModalBtn = document.getElementById('fecharCard');
const modalImg = document.getElementById('modalCardImg');
const modalNome = document.getElementById('modalCardNome');
const modalDesconto = document.getElementById('modalCardDesconto');
const modalDescricao = document.getElementById('modalCardDescricao');
const modalPreco = document.getElementById('modalCardPreco');
const modalPrecoOriginal = document.getElementById('modalCardPrecoOriginal');
const btnAdicionar = document.getElementById('btnAdicionar');
const quantidadeInput = modalProduto?.querySelector('input[type="number"]');
const observacaoTextarea = modalProduto?.querySelector('textarea');
const btnMenos = modalProduto?.querySelector('.quantidade-btn[aria-label="Diminuir quantidade"]');
const btnMais = modalProduto?.querySelector('.quantidade-btn[aria-label="Aumentar quantidade"]');

let produtoAtual = null;

// Função para fechar o modal
function fecharModal() {
    if (modalProduto) {
        modalProduto.classList.remove('ativo');
        modalProduto.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('card-ampliado-aberto');
        if (document.activeElement) {
            document.activeElement.focus();
        }
    }
}

// Função para gerenciar foco dentro do modal
function trapFocus(event) {
    if (!modalProduto) return;
    const focusableElements = modalProduto.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
        }
    }
}

// Manipulador para adicionar ao carrinho
function handleAdicionar() {
    if (!produtoAtual) {
        mostrarMensagem('Nenhum produto selecionado.', 'error');
        return;
    }
    const quantidade = parseInt(quantidadeInput?.value);
    if (isNaN(quantidade) || quantidade < 1) {
        mostrarMensagem('Por favor, insira uma quantidade válida.', 'error');
        return;
    }
    const observacao = observacaoTextarea?.value.trim() || '';
    adicionarAoCarrinho(produtoAtual, quantidade, observacao);
    publish('adicionarAoCarrinho', { id: produtoAtual.id, quantidade, observacao });
    fecharModal();
    mostrarMensagem(`${produtoAtual.nome} adicionado ao carrinho!`);
}

/**
 * Inicializa o modal de produto, configurando eventos.
 */
export function inicializarModal() {
    if (!modalProduto || !fecharModalBtn || !btnAdicionar || !quantidadeInput || !observacaoTextarea || !btnMenos || !btnMais) {
        console.warn('Elementos do modal de produto não encontrados:', {
            modalProduto: !!modalProduto,
            fecharModalBtn: !!fecharModalBtn,
            btnAdicionar: !!btnAdicionar,
            quantidadeInput: !!quantidadeInput,
            observacaoTextarea: !!observacaoTextarea,
            btnMenos: !!btnMenos,
            btnMais: !!btnMais
        });
        mostrarMensagem('Erro ao carregar o modal de produto. Tente recarregar a página.', 'error');
        return;
    }

    // Configuração de eventos
    fecharModalBtn.addEventListener('click', fecharModal);
    modalProduto.addEventListener('click', (event) => {
        if (event.target === modalProduto) {
            fecharModal();
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalProduto.classList.contains('ativo')) {
            fecharModal();
        } else if (modalProduto.classList.contains('ativo')) {
            trapFocus(event);
        }
    });
    btnAdicionar.addEventListener('click', handleAdicionar);
    btnMenos.addEventListener('click', () => {
        const currentValue = parseInt(quantidadeInput.value) || 1;
        if (currentValue > 1) {
            quantidadeInput.value = currentValue - 1;
        }
    });
    btnMais.addEventListener('click', () => {
        const currentValue = parseInt(quantidadeInput.value) || 1;
        quantidadeInput.value = currentValue + 1;
    });
    quantidadeInput.addEventListener('input', () => {
        if (quantidadeInput.value < 1) quantidadeInput.value = 1;
    });
}

/**
 * Abre o modal preenchendo-o com os dados do produto.
 * @param {number} produtoId - O ID do produto a ser exibido.
 */
export function abrirCardAmpliado(produtoId) {
    const produto = obterProdutoPorId(produtoId);
    if (!produto) {
        mostrarMensagem('Produto não encontrado.', 'error');
        return;
    }

    produtoAtual = produto;

    modalImg.src = produto.imagem;
    modalImg.alt = produto.nome;
    modalNome.textContent = produto.nome;
    modalDescricao.textContent = produto.descricao;
    modalPreco.textContent = produto.precoFormatado;
    if (produto.descontoAplicado) {
        modalDesconto.textContent = `${produto.descontoAplicado}% OFF`;
        modalDesconto.style.display = 'block';
    } else {
        modalDesconto.style.display = 'none';
    }
    if (produto.precoOriginal) {
        modalPrecoOriginal.textContent = produto.precoOriginalFormatado;
        modalPrecoOriginal.style.display = 'block';
    } else {
        modalPrecoOriginal.style.display = 'none';
    }
    quantidadeInput.value = 1;
    observacaoTextarea.value = '';

    modalProduto.classList.add('ativo');
    modalProduto.setAttribute('aria-hidden', 'false');
    document.body.classList.add('card-ampliado-aberto');
    modalProduto.querySelector('button, input, textarea').focus();
    modalProduto.querySelector('.modal-conteudo').classList.add('magical-open');
}