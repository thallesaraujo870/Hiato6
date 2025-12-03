const API_BASE_URL = '/api';

let usuarioLogado = false;
let nomeUsuario = "";
let userId = null;
let authToken = null;
let eventos = [];
let comentarios = [];
let inscricoes = [];
let comentariosGerais = [];


async function apiGet(endpoint) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição GET:', error);
        throw error;
    }
}

async function apiPost(endpoint, data) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            // Tenta obter o corpo da resposta para um erro mais detalhado
            const errorBody = await response.text();
            throw new Error(`Erro: ${response.status}. Detalhes: ${errorBody || response.statusText}`);
        }

        try {
            return await response.json();
        } catch (e) {
            return {};
        }

    } catch (error) {
        console.error('Erro na requisição POST:', error);
        throw error;
    }
}


// hamburguer de siri

const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
});

const modais = {
    login: document.getElementById("modal-login"),
    cadastro: document.getElementById("modal-cadastro"),
    instituicao: document.getElementById("modal-instituicao"),
    espaco: document.getElementById("modal-espaco"),
    evento: document.getElementById("modal-evento"),
    comentario: document.getElementById("modal-comentario"),
    eventoDetalhes: document.getElementById("modal-evento-detalhes"),
    comentariosGerais: document.getElementById("modal-comentarios-gerais"),
    novoComentarioGeral: document.getElementById("modal-novo-comentario-geral")
};

function abrirModal(nomeModal) {
    modais[nomeModal].classList.add("show");
    document.body.style.overflow = "hidden";
}

function fecharModal(nomeModal) {
    modais[nomeModal].classList.remove("show");
    document.body.style.overflow = "auto";
}


// os eventos de botoes

document.getElementById("btn-login").addEventListener("click", (e) => {
    e.preventDefault();
    abrirModal("login");
});

document.getElementById("btn-cadastro").addEventListener("click", (e) => {
    e.preventDefault();
    abrirModal("cadastro");
});

document.getElementById("link-cadastro").addEventListener("click", (e) => {
    e.preventDefault();
    fecharModal("login");
    abrirModal("cadastro");
});

document.getElementById("link-login").addEventListener("click", (e) => {
    e.preventDefault();
    fecharModal("cadastro");
    abrirModal("login");
});

document.getElementById("btn-cadastrar-instituicao")?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirModal("instituicao");
});

document.getElementById("btn-cadastrar-espaco")?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirModal("espaco");
});

document.getElementById("btn-cadastrar-evento")?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirModal("evento");
});

document.getElementById("btn-fazer-comentario")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!usuarioLogado) {
        alert("Você precisa estar logado para acessar os comentários.");
        return;
    }
    carregarComentariosGerais();
});

document.getElementById("btn-adicionar-comentario-publico")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!usuarioLogado) {
        alert("Você precisa estar logado para adicionar um comentário.");
        abrirModal("login");
        return;
    }
    abrirModal("novoComentarioGeral");
});

document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
        Object.keys(modais).forEach(nome => {
            fecharModal(nome);
        });
    });
});

Object.values(modais).forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            Object.keys(modais).forEach(nome => {
                fecharModal(nome);
            });
        }
    });
});


// Login com a api verdadeira

document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const login = document.getElementById("login-email").value;
    const password = document.getElementById("login-senha").value;

    try {
        const response = await apiPost('/auth/login', {
            login: login,
            password: password
        });

        // Salva os dados!!! importante cudiado
        authToken = response.token;
        userId = response.id;
        nomeUsuario = response.name;
        usuarioLogado = true;

        fecharModal("login");
        mostrarMenuAdmin();

        document.getElementById("btn-login").style.display = "none";
        document.getElementById("btn-cadastro").style.display = "none";

        await carregarEventos();

        // CORREÇÃO: Carrega os comentários apenas após o login
        await carregarComentariosGeraisSilencioso();

        alert(`Bem-vindo(a), ${nomeUsuario}!`);

        document.getElementById("form-login").reset();
    } catch (error) {
        alert("Erro ao fazer login. Verifique suas credenciais.");
        console.error(error);
    }
});

