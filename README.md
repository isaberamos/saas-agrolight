
# 🌱 SaaS AgroLight

Sistema web para gestão financeira rural, desenvolvido com Django + React, voltado para pequenos agricultores. O sistema permite controle de contas a pagar e receber, cadastro de clientes e fornecedores, além de um dashboard com previsão do tempo integrada e resumo financeiro.

---

## 📋 Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
  - [Pré-requisitos](#pré-requisitos)
  - [Backend (Django)](#backend-django)
  - [Frontend (React)](#frontend-react)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Integração com OpenWeather API](#integração-com-openweather-api)
- [Autenticação e Rotas Protegidas](#autenticação-e-rotas-protegidas)
- [Estilização e Responsividade](#estilização-e-responsividade)
- [Licença](#licença)
- [Desenvolvedoras](#desenvolvedoras)

---

## 🚀 Tecnologias Utilizadas

### Backend

- Django 5.2  
- Django REST Framework  
- PostgreSQL  
- SimpleJWT  
- python-decouple  
- python-dotenv  

### Frontend

- React 19  
- React Router DOM  
- React Toastify  
- Material UI (MUI)  
- Axios  
- Chart.js + react-chartjs-2  
- Context API  
- OpenWeatherMap API  
- HTML5 + CSS3  

---

## 🛠 Instalação

### Pré-requisitos

- Python 3.10+  
- Node.js 18+  
- PostgreSQL instalado e configurado  
- Git  

### Backend (Django)

```bash
cd backend

# Criar e ativar ambiente virtual
python -m venv venv
# Linux/macOS
source venv/bin/activate
# Windows
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env baseado no .env-example e configurar variáveis
# Aplicar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Rodar servidor
python manage.py runserver
```

### Frontend (React)

```bash
cd frontend

# Instalar dependências
npm install --legacy-peer-deps

# Configurar chave da API OpenWeather em src/services/weatherService.js
# const API_KEY = 'SUA_CHAVE_OPENWEATHERMAP';

# Rodar servidor de desenvolvimento
npm start
```

---

## 📦 Scripts Disponíveis

```bash
npm start         # Inicia servidor React em modo dev
npm run build     # Gera build para produção
npm test          # Executa testes automatizados (se houver)
npm run lint      # Analisa código com ESLint (se configurado)
```

---

## 📁 Estrutura de Pastas

```plaintext
saas-agro-light/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env-example
│   └── setup/
│       └── settings.py
│       └── ...
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       └── App.js
└── README.md
```

---

## ✨ Funcionalidades Principais

- Login com autenticação JWT  
- Recuperação de senha por e-mail  
- Cadastro e edição de usuários com permissão diferenciada (admin/comum)  
- Cadastro de clientes, fornecedores e propriedades  
- Dashboard com:
  - Resumo financeiro  
  - Calendário de eventos  
  - Previsão do tempo (via API)  
- Gerenciamento financeiro:
  - Contas a pagar e a receber  
  - Plano de contas hierárquico  
- Design responsivo e acessível  

---

## ☁️ Integração com OpenWeather API

A previsão do tempo é exibida no dashboard com base em dados da API do OpenWeather. Configure sua chave no arquivo:

```js
// src/services/weatherService.js
const API_KEY = 'SUA_CHAVE_OPENWEATHERMAP';

export const getWeatherByCity = async (cidade) => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&lang=pt_br&appid=${API_KEY}`);
};
```

---

## 🔐 Autenticação e Rotas Protegidas

- Autenticação via JWT (SimpleJWT no Django)  
- React usa `AuthContext` para gerenciar sessão  
- Rotas protegidas com componente `PrivateRoute`  

---

## 📄 Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

---
