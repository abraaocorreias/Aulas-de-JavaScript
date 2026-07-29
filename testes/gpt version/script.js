/* =========================================================
   RESO — Diário Audiófilo
   CRUD local + integração com a iTunes Search API
========================================================= */

const STORAGE_KEY = 'reso_reviews';
const THEME_KEY = 'reso_theme';
const CAPA_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
        <rect width="500" height="500" fill="#20242c"/>
        <circle cx="250" cy="250" r="120" fill="none" stroke="#555b66" stroke-width="12"/>
        <circle cx="250" cy="250" r="28" fill="#d89a47"/>
        <text x="250" y="420" fill="#a49d90" font-family="Arial, sans-serif" font-size="28" text-anchor="middle">Sem capa</text>
    </svg>
`)}`;

// Elementos principais
const gallery = document.getElementById('album-gallery');
const contadorRegistros = document.getElementById('contador-registros');
const buscaLocal = document.getElementById('busca-local');
const ordenarReviews = document.getElementById('ordenar-reviews');
const statTotal = document.getElementById('stat-total');
const statMedia = document.getElementById('stat-media');
const statArtistas = document.getElementById('stat-artistas');
const statEquipamento = document.getElementById('stat-equipamento');
const statEquipamentoUsos = document.getElementById('stat-equipamento-usos');
const btnTema = document.getElementById('btn-tema');
const iconeTema = document.getElementById('icone-tema');

// Modal de avaliação
const modalAvaliacao = document.getElementById('modal-avaliacao');
const btnNovaEscuta = document.getElementById('btn-nova-escuta');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const btnCancelarForm = document.getElementById('btn-cancelar-form');
const passo1Busca = document.getElementById('passo-1-busca');
const passo2Form = document.getElementById('passo-2-form');

// Busca na API
const inputBusca = document.getElementById('input-busca');
const btnBuscarApi = document.getElementById('btn-buscar-api');
const resultadoApi = document.getElementById('resultado-api');
const btnToggleManual = document.getElementById('btn-toggle-manual');
const formManual = document.getElementById('form-manual');
const manualTitulo = document.getElementById('manual-titulo');
const manualArtista = document.getElementById('manual-artista');
const manualCapa = document.getElementById('manual-capa');
const manualStatus = document.getElementById('manual-status');
const btnUsarManual = document.getElementById('btn-usar-manual');

// Formulário da avaliação
const formReview = document.getElementById('form-review');
const btnSalvarReview = document.getElementById('btn-salvar-review');
const btnTrocarAlbum = document.getElementById('btn-trocar-album');
const formStatus = document.getElementById('form-status');
const albumTitulo = document.getElementById('album-titulo');
const albumArtista = document.getElementById('album-artista');
const albumCapa = document.getElementById('album-capa');
const inputNota = document.getElementById('nota');
const inputEquipamento = document.getElementById('equipamento');
const inputDac = document.getElementById('dac');
const inputPeaceEq = document.getElementById('peace-eq');
const inputObservacao = document.getElementById('observacao');

// Prévia do álbum
const previewCapa = document.getElementById('preview-capa');
const previewTitulo = document.getElementById('preview-titulo');
const previewArtista = document.getElementById('preview-artista');
const previewMeta = document.getElementById('preview-meta');

// Sistema de notas
const starContainer = document.getElementById('star-container');
const ratingStars = [...document.querySelectorAll('.rating-star')];
const displayNota = document.getElementById('display-nota');

// Modal de leitura
const modalLeitura = document.getElementById('modal-leitura');
const btnFecharLeitura = document.getElementById('btn-fechar-leitura');

// Confirmação e notificações
const modalConfirm = document.getElementById('modal-confirm');
const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');
const toastContainer = document.getElementById('toast-container');

let reviews = carregarReviews();
let editandoId = null;
let albumMetadataTemp = {};
let notaSelecionada = 5;

