
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


const stars = document.querySelectorAll('.star-rating-custom .star');
const displayNota = document.getElementById('display-nota');
/* ===================================================
   LÓGICA DAS ESTRELAS CLICÁVEIS (FORMULÁRIO)
=================================================== */
function atualizarEstrelasForm(nota) {
    inputNota.value = nota; // Atualiza o input oculto que será salvo no banco
    displayNota.textContent = nota; // Atualiza o número em texto (ex: 4.5)
    
    stars.forEach(star => {
        let valor = parseInt(star.getAttribute('data-valor'));
        if (valor <= nota) {
            star.textContent = '★';
            star.style.color = 'var(--accent-color)';
        } else if (valor - 0.5 === nota) {
            star.textContent = '½';
            star.style.color = 'var(--accent-color)';
        } else {
            star.textContent = '☆';
            star.style.color = 'var(--text-muted)';
        }
    });
}

// Escutando os eventos de Clique e Duplo Clique
stars.forEach(star => {
    // Clique Simples = Nota Cheia
    star.addEventListener('click', function() {
        let valor = parseInt(this.getAttribute('data-valor'));
        atualizarEstrelasForm(valor);
    });

    // Clique Duplo = Meia Estrela
    star.addEventListener('dblclick', function() {
        let valor = parseInt(this.getAttribute('data-valor')) - 0.5;
        // Evita nota 0.5 se o usuário der duplo clique na primeira estrela acidentalmente,
        // mas permite se for o caso. O if abaixo é opcional.
        if (valor < 0.5) valor = 0.5; 
        
        atualizarEstrelasForm(valor);
        window.getSelection().removeAllRanges(); // Garante a limpeza visual
    });
});

/* ===================================================
   2. ESTADO DA APLICAÇÃO (LOCALSTORAGE)
=================================================== */
let reviews = JSON.parse(localStorage.getItem('reso_reviews')) || [];

// Guarda o id da review em edição. null = criando uma nova.
let editandoId = null;

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
        // "recentes" (inverte a ordem para o último salvo aparecer primeiro)
        reviewsOrdenados.reverse();
    }

    // Renderiza usando a lista ordenada/filtrada
    reviewsOrdenados.forEach((review, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.05}s`; // efeito cascata na entrada

        card.innerHTML = `
            <img src="${review.capa}" alt="Capa de ${review.album}">
            <div class="card-title">${review.album}</div>
            <div class="card-artist">${review.artista}</div>
            <div class="card-stars">${gerarEstrelas(review.nota)}</div>
            <div>
                <span class="card-tech">🎧 ${review.equipamento}</span>
                ${review.dac ? `<span class="card-tech">🔌 ${review.dac}</span>` : ""}
                ${review.peaceEq ? `<span class="card-tech card-tech-eq">🎛️ ${review.peaceEq}</span>` : ""}
            </div>
            ${review.observacao ? `<p class="card-observacao">${review.observacao}</p>` : ""}
            <div class="card-actions">
                <button class="btn-editar" data-id="${review.id}">Editar</button>
                <button class="btn-excluir" data-id="${review.id}">Excluir</button>
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
            <img src="${capaGrande}" alt="Capa de ${item.collectionName}">
            <div class="api-result-info">
                <div class="api-result-title">${item.collectionName}</div>
                <div class="api-result-artist">${item.artistName} ${ano ? `· ${ano}` : ""}</div>
            </div>
            <button class="btn-selecionar" type="button">Selecionar</button>
        `;

        resultCard.querySelector('.btn-selecionar').addEventListener('click', () => {
            selecionarAlbum({
                titulo: item.collectionName,
                artista: item.artistName,
                capa: capaGrande
            });
        });

        resultadoApi.appendChild(resultCard);
    });
}

function selecionarAlbum(album) {
    albumTitulo.value = album.titulo;
    albumArtista.value = album.artista;
    albumCapa.value = album.capa;

    passo1Busca.classList.add('hidden');
    passo2Form.classList.remove('hidden');
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
        observacao: inputObservacao.value
    };

    if (editandoId) {
        // UPDATE: substitui a review existente
        reviews = reviews.map(review =>
            review.id === editandoId ? { id: editandoId, ...dadosFormulario } : review
        );
    } else {
        // CREATE: adiciona uma nova review
        const novaReview = {
            id: Date.now().toString(),
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
    }
});

function abrirModalParaEdicao(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    editandoId = id;

    albumTitulo.value = review.album;
    albumArtista.value = review.artista;
    albumCapa.value = review.capa;
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
}

function limparFormulario() {
    formReview.reset();
    albumTitulo.value = "";
    albumArtista.value = "";
    albumCapa.value = "";
    inputPeaceEq.value = "";
    atualizarEstrelasForm(5);
}

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
