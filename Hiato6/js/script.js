// variaveis do sistema
let usuarioLogado = false;
let nomeUsuario = "";
let eventos = [];
let comentarios = [];
let inscricoes = [];
let comentariosGerais = [];

// menu hamburguer
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
});

// modais
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

// botoes pra abrir modais
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

// botoes admin
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
    renderizarComentariosGerais();
    abrirModal("comentariosGerais");
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

// fechar modais
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

// login
document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    if (email && senha) {
        usuarioLogado = true;
        nomeUsuario = email.split('@')[0];
        fecharModal("login");
        mostrarMenuAdmin();

        document.getElementById("btn-login").style.display = "none";
        document.getElementById("btn-cadastro").style.display = "none";

        renderizarEventos();
        alert(`Bem-vindo(a), ${nomeUsuario}!`);
        document.getElementById("form-login").reset();
    }
});

// cadastro
document.getElementById("form-cadastro").addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const senha = document.getElementById("cadastro-senha").value;

    if (nome && email && senha) {
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        fecharModal("cadastro");
        abrirModal("login");
        document.getElementById("form-cadastro").reset();
    }
});

// menu admin
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
    inscricoes = [];
    document.getElementById("admin-menu").classList.remove("active");
    document.getElementById("btn-login").style.display = "block";
    document.getElementById("btn-cadastro").style.display = "block";

    renderizarEventos();
    alert("Logout realizado com sucesso!");
});

// cadastrar instituicao
document.getElementById("form-instituicao").addEventListener("submit", (e) => {
    e.preventDefault();

    if (!usuarioLogado) {
        alert("Você precisa estar logado para cadastrar uma instituição.");
        return;
    }

    alert("Instituição cadastrada com sucesso!");
    fecharModal("instituicao");
    document.getElementById("form-instituicao").reset();
});

// cadastrar espaco
document.getElementById("form-espaco").addEventListener("submit", (e) => {
    e.preventDefault();

    if (!usuarioLogado) {
        alert("Você precisa estar logado para cadastrar um espaço.");
        return;
    }

    alert("Espaço cadastrado com sucesso!");
    fecharModal("espaco");
    document.getElementById("form-espaco").reset();
});

// cadastrar evento
document.getElementById("form-evento").addEventListener("submit", (e) => {
    e.preventDefault();

    if (!usuarioLogado) {
        alert("Você precisa estar logado para cadastrar um evento.");
        return;
    }

    const evento = {
        id: Date.now(),
        nome: e.target[0].value,
        espaco: e.target[1].value,
        data: e.target[2].value,
        horarioInicio: e.target[3].value,
        horarioFim: e.target[4].value,
        descricao: e.target[5].value,
        vagas: parseInt(e.target[6].value),
        inscritos: 0
    };

    eventos.push(evento);
    renderizarEventos();

    alert("Evento cadastrado com sucesso!");
    fecharModal("evento");
    document.getElementById("form-evento").reset();
});

// participar do evento
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

// ver detalhes do evento
function abrirDetalhesEvento(eventoId) {
    const evento = eventos.find(e => e.id === eventoId);

    if (!evento) return;

    const dataFormatada = new Date(evento.data + 'T00:00:00').toLocaleDateString('pt-BR');

    document.getElementById("detalhes-evento-titulo").textContent = evento.nome;
    document.getElementById("detalhes-evento-info").innerHTML = `
        <p><strong>📍 Local:</strong> ${evento.espaco}</p>
        <p><strong>📅 Data:</strong> ${dataFormatada}</p>
        <p><strong>🕐 Horário:</strong> ${evento.horarioInicio} - ${evento.horarioFim}</p>
        <p><strong>👥 Vagas:</strong> ${evento.inscritos}/${evento.vagas}</p>
        <p style="margin-top: 15px;">${evento.descricao}</p>
    `;

    renderizarComentariosEvento(eventoId);

    const btnComentarEvento = document.getElementById("btn-comentar-evento");
    btnComentarEvento.onclick = () => {
        if (!usuarioLogado) {
            alert("Você precisa estar logado para comentar.");
            return;
        }

        if (!inscricoes.includes(eventoId)) {
            alert("Você precisa estar inscrito no evento para comentar.");
            return;
        }

        abrirModalComentarioEvento(eventoId);
    };

    abrirModal("eventoDetalhes");
}

// mostrar eventos
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
                <p class="evento-info"><strong>🕐 Horário:</strong> ${evento.horarioInicio} - ${evento.horarioFim}</p>
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

// sistema de estrelas
function setupRatingStars(containerId, inputId) {
    const stars = document.querySelectorAll(`#${containerId} .star`);
    const ratingInput = document.getElementById(inputId);

    stars.forEach(star => {
        star.addEventListener("click", () => {
            const rating = star.getAttribute("data-rating");
            ratingInput.value = rating;

            stars.forEach(s => {
                if (s.getAttribute("data-rating") <= rating) {
                    s.classList.add("active");
                } else {
                    s.classList.remove("active");
                }
            });
        });

        star.addEventListener("mouseenter", () => {
            const rating = star.getAttribute("data-rating");
            stars.forEach(s => {
                if (s.getAttribute("data-rating") <= rating) {
                    s.style.color = "#ffc107";
                }
            });
        });

        star.addEventListener("mouseleave", () => {
            stars.forEach(s => {
                if (!s.classList.contains("active")) {
                    s.style.color = "#ddd";
                }
            });
        });
    });
}

setupRatingStars("rating-evento", "rating-evento-value");