/* -------------------- Utilidades -------------------- */

function carregarReviews() {
    try {
        const dados = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (!Array.isArray(dados)) return [];

        return dados.map((review, index) => {
            const dataPeloId = /^\d{13}$/.test(String(review.id || ''))
                ? new Date(Number(review.id)).toISOString()
                : null;

            return {
                ...review,
                id: String(review.id || `${Date.now()}-${index}`),
                nota: normalizarNota(Number(review.nota) || 5),
                origem: review.origem || 'legado',
                criadoEm: review.criadoEm || dataPeloId || new Date(Date.now() - (dados.length - index) * 1000).toISOString(),
                atualizadoEm: review.atualizadoEm || review.criadoEm || dataPeloId || null
            };
        });
    } catch (erro) {
        console.error('Não foi possível ler o LocalStorage:', erro);
        return [];
    }
}

function salvarNoStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        return true;
    } catch (erro) {
        console.error('Não foi possível salvar no LocalStorage:', erro);
        showToast('Não foi possível salvar os dados neste navegador.', true);
        return false;
    }
}

function escaparHtml(valor) {
    const texto = String(valor ?? '');
    return texto
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function urlSegura(valor) {
    if (!valor) return CAPA_PLACEHOLDER;

    try {
        const url = new URL(valor, window.location.href);
        if (url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'data:') {
            return url.href;
        }
    } catch (_) {
        // Usa a capa genérica abaixo.
    }

    return CAPA_PLACEHOLDER;
}

function normalizarTexto(valor) {
    return String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function normalizarNota(valor) {
    const limitada = Math.min(5, Math.max(0.5, valor));
    return Math.round(limitada * 2) / 2;
}

function formatarNota(valor) {
    return Number(valor).toFixed(1).replace('.', ',');
}

function formatarData(valor) {
    if (!valor) return '';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR').format(data);
}

function showToast(mensagem, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast${isError ? ' error' : ''}`;
    toast.textContent = mensagem;
    toastContainer.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
}

function criarMedidorEstrelas(nota) {
    const percentual = Math.min(100, Math.max(0, (Number(nota) / 5) * 100));
    return `
        <span class="star-meter" aria-hidden="true">
            ★★★★★
            <span class="star-meter-fill" style="width:${percentual}%">★★★★★</span>
        </span>
        <span class="rating-number">${formatarNota(nota)}</span>
    `;
}

function atualizarDatalists() {
    const listas = [
        ['lista-equipamentos', reviews.map(review => review.equipamento)],
        ['lista-dacs', reviews.map(review => review.dac)],
        ['lista-eqs', reviews.map(review => review.peaceEq)]
    ];

    listas.forEach(([id, valores]) => {
        const unicos = [...new Set(valores.filter(Boolean).map(valor => valor.trim()))];
        document.getElementById(id).innerHTML = unicos
            .map(valor => `<option value="${escaparHtml(valor)}"></option>`)
            .join('');
    });
}

/* -------------------- Leitura e renderização -------------------- */

function obterReviewsVisiveis() {
    const termo = normalizarTexto(buscaLocal.value);
    let lista = [...reviews];

    if (termo) {
        lista = lista.filter(review => {
            const conteudo = normalizarTexto([
                review.album,
                review.artista,
                review.equipamento,
                review.dac,
                review.peaceEq
            ].join(' '));
            return conteudo.includes(termo);
        });
    }

    switch (ordenarReviews.value) {
        case 'nota':
            lista.sort((a, b) => b.nota - a.nota || a.album.localeCompare(b.album, 'pt-BR'));
            break;
        case 'artista':
            lista.sort((a, b) => a.artista.localeCompare(b.artista, 'pt-BR', { sensitivity: 'base' }));
            break;
        case 'album':
            lista.sort((a, b) => a.album.localeCompare(b.album, 'pt-BR', { sensitivity: 'base' }));
            break;
        default:
            lista.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    }

    return lista;
}

function atualizarContador(visiveis) {
    const total = reviews.length;
    const textoTotal = `${total} ${total === 1 ? 'registro' : 'registros'}`;

    contadorRegistros.textContent = visiveis === total
        ? textoTotal
        : `${visiveis} de ${textoTotal}`;
}

function atualizarEstatisticas() {
    const total = reviews.length;
    statTotal.textContent = total;

    if (total === 0) {
        statMedia.textContent = '★ 0,00';
        statArtistas.textContent = '0';
        statEquipamento.textContent = '—';
        statEquipamento.title = '';
        statEquipamentoUsos.textContent = 'Nenhum uso';
        return;
    }

    const media = reviews.reduce((soma, review) => soma + Number(review.nota || 0), 0) / total;
    statMedia.textContent = `★ ${media.toFixed(2).replace('.', ',')}`;

    const artistasUnicos = new Set(
        reviews
            .map(review => normalizarTexto(review.artista))
            .filter(Boolean)
    );
    statArtistas.textContent = artistasUnicos.size;

    const contagem = new Map();
    reviews.forEach(review => {
        const equipamento = String(review.equipamento || '').trim();
        if (!equipamento) return;

        const chave = normalizarTexto(equipamento);
        const atual = contagem.get(chave) || { nome: equipamento, usos: 0 };
        atual.usos += 1;
        contagem.set(chave, atual);
    });

    const maisUtilizado = [...contagem.values()]
        .sort((a, b) => b.usos - a.usos || a.nome.localeCompare(b.nome, 'pt-BR'))[0];

    if (!maisUtilizado) {
        statEquipamento.textContent = '—';
        statEquipamento.title = '';
        statEquipamentoUsos.textContent = 'Nenhum uso';
        return;
    }

    statEquipamento.textContent = `🎧 ${maisUtilizado.nome}`;
    statEquipamento.title = maisUtilizado.nome;
    statEquipamentoUsos.textContent = `${maisUtilizado.usos} ${maisUtilizado.usos === 1 ? 'uso' : 'usos'}`;
}

function aplicarTema(tema) {
    const temaFinal = tema === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = temaFinal;

    try {
        localStorage.setItem(THEME_KEY, temaFinal);
    } catch (erro) {
        console.warn('Não foi possível salvar a preferência de tema:', erro);
    }

    const temaClaro = temaFinal === 'light';
    iconeTema.textContent = temaClaro ? '☾' : '☀';
    btnTema.setAttribute('aria-label', temaClaro ? 'Ativar tema escuro' : 'Ativar tema claro');
    btnTema.title = temaClaro ? 'Ativar tema escuro' : 'Ativar tema claro';
}

function carregarTema() {
    try {
        const temaSalvo = localStorage.getItem(THEME_KEY);
        aplicarTema(temaSalvo === 'light' ? 'light' : 'dark');
    } catch (erro) {
        console.warn('Não foi possível ler a preferência de tema:', erro);
        aplicarTema('dark');
    }
}

function renderizarCards() {
    const lista = obterReviewsVisiveis();
    atualizarContador(lista.length);
    atualizarEstatisticas();
    atualizarDatalists();
    gallery.innerHTML = '';

    if (reviews.length === 0) {
        gallery.innerHTML = `
            <div class="empty-state">
                <strong>Seu diário ainda está vazio.</strong>
                Use “Nova avaliação” para registrar a primeira escuta.
            </div>
        `;
        return;
    }

    if (lista.length === 0) {
        gallery.innerHTML = `
            <div class="empty-state">
                <strong>Nenhum registro encontrado.</strong>
                Tente pesquisar por outro álbum, artista ou equipamento.
            </div>
        `;
        return;
    }

    lista.forEach(review => {
        const card = document.createElement('article');
        card.className = 'card';
        card.tabIndex = 0;
        card.dataset.id = review.id;
        card.setAttribute('aria-label', `Abrir avaliação de ${review.album}, por ${review.artista}`);

        card.innerHTML = `
            <div class="card-cover-wrap">
                <img class="card-cover" src="${escaparHtml(urlSegura(review.capa))}" alt="Capa de ${escaparHtml(review.album)}">
            </div>
            <div class="card-body">
                <div class="card-rating" aria-label="Nota ${formatarNota(review.nota)} de 5">
                    ${criarMedidorEstrelas(review.nota)}
                </div>
                <h2 class="card-title">${escaparHtml(review.album)}</h2>
                <p class="card-artist">${escaparHtml(review.artista)}</p>
                <p class="card-equipment">${escaparHtml(review.equipamento || 'Equipamento não informado')}</p>
                <div class="card-actions">
                    <button class="card-action btn-editar" type="button" data-id="${escaparHtml(review.id)}">Editar</button>
                    <button class="card-action delete btn-excluir" type="button" data-id="${escaparHtml(review.id)}">Excluir</button>
                </div>
            </div>
        `;

        gallery.appendChild(card);
    });
}

/* -------------------- Integração com a API -------------------- */

async function buscarAlbum() {
    const termo = inputBusca.value.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();

    if (!termo) {
        resultadoApi.innerHTML = '<p class="api-message error">Digite o nome de um álbum ou artista.</p>';
        inputBusca.focus();
        return;
    }

    btnBuscarApi.disabled = true;
    btnBuscarApi.textContent = 'Pesquisando…';
    resultadoApi.innerHTML = '<p class="api-message">Consultando o catálogo do iTunes…</p>';

    try {
        const paises = ['BR', 'US'];
        const requisicoes = paises.map(async country => {
            const parametros = new URLSearchParams({
                term: termo,
                media: 'music',
                entity: 'album',
                limit: '50',
                country,
                explicit: 'Yes'
            });

            const resposta = await fetch(`https://itunes.apple.com/search?${parametros}`);
            if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
            return resposta.json();
        });

        const respostas = await Promise.allSettled(requisicoes);
        const sucessos = respostas
            .filter(resultado => resultado.status === 'fulfilled')
            .map(resultado => resultado.value);

        if (sucessos.length === 0) {
            throw new Error('A API não respondeu em nenhum catálogo.');
        }

        const idsVistos = new Set();
        const combinados = [];

        sucessos.forEach(dados => {
            (dados.results || []).forEach(item => {
                const chave = item.collectionId || `${item.artistName}-${item.collectionName}`;
                if (!idsVistos.has(chave)) {
                    idsVistos.add(chave);
                    combinados.push(item);
                }
            });
        });

        const ordenados = ordenarResultadosApi(combinados, termo).slice(0, 10);
        renderizarResultadosApi(ordenados);
    } catch (erro) {
        console.error('Erro na busca do iTunes:', erro);
        resultadoApi.innerHTML = `
            <p class="api-message error">
                Não foi possível consultar o iTunes agora. Verifique a internet ou use o cadastro manual.
            </p>
        `;
    } finally {
        btnBuscarApi.disabled = false;
        btnBuscarApi.textContent = 'Pesquisar';
    }
}

