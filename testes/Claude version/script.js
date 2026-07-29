
/* ===================================================
   1. SELETORES DO HTML
=================================================== */
const gallery = document.getElementById('album-gallery');
const modal = document.getElementById('modal-avaliacao');
const btnNovaEscuta = document.getElementById('btn-nova-escuta');
const btnFecharModal = document.getElementById('btn-fechar-modal');

const passo1Busca = document.getElementById('passo-1-busca');
const passo2Form = document.getElementById('passo-2-form');

const inputBusca = document.getElementById('input-busca');
const btnBuscarApi = document.getElementById('btn-buscar-api');
const resultadoApi = document.getElementById('resultado-api');

const btnToggleManual = document.getElementById('btn-toggle-manual');
const formManual = document.getElementById('form-manual');
const manualTitulo = document.getElementById('manual-titulo');
const manualArtista = document.getElementById('manual-artista');
const manualCapa = document.getElementById('manual-capa');
const btnUsarManual = document.getElementById('btn-usar-manual');

// Capa genérica usada quando o usuário não informa uma URL de capa manualmente
const CAPA_PLACEHOLDER = 'https://placehold.co/400x400/1e1e1e/a0a0a0?text=Sem+Capa';

const formReview = document.getElementById('form-review');
const albumTitulo = document.getElementById('album-titulo');
const albumArtista = document.getElementById('album-artista');
const albumCapa = document.getElementById('album-capa');
const inputNota = document.getElementById('nota');
const inputEquipamento = document.getElementById('equipamento');
const inputDac = document.getElementById('dac');
const inputPeaceEq = document.getElementById('peace-eq');
const inputObservacao = document.getElementById('observacao');

const buscaLocal = document.getElementById('busca-local');


const starContainer = document.getElementById('star-container');
const starEls = document.querySelectorAll('.star-rating-custom .star');
const displayNota = document.getElementById('display-nota');

/* ===================================================
   LÓGICA DAS ESTRELAS (DUAS ZONAS DE CLIQUE POR ESTRELA)
=================================================== */
// Preenche visualmente cada estrela (0%, 50% ou 100%) e atualiza o input oculto
function atualizarEstrelasForm(nota) {
    inputNota.value = nota;
    displayNota.textContent = nota;

    starEls.forEach(star => {
        const valor = parseFloat(star.dataset.valor);
        const front = star.querySelector('.star-front');
        if (nota >= valor) {
            front.style.width = '100%';
        } else if (nota >= valor - 0.5) {
            front.style.width = '50%';
        } else {
            front.style.width = '0%';
        }
    });
}

// Cada estrela tem dois botões (metade esquerda/direita), então um único clique
// já seleciona qualquer nota em passos de 0,5 - funciona em touch e teclado
starContainer.querySelectorAll('.star-hit').forEach(btn => {
    btn.addEventListener('click', function() {
        atualizarEstrelasForm(parseFloat(this.dataset.valor));
    });
});

/* ===================================================
   2. ESTADO DA APLICAÇÃO (LOCALSTORAGE)
=================================================== */
let reviews = JSON.parse(localStorage.getItem('reso_reviews')) || [];

// Guarda o id da review em edição. null = criando uma nova.
let editandoId = null;

// Guarda metadados extras vindos da API (gênero, ano, faixas) entre a seleção
// do álbum e o envio do formulário, já que esses campos não são editáveis.
let albumMetadataTemp = {};

function salvarNoStorage() {
    localStorage.setItem('reso_reviews', JSON.stringify(reviews));
}

/* ===================================================
   3. RENDERIZAÇÃO DA GALERIA E FERRAMENTAS
=================================================== */
function gerarEstrelas(nota) {
    const inteiras = Math.floor(nota);
    const temMeia = nota % 1 !== 0;
    const vazias = 5 - Math.ceil(nota);
    return '★'.repeat(inteiras) + (temMeia ? '½' : '') + '☆'.repeat(vazias);
}

// Escapa texto do usuário antes de injetar via innerHTML, evitando quebra de layout/XSS
function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? "";
    return div.innerHTML;
}