document.getElementById("form-cadastro").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const senha = document.getElementById("cadastro-senha").value;

    try {
        await apiPost('/users', {
            name: nome,
            login: email,
            password: senha,
            email: email
        });

        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        fecharModal("cadastro");
        abrirModal("login");

        document.getElementById("form-cadastro").reset();
    } catch (error) {
        alert("Erro ao realizar cadastro. Tente novamente.");
        console.error(error);
    }
});

document.getElementById("form-instituicao")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!usuarioLogado || !authToken || !userId) {
        alert("Você precisa estar logado para cadastrar uma instituição.");
        return;
    }

    try {
        // Coleta dos Dados do Formulário (Usando os IDs que corrigimos no HTML)
        const novaInstituicao = {
            name: document.getElementById("inst-nome").value,
            cnpj: document.getElementById("inst-cnpj").value,
            // O checkbox.checked retorna true ou false, perfeito para o booleano 'type'
            type: document.getElementById("inst-tipo").checked,
            address: document.getElementById("inst-endereco").value,
            telephone: document.getElementById("inst-telefone").value,
            email: document.getElementById("inst-email").value,
            website: document.getElementById("inst-website").value,
            linkImageLogo: document.getElementById("inst-logo").value,
            // O userId deve ser o ID do usuário que está logado (variável global)
            userId: userId
        };

        // Chamada à API para a rota de Instituições (POST)
        await apiPost('/institutions', novaInstituicao);

        alert("Instituição cadastrada com sucesso!");
        fecharModal("instituicao");
        document.getElementById("form-instituicao").reset();

    } catch (error) {
        alert("Erro ao cadastrar instituição. Verifique os dados e o console para mais detalhes.");
        console.error('Erro de cadastro de Instituição:', error);
    }
});

function mostrarMenuAdmin() {
    const adminMenu = document.getElementById("admin-menu");
    adminMenu.classList.add("active");
}

document.getElementById("admin-toggle")?.addEventListener("click", () => {
    const dropdown = document.getElementById("admin-dropdown");
    dropdown.classList.toggle("show");
});

document.getElementById("btn-logout")?.addEventListener("click", (e) => {
    e.preventDefault();

    usuarioLogado = false;
    nomeUsuario = "";
    userId = null;
    authToken = null;
    inscricoes = [];

    document.getElementById("admin-menu").classList.remove("active");
    document.getElementById("btn-login").style.display = "block";
    document.getElementById("btn-cadastro").style.display = "block";

    carregarEventos();
    alert("Logout realizado com sucesso!");
});

async function carregarEventos() {
    try {
        const eventosAPI = await apiGet('/events');

        // Importante, eventos api entr front end com beckend
        eventos = eventosAPI.map(evento => ({
            id: evento.id,
            nome: evento.title || "Evento sem título",
            espaco: evento.address || "Local não informado",
            data: evento.date || new Date().toISOString().split('T')[0],
            horarioInicio: evento.time || "00:00",
            horarioFim: evento.endTime || "23:59",
            descricao: evento.description || "Sem descrição",
            vagas: evento.capacity || 0,
            inscritos: evento.enrolled || 0,
            telefone: evento.telephone || "",
            institutionId: evento.institutionId
        }));

        renderizarEventos();
    } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        eventos = [];
        renderizarEventos();
    }
}



