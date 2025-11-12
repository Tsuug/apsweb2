# 📚 Sistema de Cadastro de Biblioteca

Sistema web moderno para gerenciamento de acervo de livros, desenvolvido com HTML, CSS e JavaScript puro.

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Sistema de login e registro de usuários
- ✅ Proteção de rotas (página principal só acessível após login)
- ✅ Logout seguro
- ✅ Validação de senhas e emails

### 📚 Gerenciamento de Livros
- ✅ Cadastro de livros com informações completas (título, autor, ISBN, ano, categoria, status)
- ✅ Listagem de todos os livros cadastrados
- ✅ Edição de livros existentes
- ✅ Exclusão de livros
- ✅ Busca por título, autor, categoria ou ISBN
- ✅ Armazenamento local (localStorage) - dados persistem no navegador
- ✅ Interface moderna e responsiva
- ✅ Design intuitivo e fácil de usar

## 🚀 Como usar localmente

1. Clone ou baixe este repositório
2. Abra o arquivo `login.html` em seu navegador (ou use um servidor local)
3. Crie uma conta ou faça login
4. Comece a gerenciar seus livros!

**Usando servidor local:**
```bash
npx serve .
```
Acesse `http://localhost:3000/login.html`

## 📦 Deploy no Vercel

### Opção 1: Via Interface Web

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta (GitHub, GitLab ou Bitbucket)
3. Clique em "Add New Project"
4. Conecte seu repositório ou faça upload dos arquivos
5. O Vercel detectará automaticamente a configuração
6. Clique em "Deploy"

### Opção 2: Via CLI

1. Instale o Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. No diretório do projeto, execute:
   ```bash
   vercel
   ```

3. Siga as instruções no terminal
4. Seu projeto estará online em segundos!

## 📁 Estrutura do Projeto

```
sistema/
├── login.html      # Página de login e registro
├── index.html      # Página principal (protegida)
├── styles.css      # Estilos e design
├── auth.js         # Sistema de autenticação
├── script.js       # Lógica do sistema de biblioteca
├── vercel.json     # Configuração do Vercel
├── package.json    # Metadados do projeto
└── README.md       # Este arquivo
```

## 🎨 Tecnologias Utilizadas

- **HTML5** - Estrutura da página
- **CSS3** - Estilização moderna com gradientes e animações
- **JavaScript (ES6+)** - Lógica e interatividade
- **LocalStorage** - Armazenamento de dados no navegador

## 📝 Notas

- **Autenticação**: O sistema usa localStorage para armazenar usuários e sessões
- **Segurança**: As senhas são armazenadas em texto simples (não recomendado para produção)
- **Dados**: Todos os dados são armazenados localmente no navegador (localStorage)
- **Multi-usuário**: Cada navegador mantém seus próprios dados e usuários
- **Offline**: O sistema funciona completamente offline após o primeiro carregamento
- **Backup**: Para backup, você pode exportar os dados do localStorage manualmente

### ⚠️ Importante
Este é um sistema de demonstração. Para uso em produção, considere:
- Criptografia de senhas (hash)
- Backend com banco de dados
- Autenticação JWT ou similar
- Validação server-side

## 🔧 Personalização

Você pode personalizar:
- Cores no arquivo `styles.css` (variáveis CSS no `:root`)
- Categorias de livros no `index.html`
- Campos do formulário conforme necessário

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

---

Desenvolvido com ❤️ para gerenciamento de bibliotecas