// Exibe uma notificação temporária no canto da tela
function showToast(mensagem, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = mensagem;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Alimenta as sugestões (datalist) do formulário com valores já usados antes
function atualizarDatalists() {
    const equipamentos = [...new Set(reviews.map(r => r.equipamento).filter(Boolean))];
    const dacs = [...new Set(reviews.map(r => r.dac).filter(Boolean))];
    const eqs = [...new Set(reviews.map(r => r.peaceEq).filter(Boolean))];

    document.getElementById('lista-equipamentos').innerHTML =
        equipamentos.map(e => `<option value="${escaparHtml(e)}">`).join('');
    document.getElementById('lista-dacs').innerHTML =
        dacs.map(e => `<option value="${escaparHtml(e)}">`).join('');
    document.getElementById('lista-eqs').innerHTML =
        eqs.map(e => `<option value="${escaparHtml(e)}">`).join('');
}

// Calcula e exibe as estatísticas gerais do usuário
function atualizarDashboard() {
    const total = reviews.length;
    document.getElementById('stat-total').textContent = total;

    if (total === 0) {
        document.getElementById('stat-media').textContent = "0.0";
        document.getElementById('stat-artistas').textContent = "0";
        document.getElementById('stat-equipamento').textContent = "-";
        return;
    }

    // Calcular Média via reduce()
    const somaNotas = reviews.reduce((acc, curr) => acc + curr.nota, 0);
    const media = (somaNotas / total).toFixed(2);
    document.getElementById('stat-media').textContent = `★ ${media}`;

    // Calcular Artistas Únicos via Set()
    const artistasUnicos = new Set(reviews.map(r => r.artista)).size;
    document.getElementById('stat-artistas').textContent = artistasUnicos;

    // Calcular Equipamento Mais Usado
    const contagemEquipamentos = {};
    let equipFavorito = "-";
    let maxUsos = 0;

    reviews.forEach(r => {
        if (r.equipamento) {
            contagemEquipamentos[r.equipamento] = (contagemEquipamentos[r.equipamento] || 0) + 1;
            if (contagemEquipamentos[r.equipamento] > maxUsos) {
                maxUsos = contagemEquipamentos[r.equipamento];
                equipFavorito = r.equipamento;
            }
        }
    });

    document.getElementById('stat-equipamento').innerHTML =
        `<span class="stat-equip-nome" title="${escaparHtml(equipFavorito)}">🎧 ${escaparHtml(equipFavorito)}</span>
         <span style="font-size:0.75rem; color:var(--text-muted); display:block; margin-top:0.2rem; font-weight:normal;">(${maxUsos} uso${maxUsos !== 1 ? 's' : ''})</span>`;
}

function renderizarCards() {
    gallery.innerHTML = "";
    const selectOrdem = document.getElementById('ordenar-reviews').value;
    const termoBusca = buscaLocal.value.trim().toLowerCase();

    // Cria uma cópia do array para não bagunçar o LocalStorage ao ordenar/filtrar
    let reviewsOrdenados = [...reviews];

    // Busca local por álbum ou artista
    if (termoBusca) {
        reviewsOrdenados = reviewsOrdenados.filter(r =>
            r.album.toLowerCase().includes(termoBusca) ||
            r.artista.toLowerCase().includes(termoBusca)
        );
    }

    // Atualiza o Dashboard superior
    atualizarDashboard();

    // Datalists são atualizados sempre com base no acervo completo, não no filtro
    atualizarDatalists();

    if (reviews.length === 0) {
        gallery.innerHTML = "<p style='color: var(--text-muted);'>Nenhuma avaliação registrada ainda. Adicione sua primeira escuta!</p>";
        return;
    }

    if (reviewsOrdenados.length === 0) {
        gallery.innerHTML = "<p style='color: var(--text-muted);'>Nenhuma avaliação encontrada para essa busca.</p>";
        return;
    }

    // Lógica de Ordenação
    if (selectOrdem === "nota") {
        reviewsOrdenados.sort((a, b) => b.nota - a.nota);
    } else if (selectOrdem === "artista") {
        reviewsOrdenados.sort((a, b) => a.artista.localeCompare(b.artista));
    } else if (selectOrdem === "album") {
        reviewsOrdenados.sort((a, b) => a.album.localeCompare(b.album));
    } else {
        // "recentes" - ordena pela data de criação registrada (mais nova primeiro)
        reviewsOrdenados.sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0));
    }

    // Renderiza usando a lista ordenada/filtrada
    reviewsOrdenados.forEach((review, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.05}s`; // efeito cascata na entrada

        card.dataset.id = review.id;
        card.innerHTML = `
            <div class="card-media">
                <img src="${escaparHtml(review.capa)}" alt="Capa de ${escaparHtml(review.album)}">
                <div class="card-actions">
                    <button class="btn-editar" data-id="${review.id}" title="Editar" aria-label="Editar">✏️</button>
                    <button class="btn-excluir" data-id="${review.id}" title="Excluir" aria-label="Excluir">🗑️</button>
                </div>
            </div>
            <div class="card-stars">${gerarEstrelas(review.nota)}</div>
            <div class="card-title">${escaparHtml(review.album)}</div>
            <div class="card-artist">${escaparHtml(review.artista)}</div>
            <div class="card-tags-mini">
                <span class="tag-icon" title="${escaparHtml(review.equipamento)}">🎧</span>
                ${review.dac ? `<span class="tag-icon" title="${escaparHtml(review.dac)}">🔌</span>` : ""}
                ${review.peaceEq ? `<span class="tag-icon" title="${escaparHtml(review.peaceEq)}">🎛️</span>` : ""}
            </div>
        `;
        gallery.appendChild(card);
    });
}

/* ===================================================
   4. BUSCA NA API DO ITUNES
=================================================== */
async function buscarAlbum() {
    const termo = inputBusca.value.trim();

    if (termo === "") {
        resultadoApi.innerHTML = "<p class='api-msg'>Digite algo para pesquisar.</p>";
        return;
    }

    btnBuscarApi.disabled = true;
    btnBuscarApi.textContent = "Pesquisando...";
    resultadoApi.innerHTML = "<p class='api-msg'>Pesquisando...</p>";

    try {
        // A API do iTunes trata vírgulas como parte literal do termo e,
        // com termos longos/compostos, sua ordenação por relevância é fraca -
        // é comum vir artista/álbum completamente diferentes na frente.
        // Por isso: (1) limpamos o termo, (2) pedimos mais candidatos (limit maior)
        // e (3) reordenamos no cliente pela relevância real com a busca digitada.
        const termoLimpo = termo.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();

        // A API do iTunes é dividida por loja/país: cada storefront só retorna
        // o que a Apple liberou o licenciamento NAQUELE catálogo específico.
        // Um álbum pode estar 100% disponível na loja US e ainda não ter
        // sincronizado (ou nunca sincronizar) na loja BR. Por isso buscamos
        // em BR e US em paralelo e juntamos os resultados, removendo
        // duplicatas (mesmo collectionId aparecendo nas duas lojas).
        const paises = ['BR', 'US'];
        const respostas = await Promise.all(
            paises.map(pais =>
                fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(termoLimpo)}&entity=album&limit=50&country=${pais}&explicit=Yes`)
                    .then(r => r.ok ? r.json() : { results: [] })
                    .catch(() => ({ results: [] }))
            )
        );

        const vistos = new Set();
        const resultadosCombinados = [];
        respostas.forEach(dados => {
            (dados.results || []).forEach(item => {
                if (!vistos.has(item.collectionId)) {
                    vistos.add(item.collectionId);
                    resultadosCombinados.push(item);
                }
            });
        });

        const resultadosRelevantes = ordenarPorRelevancia(resultadosCombinados, termoLimpo);
        renderizarResultadosApi(resultadosRelevantes.slice(0, 8));

    } catch (erro) {
        console.error(erro);
        resultadoApi.innerHTML = "<p class='api-msg'>Ocorreu um erro na busca. Tente novamente.</p>";
    } finally {
        btnBuscarApi.disabled = false;
        btnBuscarApi.textContent = "Pesquisar";
    }
}

