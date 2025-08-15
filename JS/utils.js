/**
 * Funções utilitárias para formatação e mensagens.
 */

/**
 * Formata um preço em reais.
 * @param {number} preco - Valor numérico do preço.
 * @returns {string} Preço formatado (e.g., R$ 123,45).
 */
export function formatarPreco(preco) {
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

/**
 * Exibe uma mensagem de sucesso ou erro na tela.
 * @param {string} mensagem - Texto da mensagem.
 * @param {string} tipo - Tipo da mensagem ('success' ou 'error').
 * @param {number} duracao - Duração em milissegundos.
 */
export function mostrarMensagem(mensagem, tipo = 'success', duracao = 3000) {
    const div = document.createElement('div');
    div.className = `mensagem-sucesso ${tipo}`;
    div.setAttribute('role', 'alert');
    div.setAttribute('aria-live', 'assertive');
    div.textContent = mensagem;
    document.body.appendChild(div);
    setTimeout(() => {
        div.classList.add('fade-out');
        setTimeout(() => div.remove(), 300);
    }, duracao);
}

// Verifica se todos os elementos do objeto existem no DOM
export function verificarElementosDOM(elementos) {
    return Object.values(elementos).every(el => el !== null && el !== undefined);
}