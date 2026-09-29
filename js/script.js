/* =========================================================
   MÁSCARAS AUTOMÁTICAS
   ========================================================= */
function aplicarMascara(input, funcaoMascara) {
    input.addEventListener('input', (e) => {
        const pos = e.target.selectionStart;
        const antes = e.target.value;
        const depois = funcaoMascara(e.target.value);
        if (antes === depois) return;
        e.target.value = depois;
        const diff = depois.length - antes.length;
        const nova = Math.max(0, pos + diff);
        e.target.setSelectionRange(nova, nova);
    });
}

const mascaraCPF = v => v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const mascaraTelefone = v => v.replace(/\D/g, '').slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');

const mascaraCEP = v => v.replace(/\D/g, '').slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2');

const campoCPF = document.getElementById('cpf');
const campoTelefone = document.getElementById('telefone');
const campoCEP = document.getElementById('cep');

if (campoCPF) aplicarMascara(campoCPF, mascaraCPF);
if (campoTelefone) aplicarMascara(campoTelefone, mascaraTelefone);
if (campoCEP) aplicarMascara(campoCEP, mascaraCEP);

/* =========================================================
   VALIDAÇÃO REAL DE CPF (dígito verificador)
   ========================================================= */
function validarCPF(cpf) {
    const n = cpf.replace(/\D/g, '');
    if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;
    let s = 0;
    for (let i = 0; i < 9; i++) s += parseInt(n[i]) * (10 - i);
    let r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(n[9])) return false;
    s = 0;
    for (let i = 0; i < 10; i++) s += parseInt(n[i]) * (11 - i);
    r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
    return r === parseInt(n[10]);
}

/* =========================================================
   VIACEP — PREENCHIMENTO AUTOMÁTICO
   ========================================================= */
if (campoCEP) {
    campoCEP.addEventListener('blur', async () => {
        const cep = campoCEP.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        try {
            const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const d = await r.json();
            if (d.erro) { campoCEP.setCustomValidity('CEP não encontrado.'); return; }
            campoCEP.setCustomValidity('');
            document.getElementById('endereco').value = `${d.logradouro}${d.bairro ? ', ' + d.bairro : ''}`;
            document.getElementById('cidade').value = d.localidade;
            document.getElementById('uf').value = d.uf;
        } catch (e) { console.warn('Erro ViaCEP:', e); }
    });
    campoCEP.addEventListener('input', () => campoCEP.setCustomValidity(''));
}

/* =========================================================
   VALIDAÇÃO BOOTSTRAP + REDIRECIONAMENTO
   ========================================================= */
document.querySelectorAll('.needs-validation').forEach((form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const feedback = form.querySelector('.formulario__feedback');
        if (feedback) { feedback.textContent = ''; feedback.classList.remove('text-success', 'text-danger'); }

        // 1) Validação HTML5 + Bootstrap
        let valido = form.checkValidity();

        // 2) Validação extra de CPF (só no cadastro)
        const cpfInput = form.querySelector('#cpf');
        if (cpfInput && cpfInput.value && !validarCPF(cpfInput.value)) {
            cpfInput.setCustomValidity('CPF inválido.');
            valido = false;
        } else if (cpfInput) {
            cpfInput.setCustomValidity('');
        }

        // Aplica classe Bootstrap
        form.classList.add('was-validated');

        if (!valido) {
            if (feedback) {
                feedback.textContent = 'Verifique os campos destacados.';
                feedback.classList.add('text-danger');
            }
            form.reportValidity();
            return;
        }

        // 3) Simula envio + redireciona
        if (feedback) {
            feedback.textContent = 'Enviando...';
            feedback.classList.add('text-success');
        }

        const nome = form.querySelector('#nome')?.value.trim();
        if (nome) {
            try { sessionStorage.setItem('ips-nome', nome); } catch (err) {}
        }

        setTimeout(() => {
            if (form.id === 'formCadastro') {
                window.location.href = 'obrigado.html';
            } else {
                if (feedback) feedback.textContent = 'Mensagem enviada com sucesso!';
                form.reset();
                form.classList.remove('was-validated');
            }
        }, 800);
    });
});

/* =========================================================
   MENSAGEM PERSONALIZADA EM obrigado.html
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const titulo = document.getElementById('tituloObrigado');
    if (!titulo || !window.location.pathname.endsWith('obrigado.html')) return;
    try {
        const nome = sessionStorage.getItem('ips-nome');
        if (nome) titulo.textContent = `Obrigado, ${nome.split(' ')[0]}! Inscrição enviada com sucesso.`;
    } catch (err) {}
});