# PGRD – Programa de Gerenciamento de Riscos de Dados
_Photo Manager – Documento Interno_

## 1. Inventário de Dados
- **Banco de Dados (Supabase):** usuários, escolas, eventos, fotos, pedidos.
- **Storage:** fotos organizadas por tenant.
- **Logs:** autenticação, acessos e transações.

## 2. Riscos Mapeados
- Vazamento de fotos de crianças.
- Acesso não autorizado a dados pessoais.
- Perda de dados por falhas técnicas.

## 3. Medidas de Prevenção
- Autenticação com senha forte e RLS por tenant.
- Criptografia de dados em trânsito e em repouso.
- Backups periódicos e testes de recuperação.
- Monitoramento de acessos e alertas de segurança.

## 4. Plano de Resposta a Incidentes
- Identificação imediata do incidente.
- Contenção técnica.
- Notificação à ANPD e usuários em até 72h.
- Revisão dos processos para evitar recorrência.

## 5. Responsável pelo Programa
Encarregado (DPO): **Robson Marcelo Martins**  
E-mail: [makarispo@gmail.com]
