/**
 * Sistema de eventos pub/sub.
 * Eventos disponíveis:
 * - busca:atualizada: Disparado quando o termo de busca é atualizado (data: string).
 * - cart:updated: Disparado quando o carrinho é atualizado (data: Array).
 * - favoritos:updated: Disparado quando a lista de favoritos é atualizada (data: Array).
 * - adicionarAoCarrinho: Disparado quando um produto é adicionado ao carrinho (data: { id, quantidade, observacao }).
 * - filtro:updated: Disparado quando o filtro ativo é alterado (data: string).
 */
const subscribers = {};

/**
 * Publica um evento com dados associados.
 * @param {string} eventName - Nome do evento.
 * @param {*} data - Dados associados ao evento.
 */
export function publish(eventName, data) {
    if (typeof eventName !== 'string') {
        console.error('Nome do evento deve ser uma string:', eventName);
        return;
    }
    if (subscribers[eventName]) {
        subscribers[eventName].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Erro ao executar callback para o evento "${eventName}":`, error);
            }
        });
    }
}

/**
 * Inscreve um callback para um evento.
 * @param {string} eventName - Nome do evento.
 * @param {function} callback - Função a ser executada.
 */
export function subscribe(eventName, callback) {
    if (typeof eventName !== 'string' || typeof callback !== 'function') {
        console.warn('subscribe requer um nome de evento (string) e um callback (função)');
        return;
    }
    if (!subscribers[eventName]) {
        subscribers[eventName] = [];
    }
    subscribers[eventName].push(callback);
}

/**
 * Inscreve um callback para ser executado apenas uma vez.
 * @param {string} eventName - Nome do evento.
 * @param {function} callback - Função a ser executada.
 */
export function once(eventName, callback) {
    if (typeof eventName !== 'string' || typeof callback !== 'function') {
        console.warn('once requer um nome de evento (string) e um callback (função)');
        return;
    }
    const wrapper = (data) => {
        callback(data);
        unsubscribe(eventName, wrapper);
    };
    subscribe(eventName, wrapper);
}

/**
 * Remove a inscrição de um callback para um evento.
 * @param {string} eventName - Nome do evento.
 * @param {function} callback - Função a ser removida.
 */
export function unsubscribe(eventName, callback) {
    if (subscribers[eventName]) {
        subscribers[eventName] = subscribers[eventName].filter(cb => cb !== callback);
        if (subscribers[eventName].length === 0) {
            delete subscribers[eventName];
        }
    }
}

/**
 * Limpa todos os assinantes de um evento ou todos os eventos.
 * @param {string} [eventName] - Nome do evento (opcional).
 */
export function limparEventos(eventName) {
    if (eventName) {
        delete subscribers[eventName];
    } else {
        Object.keys(subscribers).forEach(key => delete subscribers[key]);
    }
}