// Dá uma pontuação a cada resultado com base em quantas palavras da busca
// aparecem no artista/álbum, dando peso extra para o nome do artista
// (que geralmente é a parte mais importante para o usuário).
function ordenarPorRelevancia(resultados, termoBusca) {
    if (!resultados || resultados.length === 0) return [];

    const palavras = termoBusca.toLowerCase().split(' ').filter(p => p.length > 1);

    const pontuados = resultados.map(item => {
        const artista = (item.artistName || '').toLowerCase();
        const album = (item.collectionName || '').toLowerCase();
        let pontos = 0;

        palavras.forEach(palavra => {
            if (artista.includes(palavra)) pontos += 2; // artista pesa mais
            if (album.includes(palavra)) pontos += 1;
        });

        return { item, pontos };
    });

    // Mantém apenas quem teve alguma correspondência real;
    // se nada bateu, cai de volta pra ordem original da API.
    const comMatch = pontuados.filter(p => p.pontos > 0);
    const base = comMatch.length > 0 ? comMatch : pontuados;

    return base
        .sort((a, b) => b.pontos - a.pontos)
        .map(p => p.item);
}

function renderizarResultadosApi(resultados) {
    resultadoApi.innerHTML = "";

    if (!resultados || resultados.length === 0) {
        resultadoApi.innerHTML = "<p class='api-msg'>Nenhum álbum encontrado.</p>";
        return;
    }

    resultados.forEach(item => {
        const capaGrande = item.artworkUrl100.replace('100x100', '400x400');
        const ano = item.releaseDate ? item.releaseDate.slice(0, 4) : "";

        const resultCard = document.createElement('div');
        resultCard.className = 'api-result-card';
        resultCard.innerHTML = `
            <img src="${escaparHtml(capaGrande)}" alt="Capa de ${escaparHtml(item.collectionName)}">
            <div class="api-result-info">
                <div class="api-result-title">${escaparHtml(item.collectionName)}</div>
                <div class="api-result-artist">${escaparHtml(item.artistName)} ${ano ? `· ${escaparHtml(ano)}` : ""}</div>
            </div>
            <button class="btn-selecionar" type="button">Selecionar</button>
        `;

        resultCard.querySelector('.btn-selecionar').addEventListener('click', () => {
            selecionarAlbum({
                titulo: item.collectionName,
                artista: item.artistName,
                capa: capaGrande,
                genero: item.primaryGenreName || null,
                ano: ano || null,
                faixas: item.trackCount || null,
                origem: 'itunes',
                collectionId: item.collectionId ?? null
            });
        });

        resultadoApi.appendChild(resultCard);
    });
}

