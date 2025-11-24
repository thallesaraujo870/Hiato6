// ============================================
// ESTADO DA APLICAÇÃO
// ============================================
let usuarioLogado = false;
let eventos = [];
let comentarios = [];

// ============================================
// MENU HAMBURGUER
// ============================================
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
});

// ============================================
// CONTROLE DE MODAIS
// ============================================
const modais = {
    login: document.getElementById("modal-login"),
    cadastro: document.getElementById("modal-cadastro"),
    instituicao: document.getElementById("modal-instituicao"),
    espaco: document.getElementById("modal-espaco"),
    evento: document.getElementById("modal-evento"),
    comentario: document.getElementById("modal-comentario")
};

// Função para abrir modal
function abrirModal(nomeModal) {
    modais[nomeModal].classList.add("show");
    document.body.style.overflow = "hidden";
}

// Função para fechar modal
function fecharModal(nomeModal) {
    modais[nomeModal].classList.remove("show");
    document.body.style.overflow = "auto";
}

// Botões para abrir modais
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

// Botões admin
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

document.getElementById("btn-adicionar-comentario")?.addEventListener("click", (e) => {
    e.preventDefault();
    abrirModal("comentario");
});

// Fechar modais ao clicar no X
document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
        Object.keys(modais).forEach(nome => {
            fecharModal(nome);
        });
    });
});

// Fechar modal ao clicar fora
Object.values(modais).forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            Object.keys(modais).forEach(nome => {
                fecharModal(nome);
            });
        }
    });
});

// ============================================
// LOGIN E CADASTRO
// ============================================
document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;
    
    // Simulação de login
    if (email && senha) {
        usuarioLogado = true;
        fecharModal("login");
        mostrarMenuAdmin();
        
        // Esconder botões de login/cadastro
        document.getElementById("btn-login").style.display = "none";
        document.getElementById("btn-cadastro").style.display = "none";
        
        alert("Login realizado com sucesso!");
        
        // Limpar formulário
        document.getElementById("form-login").reset();
    }
});

document.getElementById("form-cadastro").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nome = document.getElementById("cadastro-nome").value;
    const email = document.getElementById("cadastro-email").value;
    const senha = document.getElementById("cadastro-senha").value;
    
    // Simulação de cadastro
    if (nome && email && senha) {
        alert("Cadastro realizado com sucesso! Faça login para continuar.");
        fecharModal("cadastro");
        abrirModal("login");
        
        // Limpar formulário
        document.getElementById("form-cadastro").reset();
    }
});

// ============================================
// MENU ADMIN
// ============================================
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
    document.getElementById("admin-menu").classList.remove("active");
    document.getElementById("btn-login").style.display = "block";
    document.getElementById("btn-cadastro").style.display = "block";
    
    alert("Logout realizado com sucesso!");
});

// ============================================
// CADASTRO DE INSTITUIÇÃO
// ============================================
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

// ============================================
// CADASTRO DE ESPAÇO
// ============================================
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

// ============================================
// CADASTRO DE EVENTO
// ============================================
document.getElementById("form-evento").addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (!usuarioLogado) {
        alert("Você precisa estar logado para cadastrar um evento.");
        return;
    }
    
    const formData = new FormData(e.target);
    const evento = {
        id: Date.now(),
        nome: e.target[0].value,
        espaco: e.target[1].value,
        data: e.target[2].value,
        horarioInicio: e.target[3].value,
        horarioFim: e.target[4].value,
        descricao: e.target[5].value,
        vagas: e.target[6].value
    };
    
    eventos.push(evento);
    renderizarEventos();
    
    alert("Evento cadastrado com sucesso!");
    fecharModal("evento");
    document.getElementById("form-evento").reset();
});

// ============================================
// RENDERIZAR EVENTOS
// ============================================
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
        
        return `
            <div class="evento-card">
                <h3>${evento.nome}</h3>
                <p class="evento-info"><strong>📍 Local:</strong> ${evento.espaco}</p>
                <p class="evento-info"><strong>📅 Data:</strong> ${dataFormatada}</p>
                <p class="evento-info"><strong>🕐 Horário:</strong> ${evento.horarioInicio} - ${evento.horarioFim}</p>
                <p class="evento-info"><strong>👥 Vagas:</strong> ${evento.vagas}</p>
                <p style="margin-top: 15px; color: #555;">${evento.descricao}</p>
            </div>
        `;
    }).join('');
}

