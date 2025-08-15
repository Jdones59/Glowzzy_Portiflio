import { obterProdutos, filtrarPorTag, filtrarPorCategoria } from './produtos.js';
import { getState, setState } from './state.js';
import { publish } from './events.js';

function limparVitrine(container) {
  container.innerHTML = '';
}

export function criarCardProduto(produto) {
  const card = document.createElement('div');
  card.className = 'card card-produto'; // Corrige para incluir ambas as classes
  card.dataset.id = produto.id;
  card.role = 'button';
  card.tabIndex = 0;
  card.ariaLabel = `Ver detalhes do produto ${produto.nome}`;
  card.innerHTML = `
    <div class="image-container">
      ${produto.descontoAplicado ? `<span class="selo-promocao">${produto.descontoAplicado}% OFF</span>` : ''}
      <img src="${produto.imagem}" alt="${produto.nome}" class="card-imagem" onerror="this.src='img/placeholder.webp'; this.onerror=null;">
    </div>
    <h3>${produto.nome}</h3>
    <div class="preco">
      <span class="preco-desconto">${produto.precoFormatado}</span>
      ${produto.precoOriginal ? `<span class="preco-original">${produto.precoOriginalFormatado}</span>` : ''}
    </div>
    <button class="btn-comprar" data-id="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">Comprar</button>
  `;
  const abrirModal = () => import('./modalcard.js').then(({ abrirCardAmpliado }) => abrirCardAmpliado(Number(card.dataset.id)));
  card.addEventListener('click', abrirModal);
  card.addEventListener('keydown', e => {
    if (['Enter', ' '].includes(e.key)) {
      e.preventDefault();
      abrirModal();
    }
  });
  card.querySelector('.btn-comprar').addEventListener('click', e => {
    e.stopPropagation();
    abrirModal();
  });
  return card;
}

function preencherVitrine(container, produtos) {
  limparVitrine(container);
  produtos.forEach(produto => container.appendChild(criarCardProduto(produto)));
}

export function inicializarVitrine() {
  const destaquesContainer = document.getElementById('destaquesContainer');
  const maisVendidosContainer = document.getElementById('maisVendidosContainer');
  const outrosProdutosContainer = document.getElementById('outrosProdutosContainer');

  // Verifica se todos os containers da vitrine existem antes de continuar
  // Se algum container não for encontrado, exibe erro no console e retorna sem executar o restante da função
  if (!destaquesContainer || !maisVendidosContainer || !outrosProdutosContainer) {
    console.error('Containers da vitrine não encontrados:', {
      destaquesContainer: !!destaquesContainer,
      maisVendidosContainer: !!maisVendidosContainer,
      outrosProdutosContainer: !!outrosProdutosContainer
    });
    return;
  }

  const state = getState();
  const produtosDestaque = filtrarPorTag('destaque');
  const produtosMaisVendidos = filtrarPorTag('mais-vendido');
  const produtosFiltrados = state.filtroAtual === 'todos' ? obterProdutos() : filtrarPorCategoria(state.filtroAtual);

  preencherVitrine(destaquesContainer, produtosDestaque);
  preencherVitrine(maisVendidosContainer, produtosMaisVendidos);
  preencherVitrine(outrosProdutosContainer, produtosFiltrados);

  publish('vitrine:atualizada', {
    destaques: produtosDestaque.length,
    maisVendidos: produtosMaisVendidos.length,
    outros: produtosFiltrados.length
  });
}

function atualizarVitrine() {
  const state = getState();
  const outrosProdutosContainer = document.getElementById('outrosProdutosContainer');
  const produtosFiltrados = state.filtroAtual === 'todos' ? obterProdutos() : filtrarPorCategoria(state.filtroAtual);
  preencherVitrine(outrosProdutosContainer, produtosFiltrados);
  publish('vitrine:atualizada', { outros: produtosFiltrados.length });
}

publish('filtro:updated', () => atualizarVitrine());
publish('busca:atualizada', () => atualizarVitrine());