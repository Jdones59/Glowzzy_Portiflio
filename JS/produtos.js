import { formatarPreco } from './utils.js';

/*
 * Lista estática de produtos da loja.
 */
const listaProdutos = [
    {
        id: 1,
        nome: 'Batom Glossy Pink',
        imagem: 'img/BatomGlossy.WebP',
        imagens: ['img/BatomGlossy.WebP', 'img/BatomGlossy2.WebP', 'img/BatomGlossy3.WebP'],
        preco: 39.9,
        precoFormatado: 'R$ 39,90',
        precoOriginal: 49.9,
        precoOriginalFormatado: 'R$ 49,90',
        descontoAplicado: 20,
        categoria: 'Maquiagem',
        descricao: 'Batom com acabamento glossy e cor vibrante.',
        tags: ['destaque', 'mais-vendido'],
    },
    {
        id: 2,
        nome: 'Máscara Nutritiva',
        imagem: 'img/MascaraNutritiva.WebP',
        imagens: ['img/MascaraNutritiva.WebP', 'img/MascaraNutritiva2.WebP'],
        preco: 59.9,
        precoFormatado: 'R$ 59,90',
        precoOriginal: 69.9,
        precoOriginalFormatado: 'R$ 69,90',
        descontoAplicado: 14,
        categoria: 'Cuidados',
        descricao: 'Máscara capilar para nutrição intensa.',
        tags: ['destaque'],
    },
    {
        id: 3,
        nome: 'Creme pra pele Glow',
        imagem: 'img/CremePeleGlow.WebP',
        imagens: ['img/CremePeleGlow.webp'],
        preco: 19.9,
        precoFormatado: 'R$ 19,90',
        precoOriginal: 29.9,
        precoOriginalFormatado: 'R$ 29,90',
        descontoAplicado: 33,
        categoria: 'Cuidados',
        descricao: 'Creme hidratante para pele radiante.',
        tags: ['destaque'],
    },
    {
        id: 4,
        nome: 'Glow Serum',
        imagem: 'img/GlowSerum.WebP',
        imagens: ['img/GlowSerum.webp'],
        preco: 29.9,
        precoFormatado: 'R$ 29,90',
        precoOriginal: 39.9,
        precoOriginalFormatado: 'R$ 39,90',
        descontoAplicado: 25,
        categoria: 'Cuidados',
        descricao: 'Sérum hidratante para pele radiante.',
        tags: ['destaque'],
    },
    {
        id: 5,
        nome: 'Glass Glowzzy',
        imagem: 'img/Glass.WebP',
        imagens: ['img/Glass.webp', 'img/Glass2.webp'],
        preco: 59.9,
        precoFormatado: 'R$ 59,90',
        precoOriginal: 79.9,
        precoOriginalFormatado: 'R$ 79,90',
        descontoAplicado: 25,
        categoria: 'Acessórios',
        descricao: 'Acessório elegante para destacar sua beleza.',
        tags: ['destaque'],
    },
    {
        id: 6,
        nome: 'Paleta Rainbow Glow',
        imagem: 'img/PaletaRainbowGlow.WebP',
        imagens: ['img/PaletaRainbowGlow.webp'],
        preco: 89.9,
        precoFormatado: 'R$ 89,90',
        precoOriginal: 110.0,
        precoOriginalFormatado: 'R$ 110,00',
        descontoAplicado: 18,
        categoria: 'Maquiagem',
        descricao: 'Cobertura perfeita e acabamento natural para todos os tipos de pele.',
        tags: ['promocao', 'mais-vendido'],
    },
    {
        id: 7,
        nome: 'Sérum Vitamina C',
        imagem: 'img/SerumGlow.WebP',
        imagens: ['img/SerumGlow.WebP'],
        preco: 120.0,
        precoFormatado: 'R$ 120,00',
        precoOriginal: null,
        precoOriginalFormatado: null,
        descontoAplicado: null,
        categoria: 'Cuidados',
        descricao: 'Antioxidante poderoso para uma pele mais luminosa e uniforme.',
        tags: ['lancamento'],
    },
    {
        id: 8,
        nome: 'Serum hidratante',
        imagem: 'img/SerumGlowzzy.webp',
        imagens: ['img/SerumGlowzzy.webp'],
        preco: 150.5,
        precoFormatado: 'R$ 150,50',
        precoOriginal: 200.0,
        precoOriginalFormatado: 'R$ 200,00',
        descontoAplicado: 25,
        categoria: 'Acessórios',
        descricao: 'Conjunto completo com 12 pincéis para uma maquiagem impecável.',
        tags: ['promocao'],
    },
    {
        id: 9,
        nome: 'Shampoo',
        imagem: 'img/shampoo.webp',
        imagens: ['img/shampoo.webp'],
        preco: 99.9,
        precoFormatado: 'R$ 29,90',
        precoOriginal: null,
        precoOriginalFormatado: null,
        descontoAplicado: null,
        categoria: 'Maquiagem',
        descricao: '18 cores versáteis com alta pigmentação e longa duração.',
        tags: ['mais-vendido'],
    },
    {
        id: 10,
        nome: 'Shampoo Vitality',
        imagem: 'img/Shampoovitality.webp',
        imagens: ['img/Shampoovitality.webp'],
        preco: 75.0,
        precoFormatado: 'R$ 75,00',
        precoOriginal: null,
        precoOriginalFormatado: null,
        descontoAplicado: null,
        categoria: 'Cuidados',
        descricao: 'Hidratação intensa e leve, com ácido hialurônico.',
        tags: [],
    }
];