function selecionarAlbum(album) {
    albumTitulo.value = album.titulo;
    albumArtista.value = album.artista;
    albumCapa.value = album.capa;

    // Guarda os dados enriquecidos da API (quando existirem) para salvar junto da review.
    // origem/collectionId identificam se o registro veio do iTunes ou de cadastro manual.
    albumMetadataTemp = {
        genero: album.genero || null,
        ano: album.ano || null,
        faixas: album.faixas || null,
        origem: album.origem || 'manual',
        collectionId: album.collectionId || null
    };

    preencherPreviewAlbum(album.titulo, album.artista, album.capa, album.ano);

    passo1Busca.classList.add('hidden');
    passo2Form.classList.remove('hidden');
}

// Mostra a capa, título e metadados do álbum escolhido no topo do passo 2,
// para o usuário confirmar visualmente que está avaliando o álbum certo
function preencherPreviewAlbum(titulo, artista, capa, ano) {
    document.getElementById('preview-capa').src = capa || CAPA_PLACEHOLDER;
    document.getElementById('preview-capa').alt = `Capa de ${titulo}`;
    document.getElementById('preview-titulo').textContent = titulo;

    const metaPartes = [artista];
    if (ano) metaPartes.push(ano);
    document.getElementById('preview-meta').textContent = metaPartes.join(' · ');
}

