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
const btnUsarManual = document.getElementById('btn-usar-manual');
const formReview = document.getElementById('form-review');
const buscaLocal = document.getElementById('busca-local');
const previewSelecao = document.getElementById('preview-selecao');

const CAPA_PLACEHOLDER = 'https://placehold.co/400x400/1e1e1e/a0a0a0?text=Sem+Capa';
let reviews = JSON.parse(localStorage.getItem('reso_reviews')) || [];
let editandoId = null;
let albumMetadataTemp = {};

function salvarNoStorage() {
    localStorage.setItem('reso_reviews', JSON.stringify(reviews));
}

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function gerarEstrelas(nota) {
    const inteiras = Math.floor(nota);
    const temMeia = nota % 1 !== 0;
    const vazias = 5 - Math.ceil(nota);
    return '★'.repeat(inteiras) + (temMeia ? '½' : '') + '☆'.repeat(vazias);
}

function showToast(mensagem, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = mensagem;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Lógica de Meia Estrela por área de clique (metade esquerda vs direita)
const stars = document.querySelectorAll('.star-rating-custom .star');
const displayNota = document.getElementById('display-nota');
const inputNota = document.getElementById('nota');

function atualizarEstrelasForm(nota) {
    inputNota.value = nota;
    displayNota.textContent = nota;
    
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

stars.forEach(star => {
    star.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const isHalf = (e.clientX - rect.left) < (rect.width / 2);
        let valor = parseInt(this.getAttribute('data-valor'));
        if (isHalf) valor -= 0.5;
        atualizarEstrelasForm(valor);
    });
});

function atualizarDatalists() {
    const equipamentos = [...new Set(reviews.map(r => r.equipamento).filter(Boolean))];
    const dacs = [...new Set(reviews.map(r => r.dac).filter(Boolean))];
    const eqs = [...new Set(reviews.map(r => r.peaceEq).filter(Boolean))];

    document.getElementById('lista-equipamentos').innerHTML = equipamentos.map(e => `<option value="${escaparHtml(e)}">`).join('');
    document.getElementById('lista-dacs').innerHTML = dacs.map(e => `<option value="${escaparHtml(e)}">`).join('');
    document.getElementById('lista-eqs').innerHTML = eqs.map(e => `<option value="${escaparHtml(e)}">`).join('');
}

function atualizarDashboard() {
    const total = reviews.length;
    document.getElementById('stat-total').textContent = total;

    if (total === 0) {
        document.getElementById('stat-media').textContent = "0.0";
        document.getElementById('stat-artistas').textContent = "0";
        document.getElementById('stat-equipamento').textContent = "-";
        return;
    }

    const somaNotas = reviews.reduce((acc, curr) => acc + curr.nota, 0);
    const media = (somaNotas / total).toFixed(2);
    document.getElementById('stat-media').textContent = `★ ${media}`;

    const artistasUnicos = new Set(reviews.map(r => r.artista)).size;
    document.getElementById('stat-artistas').textContent = artistasUnicos;

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

    let reviewsOrdenados = [...reviews];

    if (termoBusca) {
        reviewsOrdenados = reviewsOrdenados.filter(r =>
            r.album.toLowerCase().includes(termoBusca) ||
            r.artista.toLowerCase().includes(termoBusca)
        );
    }

    atualizarDashboard();
    atualizarDatalists();

    if (reviews.length === 0 || reviewsOrdenados.length === 0) {
        gallery.innerHTML = "<p style='color: var(--text-muted); grid-column: 1/-1;'>Nenhuma avaliação encontrada.</p>";
        return;
    }

    if (selectOrdem === "nota") {
        reviewsOrdenados.sort((a, b) => b.nota - a.nota);
    } else if (selectOrdem === "artista") {
        reviewsOrdenados.sort((a, b) => a.artista.localeCompare(b.artista));
    } else if (selectOrdem === "album") {
        reviewsOrdenados.sort((a, b) => a.album.localeCompare(b.album));
    } else {
        // Ordena pela data exata de criação
        reviewsOrdenados.sort((a, b) => new Date(b.criadoEm || parseInt(b.id)) - new Date(a.criadoEm || parseInt(a.id)));
    }

    reviewsOrdenados.forEach((review, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.04}s`;
        card.dataset.id = review.id;

        card.innerHTML = `
            <div class="card-media">
                <img src="${review.capa}" alt="Capa de ${escaparHtml(review.album)}" onerror="this.src='${CAPA_PLACEHOLDER}'">
                <div class="card-actions">
                    <button class="btn-editar" data-id="${review.id}" title="Editar">Editar</button>
                    <button class="btn-excluir" data-id="${review.id}" title="Excluir">Excluir</button>
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

async function buscarAlbum() {
    const termo = inputBusca.value.trim();
    if (termo === "") return;

    btnBuscarApi.disabled = true;
    btnBuscarApi.textContent = "Pesquisando...";
    resultadoApi.innerHTML = "<div class='api-msg loader'></div>";

    try {
        const termoLimpo = termo.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
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
        resultadoApi.innerHTML = "<p class='api-msg'>Erro na busca. Tente novamente.</p>";
    } finally {
        btnBuscarApi.disabled = false;
        btnBuscarApi.textContent = "Pesquisar";
    }
}

function ordenarPorRelevancia(resultados, termoBusca) {
    if (!resultados || resultados.length === 0) return [];
    const palavras = termoBusca.toLowerCase().split(' ').filter(p => p.length > 1);

    const pontuados = resultados.map(item => {
        const artista = (item.artistName || '').toLowerCase();
        const album = (item.collectionName || '').toLowerCase();
        let pontos = 0;
        palavras.forEach(palavra => {
            if (artista.includes(palavra)) pontos += 2;
            if (album.includes(palavra)) pontos += 1;
        });
        return { item, pontos };
    });

    const comMatch = pontuados.filter(p => p.pontos > 0);
    return (comMatch.length > 0 ? comMatch : pontuados).sort((a, b) => b.pontos - a.pontos).map(p => p.item);
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
            <img src="${capaGrande}" alt="Capa" onerror="this.src='${CAPA_PLACEHOLDER}'">
            <div class="api-result-info">
                <div class="api-result-title">${escaparHtml(item.collectionName)}</div>
                <div class="api-result-artist">${escaparHtml(item.artistName)} ${ano ? `· ${ano}` : ""}</div>
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
                origem: "iTunes",
                collectionId: item.collectionId
            });
        });
        resultadoApi.appendChild(resultCard);
    });
}