function renderizarEventos() {
    const container = document.getElementById("eventos-lista");

    if (eventos.length === 0) {
        container.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: #666;">
                Nenhum evento cadastrado ainda. Faça login para cadastrar eventos!
            </p>
        `;
        return;
    }

    container.innerHTML = eventos.map(evento => {
        const dataFormatada = new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR');
        const jaInscrito = inscricoes.includes(evento.id);
        const vagasEsgotadas = evento.inscritos >= evento.vagas;

        return `
            <div class="evento-card">
                <h3>${evento.nome}</h3>
                <p class="evento-info"><strong>📍 Local:</strong> ${evento.espaco}</p>
                <p class="evento-info"><strong>📅 Data:</strong> ${dataFormatada}</p>
                <p class="evento-info"><strong>🕐 Horário:</strong> ${evento.horarioInicio}</p>
                <p class="evento-info"><strong>👥 Vagas:</strong> ${evento.inscritos}/${evento.vagas}</p>
                <p style="margin-top: 15px; color: #555;">${evento.descricao}</p>
                
                <div class="evento-acoes">
                    ${usuarioLogado ?
                (jaInscrito ?
                    '<button class="btn-inscrito" disabled>✓ Inscrito</button>' :
                    (vagasEsgotadas ?
                        '<button class="btn-esgotado" disabled>Vagas Esgotadas</button>' :
                        `<button class="btn-participar" onclick="participarEvento(${evento.id})">Participar</button>`
                    )
                ) :
                '<button class="btn-participar" onclick="participarEvento(${evento.id})">Participar</button>'
            }
                    <button class="btn-detalhes" onclick="abrirDetalhesEvento(${evento.id})">Ver Detalhes</button>
                </div>
            </div>
        `;
    }).join('');
}


document.getElementById("form-evento").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!usuarioLogado) {
        alert("Você precisa estar logado para cadastrar um evento.");
        return;
    }

    try {
        const novoEvento = {
            title: e.target[0].value,
            description: e.target[5].value,
            date: e.target[2].value,
            time: e.target[3].value,
            endTime: e.target[4].value,
            address: e.target[1].value,
            telephone: "",
            capacity: parseInt(e.target[6].value),
            institutionId: 1
        };

        await apiPost('/events', novoEvento);

        alert("Evento cadastrado com sucesso!");
        fecharModal("evento");
        document.getElementById("form-evento").reset();

        await carregarEventos();
    } catch (error) {
        alert("Erro ao cadastrar evento. Tente novamente.");
        console.error(error);
    }
});

async function carregarComentariosGeraisSilencioso() {
    try {
        const comentariosAPI = await apiGet('/comments');

        comentariosGerais = comentariosAPI.map(comentario => ({
            id: comentario.id,
            autor: comentario.userName || "Usuário",
            assunto: "Comentário",
            texto: comentario.description || "",
            data: new Date(comentario.date).toLocaleDateString('pt-BR'),
            hora: new Date(comentario.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            userId: comentario.userId
        }));

        // Apenas renderiza os comentários públicos, SEM abrir modal
        renderizarComentariosPublicos();
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        comentariosGerais = [];
        renderizarComentariosPublicos();
    }
}

// Carregar comentarios gerais (ESSA FUNÇÃO ABRE O MODAL)

async function carregarComentariosGerais() {
    try {
        const comentariosAPI = await apiGet('/comments');

        comentariosGerais = comentariosAPI.map(comentario => ({
            id: comentario.id,
            autor: comentario.userName || "Usuário",
            assunto: "Comentário",
            texto: comentario.description || "",
            data: new Date(comentario.date).toLocaleDateString('pt-BR'),
            hora: new Date(comentario.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            userId: comentario.userId
        }));

        renderizarComentariosGerais();
        renderizarComentariosPublicos();
        abrirModal("comentariosGerais");
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        comentariosGerais = [];
        renderizarComentariosGerais();
        renderizarComentariosPublicos();
    }
}


document.getElementById("btn-novo-comentario-geral")?.addEventListener("click", () => {
    fecharModal("comentariosGerais");
    abrirModal("novoComentarioGeral");
});

document.getElementById("form-novo-comentario-geral")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const assunto = document.getElementById("assunto-comentario-geral").value;
    const texto = document.getElementById("texto-comentario-geral").value;

    try {
        await apiPost('/comments', {
            description: `${assunto}: ${texto}`,
            date: new Date().toISOString(),
            userId: userId
        });

        alert("Comentário enviado com sucesso!");

        document.getElementById("form-novo-comentario-geral").reset();
        fecharModal("novoComentarioGeral");

        await carregarComentariosGerais();
    } catch (error) {
        alert("Erro ao enviar comentário. Tente novamente.");
        console.error(error);
    }
});


function renderizarComentariosGerais() {
    const container = document.getElementById("lista-comentarios-gerais");

    if (comentariosGerais.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 8px;">
                <p style="color: #666; font-size: 1.1rem;">📭 Nenhum comentário ainda</p>
                <p style="color: #999; margin-top: 10px;">Seja o primeiro a deixar um comentário!</p>
            </div>
        `;
        return;
    }

    const comentariosOrdenados = [...comentariosGerais].sort((a, b) => b.id - a.id);

    container.innerHTML = comentariosOrdenados.map(comentario => `
        <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #34a853; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-weight: 600; color: #1e3c72; font-size: 1rem;">👤 ${comentario.autor}</span>
                <span style="color: #999; font-size: 0.85rem;">📅 ${comentario.data} às ${comentario.hora}</span>
            </div>
            <p style="color: #555; line-height: 1.6; margin-top: 10px;">${comentario.texto}</p>
        </div>
    `).join('');
}