function ordenarResultadosApi(resultados, termoBusca) {
    const busca = normalizarTexto(termoBusca);
    const palavras = busca.split(/\s+/).filter(palavra => palavra.length > 1);

    return resultados
        .map(item => {
            const artista = normalizarTexto(item.artistName);
            const album = normalizarTexto(item.collectionName);
            let pontos = 0;

            if (album === busca) pontos += 30;
            if (artista === busca) pontos += 24;
            if (album.startsWith(busca)) pontos += 12;
            if (artista.startsWith(busca)) pontos += 10;

            palavras.forEach(palavra => {
                if (album.includes(palavra)) pontos += 4;
                if (artista.includes(palavra)) pontos += 5;
            });

            return { item, pontos };
        })
        .filter(resultado => resultado.pontos > 0)
        .sort((a, b) => {
            if (b.pontos !== a.pontos) return b.pontos - a.pontos;
            return new Date(b.item.releaseDate || 0) - new Date(a.item.releaseDate || 0);
        })
        .map(resultado => resultado.item);
}

function renderizarResultadosApi(resultados) {
    resultadoApi.innerHTML = '';

    if (!resultados.length) {
        resultadoApi.innerHTML = `
            <p class="api-message">
                Nenhum álbum correspondente foi encontrado. Tente pesquisar somente pelo artista ou use o cadastro manual.
            </p>
        `;
        return;
    }

    resultados.forEach(item => {
        const capa = urlSegura((item.artworkUrl100 || '').replace('100x100', '600x600'));
        const ano = item.releaseDate ? item.releaseDate.slice(0, 4) : '';
        const elemento = document.createElement('article');
        elemento.className = 'api-result';

        elemento.innerHTML = `
            <img src="${escaparHtml(capa)}" alt="Capa de ${escaparHtml(item.collectionName)}">
            <div>
                <p class="api-result-title">${escaparHtml(item.collectionName)}</p>
                <p class="api-result-artist">${escaparHtml(item.artistName)}${ano ? ` · ${ano}` : ''}</p>
            </div>
            <button class="btn btn-secondary" type="button">Selecionar</button>
        `;

        elemento.querySelector('button').addEventListener('click', () => {
            selecionarAlbum({
                titulo: item.collectionName,
                artista: item.artistName,
                capa,
                genero: item.primaryGenreName || null,
                ano: ano || null,
                faixas: item.trackCount || null,
                origem: 'itunes',
                collectionId: item.collectionId || null
            });
        });

        resultadoApi.appendChild(elemento);
    });
}

