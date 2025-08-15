/**
 * Módulo responsável por gerenciar o menu dropdown de categorias.
 */

import { publish } from './events.js';
import { mostrarMensagem, verificarElementosDOM } from './utils.js';

// Seletores do DOM
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

/**
 * Abre o menu dropdown.
 */
function abrirDropdown() {
    if (dropdownMenu) {
        dropdownMenu.classList.add('show');
        dropdownToggle?.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Fecha o menu dropdown.
 */
function fecharDropdown() {
    if (dropdownMenu) {
        dropdownMenu.classList.remove('show');
        dropdownToggle?.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Inicializa o menu dropdown com eventos de clique e suporte a acessibilidade.
 */
export function inicializarDropdown() {
    // Verifica elementos do DOM
    const elementos = {
        dropdownToggle,
        dropdownMenu
    };
    // Verifica se todos os elementos necessários do dropdown existem
    if (!verificarElementosDOM(elementos)) {
        // Se algum elemento não existir, exibe mensagem de erro e retorna sem inicializar o dropdown
        mostrarMensagem('Erro ao carregar o menu de categorias. Tente recarregar a página.', 'error');
        return;
    }

    // Configura evento de clique no botão de toggle
    dropdownToggle.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('show')) {
            fecharDropdown();
        } else {
            abrirDropdown();
        }
    });

    // Configura eventos para os itens do dropdown
    const itens = dropdownMenu.querySelectorAll('.dropdown-item');
    itens.forEach(item => {
        item.addEventListener('click', () => {
            const categoria = item.textContent.trim().toLowerCase();
            try {
                publish('filtro:categoria', categoria);
                fecharDropdown();
            } catch (error) {
                // Se houver erro ao publicar evento de filtro, loga no console e avisa o usuário
                console.error('Erro ao publicar evento de filtro:', error);
                mostrarMensagem('Erro ao filtrar por categoria.', 'error');
            }
        });
    });

    // Fecha o dropdown ao clicar fora
    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !dropdownToggle.contains(e.target)) {
            fecharDropdown();
        }
    });

    // Suporte a acessibilidade (tecla Enter ou Espaço)
    dropdownToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (dropdownMenu.classList.contains('show')) {
                fecharDropdown();
            } else {
                abrirDropdown();
            }
        }
    });

    // Foca o primeiro item ao abrir o dropdown
    dropdownMenu.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            itens[0]?.focus();
        }
    });
}