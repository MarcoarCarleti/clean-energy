# Clean Energy Lead Capture Platform
## Descrição do Projeto

Este projeto foi desenvolvido para a Clean Energy, uma empresa líder no mercado de comercialização de energia
renovável. O objetivo é criar uma plataforma que simule a economia de energia para os usuários e capture os dados de
leads para posterior contato comercial. A aplicação foi construída utilizando Next.js 14 com TypeScript e PostgreSQL
como banco de dados relacional. Além disso, foram utilizados Tailwind CSS para estilização e Prisma ORM para a
manipulação do banco de dados.
## Funcionalidades

- **Simulação de Economia**: Permite que os usuários insiram seus dados de consumo de energia e visualizem uma
simulação de economia com base em diferentes períodos (1, 3 e 5 anos).

- **Captura de Leads**: Coleta os dados dos usuários interessados em economizar com energia renovável.
  
- **Autenticação de Administradores**: Acesso seguro para administradores gerenciarem os leads capturados.
  
- **Listagem de Leads**: Exibição e gerenciamento dos leads capturados, com a possibilidade de exportá-los para
planilhas em formato XLSX.

- **Exclusão de Leads**: Permite que administradores excluam leads desnecessários.

## Pré-requisitos
- Node.js 18.18 ou superior
- Docker (opcional, se optar por rodar o projeto em containers)
- PostgreSQL (apenas se não usar o Docker)

## Login

O login padrão da plataforma é:
- **Email**: admin@admin.com
- **Senha**: admin

## Plataforma
Atualmente, a plataforma está hospedada em: https://clean-energy-sigma.vercel.app/
  
## Como Rodar o Projeto

### 1. Usando Docker

Este projeto inclui um docker-compose e um Dockerfile que configuram e executam o ambiente completo da aplicação,
incluindo o banco de dados PostgreSQL.

1. Clone o repositório:
```
 git clone https://github.com/MarcoarCarleti/clean-energy.git
 ```

2. Navegue até o diretório do projeto:
```
 cd clean-energy
```

3. Inicie os containers Docker:
```
 docker-compose up --build
```

4. Acesse o aplicativo no seu navegador em http://localhost:3000.
   
### 2. Sem Docker

Caso prefira rodar o projeto sem Docker, siga os passos abaixo:
1. Clone o repositório:
```
 git clone https://github.com/MarcoarCarleti/clean-energy.git
```

2. Navegue até o diretório do projeto:
```
 cd clean-energy
```

3. Instale as dependências:
```
 npm install
```

4. Configure o banco de dados PostgreSQL e as variáveis de ambiente no arquivo .env, seguindo o modelo do arquivo .env.example.
   
5. Execute as migrações e gere os arquivos Prisma:
```
 npx prisma generate
 npx prisma migrate deploy
 npx prisma db seed
```

6. Monte o projeto:
```
 npm run build
```

7. Rode o projeto:
```
 npm start
```

7. Acesse o aplicativo no seu navegador em http://localhost:3000.