/* -------------------- Seleção e nota -------------------- */

function selecionarAlbum(album) {
    albumTitulo.value = album.titulo;
    albumArtista.value = album.artista;
    albumCapa.value = urlSegura(album.capa);

    albumMetadataTemp = {
        genero: album.genero || null,
        ano: album.ano || null,
        faixas: album.faixas || null,
        origem: album.origem || 'manual',
        collectionId: album.collectionId || null
    };

    atualizarPreviaAlbum();
    passo1Busca.classList.add('hidden');
    passo2Form.classList.remove('hidden');
    inputEquipamento.focus();
}

function atualizarPreviaAlbum() {
    previewCapa.src = urlSegura(albumCapa.value);
    previewCapa.alt = `Capa de ${albumTitulo.value}`;
    previewTitulo.textContent = albumTitulo.value;
    previewArtista.textContent = albumArtista.value;

    const partes = [albumMetadataTemp.genero, albumMetadataTemp.ano].filter(Boolean);
    if (albumMetadataTemp.faixas) {
        partes.push(`${albumMetadataTemp.faixas} faixa${Number(albumMetadataTemp.faixas) === 1 ? '' : 's'}`);
    }
    partes.push(albumMetadataTemp.origem === 'itunes' ? 'Dados do iTunes' : 'Cadastro manual');
    previewMeta.textContent = partes.join(' · ');
}

