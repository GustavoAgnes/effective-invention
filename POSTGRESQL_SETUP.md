# 🐘 Configuração do PostgreSQL para WoodCraft

## 📥 Instalação do PostgreSQL

### Windows:

1. **Baixar PostgreSQL:**
   - Acesse: https://www.postgresql.org/download/windows/
   - Baixe o instalador do PostgreSQL (versão 15 ou superior recomendada)

2. **Instalar:**
   - Execute o instalador
   - Senha do superusuário (postgres): **Anote esta senha!**
   - Porta padrão: 5432
   - Locale: Default

3. **Verificar instalação:**
   ```bash
   psql --version
   ```

## 🗄️ Criar Banco de Dados

Abra o **pgAdmin** ou **SQL Shell (psql)** e execute:

```sql
-- Criar banco de dados
CREATE DATABASE woodcraft;

-- Criar usuário (opcional, mas recomendado)
CREATE USER woodcraft_user WITH PASSWORD 'woodcraft2024';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE woodcraft TO woodcraft_user;

-- Conectar ao banco
\c woodcraft

-- Dar permissões no schema public
GRANT ALL ON SCHEMA public TO woodcraft_user;
```

## ⚙️ Configuração Já Aplicada

As seguintes mudanças já foram feitas no projeto:

### 1. **pom.xml** - Dependências atualizadas:
- ✅ Removido H2 Database
- ✅ Adicionado PostgreSQL Driver

### 2. **application.properties** - Configuração do banco:
```properties
# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://localhost:5432/woodcraft
spring.datasource.username=woodcraft_user
spring.datasource.password=woodcraft2024
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 3. **Variáveis de Ambiente** (Recomendado para produção):
Crie um arquivo `.env` ou configure as variáveis:
```bash
DB_URL=jdbc:postgresql://localhost:5432/woodcraft
DB_USERNAME=woodcraft_user
DB_PASSWORD=woodcraft2024
```

## 🚀 Iniciar Aplicação

Após instalar o PostgreSQL e criar o banco:

1. **Parar o backend atual:**
   ```bash
   # No terminal do Kiro ou manualmente
   ```

2. **Iniciar novamente:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Verificar logs:**
   - Deve aparecer: "Hibernate: create table..." para cada tabela
   - Usuários de teste serão criados automaticamente

## 📊 Vantagens do PostgreSQL

✅ **Persistência:** Dados não são perdidos ao reiniciar
✅ **Performance:** Muito mais rápido para grandes volumes
✅ **Recursos:** Suporte a JSON, arrays, full-text search
✅ **Produção:** Pronto para deploy em produção
✅ **Backup:** Ferramentas robustas de backup e restore
✅ **Escalabilidade:** Suporta milhões de registros

## 🔧 Ferramentas Úteis

- **pgAdmin:** Interface gráfica para gerenciar o banco
- **DBeaver:** Cliente SQL universal
- **DataGrip:** IDE da JetBrains (pago)

## 🐛 Troubleshooting

### Erro de conexão:
```
Verifique se o PostgreSQL está rodando:
- Windows: Services → PostgreSQL
- Ou: pg_ctl status
```

### Erro de autenticação:
```
Verifique usuário e senha em application.properties
```

### Porta já em uso:
```
Altere a porta em postgresql.conf ou use outra porta
```

## 📝 Próximos Passos

1. Instalar PostgreSQL
2. Criar banco de dados `woodcraft`
3. Reiniciar o backend
4. Testar a aplicação

Os dados agora serão persistidos permanentemente! 🎉
