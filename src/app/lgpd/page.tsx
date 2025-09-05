'use client'

import { Header } from '@/components/ui/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LGPDPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Aviso de Conformidade com a LGPD
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Photo Manager – Makarispo Tech
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Introdução */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                A Makarispo Tech, responsável pela plataforma <strong className="text-foreground">Photo Manager</strong>, 
                cumpre integralmente a <strong className="text-foreground">Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD)</strong>.
              </p>
              <p className="text-muted-foreground">
                Este documento resume como tratamos dados pessoais de <strong className="text-foreground">fotógrafos (clientes SaaS)</strong> 
                e <strong className="text-foreground">pais/escolas (usuários finais)</strong>, garantindo transparência, segurança e respeito à privacidade.
              </p>
            </CardContent>
          </Card>

          {/* Seção 1 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                1. Princípios da LGPD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Nosso tratamento de dados segue os princípios estabelecidos na lei:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong className="text-foreground">Finalidade:</strong> utilizamos os dados apenas para as finalidades informadas e legítimas.</li>
                <li>• <strong className="text-foreground">Adequação:</strong> tratamos os dados de forma compatível com a atividade da plataforma.</li>
                <li>• <strong className="text-foreground">Necessidade:</strong> coletamos apenas o mínimo necessário.</li>
                <li>• <strong className="text-foreground">Livre Acesso:</strong> permitimos que os titulares acessem seus dados.</li>
                <li>• <strong className="text-foreground">Qualidade dos Dados:</strong> mantemos os dados corretos, atualizados e relevantes.</li>
                <li>• <strong className="text-foreground">Transparência:</strong> informamos de forma clara como os dados são usados.</li>
                <li>• <strong className="text-foreground">Segurança:</strong> adotamos medidas técnicas e administrativas para proteger os dados.</li>
                <li>• <strong className="text-foreground">Prevenção:</strong> atuamos para evitar danos decorrentes do uso dos dados.</li>
                <li>• <strong className="text-foreground">Não Discriminação:</strong> não utilizamos dados para fins discriminatórios.</li>
                <li>• <strong className="text-foreground">Responsabilização e Prestação de Contas:</strong> estamos prontos para demonstrar conformidade.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 2 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                2. Direitos dos Titulares de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                De acordo com a LGPD, qualquer titular pode solicitar:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Confirmação da existência de tratamento.</li>
                <li>• Acesso aos dados coletados.</li>
                <li>• Correção de dados incompletos, inexatos ou desatualizados.</li>
                <li>• Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                <li>• Portabilidade dos dados.</li>
                <li>• Eliminação de dados tratados com base no consentimento.</li>
                <li>• Informação sobre compartilhamento de dados com terceiros.</li>
                <li>• Revogação do consentimento.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 3 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                3. Tratamento de Dados no Photo Manager
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong className="text-foreground">Fotógrafos:</strong> coletamos dados para autenticação, gestão de assinatura e uso da plataforma.</li>
                <li>• <strong className="text-foreground">Pais/Escolas:</strong> coletamos dados para permitir acesso às fotos, processar compras e oferecer suporte.</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Dados tratados incluem: nome, e-mail, telefone, dados de pagamento, relação com aluno e fotos enviadas/armazenadas.
              </p>
            </CardContent>
          </Card>

          {/* Seção 4 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                4. Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong className="text-foreground">Processadores de pagamento</strong> (ex.: Pagar.me, Stripe).</li>
                <li>• <strong className="text-foreground">Serviços de armazenamento</strong> (ex.: Supabase).</li>
                <li>• <strong className="text-foreground">Autoridades públicas</strong>, quando exigido por lei.</li>
              </ul>
              <p className="text-muted-foreground mt-4 font-semibold">
                Não comercializamos dados pessoais.
              </p>
            </CardContent>
          </Card>

          {/* Seção 5 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                5. Segurança da Informação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Adotamos medidas de segurança para proteger dados pessoais contra acessos não autorizados:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Criptografia em repouso e em trânsito.</li>
                <li>• Autenticação de usuários e segregação de dados por tenant.</li>
                <li>• Monitoramento e auditoria de acessos.</li>
                <li>• Backups periódicos e testes de recuperação.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 6 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                6. Contato com o Encarregado de Dados (DPO)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Titulares de dados podem exercer seus direitos entrando em contato com nosso Encarregado de Dados:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Encarregado (DPO):</strong> Robson Marcelo Martins</p>
                <p><strong className="text-foreground">E-mail:</strong> makarispo@gmail.com</p>
              </div>
            </CardContent>
          </Card>

          {/* Seção 7 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                7. Atualizações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Este aviso pode ser atualizado a qualquer momento para refletir mudanças legais ou melhorias na plataforma. 
                Sempre indicaremos a data da última revisão.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">Última atualização:</strong> 04/09/2025
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-border/30 pt-8">
          <p>© 2024 Photo Manager. Todos os direitos reservados.</p>
        </footer>
      </main>
    </div>
  )
}

