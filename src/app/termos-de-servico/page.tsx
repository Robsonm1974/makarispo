'use client'

import { Header } from '@/components/ui/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermosServicoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Termos de Serviço
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Condições de uso da plataforma Photo Manager
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
                1. Objeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Este Termo regula o uso da plataforma <strong className="text-foreground">Photo Manager</strong>, 
                disponibilizada pela <strong className="text-foreground">Makarispo Tech</strong>, por:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong className="text-foreground">Fotógrafos (clientes SaaS):</strong> que assinam o serviço para organizar eventos, cadastrar escolas e comercializar fotos.</li>
                <li>• <strong className="text-foreground">Pais/Escolas (usuários finais):</strong> que acessam a plataforma pública para visualizar e adquirir fotos.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 2 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                2. Cadastro e Acesso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• O fotógrafo deve fornecer informações verídicas no cadastro e manter suas credenciais seguras.</li>
                <li>• Pais e escolas acessam via senha ou QR Code fornecido pelo fotógrafo.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 3 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                3. Planos, Pagamentos e Cancelamentos (Fotógrafos)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• A contratação segue o plano selecionado, com cobrança recorrente.</li>
                <li>• Cancelamentos produzem efeito no próximo ciclo de faturamento.</li>
                <li>• Não há reembolso por período já utilizado.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 4 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                4. Compras e Pagamentos (Pais/Escolas)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• As fotos podem ser adquiridas via métodos de pagamento disponibilizados (PIX, cartão etc.).</li>
                <li>• Produtos digitais são entregues após a confirmação do pagamento.</li>
                <li>• Produtos físicos seguem prazos informados pelo fotógrafo responsável.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 5 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                5. Direitos Autorais e Uso de Fotos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• As fotos são de propriedade intelectual do fotógrafo.</li>
                <li>• O comprador recebe licença de uso pessoal, não podendo revender ou explorar comercialmente.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 6 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                6. Uso Permitido e Proibido da Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">É permitido:</h3>
                  <p className="text-muted-foreground">uso do Photo Manager para finalidades previstas neste Termo.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">É proibido:</h3>
                  <p className="text-muted-foreground">uso para fins ilegais, compartilhamento não autorizado de fotos, tentativa de burlar sistemas de segurança.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção 7 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                7. Limitação de Responsabilidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• A <strong className="text-foreground">Makarispo Tech</strong> fornece apenas a infraestrutura tecnológica.</li>
                <li>• Disputas relacionadas à qualidade das fotos, prazos ou entrega devem ser resolvidas entre fotógrafo e cliente final.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Seção 8 */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                8. Foro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fica eleito o foro da comarca de <strong className="text-foreground">Curitiba/Paraná</strong> para dirimir 
                quaisquer controvérsias oriundas deste Termo.
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

