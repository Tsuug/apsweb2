
class LibrarySystem {
    constructor() {
        
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return; 
        }

        this.books = this.loadBooks();
        this.editingId = null;
        this.displayUserInfo(currentUser);
        this.init();
    }

    checkAuthentication() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return false;
        }
        this.displayUserInfo(currentUser);
        return true;
    }

    getCurrentUser() {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    }

    displayUserInfo(user) {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && user) {
            userNameElement.textContent = `👤 ${user.name}`;
        }
    }

    init() {
        try {
            this.renderBooks();
            this.setupEventListeners();
        } catch (error) {
            console.error('Erro ao inicializar sistema:', error);
            this.showNotification('Erro ao inicializar o sistema. Recarregue a página.', 'error');
        }
    }

    setupEventListeners() {
        const form = document.getElementById('book-form');
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('clear-search');
        const cancelBtn = document.getElementById('cancel-btn');

        if (!form || !searchInput || !clearSearchBtn || !cancelBtn) {
            console.error('Elementos do formulário não encontrados!');
            return;
        }

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        clearSearchBtn.addEventListener('click', () => this.clearSearch());
        cancelBtn.addEventListener('click', () => this.cancelEdit());
    }

    loadBooks() {
        const stored = localStorage.getItem('libraryBooks');
        return stored ? JSON.parse(stored) : [];
    }

    saveBooks() {
        localStorage.setItem('libraryBooks', JSON.stringify(this.books));
    }

    handleSubmit(e) {
        e.preventDefault();

        try {
            const titleInput = document.getElementById('title');
            const authorInput = document.getElementById('author');
            
            if (!titleInput || !authorInput) {
                this.showNotification('Erro: Campos do formulário não encontrados!', 'error');
                return;
            }

            const title = titleInput.value.trim();
            const author = authorInput.value.trim();

            if (!title || !author) {
                this.showNotification('Por favor, preencha pelo menos o título e o autor!', 'error');
                return;
            }

            const bookData = {
                id: this.editingId || Date.now().toString(),
                title: title,
                author: author,
                isbn: document.getElementById('isbn')?.value.trim() || '',
                year: document.getElementById('year')?.value || '',
                category: document.getElementById('category')?.value || '',
                status: document.getElementById('status')?.value || 'Disponível',
                createdAt: this.editingId 
                    ? this.books.find(b => b.id === this.editingId)?.createdAt || new Date().toISOString()
                    : new Date().toISOString()
            };

            if (this.editingId) {
                // Atualizar livro existente
                const index = this.books.findIndex(b => b.id === this.editingId);
                if (index !== -1) {
                    this.books[index] = bookData;
                }
            } else {
                // Adicionar novo livro
                this.books.push(bookData);
            }

            this.saveBooks();
            this.renderBooks();
            this.resetForm();
            this.showNotification(
                this.editingId ? 'Livro atualizado com sucesso!' : 'Livro cadastrado com sucesso!',
                'success'
            );
        } catch (error) {
            console.error('Erro ao salvar livro:', error);
            this.showNotification('Erro ao salvar o livro. Tente novamente.', 'error');
        }
    }

    resetForm() {
        document.getElementById('book-form').reset();
        document.getElementById('book-id').value = '';
        this.editingId = null;
        document.getElementById('form-title').textContent = 'Cadastrar Novo Livro';
        document.getElementById('submit-btn').textContent = 'Cadastrar Livro';
        document.getElementById('cancel-btn').style.display = 'none';
    }

    editBook(id) {
        const book = this.books.find(b => b.id === id);
        if (!book) return;

        this.editingId = id;
        document.getElementById('book-id').value = id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn || '';
        document.getElementById('year').value = book.year || '';
        document.getElementById('category').value = book.category || '';
        document.getElementById('status').value = book.status || 'Disponível';
        
        document.getElementById('form-title').textContent = 'Editar Livro';
        document.getElementById('submit-btn').textContent = 'Atualizar Livro';
        document.getElementById('cancel-btn').style.display = 'inline-block';

        // Scroll suave até o formulário
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    cancelEdit() {
        this.resetForm();
    }

    deleteBook(id) {
        if (confirm('Tem certeza que deseja excluir este livro?')) {
            this.books = this.books.filter(b => b.id !== id);
            this.saveBooks();
            this.renderBooks();
            this.showNotification('Livro excluído com sucesso!', 'success');
            
            // Se estava editando o livro excluído, resetar o formulário
            if (this.editingId === id) {
                this.resetForm();
            }
        }
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        this.renderBooks(searchTerm);
    }

    clearSearch() {
        document.getElementById('search-input').value = '';
        this.renderBooks();
    }

    filterBooks(searchTerm) {
        if (!searchTerm) return this.books;

        return this.books.filter(book => {
            const title = book.title.toLowerCase();
            const author = book.author.toLowerCase();
            const category = (book.category || '').toLowerCase();
            const isbn = (book.isbn || '').toLowerCase();

            return title.includes(searchTerm) ||
                   author.includes(searchTerm) ||
                   category.includes(searchTerm) ||
                   isbn.includes(searchTerm);
        });
    }

    renderBooks(searchTerm = '') {
        try {
            const container = document.getElementById('books-container');
            const emptyState = document.getElementById('empty-state');

            if (!container || !emptyState) {
                console.error('Elementos de renderização não encontrados!');
                return;
            }

            const filteredBooks = this.filterBooks(searchTerm);

            container.innerHTML = '';

            if (filteredBooks.length === 0) {
                container.style.display = 'none';
                emptyState.style.display = 'block';
                emptyState.innerHTML = searchTerm
                    ? '<p>🔍 Nenhum livro encontrado com essa busca.</p><p>Tente outros termos de pesquisa.</p>'
                    : '<p>📖 Nenhum livro cadastrado ainda.</p><p>Comece adicionando seu primeiro livro!</p>';
                return;
            }

            container.style.display = 'grid';
            emptyState.style.display = 'none';

            filteredBooks.forEach(book => {
                try {
                    const card = this.createBookCard(book);
                    container.appendChild(card);
                } catch (error) {
                    console.error('Erro ao criar card do livro:', book, error);
                }
            });
        } catch (error) {
            console.error('Erro ao renderizar livros:', error);
            this.showNotification('Erro ao exibir os livros. Recarregue a página.', 'error');
        }
    }

    createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card';

        const statusClass = `status-${book.status.toLowerCase().replace(' ', '-')}`;

        card.innerHTML = `
            <h3>${this.escapeHtml(book.title)}</h3>
            <p class="author">por ${this.escapeHtml(book.author)}</p>
            
            <div class="book-info">
                ${book.isbn ? `<span><strong>ISBN:</strong> ${this.escapeHtml(book.isbn)}</span>` : ''}
                ${book.year ? `<span><strong>Ano:</strong> ${this.escapeHtml(book.year)}</span>` : ''}
                ${book.category ? `<span><strong>Categoria:</strong> ${this.escapeHtml(book.category)}</span>` : ''}
            </div>

            <span class="status-badge ${statusClass}">${this.escapeHtml(book.status)}</span>

            <div class="book-actions">
                <button class="btn btn-edit" onclick="library.editBook('${book.id}')">
                    ✏️ Editar
                </button>
                <button class="btn btn-delete" onclick="library.deleteBook('${book.id}')">
                    🗑️ Excluir
                </button>
            </div>
        `;

        return card;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Remove notificação anterior se existir
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        let bgColor = '#6366f1'; // padrão (info)
        if (type === 'success') {
            bgColor = '#10b981';
        } else if (type === 'error') {
            bgColor = '#ef4444';
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Adicionar animações CSS dinamicamente
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

// Sistema de autenticação simplificado para a página principal
const auth = {
    logout() {
        if (confirm('Deseja realmente sair do sistema?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }
};

// Inicializar o sistema quando a página carregar
let library;
document.addEventListener('DOMContentLoaded', () => {
    library = new LibrarySystem();
});


