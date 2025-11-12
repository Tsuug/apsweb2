
class AuthSystem {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupForms();
        this.checkAuth();
    }

    checkAuth() {
        
        if (this.currentUser) {
            window.location.href = 'index.html';
        }
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tab) {
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        
        if (tab === 'login') {
            document.getElementById('login-form').classList.add('active');
        } else {
            document.getElementById('register-form').classList.add('active');
        }
    }

    setupForms() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        registerForm.addEventListener('submit', (e) => this.handleRegister(e));
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.setCurrentUser(user);
            this.showNotification('Login realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } else {
            this.showNotification('Email ou senha incorretos!', 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

       
        if (password.length < 6) {
            this.showNotification('A senha deve ter no mínimo 6 caracteres!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showNotification('As senhas não coincidem!', 'error');
            return;
        }

        const users = this.getUsers();

        
        if (users.find(u => u.email === email)) {
            this.showNotification('Este email já está cadastrado!', 'error');
            return;
        }

        
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('libraryUsers', JSON.stringify(users));

        this.showNotification('Conta criada com sucesso! Faça login para continuar.', 'success');
        
       
        document.getElementById('register-form').reset();
        setTimeout(() => {
            this.switchTab('login');
            document.getElementById('login-email').value = email;
        }, 1500);
    }

    getUsers() {
        const stored = localStorage.getItem('libraryUsers');
        return stored ? JSON.parse(stored) : [];
    }

    setCurrentUser(user) {
        
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        this.currentUser = userSession;
    }

    getCurrentUser() {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
    }

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}


const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


let auth;
document.addEventListener('DOMContentLoaded', () => {
    auth = new AuthSystem();
});