/* ===================================================
   5. CRUD - CREATE / UPDATE
=================================================== */
formReview.addEventListener('submit', (e) => {
    e.preventDefault();

    const dadosFormulario = {
        album: albumTitulo.value,
        artista: albumArtista.value,
        capa: albumCapa.value,
        nota: Number(inputNota.value),
        equipamento: inputEquipamento.value,
        dac: inputDac.value,
        peaceEq: inputPeaceEq.value,
        observacao: inputObservacao.value,
        genero: albumMetadataTemp.genero || null,
        ano: albumMetadataTemp.ano || null,
        faixas: albumMetadataTemp.faixas || null,
        // origem indica se os dados do álbum vieram da API do iTunes ou de cadastro manual
        origem: albumMetadataTemp.origem || 'manual',
        collectionId: albumMetadataTemp.collectionId || null
    };

    if (editandoId) {
        // UPDATE: mantém id e criadoEm originais, sobrescreve o restante
        reviews = reviews.map(review =>
            review.id === editandoId ? { ...review, ...dadosFormulario } : review
        );
    } else {
        // CREATE: adiciona uma nova review com data de criação registrada
        const novaReview = {
            id: Date.now().toString(),
            criadoEm: new Date().toISOString(),
            ...dadosFormulario
        };
        reviews.push(novaReview);
    }

    salvarNoStorage();
    renderizarCards();
    showToast("Avaliação salva com sucesso!");
    fecharModal();
});

/* ===================================================
   6. CRUD - DELETE / EDIT (delegação de eventos na galeria)
=================================================== */
// Retorna uma Promise que resolve true/false conforme o usuário clica em Excluir ou Cancelar
function confirmarExclusao() {
    return new Promise(resolve => {
        const modalConfirm = document.getElementById('modal-confirm');
        modalConfirm.classList.remove('hidden');

        document.getElementById('btn-confirm-delete').onclick = () => {
            modalConfirm.classList.add('hidden');
            resolve(true);
        };
        document.getElementById('btn-confirm-cancel').onclick = () => {
            modalConfirm.classList.add('hidden');
            resolve(false);
        };
    });
}

gallery.addEventListener('click', async (e) => {
    const idExcluir = e.target.closest('.btn-excluir')?.dataset.id;
    const idEditar = e.target.closest('.btn-editar')?.dataset.id;

    if (idExcluir) {
        const confirmou = await confirmarExclusao();
        if (confirmou) {
            reviews = reviews.filter(review => review.id !== idExcluir);
            salvarNoStorage();
            renderizarCards();
            showToast("Avaliação removida", true);
        }
    }

    if (idEditar) {
        abrirModalParaEdicao(idEditar);
        return;
    }

    // Clique em qualquer outra parte do card abre o Modo Leitura
    const card = e.target.closest('.card');
    if (card) {
        abrirModalLeitura(card.dataset.id);
    }
});

/* ===================================================
   6b. MODAL DE LEITURA (MODO DETALHADO)
=================================================== */
const modalLeitura = document.getElementById('modal-leitura');
const btnFecharLeitura = document.getElementById('btn-fechar-leitura');

function abrirModalLeitura(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    const capaEl = document.getElementById('leitura-capa');
    capaEl.src = review.capa;
    capaEl.alt = `Capa de ${review.album}`;

    document.getElementById('leitura-titulo').textContent = review.album;
    document.getElementById('leitura-artista').textContent = review.artista;

    const metaPartes = [];
    if (review.genero) metaPartes.push(review.genero);
    if (review.ano) metaPartes.push(review.ano);
    if (review.faixas) metaPartes.push(`${review.faixas} faixa${review.faixas !== 1 ? 's' : ''}`);
    document.getElementById('leitura-meta').textContent = metaPartes.join(' · ');

    document.getElementById('leitura-stars').innerHTML =
        `${gerarEstrelas(review.nota)} <span class="leitura-nota-num">${review.nota}/5</span>`;

    const tagsHtml = [
        `<span class="card-tech">🎧 ${escaparHtml(review.equipamento)}</span>`,
        review.dac ? `<span class="card-tech">🔌 ${escaparHtml(review.dac)}</span>` : "",
        review.peaceEq ? `<span class="card-tech card-tech-eq">🎛️ ${escaparHtml(review.peaceEq)}</span>` : ""
    ].join('');
    document.getElementById('leitura-tags').innerHTML = tagsHtml;

    document.getElementById('leitura-observacao').textContent =
        review.observacao || "Sem observações registradas para essa escuta.";

    const origemEl = document.getElementById('leitura-origem');
    if (review.origem === 'itunes') {
        origemEl.textContent = 'Dados do álbum: iTunes';
        origemEl.classList.remove('hidden');
    } else {
        origemEl.textContent = '';
        origemEl.classList.add('hidden');
    }

    modalLeitura.classList.remove('hidden');
}

