// Função para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função de login
async function fazerLogin(email, senha) {
    if (!email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }
    if (!validarEmail(email)) {
        alert("Email inválido!");
        return;
    }
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            // Supondo que o token JWT venha na resposta
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard.html'; // Redireciona após login
        } else {
            alert(data.mensagem || "Erro ao fazer login!");
        }
    } catch (error) {
        alert("Erro de conexão com o servidor!");
    }
}

// Função de cadastro
async function fazerCadastro(nome, email, senha, confirmarSenha) {
    if (!nome || !email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos!");
        return;
    }
    if (!validarEmail(email)) {
        alert("Email inválido!");
        return;
    }
    if (senha !== confirmarSenha) {
        alert("As senhas não conferem!");
        return;
    }
    try {
        const response = await fetch('/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        const data = await response.json();
        if (response.ok) {
            alert("Cadastro realizado com sucesso!");
            window.location.href = '/login.html'; // Redireciona para login
        } else {
            alert(data.mensagem || "Erro ao cadastrar!");
        }
    } catch (error) {
        alert("Erro de conexão com o servidor!");
    }
}

// Exemplo de ligação com elementos do HTML
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;
            fazerLogin(email, senha);
        });
    }

    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('cadastroNome').value;
            const email = document.getElementById('cadastroEmail').value;
            const senha = document.getElementById('cadastroSenha').value;
            const confirmarSenha = document.getElementById('cadastroConfirmarSenha').value;
            fazerCadastro(nome, email, senha, confirmarSenha);
        });
    }
});