# 📋 PLANEJAMENTO E-COMMERCE - PHOTO MANAGER

## �� OBJETIVO
Implementar um sistema de e-commerce completo dentro do Photo Manager, permitindo que pais comprem fotos online e que o fotógrafo receba diretamente pelas vendas.

## �� RESUMO EXECUTIVO
- **Modelo**: Direct-to-merchant (cada fotógrafo conecta suas próprias chaves de API)
- **Gateways**: PagSeguro, Mercado Pago, Pagar.me (Fase 1)
- **Entrega**: Retirada/entrega na escola (sem integração logística)
- **Fiscal**: Não emitir nota fiscal nem recolher impostos pela plataforma

---

## ��️ CRONOGRAMA DE IMPLEMENTAÇÃO

### **FASE 1: ESTRUTURA BASE** (Semana 1-2)
- [ ] Produtos - Dashboard Settings
- [ ] Configurações de Pagamento - Dashboard Settings
- [ ] Estrutura de banco de dados

### **FASE 2: CARRINHO E CHECKOUT** (Semana 3-4)
- [ ] Melhorias no carrinho existente
- [ ] Checkout completo
- [ ] Integração com produtos

### **FASE 3: INTEGRAÇÃO DE PAGAMENTOS** (Semana 3-4)
- [ ] Integração PagSeguro (checkout hospedado)
- [ ] Sistema de webhooks
- [ ] Páginas de retorno
- [ ] Testes de integração

### **FASE 4: E-MAILS E NOTIFICAÇÕES** (Semana 7)
- [ ] E-mails transacionais
- [ ] Sistema de notificações
- [ ] Templates personalizáveis

### **FASE 5: PAINEL DE PEDIDOS** (Semana 8)
- [ ] Dashboard de pedidos
- [ ] Relatórios de vendas
- [ ] Exportação de dados

---

## ��️ ESTRUTURA TÉCNICA

### **1. PRODUTOS - Dashboard Settings**

#### Componentes a Criar:
- `ProductForm.tsx` - Formulário de criação/edição
- `ProductList.tsx` - Listagem com ações
- `ProductCard.tsx` - Card individual do produto
- `ProductImageUpload.tsx` - Upload de imagens

#### Campos do Produto:
- Nome do produto
- Preço
- Tamanho (opcional)
- Descrição
- Imagens (múltiplas)
- Categoria (opcional)
- Status (ativo/inativo)

#### Funcionalidades:
- CRUD completo de produtos
- Upload de imagens para bucket `products`
- Validação de campos obrigatórios
- Preview do produto

### **2. CONFIGURAÇÕES DE PAGAMENTO - Dashboard Settings**

#### Componentes a Criar:
- `PaymentConfigForm.tsx` - Configuração principal
- `PaymentMethodSelector.tsx` - Seleção de métodos
- `WebhookUrlDisplay.tsx` - Exibição da URL
- `PaymentTestButton.tsx` - Teste de integração

#### Configurações:
- Seleção da plataforma (PagSeguro, Mercado Pago, Pagar.me)
- Ambiente (sandbox/produção)
- Credenciais (chaves/tokens)
- Métodos aceitos (PIX, cartão, boleto)
- URL de webhook (gerada automaticamente)
- Teste de conectividade

### **3. INTEGRAÇÃO DE PAGAMENTOS (CHECKOUT HOSPEDADO)**

#### **RECOMENDAÇÃO: PagSeguro (Checkout Hospedado)**
- ✅ **Implementação muito mais simples**
- ✅ **Sem responsabilidade PCI DSS**
- ✅ **Interface de pagamento do PagSeguro**
- ✅ **Redirecionamento automático**
- ✅ **Webhooks robustos**
- ✅ **Taxas: 4.99% + R$ 0.39**

#### **Fluxo Simplificado:**
1. **Cliente** finaliza compra no seu site
2. **Sistema** cria transação no PagSeguro
3. **Cliente** é redirecionado para PagSeguro
4. **PagSeguro** processa o pagamento
5. **Cliente** retorna para seu site
6. **Webhook** atualiza status do pedido

#### **Serviços Simplificados:**
- `PagSeguroService.ts` - Criação de transações
- `WebhookHandler.ts` - Processamento de webhooks
- `OrderStatusUpdater.ts` - Atualização de status
- `CheckoutRedirect.ts` - Redirecionamento para PagSeguro

---

## 🗄️ ESTRUTURA DE BANCO DE DADOS

### **Tabelas Existentes (Ajustar):**
- `products` - Produtos do fotógrafo
- `order_items` - Itens do pedido
- `orders` - Pedidos

### **Tabelas Novas (Criar):**
- `payment_configs` - Configurações de pagamento por tenant
- `payment_transactions` - Transações de pagamento
- `product_categories` - Categorias de produtos (opcional)

