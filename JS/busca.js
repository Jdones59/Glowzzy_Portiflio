import { publish } from './events.js';

// Função para inicializar a busca com debouncing
export function inicializarBusca() {
    const barraPesquisa = document.querySelector('.barra-pesquisa input');
    if (!barraPesquisa) {
        console.warn('Barra de pesquisa não encontrada.');
        return;
    }

    // Adiciona aria-live à região de resultados
    const resultadosContainer = document.getElementById('outrosProdutosContainer');
    if (resultadosContainer) {
        resultadosContainer.setAttribute('aria-live', 'polite');
    }

    let timeout;
    barraPesquisa.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const termo = barraPesquisa.value.trim();
            try {
                publish('busca:atualizada', termo);
            } catch (error) {
                console.error('Erro ao publicar evento de busca:', error);
            }
        }, 300); // Debounce de 300ms
    });

    // Suporte para acessibilidade com Enter
    barraPesquisa.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const termo = barraPesquisa.value.trim();
            try {
                publish('busca:atualizada', termo);
            } catch (error) {
                console.error('Erro ao publicar evento de busca:', error);
            }
        }
    });
}