function renderizarComentariosPublicos() {
    const container = document.getElementById("comentarios-publicos-lista");

    if (comentariosGerais.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: white; border-radius: 10px; box-shadow: 0 3px 15px rgba(0,0,0,0.1);">
                <p style="color: #666; font-size: 1.3rem; margin-bottom: 15px;">📭 Nenhum comentário ainda</p>
                <p style="color: #999; font-size: 1rem;">Seja o primeiro a deixar um comentário sobre o projeto!</p>
            </div>
        `;
        return;
    }

    const comentariosOrdenados = [...comentariosGerais].sort((a, b) => b.id - a.id);

    container.innerHTML = comentariosOrdenados.map(comentario => `
        <div style="background: white; padding: 25px; border-radius: 10px; border-left: 4px solid #34a853; box-shadow: 0 3px 15px rgba(0,0,0,0.15); transition: transform 0.3s;" 
            onmouseover="this.style.transform='translateY(-5px)'" 
            onmouseout="this.style.transform='translateY(0)'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                <span style="font-weight: 600; color: #1e3c72; font-size: 1.05rem;">👤 ${comentario.autor}</span>
                <span style="color: #999; font-size: 0.9rem;">📅 ${comentario.data} às ${comentario.hora}</span>
            </div>
            <p style="color: #555; line-height: 1.7; margin-top: 12px;">${comentario.texto}</p>
        </div>
    `).join('');
}


function participarEvento(eventoId) {
    if (!usuarioLogado) {
        alert("Você precisa estar logado para participar de um evento.");
        abrirModal("login");
        return;
    }

    const evento = eventos.find(e => e.id === eventoId);

    if (!evento) {
        alert("Evento não encontrado.");
        return;
    }

    if (inscricoes.includes(eventoId)) {
        alert("Você já está inscrito neste evento!");
        return;
    }

    if (evento.inscritos >= evento.vagas) {
        alert("Desculpe, as vagas para este evento estão esgotadas.");
        return;
    }

    evento.inscritos++;
    inscricoes.push(eventoId);
    renderizarEventos();

    alert(`Inscrição confirmada no evento: ${evento.nome}!`);
}


function abrirDetalhesEvento(eventoId) {
    const evento = eventos.find(e => e.id === eventoId);

    if (!evento) return;

    const dataFormatada = new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR');

    document.getElementById("detalhes-evento-titulo").textContent = evento.nome;
    document.getElementById("detalhes-evento-info").innerHTML = `
        <p><strong>📍 Local:</strong> ${evento.espaco}</p>
        <p><strong>📅 Data:</strong> ${dataFormatada}</p>
        <p><strong>🕐 Horário:</strong> ${evento.horarioInicio}</p>
        <p><strong>👥 Vagas:</strong> ${evento.inscritos}/${evento.vagas}</p>
        <p style="margin-top: 15px;">${evento.descricao}</p>
    `;

    abrirModal("eventoDetalhes");
}

document.addEventListener("DOMContentLoaded", async () => {
    // Carrega eventos da API
    await carregarEventos();

});