### **Scripts SQL Necessários:**
```sql
-- Tabela de configurações de pagamento
CREATE TABLE payment_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  platform TEXT NOT NULL, -- 'mercadopago', 'pagseguro', 'pagar_me'
  environment TEXT NOT NULL, -- 'sandbox', 'production'
  credentials JSONB NOT NULL, -- chaves criptografadas
  methods_enabled TEXT[] DEFAULT ARRAY['pix', 'credit_card', 'boleto'],
  webhook_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações de pagamento
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  external_id TEXT, -- ID da transação no gateway
  status TEXT NOT NULL, -- 'pending', 'paid', 'refused', 'refunded', 'expired'
  amount DECIMAL(10,2) NOT NULL,
  method TEXT, -- 'pix', 'credit_card', 'boleto'
  gateway_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔧 FUNCIONALIDADES DETALHADAS

### **1. CARRINHO DE COMPRAS**
- Adicionar/remover itens
- Cálculo de totais dinâmico
- Persistência local (localStorage)
- Validação de estoque
- Integração com produtos adicionais

### **2. CHECKOUT HOSPEDADO (SIMPLIFICADO)**
- Formulário de dados do comprador (nome, email, telefone)
- Resumo da compra com itens selecionados
- **Redirecionamento direto para PagSeguro** (checkout hospedado)
- Página de retorno com confirmação
- **Sem necessidade de capturar dados de cartão**

### **3. INTEGRAÇÃO PAGSEGURO (CHECKOUT HOSPEDADO)**
- Criação de transação via API do PagSeguro
- Geração de URL de checkout hospedado
- Redirecionamento automático para PagSeguro
- Retorno automático após pagamento
- Processamento de webhooks para atualização de status

### **4. UP-SELL**
- Sugestões de produtos complementares
- Ofertas especiais
- Descontos por quantidade
- Produtos relacionados

### **5. E-MAILS TRANSACIONAIS**
- Confirmação de pedido
- Confirmação de pagamento
- Instruções de retirada
- Notificação para fotógrafo
- Templates personalizáveis

### **6. PAINEL DE PEDIDOS**
- Listagem com filtros (status, período, escola/evento)
- Detalhes do pedido
- Status de produção (em produção → pronto → entregue)
- Exportação CSV
- Relatórios de vendas

### **6. NOTIFICAÇÕES**

#### **6.1 E-mail (Obrigatório)**
- Confirmação de pedido
- Confirmação de pagamento
- Instruções de retirada
- Notificação para fotógrafo
- Templates personalizáveis

#### **6.2 Web Push (Opcional)**

**Objetivo:**
Permitir que fotógrafos recebam notificações em tempo real de novas vendas, sem custo adicional, diretamente em seus navegadores ou celulares, mesmo quando não estiverem com o painel aberto.

**Descrição:**
O sistema deve oferecer ao fotógrafo a opção de ativar notificações Web Push no painel. Quando um pedido for confirmado como pago (via webhook), além do e-mail já enviado, o sistema deve disparar uma notificação push.

**Conteúdo da Notificação:**
- Ícone da plataforma
- Título: "Nova venda confirmada"
- Texto: "Pedido #123 – João Silva – 3 fotos"
- Link direto para a página do pedido no painel

**Fluxo do Usuário:**
1. Ao acessar o painel pela primeira vez, o navegador solicita permissão para notificações
2. Se o fotógrafo aceitar, sua inscrição é registrada no sistema
3. A cada nova venda confirmada, o backend envia uma notificação push
4. O fotógrafo pode gerenciar as permissões diretamente no navegador

**Requisitos Técnicos:**
- Utilizar padrão Web Push API (W3C) + Service Worker
- Compatibilidade com navegadores desktop e mobile (Chrome, Firefox, Edge, Safari iOS ≥ 16.4)
- Inscrição do usuário armazenada por tenant para envio segmentado
- Garantir fallback para e-mail caso o usuário não aceite as notificações

**Vantagens:**
- Zero custo por envio
- Entrega imediata das notificações
- Funciona em navegadores modernos, inclusive em celulares Android

**Limitações:**
- Requer consentimento explícito do usuário
- No iOS, disponível apenas em versões recentes (16.4+)
- Pode ser desativado a qualquer momento pelo usuário no navegador

#### **6.3 Telegram (Futuro)**
- Integração com bot do Telegram
- Notificações via chat privado
- Comandos para consultar status de pedidos

#### **6.4 Dashboard Interno**
- Notificações in-app
- Badge de contador de pedidos pendentes
- Histórico de notificações

---

## 🔒 SEGURANÇA E CONFORMIDADE

### **Segurança:**
- Criptografia das credenciais de pagamento
- Validação de webhooks com assinatura
- Sanitização de dados de entrada
- HTTPS obrigatório
- Validação de CSRF

### **Conformidade LGPD:**
- Não armazenar dados desnecessários
- Consentimento explícito para dados de pagamento
- Política de retenção de dados
- Direito ao esquecimento
- Portabilidade de dados

### **Conformidade PCI DSS:**
- Não armazenar dados de cartão
- Usar tokenização
- Validar certificados SSL
- Logs de auditoria

---

## ❓ DECISÕES PENDENTES

### **Produtos:**
- [ ] Categorias de produtos ou lista única? Lista única.
- [ ] Preços fixos ou variáveis por tamanho? Depende do produto, as duas opções.
- [ ] Controle de estoque ou ilimitado? Ilimitado

### **Pagamentos:**
- [ ] Confirma Mercado Pago como primeira opção? Sim
- [ ] Quer implementar todas as 3 plataformas ou apenas 1? APenas um no início
- [ ] Precisa de sistema de reembolsos? Não

### **Funcionalidades:**
- [ ] Sistema de cupons/descontos? Nao
- [ ] Cálculo de frete (fixo, por peso, grátis)? Nao
- [ ] Templates de e-mail personalizáveis? Sim
- [ ] Prioridade para Web Push ou Telegram? Web Push

### **UX/UI:**
- [ ] Design do carrinho (modal, página, sidebar)?
- [ ] Fluxo de checkout (1 página ou múltiplas)? 
- [ ] Integração com produtos na página do participante? Sim

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1 - Estrutura Base:**
- [ ] Criar componentes de produtos
- [ ] Criar componentes de configuração de pagamento
- [ ] Implementar CRUD de produtos
- [ ] Criar tabelas de banco de dados
- [ ] Implementar upload de imagens

### **Fase 2 - Carrinho e Checkout:**
- [ ] Melhorar carrinho existente
- [ ] Implementar checkout completo
- [ ] Integrar produtos com carrinho
- [ ] Criar página de confirmação
- [ ] Implementar validações

### **Fase 3 - Integração de Pagamentos:**
- [ ] Integrar Mercado Pago
- [ ] Implementar webhooks
- [ ] Criar sistema de status de pedidos
- [ ] Implementar validação de pagamentos
- [ ] Testes de integração

### **Fase 4 - E-mails e Notificações:**
- [ ] Criar templates de e-mail
- [ ] Implementar envio automático
- [ ] Sistema de notificações
- [ ] Configurações de e-mail por tenant

### **Fase 5 - Painel de Pedidos:**
- [ ] Dashboard de pedidos
- [ ] Filtros e busca
- [ ] Relatórios de vendas
- [ ] Exportação de dados
- [ ] Status de produção

---

## 📚 DOCUMENTAÇÃO NECESSÁRIA

### **Para Fotógrafos:**
- Como obter chaves de API
- Como configurar webhooks
- Como testar integrações
- Como gerenciar produtos
- Como acompanhar pedidos

### **Para Desenvolvedores:**
- Documentação da API
- Guia de integração
- Troubleshooting
- Logs e monitoramento
- Backup e recuperação

---

## �� MÉTRICAS DE SUCESSO

### **Técnicas:**
- Tempo de carregamento < 3s
- Taxa de conversão > 5%
- Uptime > 99.9%
- Tempo de resposta da API < 500ms

### **Negócio:**
- Aumento de 30% nas vendas
- Redução de 50% no tempo de processamento
- Satisfação do cliente > 4.5/5
- Adoção por 80% dos fotógrafos ativos

---

## �� NOTAS DE IMPLEMENTAÇÃO

### **Prioridades:**
1. **Alta**: Mercado Pago, produtos básicos, carrinho
2. **Média**: E-mails, painel de pedidos, relatórios
3. **Baixa**: Web Push, Telegram, funcionalidades avançadas

### **Riscos:**
- Complexidade das integrações de pagamento
- Conformidade com regulamentações
- Performance com muitos produtos
- Segurança de dados de pagamento

### **Mitigações:**
- Testes extensivos em sandbox
- Consultoria jurídica para LGPD
- Otimização de queries e cache
- Auditoria de segurança

---

**Última atualização**: [Data atual]
**Versão**: 1.0
**Status**: Em planejamento


## USES CASES
### 👨‍👩‍👧 Pai/Responsável (Comprador)

1. Acessa a página pública do fotógrafo e localiza o participante através do QR Code fornecido pela escola/fotógrafo.
2. Visualiza as fotos disponíveis, seleciona as que deseja adquirir e adiciona ao carrinho de compras.
3. Revisa o pedido, clica em Finalizar Compra e realiza o pagamento utilizando PIX ou cartão de crédito/débito.
4. Recebe um e-mail/webpush de confirmação com os detalhes do pedido e instruções de retirada na escola.


### 📸 Tenant/Fotógrafo (Usuário do SaaS)
1. Recebe uma notificação de nova venda via Web Push e/ou e-mail, contendo os detalhes do pedido.
2. Fotografo acessa o painel do Photo Manager, onde pode visualizar todas as vendas, filtrá-las e acompanhar o status de cada uma (Pagamento, Produção, Impressão, Finalizado).
3. Abre o pedido específico para:
- Consultar Dados do comprador (nome e contato).
- Consultar itens adquiridos (nomes dos arquivos, imagens, quantidades, valores).
- Consultar Forma de pagamento e status atual.
- Atualizar o status do pedido conforme o andamento:  “Em produção” → “Impresso” → “Pronto para entrega” → “Finalizado”.
- Imprimir o pedido/detalhes para organizar a produção.
- Marcar o pedido como Finalizado, encerrando o fluxo. (Após concluir a produção, realiza a entrega do material na escola.)