function definirNota(valor) {
    notaSelecionada = normalizarNota(valor);
    inputNota.value = String(notaSelecionada);
    displayNota.textContent = formatarNota(notaSelecionada);

    ratingStars.forEach(star => {
        const numero = Number(star.dataset.star);
        let preenchimento = 0;

        if (notaSelecionada >= numero) preenchimento = 100;
        else if (notaSelecionada === numero - 0.5) preenchimento = 50;

        star.style.setProperty('--fill', `${preenchimento}%`);
    });

    starContainer.setAttribute('aria-label', `Nota selecionada: ${formatarNota(notaSelecionada)} de 5`);
}

ratingStars.forEach(star => {
    star.addEventListener('click', evento => {
        const numero = Number(star.dataset.star);

        // Cliques feitos pelo teclado não possuem coordenada útil: selecionam a estrela inteira.
        if (evento.detail === 0) {
            definirNota(numero);
            return;
        }

        const limites = star.getBoundingClientRect();
        const clicouNaMetadeEsquerda = evento.clientX - limites.left <= limites.width / 2;
        definirNota(clicouNaMetadeEsquerda ? numero - 0.5 : numero);
    });

    star.addEventListener('keydown', evento => {
        if (evento.key === 'ArrowLeft' || evento.key === 'ArrowDown') {
            evento.preventDefault();
            definirNota(notaSelecionada - 0.5);
        }

        if (evento.key === 'ArrowRight' || evento.key === 'ArrowUp') {
            evento.preventDefault();
            definirNota(notaSelecionada + 0.5);
        }

        if (evento.key === 'Home') {
            evento.preventDefault();
            definirNota(0.5);
        }

        if (evento.key === 'End') {
            evento.preventDefault();
            definirNota(5);
        }
    });
});

