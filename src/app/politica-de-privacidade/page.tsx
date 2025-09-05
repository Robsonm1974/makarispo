'use client'

import { Header } from '@/components/ui/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Política de Privacidade
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Como coletamos, usamos e protegemos suas informações pessoais
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Seção 1 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                1. Dados Coletados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Fotógrafos:</h3>
                <p className="text-muted-foreground">
                  nome, e-mail, telefone, dados de pagamento, preferências de uso.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Pais/Escolas:</h3>
                <p className="text-muted-foreground">
                  nome, e-mail, telefone, relação com aluno, dados de pagamento, fotos adquiridas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seção 2 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                2. Finalidade do Uso dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Fornecer acesso ao sistema.</li>
                <li>• Processar pagamentos e emitir comprovantes.</li>
                <li>• Comunicar suporte, notificações e status de pedidos.</li>
                <li>• Garantir segurança, prevenir fraudes e cumprir obrigações legais.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 3 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                3. Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Gateways de pagamento (ex.: Pagar.me, Stripe).</li>
                <li>• Provedores de armazenamento (ex.: Supabase).</li>
                <li>• Autoridades competentes, quando exigido por lei.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 4 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                4. Direitos do Usuário (LGPD)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Confirmar existência de tratamento de seus dados.</li>
                <li>• Solicitar acesso, correção ou exclusão.</li>
                <li>• Revogar consentimento a qualquer momento.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 5 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                5. Segurança e Retenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Dados armazenados com criptografia em trânsito e em repouso.</li>
                <li>• Retenção pelo período necessário para cumprimento legal e operacional.</li>
                <li>• Medidas técnicas e administrativas para prevenir acesso não autorizado.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 6 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                6. Encarregado de Dados (DPO)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Responsável:</strong> Robson Marcelo Martins</p>
                <p><strong className="text-foreground">E-mail:</strong> makarispo@gmail.com</p>
              </div>
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

