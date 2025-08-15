/**
 * Configurações globais da aplicação.
 */
export const CONFIG = {
    /**
     * Limite de cards exibidos na seção de destaques na página inicial.
     * @type {number}
     */
    PRODUCT_CARD_LIMIT_HOME: 4,

    /**
     * Limite de cards exibidos na seção de mais vendidos.
     * @type {number}
     */
    BEST_SELLER_CARD_LIMIT: 4,

    /**
     * Número de cards exibidos por visualização no carrossel.
     * @type {number}
     */
    CAROUSEL_CARDS_PER_VIEW: 3,
};

// Validação das configurações
Object.keys(CONFIG).forEach(key => {
    if (typeof CONFIG[key] !== 'number' || CONFIG[key] <= 0 || !Number.isInteger(CONFIG[key])) {
        console.error(`Configuração ${key} inválida: deve ser um número inteiro positivo. Usando valor padrão 3.`);
        CONFIG[key] = 3; // Valor padrão em caso de erro
    }
});