// comentar em evento
function abrirModalComentarioEvento(eventoId) {
    fecharModal("eventoDetalhes");

    const evento = eventos.find(e => e.id === eventoId);
    document.getElementById("comentario-evento-nome").textContent = evento.nome;

    const form = document.getElementById("form-comentario-evento");
    form.onsubmit = (e) => {
        e.preventDefault();

        const rating = document.getElementById("rating-evento-value").value;

        if (rating === "0") {
            alert("Por favor, selecione uma avaliação (estrelas).");
            return;
        }

        const comentario = {
            id: Date.now(),
            eventoId: eventoId,
            autor: nomeUsuario || "Usuário",
            eventoNome: evento.nome,
            rating: rating,
            texto: document.getElementById("texto-comentario-evento").value,
            data: new Date().toLocaleDateString('pt-BR')
        };

        comentarios.push(comentario);

        alert("Comentário adicionado com sucesso!");
        fecharModal("comentario");
        abrirModal("eventoDetalhes");

        form.reset();
        document.getElementById("rating-evento-value").value = "0";
        document.querySelectorAll("#rating-evento .star").forEach(s => s.classList.remove("active"));

        renderizarComentariosEvento(eventoId);
    };

    abrirModal("comentario");
}

// mostrar comentarios do evento
function renderizarComentariosEvento(eventoId) {
    const container = document.getElementById("comentarios-evento-lista");
    const comentariosEvento = comentarios.filter(c => c.eventoId === eventoId);

    if (comentariosEvento.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: #666; padding: 20px;">
                Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
        `;
        return;
    }

    container.innerHTML = comentariosEvento.map(comentario => {
        const estrelas = "★".repeat(comentario.rating) + "☆".repeat(5 - comentario.rating);

        return `
            <div class="comentario-item">
                <div class="comentario-header">
                    <span class="comentario-autor">${comentario.autor}</span>
                    <span class="comentario-rating">${estrelas}</span>
                </div>
                <p class="comentario-texto">${comentario.texto}</p>
                <p class="comentario-data">${comentario.data}</p>
            </div>
        `;
    }).join('');
}

// comentarios gerais
document.getElementById("btn-novo-comentario-geral")?.addEventListener("click", () => {
    fecharModal("comentariosGerais");
    abrirModal("novoComentarioGeral");
});

document.getElementById("form-novo-comentario-geral")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const assunto = document.getElementById("assunto-comentario-geral").value;
    const texto = document.getElementById("texto-comentario-geral").value;

    const novoComentario = {
        id: Date.now(),
        autor: nomeUsuario || "Usuário",
        assunto: assunto,
        texto: texto,
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    comentariosGerais.push(novoComentario);

    alert("Comentário enviado com sucesso!");

    document.getElementById("form-novo-comentario-geral").reset();
    fecharModal("novoComentarioGeral");

    renderizarComentariosPublicos();

    if (modais.comentariosGerais.classList.contains("show")) {
        renderizarComentariosGerais();
        abrirModal("comentariosGerais");
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
            <h4 style="color: #1e3c72; margin: 10px 0; font-size: 1.1rem;">📌 ${comentario.assunto}</h4>
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
            <h3 style="color: #1e3c72; margin: 12px 0; font-size: 1.2rem;">📌 ${comentario.assunto}</h3>
            <p style="color: #555; line-height: 1.7; margin-top: 12px;">${comentario.texto}</p>
        </div>
    `).join('');
}

// inicializar
document.addEventListener("DOMContentLoaded", () => {
    eventos = [
        {
            id: 1,
            nome: "Workshop de Mindfulness",
            espaco: "Sala de Meditação - UFPE",
            data: "2025-12-15",
            horarioInicio: "14:00",
            horarioFim: "16:00",
            descricao: "Aprenda técnicas de meditação e mindfulness para reduzir o estresse e melhorar o foco.",
            vagas: 20,
            inscritos: 5
        },
        {
            id: 2,
            nome: "Jogos de Raciocínio Lógico",
            espaco: "Centro Comunitário - Recife",
            data: "2025-12-20",
            horarioInicio: "10:00",
            horarioFim: "12:00",
            descricao: "Desafios e jogos que estimulam o raciocínio lógico de forma divertida e colaborativa.",
            vagas: 30,
            inscritos: 12
        }
    ];

    comentarios = [
        {
            id: 1,
            eventoId: 1,
            autor: "Maria Silva",
            eventoNome: "Workshop de Mindfulness",
            rating: "5",
            texto: "Experiência incrível! As técnicas de meditação realmente ajudaram a reduzir minha ansiedade.",
            data: "15/11/2025"
        },
        {
            id: 2,
            eventoId: 2,
            autor: "João Santos",
            eventoNome: "Jogos de Raciocínio Lógico",
            rating: "4",
            texto: "Muito divertido e educativo. Adorei a dinâmica em grupo!",
            data: "10/11/2025"
        }
    ];

    comentariosGerais = [
        {
            id: 1,
            autor: "Ana Costa",
            assunto: "Sugestão de Melhoria",
            texto: "Adorei o projeto! Seria interessante ter mais eventos voltados para jovens também.",
            data: "20/11/2025",
            hora: "14:30"
        },
        {
            id: 2,
            autor: "Pedro Lima",
            assunto: "Feedback Positivo",
            texto: "Projeto excelente! Está ajudando muitas pessoas a lidar melhor com a dependência digital.",
            data: "22/11/2025",
            hora: "10:15"
        }
    ];

    renderizarEventos();
    renderizarComentariosPublicos();
});