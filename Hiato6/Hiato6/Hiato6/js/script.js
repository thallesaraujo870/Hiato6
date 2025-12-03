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

// Fecha menu se clicar fora (opcional)
document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove("open");
    }
});

// ============================================
// MENU ADMIN
// ============================================
const adminToggle = document.getElementById("admin-toggle");
const adminDropdown = document.getElementById("admin-dropdown");

adminToggle?.addEventListener("click", () => {
    adminDropdown.classList.toggle("show");
});

// Fecha dropdown ao clicar fora
document.addEventListener("click", function (event) {
    if (!adminToggle.contains(event.target) && !adminDropdown.contains(event.target)) {
        adminDropdown.classList.remove("show");
    }
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

function abrirModal(nomeModal) {
    modais[nomeModal].classList.add("show");
    document.body.style.overflow = "hidden";
}

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

    if (email && senha) {
        usuarioLogado = true;
        fecharModal("login");
        mostrarMenuAdmin();

        document.getElementById("btn-login").style.display = "none";
        document.getElementById("btn-cadastro").style.display = "none";

        alert("Login realizado com sucesso!");
        document.getElementById("form-login").reset();
    }
});

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

// ============================================
// MENU ADMIN FUNCIONAL
// ============================================
function mostrarMenuAdmin() {
    const adminMenu = document.getElementById("admin-menu");
    adminMenu.classList.add("active");
}

document.getElementById("btn-logout")?.addEventListener("click", (e) => {
    e.preventDefault();

    usuarioLogado = false;
    document.getElementById("admin-menu").classList.remove("active");
    document.getElementById("btn-login").style.display = "block";
    document.getElementById("btn-cadastro").style.display = "block";

    alert("Logout realizado com sucesso!");
});
