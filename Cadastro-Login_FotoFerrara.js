// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDoeNVCO70QexziV_dCvky2UFu3p4fXSaA",
    authDomain: "fotoferraraonline.firebaseapp.com",
    projectId: "fotoferraraonline",
    storageBucket: "fotoferraraonline.firebasestorage.app",
    messagingSenderId: "1079836389163",
    appId: "1:1079836389163:web:aae364a8490be7f87fdf6e",
    measurementId: "G-M790M93JE5"
};
// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Função para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Função de login usando Firebase Authentication
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
        const userCredential = await auth.signInWithEmailAndPassword(email, senha);
        // Armazena o token do usuário (opcional)
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        // Redireciona após login
        window.location.href = '/dashboard.html';
    } catch (error) {
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
            alert("Email ou senha incorretos!");
        } else {
            alert("Erro ao fazer login! " + error.message);
        }
    }
}

// Função de cadastro usando Firebase Authentication
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
        const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
        // Atualiza o perfil com o nome do usuário
        await userCredential.user.updateProfile({ displayName: nome });
        alert("Cadastro realizado com sucesso!");
        window.location.href = '/login.html'; // Redireciona para login
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            alert("Este email já está cadastrado!");
        } else if (error.code === "auth/weak-password") {
            alert("A senha deve ter pelo menos 6 caracteres.");
        } else {
            alert("Erro ao cadastrar! " + error.message);
        }
    }
}

// Ligação com elementos do HTML
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
