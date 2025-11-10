# 🧪 Como Testar "Propostas Rejeitadas"

## ⚠️ IMPORTANTE: Entenda a Diferença

### "Não Tenho Interesse" ❌
- **Onde:** Botão nas solicitações (dashboard do marceneiro)
- **O que faz:** Apenas OCULTA a solicitação
- **NÃO cria proposta**
- **NÃO aparece em "Propostas Rejeitadas"**

### "Propostas Rejeitadas" 📋
- **Onde:** Seção no dashboard do marceneiro
- **O que mostra:** Propostas que VOCÊ ENVIOU e o CLIENTE rejeitou
- **Requer:** Fluxo completo abaixo

---

## 📝 Fluxo Completo para Testar

### PASSO 1: Como Cliente - Criar Solicitação
1. Faça login como **test@woodcraft.com** (senha: password123)
2. Clique em **"+ Nova Solicitação"**
3. Preencha os dados do móvel
4. Clique em **"Publicar Solicitação"**

### PASSO 2: Como Marceneiro - Enviar Proposta
1. Faça logout
2. Faça login como **woodworker@example.com** (senha: wood2024)
3. Veja a solicitação em **"🔔 Novas Solicitações"**
4. Clique em **"Enviar Proposta"** (NÃO clique em "Não Tenho Interesse"!)
5. Preencha:
   - **Preço:** R$ 2.500,00
   - **Mensagem:** "Posso fazer este móvel em 15 dias"
6. Clique em **"Enviar Proposta"**
7. Aguarde confirmação: "✅ Proposta enviada com sucesso!"

### PASSO 3: Como Cliente - Rejeitar Proposta
1. Faça logout
2. Faça login como **test@woodcraft.com**
3. Veja suas solicitações em **"📋 Minhas Solicitações"**
4. Clique na solicitação para ver detalhes
5. Veja a proposta do marceneiro na seção **"💬 Propostas Recebidas"**
6. Clique no botão **"Rejeitar"** (botão vermelho)
7. Confirme a rejeição
8. Aguarde: "Proposta rejeitada"

### PASSO 4: Como Marceneiro - Ver Proposta Rejeitada
1. Faça logout
2. Faça login como **woodworker@example.com**
3. Clique no botão **"🔄 Atualizar"** no topo
4. Veja a proposta em **"❌ Propostas Rejeitadas"**

---

## ✅ Resultado Esperado

No dashboard do marceneiro você verá:

```
❌ Propostas Rejeitadas                    1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Proposta de R$ 2.500,00                [Rejeitada]
Há X minutos
```

---

## 🐛 Se Não Funcionar

1. Verifique se você seguiu TODOS os passos
2. Certifique-se de que ENVIOU uma proposta (Passo 2)
3. Certifique-se de que o CLIENTE rejeitou (Passo 3)
4. Clique em "🔄 Atualizar" ou aguarde 30 segundos
5. Verifique o console do navegador (F12) para erros

---

## 📊 Estatísticas

Após rejeitar, as estatísticas devem mostrar:

- **Propostas Pendentes:** 0
- **Propostas Aceitas:** 0
- **Propostas Rejeitadas:** 1
