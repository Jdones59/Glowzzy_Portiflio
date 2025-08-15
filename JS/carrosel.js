import { obterProdutos } from './produtos.js';
import { criarCardProduto } from './cards.js';

export function inicializarCarrossel() {
    const container = document.getElementById('destaquesContainer');
    const setaEsquerda = document.getElementById('setaEsquerda');
    const setaDireita = document.getElementById('setaDireita');
    const wrapper = document.querySelector('#destaques .image-container');

    if (!container || !setaEsquerda || !setaDireita || !wrapper) {
        console.warn('Elementos do carrossel não encontrados.');
        return;
    }

    const produtos = obterProdutos();
    const cardsVisiveis = 4;
    const cardsParcial = 6;
    let indiceAtual = 0;
    let emTransicao = false;

    function renderizarGrupo(animarEntrada = false) {
        container.innerHTML = '';
        let grupo = [];
        for (let i = 0; i < cardsVisiveis; i++) {
            grupo.push(produtos[(indiceAtual + i) % produtos.length]);
        }
        grupo.forEach((produto, i) => {
            const card = criarCardProduto(produto);
            if (animarEntrada) {
                card.classList.add('card-entrada');
                card.style.animationDelay = `${i * 60}ms`;
            }
            container.appendChild(card);
        });
        if (animarEntrada) {
            setTimeout(() => {
                container.querySelectorAll('.card-entrada').forEach(card => {
                    card.classList.remove('card-entrada');
                    card.style.animationDelay = '';
                });
            }, cardsVisiveis * 60 + 400);
        }
    }

    function animarSaida(direcao, callback) {
        if (emTransicao) return;
        emTransicao = true;

        const cards = Array.from(container.children);
        const ordem = direcao === 'direita' ? [...cards].reverse() : [...cards];

        ordem.forEach((card, index) => {
            card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            card.style.transitionDelay = `${index * 60}ms`;
            card.style.transform = 'translateY(-20px)';
            card.style.opacity = '0';
        });

        setTimeout(() => {
            callback();
            emTransicao = false;
        }, ordem.length * 60 + 400);
    }

    function mover(direcao) {
        if (emTransicao) return;
        animarSaida(direcao, () => {
            if (direcao === 'direita') {
                indiceAtual = (indiceAtual + 1) % produtos.length;
            } else {
                indiceAtual = (indiceAtual - 1 + produtos.length) % produtos.length;
            }
            renderizarGrupo(true);
        });
    }

    setaDireita.addEventListener('click', () => mover('direita'));
    setaEsquerda.addEventListener('click', () => mover('esquerda'));
    window.addEventListener('resize', () => renderizarGrupo());

    // wrapper.addEventListener('mouseenter', pararAutoplay);
    // wrapper.addEventListener('mouseleave', iniciarAutoplay);

    renderizarGrupo();
    // iniciarAutoplay(); // Autoplay desativado para navegação manual
}
