🔍 Forenseek – Projeto Integrador (Senac Coding Mobile)
Aplicativo mobile para gestão forense, com interface moderna e funcional — desenvolvido no Projeto Integrador do curso Coding Mobile do Senac.

🖼️ Preview da Interface
💡 Dica: substitua este espaço por prints do app rodando no emulador ou dispositivo físico. Você pode hospedar imagens no Imgur ou incluí-las diretamente na pasta /assets.

📦 Tecnologias Utilizadas
📱 React Native — Desenvolvimento de aplicativos móveis nativos

⚛️ React — Lógica de componentes reutilizáveis

🧠 JavaScript (ES6+) — Lógica e interatividade

🌐 Integração com API — Comunicação com o backend

📍 expo-location — Coleta de localização do dispositivo

🗂️ React Navigation — Navegação entre telas

🎯 React Hook Form — Gerenciamento de formulários

📆 DateTimePicker — Seleção de datas

🛠️ Instalação e Execução
bash
Copiar
Editar
# 1. Clone o repositório
git clone https://github.com/GabrielMartinsDoliveira/FrontEnd-PI-Senac-CM.git

# 2. Acesse o diretório
cd FrontEnd-PI-Senac-CM

# 3. Instale as dependências
npm install

# 4. Execute o projeto com Expo
npx expo start
⚠️ É necessário ter o Expo CLI instalado e o aplicativo Expo Go no celular para testar o projeto via QR Code.

🗂️ Estrutura do Projeto
bash
Copiar
Editar
FrontEnd-PI-Senac-CM/
├── assets/              # Imagens e recursos estáticos
├── components/          # Componentes reutilizáveis
├── pages/               # Telas do aplicativo
├── services/            # Comunicação com a API
├── utils/               # Funções auxiliares
├── App.js               # Arquivo principal
├── app.json             # Configuração do projeto Expo
└── package.json
🔐 Logins de Teste
makefile
Copiar
Editar
Administrador
Matrícula: 000.000.000-01
Senha: teste1234

Perito
Matrícula: 123.456.789-01
Senha: teste1234

Assistente
Matrícula: 222.111.212.31
Senha: marconi123
✅ Funcionalidades
Login com perfis distintos

Cadastro de casos e evidências

Listagem de vítimas

Armazenamento de localização no momento do cadastro

Interface adaptada para dispositivos móveis

Componentes reutilizáveis e navegação fluida

🚧 Melhorias Futuras
📸 Captura e upload de imagens de evidências

🧪 Testes automatizados com Jest e Testing Library

📍 Melhor integração com geolocalização

♿ Acessibilidade (A11Y)

👨‍💻 Equipe
Nome	GitHub
Gabriel Martins	@GabrielMartinsDoliveira
Bruno	@BBRRUUNNOO
Marconi	@marconi412

📄 Licença
Este projeto está licenciado sob a licença MIT.
Desenvolvido como parte do curso Coding Mobile - Senac.