// ============================================
// SISTEMA DE AVALIAÇÃO (ESTRELAS)
// ============================================
const stars = document.querySelectorAll(".star");
const ratingValue = document.getElementById("rating-value");

stars.forEach(star => {
    star.addEventListener("click", () => {
        const rating = star.getAttribute("data-rating");
        ratingValue.value = rating;
        
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

// ============================================
// ADICIONAR COMENTÁRIO
// ============================================
document.getElementById("form-comentario").addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (!usuarioLogado) {
        alert("Você precisa estar logado para adicionar um comentário.");
        return;
    }
    
    const rating = document.getElementById("rating-value").value;
    
    if (rating === "0") {
        alert("Por favor, selecione uma avaliação (estrelas).");
        return;
    }
    
    const comentario = {
        id: Date.now(),
        autor: "Usuário Logado", // Pode ser substituído pelo nome real do usuário
        evento: e.target[0].value,
        rating: rating,
        texto: e.target[2].value,
        data: new Date().toLocaleDateString('pt-BR')
    };
    
    comentarios.push(comentario);
    renderizarComentarios();
    
    alert("Comentário adicionado com sucesso!");
    fecharModal("comentario");
    document.getElementById("form-comentario").reset();
    document.getElementById("rating-value").value = "0";
    stars.forEach(s => s.classList.remove("active"));
});

// ============================================
// RENDERIZAR COMENTÁRIOS
// ============================================
function renderizarComentarios() {
    const container = document.getElementById("comentarios-lista");
    
    if (comentarios.length === 0) {
        container.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: #666;">
                Nenhum comentário ainda. Participe de um evento e compartilhe sua experiência!
            </p>
        `;
        return;
    }
    
    container.innerHTML = comentarios.map(comentario => {
        const estrelas = "★".repeat(comentario.rating) + "☆".repeat(5 - comentario.rating);
        
        return `
            <div class="comentario-card">
                <div class="comentario-header">
                    <span class="comentario-autor">${comentario.autor}</span>
                    <span class="comentario-rating">${estrelas}</span>
                </div>
                <p class="comentario-evento">Evento: ${comentario.evento}</p>
                <p class="comentario-texto">${comentario.texto}</p>
                <p class="comentario-data">${comentario.data}</p>
            </div>
        `;
    }).join('');
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // Adicionar alguns eventos de exemplo
    eventos = [
        {
            id: 1,
            nome: "Workshop de Mindfulness",
            espaco: "Sala de Meditação - UFPE",
            data: "2025-12-15",
            horarioInicio: "14:00",
            horarioFim: "16:00",
            descricao: "Aprenda técnicas de meditação e mindfulness para reduzir o estresse e melhorar o foco.",
            vagas: "20"
        },
        {
            id: 2,
            nome: "Jogos de Raciocínio Lógico",
            espaco: "Centro Comunitário - Recife",
            data: "2025-12-20",
            horarioInicio: "10:00",
            horarioFim: "12:00",
            descricao: "Desafios e jogos que estimulam o raciocínio lógico de forma divertida e colaborativa.",
            vagas: "30"
        }
    ];
    
    // Adicionar alguns comentários de exemplo
    comentarios = [
        {
            id: 1,
            autor: "Maria Silva",
            evento: "Workshop de Mindfulness",
            rating: "5",
            texto: "Experiência incrível! As técnicas de meditação realmente ajudaram a reduzir minha ansiedade.",
            data: "15/11/2025"
        },
        {
            id: 2,
            autor: "João Santos",
            evento: "Jogos de Raciocínio Lógico",
            rating: "4",
            texto: "Muito divertido e educativo. Adorei a dinâmica em grupo!",
            data: "10/11/2025"
        }
    ];
    
    renderizarEventos();
    renderizarComentarios();
});