/**
 * Calcula o preço com desconto.
 * @param {number} original - Preço original.
 * @param {number|null} desconto - Percentual de desconto.
 * @returns {number} Preço calculado.
 */
function calcularPrecoComDesconto(original, desconto) {
    if (desconto === null || desconto === undefined) {
        return original;
    }
    return Math.round(original * (1 - desconto / 100) * 10) / 10; // Arredonda para 1 decimal
}

/**
 * Valida um produto para garantir que possui todas as propriedades necessárias.
 * @param {object} produto - O objeto do produto a ser validado.
 * @returns {boolean} True se o produto for válido.
 */
function validarProduto(produto) {
    const isValid = produto &&
        typeof produto.id === 'number' &&
        typeof produto.nome === 'string' &&
        typeof produto.imagem === 'string' &&
        Array.isArray(produto.imagens) &&
        produto.imagens.every(img => typeof img === 'string' && img.endsWith('.webp')) &&
        (produto.precoOriginal === null || typeof produto.precoOriginal === 'number') &&
        (produto.precoOriginalFormatado === null || typeof produto.precoOriginalFormatado === 'string') &&
        (produto.descontoAplicado === null || typeof produto.descontoAplicado === 'number') &&
        typeof produto.categoria === 'string' &&
        typeof produto.descricao === 'string' &&
        Array.isArray(produto.tags);
    if (!isValid) {
        console.warn('Produto inválido:', {
            id: produto?.id,
            nome: produto?.nome,
            erros: {
                id: typeof produto?.id !== 'number' ? 'ID não é número' : null,
                nome: typeof produto?.nome !== 'string' ? 'Nome inválido' : null,
                imagem: typeof produto?.imagem !== 'string' ? 'Imagem inválida' : null,
                imagens: !Array.isArray(produto?.imagens) || !produto?.imagens.every(img => typeof img === 'string' && img.endsWith('.webp')) ? 'Imagens inválidas' : null,
                precoOriginal: produto?.precoOriginal !== null && typeof produto?.precoOriginal !== 'number' ? 'Preço original inválido' : null,
                precoOriginalFormatado: produto?.precoOriginalFormatado !== null && typeof produto?.precoOriginalFormatado !== 'string' ? 'Preço original formatado inválido' : null,
                descontoAplicado: produto?.descontoAplicado !== null && typeof produto?.descontoAplicado !== 'number' ? 'Desconto inválido' : null,
                categoria: typeof produto?.categoria !== 'string' ? 'Categoria inválida' : null,
                descricao: typeof produto?.descricao !== 'string' ? 'Descrição inválida' : null,
                tags: !Array.isArray(produto?.tags) ? 'Tags inválidas' : null
            }
        });
    }
    return isValid;
}

/**
 * Retorna a lista de produtos válidos.
 * @returns {Array} Lista de produtos.
 */
export function obterProdutos() {
    const produtosValidos = listaProdutos.filter(validarProduto).map(produto => {
        let precoCalculado;
        if (produto.precoOriginal !== null) {
            precoCalculado = calcularPrecoComDesconto(produto.precoOriginal, produto.descontoAplicado);
        } else {
            precoCalculado = produto.id === 9 ? 29.9 : (produto.id === 10 ? 75.0 : 0);
        }
        return {
            ...produto,
            preco: precoCalculado,
            precoFormatado: formatarPreco(precoCalculado)
        };
    });
    if (produtosValidos.length < listaProdutos.length) {
        console.warn(`${listaProdutos.length - produtosValidos.length} produto(s) inválido(s) foram ignorados.`);
    }
    return produtosValidos;
}

/**
 * Retorna um produto por ID.
 * @param {number} id - ID do produto.
 * @returns {object|null} Produto encontrado ou null.
 */
export function obterProdutoPorId(id) {
    if (typeof id !== 'number') {
        console.warn('ID do produto deve ser um número:', id);
        return null;
    }
    const produto = obterProdutos().find(p => p.id === id);
    if (!produto) {
        console.warn(`Produto com ID ${id} não encontrado.`);
    }
    return produto || null;
}

/**
 * Filtra produtos por categoria.
 * @param {string} categoria - Categoria para filtrar (ou 'todos').
 * @returns {Array} Lista de produtos filtrados.
 */
export function filtrarPorCategoria(categoria) {
    if (typeof categoria !== 'string') {
        console.warn('Categoria deve ser uma string:', categoria);
        return obterProdutos();
    }
    if (categoria === 'todos' || categoria === 'ver todas') {
        return obterProdutos();
    }
    return obterProdutos().filter(p => p.categoria && p.categoria.toLowerCase() === categoria.toLowerCase());
}

/**
 * Filtra produtos por termo de busca.
 * @param {string} termo - Termo de busca.
 * @returns {Array} Lista de produtos filtrados.
 */
export function filtrarPorTermoBusca(termo) {
    if (typeof termo !== 'string') {
        console.warn('Termo de busca deve ser uma string:', termo);
        return obterProdutos();
    }
    if (!termo) return obterProdutos();
    return obterProdutos().filter(p => p.nome.toLowerCase().includes(termo.toLowerCase()));
}

/**
 * Filtra produtos por tag.
 * @param {string} tag - Tag para filtrar (e.g., 'promocao', 'lancamento', 'mais-vendido').
 * @returns {Array} Lista de produtos filtrados.
 */
export function filtrarPorTag(tag) {
    if (typeof tag !== 'string') {
        console.warn('Tag deve ser uma string:', tag);
        return obterProdutos();
    }
    if (!tag) return obterProdutos();
    return obterProdutos().filter(p => p.tags && p.tags.includes(tag));
}