/* -------------------- CRUD: Create e Update -------------------- */

formReview.addEventListener('submit', evento => {
    evento.preventDefault();
    formStatus.textContent = '';
    formStatus.classList.remove('error');

    const equipamento = inputEquipamento.value.trim();
    if (!albumTitulo.value || !albumArtista.value) {
        formStatus.textContent = 'Selecione um álbum antes de salvar.';
        formStatus.classList.add('error');
        return;
    }

    if (!equipamento) {
        formStatus.textContent = 'Informe o equipamento utilizado.';
        formStatus.classList.add('error');
        inputEquipamento.focus();
        return;
    }

    btnSalvarReview.disabled = true;
    const agora = new Date().toISOString();
    const existente = editandoId ? reviews.find(review => review.id === editandoId) : null;

    const dadosFormulario = {
        album: albumTitulo.value.trim(),
        artista: albumArtista.value.trim(),
        capa: urlSegura(albumCapa.value),
        nota: normalizarNota(Number(inputNota.value)),
        equipamento,
        dac: inputDac.value.trim(),
        peaceEq: inputPeaceEq.value.trim(),
        observacao: inputObservacao.value.trim(),
        genero: albumMetadataTemp.genero || null,
        ano: albumMetadataTemp.ano || null,
        faixas: albumMetadataTemp.faixas || null,
        origem: albumMetadataTemp.origem || existente?.origem || 'manual',
        collectionId: albumMetadataTemp.collectionId || existente?.collectionId || null,
        criadoEm: existente?.criadoEm || agora,
        atualizadoEm: agora
    };

    if (editandoId) {
        reviews = reviews.map(review =>
            review.id === editandoId
                ? { id: review.id, ...dadosFormulario }
                : review
        );
    } else {
        reviews.push({
            id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
            ...dadosFormulario
        });
    }

    if (salvarNoStorage()) {
        const mensagem = editandoId ? 'Avaliação atualizada.' : 'Avaliação adicionada ao diário.';
        fecharModalAvaliacao();
        renderizarCards();
        showToast(mensagem);
    }

    btnSalvarReview.disabled = false;
});

/* -------------------- CRUD: Read, Update e Delete -------------------- */

gallery.addEventListener('click', async evento => {
    const botaoEditar = evento.target.closest('.btn-editar');
    const botaoExcluir = evento.target.closest('.btn-excluir');

    if (botaoEditar) {
        evento.stopPropagation();
        abrirModalEdicao(botaoEditar.dataset.id);
        return;
    }

    if (botaoExcluir) {
        evento.stopPropagation();
        const confirmou = await confirmarExclusao();
        if (confirmou) excluirReview(botaoExcluir.dataset.id);
        return;
    }

    const card = evento.target.closest('.card');
    if (card) abrirModalLeitura(card.dataset.id);
});