function selecionarAlbum(album) {
    document.getElementById('album-titulo').value = album.titulo;
    document.getElementById('album-artista').value = album.artista;
    document.getElementById('album-capa').value = album.capa;

    albumMetadataTemp = {
        genero: album.genero || null,
        ano: album.ano || null,
        faixas: album.faixas || null,
        origem: album.origem || "Manual",
        collectionId: album.collectionId || null
    };

    // Monta o preview visual
    previewSelecao.innerHTML = `
        <img src="${album.capa}" alt="Capa">
        <div>
            <strong>${escaparHtml(album.titulo)}</strong><br>
            <span>${escaparHtml(album.artista)} ${album.ano ? `· ${album.ano}` : ""}</span>
        </div>
        <button type="button" class="btn-voltar-busca" onclick="voltarParaBusca()">Trocar</button>
    `;

    passo1Busca.classList.add('hidden');
    passo2Form.classList.remove('hidden');
}

function voltarParaBusca() {
    passo2Form.classList.add('hidden');
    passo1Busca.classList.remove('hidden');
}

formReview.addEventListener('submit', (e) => {
    e.preventDefault();

    const dadosFormulario = {
        album: document.getElementById('album-titulo').value,
        artista: document.getElementById('album-artista').value,
        capa: document.getElementById('album-capa').value,
        nota: Number(inputNota.value),
        equipamento: document.getElementById('equipamento').value,
        dac: document.getElementById('dac').value,
        peaceEq: document.getElementById('peace-eq').value,
        observacao: document.getElementById('observacao').value,
        genero: albumMetadataTemp.genero || null,
        ano: albumMetadataTemp.ano || null,
        faixas: albumMetadataTemp.faixas || null,
        origem: albumMetadataTemp.origem || "Manual",
        collectionId: albumMetadataTemp.collectionId || null,
        criadoEm: new Date().toISOString()
    };

    if (editandoId) {
        const oldReview = reviews.find(r => r.id === editandoId);
        if (oldReview && oldReview.criadoEm) {
            dadosFormulario.criadoEm = oldReview.criadoEm; // Mantém a data original na edição
        }
        reviews = reviews.map(review => review.id === editandoId ? { id: editandoId, ...dadosFormulario } : review);
    } else {
        reviews.push({ id: Date.now().toString(), ...dadosFormulario });
    }

    salvarNoStorage();
    renderizarCards();
    showToast("Avaliação salva com sucesso!");
    fecharModal();
});

function confirmarExclusao() {
    return new Promise(resolve => {
        const modalConfirm = document.getElementById('modal-confirm');
        modalConfirm.classList.remove('hidden');
        document.getElementById('btn-confirm-delete').onclick = () => {
            modalConfirm.classList.add('hidden'); resolve(true);
        };
        document.getElementById('btn-confirm-cancel').onclick = () => {
            modalConfirm.classList.add('hidden'); resolve(false);
        };
    });
}

gallery.addEventListener('click', async (e) => {
    const idExcluir = e.target.closest('.btn-excluir')?.dataset.id;
    const idEditar = e.target.closest('.btn-editar')?.dataset.id;

    if (idExcluir) {
        if (await confirmarExclusao()) {
            reviews = reviews.filter(review => review.id !== idExcluir);
            salvarNoStorage();
            renderizarCards();
            showToast("Avaliação removida", true);
        }
        return;
    }

    if (idEditar) {
        abrirModalParaEdicao(idEditar);
        return;
    }

    const card = e.target.closest('.card');
    if (card) abrirModalLeitura(card.dataset.id);
});

