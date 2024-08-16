# Usa a imagem oficial do Node.js versão 14 como base
FROM node:21.6.1

# Cria e define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o arquivo package.json e package-lock.json (se existir) para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia os arquivos do projeto para o diretório de trabalho
COPY . .

RUN npx prisma generate

# Constrói o projeto Next.js
RUN npm run build