gallery.addEventListener('keydown', evento => {
    if ((evento.key === 'Enter' || evento.key === ' ') && evento.target.classList.contains('card')) {
        evento.preventDefault();
        abrirModalLeitura(evento.target.dataset.id);
    }
});

function abrirModalEdicao(id) {
    const review = reviews.find(item => item.id === id);
    if (!review) return;

    editandoId = id;
    albumTitulo.value = review.album;
    albumArtista.value = review.artista;
    albumCapa.value = review.capa;
    inputEquipamento.value = review.equipamento || '';
    inputDac.value = review.dac || '';
    inputPeaceEq.value = review.peaceEq || '';
    inputObservacao.value = review.observacao || '';

    albumMetadataTemp = {
        genero: review.genero || null,
        ano: review.ano || null,
        faixas: review.faixas || null,
        origem: review.origem || 'legado',
        collectionId: review.collectionId || null
    };

    definirNota(review.nota);
    atualizarPreviaAlbum();
    passo1Busca.classList.add('hidden');
    passo2Form.classList.remove('hidden');
    modalAvaliacao.classList.remove('hidden');
    btnSalvarReview.textContent = 'Atualizar avaliação';
    inputEquipamento.focus();
}

function excluirReview(id) {
    const quantidadeAnterior = reviews.length;
    reviews = reviews.filter(review => review.id !== id);

    if (reviews.length === quantidadeAnterior) return;

    if (salvarNoStorage()) {
        renderizarCards();
        showToast('Avaliação excluída.', true);
    }
}

function abrirModalLeitura(id) {
    const review = reviews.find(item => item.id === id);
    if (!review) return;

    const capa = document.getElementById('leitura-capa');
    capa.src = urlSegura(review.capa);
    capa.alt = `Capa de ${review.album}`;

    document.getElementById('leitura-origem').textContent =
        review.origem === 'itunes' ? 'Dados do álbum: iTunes' : 'Dados do álbum: cadastro manual';
    document.getElementById('leitura-titulo').textContent = review.album;
    document.getElementById('leitura-artista').textContent = review.artista;

    const meta = [review.genero, review.ano].filter(Boolean);
    if (review.faixas) meta.push(`${review.faixas} faixa${Number(review.faixas) === 1 ? '' : 's'}`);
    if (review.criadoEm) meta.push(`Registrado em ${formatarData(review.criadoEm)}`);
    document.getElementById('leitura-meta').textContent = meta.join(' · ');

    document.getElementById('leitura-nota').innerHTML = criarMedidorEstrelas(review.nota);

    const equipamentos = [
        ['Equipamento', review.equipamento],
        ['DAC / amplificador', review.dac],
        ['Equalização', review.peaceEq]
    ].filter(([, valor]) => valor);

    document.getElementById('leitura-equipamentos').innerHTML = equipamentos
        .map(([rotulo, valor]) => `<dt>${escaparHtml(rotulo)}</dt><dd>${escaparHtml(valor)}</dd>`)
        .join('');

    document.getElementById('leitura-observacao').textContent =
        review.observacao || 'Nenhuma impressão sonora foi registrada.';

    modalLeitura.classList.remove('hidden');
    btnFecharLeitura.focus();
}

function confirmarExclusao() {
    return new Promise(resolve => {
        modalConfirm.classList.remove('hidden');
        btnConfirmCancel.focus();

        const finalizar = valor => {
            modalConfirm.classList.add('hidden');
            btnConfirmCancel.onclick = null;
            btnConfirmDelete.onclick = null;
            resolve(valor);
        };

        btnConfirmCancel.onclick = () => finalizar(false);
        btnConfirmDelete.onclick = () => finalizar(true);
    });
}

/* -------------------- Modais e formulário manual -------------------- */

