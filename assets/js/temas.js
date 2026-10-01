/* =========================================================
   ALTERNÂNCIA DE TEMA — Dark Mode / Claro / Alto Contraste
   ========================================================= */

const TEMAS = ['claro', 'escuro', 'alto-contraste'];
const ICONES = {
    'claro': '🌙',
    'escuro': '☀️',
    'alto-contraste': '◐'
};
const ROTULOS = {
    'claro': 'Ativar modo escuro',
    'escuro': 'Ativar alto contraste',
    'alto-contraste': 'Voltar ao modo claro'
};

/* -------- Aplica o tema no <html> -------- */
function aplicarTema(tema) {
    if (!TEMAS.includes(tema)) tema = 'claro';
    document.documentElement.dataset.tema = tema;

    // Atualiza o botão (ícone + rótulo)
    const botao = document.getElementById('toggle-tema');
    if (botao) {
        botao.textContent = ICONES[tema];
        botao.setAttribute('aria-label', ROTULOS[tema]);
        botao.setAttribute('title', ROTULOS[tema]);
    }

    // Persiste
    try {
        localStorage.setItem('ips-tema', tema);
    } catch (e) {
        console.warn('Não foi possível salvar o tema:', e);
    }
}

/* -------- Detecta o tema inicial -------- */
function detectarTemaInicial() {
    // 1. Preferência salva
    try {
        const salvo = localStorage.getItem('ips-tema');
        if (salvo && TEMAS.includes(salvo)) return salvo;
    } catch (e) { /* ignora */ }

    // 2. Preferência do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'escuro';
    }

    // 3. Padrão
    return 'claro';
}

/* -------- Ciclo: claro → escuro → alto-contraste → claro -------- */
function proximoTema(atual) {
    const indice = TEMAS.indexOf(atual);
    return TEMAS[(indice + 1) % TEMAS.length];
}

/* -------- Inicialização -------- */
document.addEventListener('DOMContentLoaded', () => {
    // Aplica o tema inicial (sem salvar ainda)
    const temaInicial = detectarTemaInicial();
    document.documentElement.dataset.tema = temaInicial;

    // Atualiza o botão
    const botao = document.getElementById('toggle-tema');
    if (botao) {
        botao.textContent = ICONES[temaInicial];
        botao.setAttribute('aria-label', ROTULOS[temaInicial]);
        botao.setAttribute('title', ROTULOS[temaInicial]);

        botao.addEventListener('click', () => {
            const atual = document.documentElement.dataset.tema || 'claro';
            const novo = proximoTema(atual);
            aplicarTema(novo);
        });
    }

    // Reage a mudanças do sistema (se não houver escolha manual)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        try {
            if (!localStorage.getItem('ips-tema')) {
                aplicarTema(e.matches ? 'escuro' : 'claro');
            }
        } catch (err) { /* ignora */ }
    });
});