function fecharModalLeitura() {
    modalLeitura.classList.add('hidden');
}

btnFecharLeitura.addEventListener('click', fecharModalLeitura);
modalLeitura.addEventListener('click', (e) => {
    if (e.target === modalLeitura) {
        fecharModalLeitura();
    }
});

/* ===================================================
   6c. TEMA CLARO / ESCURO
=================================================== */
const btnTema = document.getElementById('btn-tema');

function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem('reso_theme');
    if (temaSalvo === 'light') {
        document.body.classList.add('light-theme');
        btnTema.textContent = '☀️';
    } else {
        btnTema.textContent = '🌙';
    }
}

btnTema.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('reso_theme', isLight ? 'light' : 'dark');
    btnTema.textContent = isLight ? '☀️' : '🌙';
});

aplicarTemaSalvo();

function abrirModalParaEdicao(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    editandoId = id;

    albumTitulo.value = review.album;
    albumArtista.value = review.artista;
    albumCapa.value = review.capa;
    albumMetadataTemp = {
        genero: review.genero || null,
        ano: review.ano || null,
        faixas: review.faixas || null,
        origem: review.origem || 'manual',
        collectionId: review.collectionId || null
    };
    preencherPreviewAlbum(review.album, review.artista, review.capa, review.ano);
    atualizarEstrelasForm(Number(review.nota));
    inputEquipamento.value = review.equipamento;
    inputDac.value = review.dac || "";
    inputPeaceEq.value = review.peaceEq || "";
    inputObservacao.value = review.observacao || "";

    modal.classList.remove('hidden');
    passo1Busca.classList.add('hidden');
    passo2Form.classList.remove('hidden');
}

/* ===================================================
   7. EVENTOS (ABRIR/FECHAR MODAL)
=================================================== */
function abrirModalParaNovaEscuta() {
    editandoId = null;
    albumMetadataTemp = {};
    limparFormulario();
    resultadoApi.innerHTML = "";
    inputBusca.value = "";

    formManual.classList.add('hidden');
    manualTitulo.value = "";
    manualArtista.value = "";
    manualCapa.value = "";

    passo2Form.classList.add('hidden');
    passo1Busca.classList.remove('hidden');

    modal.classList.remove('hidden');
}

function fecharModal() {
    modal.classList.add('hidden');
    limparFormulario();
    editandoId = null;
    albumMetadataTemp = {};
}

function limparFormulario() {
    formReview.reset();
    albumTitulo.value = "";
    albumArtista.value = "";
    albumCapa.value = "";
    inputPeaceEq.value = "";
    document.getElementById('preview-capa').src = "";
    document.getElementById('preview-titulo').textContent = "";
    document.getElementById('preview-meta').textContent = "";
    atualizarEstrelasForm(5);
}

// Começa expandido (com o texto "Nova Avaliação") e encolhe para um ícone
// circular fixo no canto inferior direito assim que o usuário rola a página
window.addEventListener('scroll', () => {
    btnNovaEscuta.classList.toggle('btn-nova-compacta', window.scrollY > 140);
});

btnNovaEscuta.addEventListener('click', abrirModalParaNovaEscuta);

btnFecharModal.addEventListener('click', fecharModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

btnToggleManual.addEventListener('click', () => {
    formManual.classList.toggle('hidden');
});

btnUsarManual.addEventListener('click', () => {
    const titulo = manualTitulo.value.trim();
    const artista = manualArtista.value.trim();
    const capa = manualCapa.value.trim();

    if (titulo === "" || artista === "") {
        alert("Preencha ao menos o título do álbum e o artista.");
        return;
    }

    selecionarAlbum({
        titulo: titulo,
        artista: artista,
        capa: capa !== "" ? capa : CAPA_PLACEHOLDER
    });
});

btnBuscarApi.addEventListener('click', buscarAlbum);

inputBusca.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        buscarAlbum();
    }
});

document.getElementById('ordenar-reviews').addEventListener('change', renderizarCards);
buscaLocal.addEventListener('input', renderizarCards);
/* ===================================================
   8. INICIALIZAÇÃO
=================================================== */
renderizarCards();