function abrirModalNovaEscuta() {
    limparFormularioCompleto();
    modalAvaliacao.classList.remove('hidden');
    passo1Busca.classList.remove('hidden');
    passo2Form.classList.add('hidden');
    btnSalvarReview.textContent = 'Salvar avaliação';
    inputBusca.focus();
}

function fecharModalAvaliacao() {
    modalAvaliacao.classList.add('hidden');
    limparFormularioCompleto();
}

function limparFormularioCompleto() {
    editandoId = null;
    albumMetadataTemp = {};
    formReview.reset();
    albumTitulo.value = '';
    albumArtista.value = '';
    albumCapa.value = '';
    resultadoApi.innerHTML = '';
    inputBusca.value = '';
    manualTitulo.value = '';
    manualArtista.value = '';
    manualCapa.value = '';
    manualStatus.textContent = '';
    formStatus.textContent = '';
    formManual.classList.add('hidden');
    definirNota(5);
}

btnToggleManual.addEventListener('click', () => {
    formManual.classList.toggle('hidden');
    if (!formManual.classList.contains('hidden')) manualTitulo.focus();
});

btnUsarManual.addEventListener('click', () => {
    const titulo = manualTitulo.value.trim();
    const artista = manualArtista.value.trim();
    const capa = manualCapa.value.trim();

    manualStatus.textContent = '';
    manualStatus.classList.remove('error');

    if (!titulo || !artista) {
        manualStatus.textContent = 'Informe o título do álbum e o artista.';
        manualStatus.classList.add('error');
        return;
    }

    selecionarAlbum({
        titulo,
        artista,
        capa: capa || CAPA_PLACEHOLDER,
        origem: 'manual'
    });
});

btnTrocarAlbum.addEventListener('click', () => {
    albumTitulo.value = '';
    albumArtista.value = '';
    albumCapa.value = '';
    albumMetadataTemp = {};
    passo2Form.classList.add('hidden');
    passo1Busca.classList.remove('hidden');
    inputBusca.focus();
});

btnNovaEscuta.addEventListener('click', abrirModalNovaEscuta);
btnFecharModal.addEventListener('click', fecharModalAvaliacao);
btnCancelarForm.addEventListener('click', fecharModalAvaliacao);
btnFecharLeitura.addEventListener('click', () => modalLeitura.classList.add('hidden'));
btnBuscarApi.addEventListener('click', buscarAlbum);

inputBusca.addEventListener('keydown', evento => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        buscarAlbum();
    }
});

buscaLocal.addEventListener('input', renderizarCards);
ordenarReviews.addEventListener('change', renderizarCards);
btnTema.addEventListener('click', () => {
    const temaAtual = document.documentElement.dataset.theme || 'dark';
    aplicarTema(temaAtual === 'dark' ? 'light' : 'dark');
});

[modalAvaliacao, modalLeitura].forEach(modal => {
    modal.addEventListener('click', evento => {
        if (evento.target !== modal) return;
        if (modal === modalAvaliacao) fecharModalAvaliacao();
        if (modal === modalLeitura) modalLeitura.classList.add('hidden');
    });
});

modalConfirm.addEventListener('click', evento => {
    if (evento.target === modalConfirm) btnConfirmCancel.click();
});

document.addEventListener('keydown', evento => {
    if (evento.key !== 'Escape') return;

    if (!modalConfirm.classList.contains('hidden')) {
        btnConfirmCancel.click();
    } else if (!modalLeitura.classList.contains('hidden')) {
        modalLeitura.classList.add('hidden');
    } else if (!modalAvaliacao.classList.contains('hidden')) {
        fecharModalAvaliacao();
    }
});

document.addEventListener('error', evento => {
    if (evento.target instanceof HTMLImageElement && evento.target.src !== CAPA_PLACEHOLDER) {
        evento.target.src = CAPA_PLACEHOLDER;
    }
}, true);

/* -------------------- Inicialização -------------------- */

carregarTema();
definirNota(5);
renderizarCards();