/* ===================================================
   MODAL DE LEITURA
=================================================== */
const modalLeitura = document.getElementById('modal-leitura');

function abrirModalLeitura(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    document.getElementById('leitura-capa').src = review.capa;
    document.getElementById('leitura-titulo').textContent = review.album;
    document.getElementById('leitura-artista').textContent = review.artista;

    const metaPartes = [];
    if (review.genero) metaPartes.push(review.genero);
    if (review.ano) metaPartes.push(review.ano);
    if (review.faixas) metaPartes.push(`${review.faixas} faixas`);
    document.getElementById('leitura-meta').textContent = metaPartes.join(' · ');

    document.getElementById('leitura-stars').innerHTML = `${gerarEstrelas(review.nota)} <span class="leitura-nota-num">${review.nota}/5</span>`;

    const tagsHtml = [
        `<span class="card-tech">🎧 ${escaparHtml(review.equipamento)}</span>`,
        review.dac ? `<span class="card-tech">🔌 ${escaparHtml(review.dac)}</span>` : "",
        review.peaceEq ? `<span class="card-tech card-tech-eq">🎛️ ${escaparHtml(review.peaceEq)}</span>` : ""
    ].join('');
    
    document.getElementById('leitura-tags').innerHTML = tagsHtml;
    document.getElementById('leitura-observacao').textContent = review.observacao || "Sem observações registradas.";
    
    // Prova de uso da API para o professor
    const dataCriacao = review.criadoEm ? new Date(review.criadoEm).toLocaleDateString('pt-BR') : 'Data desconhecida';
    document.getElementById('leitura-origem').innerHTML = `Avaliando em: ${dataCriacao} <br> Origem dos metadados: <strong>${review.origem || 'Desconhecida'}</strong>`;

    modalLeitura.classList.remove('hidden');
}

document.getElementById('btn-fechar-leitura').addEventListener('click', () => modalLeitura.classList.add('hidden'));
modalLeitura.addEventListener('click', (e) => { if (e.target === modalLeitura) modalLeitura.classList.add('hidden'); });

/* ===================================================
   TEMA CLARO / ESCURO
=================================================== */
const btnTema = document.getElementById('btn-tema');
function aplicarTemaSalvo() {
    if (localStorage.getItem('reso_theme') === 'light') {
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

/* ===================================================
   CONTROLES GERAIS E INICIALIZAÇÃO
=================================================== */
function abrirModalParaEdicao(id) {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    editandoId = id;
    selecionarAlbum({
        titulo: review.album, artista: review.artista, capa: review.capa,
        genero: review.genero, ano: review.ano, faixas: review.faixas,
        origem: review.origem, collectionId: review.collectionId
    });

    atualizarEstrelasForm(Number(review.nota));
    document.getElementById('equipamento').value = review.equipamento;
    document.getElementById('dac').value = review.dac || "";
    document.getElementById('peace-eq').value = review.peaceEq || "";
    document.getElementById('observacao').value = review.observacao || "";
    modal.classList.remove('hidden');
}

function limparFormulario() {
    formReview.reset();
    atualizarEstrelasForm(5);
}

function fecharModal() {
    modal.classList.add('hidden');
    limparFormulario();
    editandoId = null;
    albumMetadataTemp = {};
}

btnNovaEscuta.addEventListener('click', () => {
    editandoId = null;
    albumMetadataTemp = {};
    limparFormulario();
    resultadoApi.innerHTML = "";
    inputBusca.value = "";
    formManual.classList.add('hidden');
    voltarParaBusca();
    modal.classList.remove('hidden');
});

btnFecharModal.addEventListener('click', fecharModal);
modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });
btnToggleManual.addEventListener('click', () => formManual.classList.toggle('hidden'));
btnUsarManual.addEventListener('click', () => {
    const titulo = document.getElementById('manual-titulo').value.trim();
    const artista = document.getElementById('manual-artista').value.trim();
    if (!titulo || !artista) return alert("Preencha ao menos o título e o artista.");
    selecionarAlbum({ titulo, artista, capa: document.getElementById('manual-capa').value.trim() || CAPA_PLACEHOLDER, origem: "Manual" });
});

btnBuscarApi.addEventListener('click', buscarAlbum);
inputBusca.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); buscarAlbum(); } });
document.getElementById('ordenar-reviews').addEventListener('change', renderizarCards);
buscaLocal.addEventListener('input', renderizarCards);

// Encolhe o FAB ao rolar a página
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) btnNovaEscuta.classList.add('scrolled');
    else btnNovaEscuta.classList.remove('scrolled');
});

renderizarCards();