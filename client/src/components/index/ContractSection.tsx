import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setContratoAceito } from "@/store/onboardingSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ContractSectionProps {
  validationErrors?: string[];
}

const ContractSection: React.FC<ContractSectionProps> = ({
  validationErrors = [],
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.onboarding);

  const contractText = useMemo(() => {
    const nome = state.company?.nomeEmpresa || "[A ser preenchido]";
    const cnpj = state.company?.cnpj || "[A ser preenchido]";

    return `
QUADRO RESUMO

Data Inicial: ${new Date().toLocaleDateString("pt-BR")}

Local de Assinatura: São Paulo - SP

QUADRO I – CONTRATADA:
Razão Social: J QUANT INFORMÁTICA LTDA.

CNPJ/MF: 17.493.469/0001-02

Endereço: Rua Professor Atilio Innocenti, 165, 4° andar, Vila Nova Conceição, na Cidade de São Paulo, Estado de São Paulo, CEP 01406-200

QUADRO II – CONTRATANTE:
Razão Social: ${nome}

CNPJ/MF: ${cnpj}

(sendo a Contratada e a Contratante doravante denominadas em conjunto como "Partes" e, individual e indistintamente, "Parte")

QUADRO III – SERVIÇOS:
Os serviços de automatização de processos e operações, a serem prestados pela Contratante à Contratada, conforme indicado na cláusula 2.1.

QUADRO IV – VIGÊNCIA:
Prazo: 12 (doze) meses contados da assinatura deste Contrato, renovável automaticamente por iguais períodos, exceto se uma Parte notificar a outra Parte, por escrito, com no mínimo 30 (trinta) dias de antecedência da data de renovação automática, sobre a sua decisão de não renovar o Contrato.

QUADRO V - PREÇO E CONDIÇÕES DE PAGAMENTO:
Forma de Pagamento: transferência bancária (via TED ou PIX).

Dados bancários: Banco 341 / Agência 5291 / Conta 03022-1 / Chave Pix 17493469000102

QUADRO VI - ENCARGOS MORATÓRIOS
1. Multa Penal Não Compensatória: 10% (dez por cento) sobre o valor em atraso.

2. Correção Monetária: com base na variação do IGPM/FGV ou outro índice que venha a substituí-lo, apurado no período entre o vencimento da obrigação e o efetivo pagamento.

3. Juros Moratórios: 1% (um por cento) ao mês, calculado pro rata die desde a data do vencimento da obrigação até a data do efetivo pagamento.

QUADRO VII – REAJUSTE
Reajuste anual com base na variação do IGP-M ou outro índice que venha a substituí-lo.

1. OBJETO
A CONTRATADA prestará serviços de BPO com foco em atendimento, vendas e cobrança, por meio de robôs inteligentes com IA, integrados a canais como WhatsApp, e-mail, redes sociais e ou landing pages.

2. CONDIÇÕES DE CONTRATAÇÃO
Início: ${new Date().toLocaleDateString("pt-BR")}

Prazo: 12 meses, renovado automaticamente, salvo notificação com 30 dias de antecedência.

Pagamento:

Mensalidade por unidade: R$ 750,00
Comissão: 18% sobre valores recuperados (cobrança ativa/negociação)
Forma de pagamento: Transferência bancária (TED ou PIX: 17493469000102)
Vencimento: Dia 20 do mês subsequente à prestação dos serviços.
Encargos por atraso: Multa de 10%, correção pelo IGPM/FGV e juros de 1% ao mês.

3. OBRIGAÇÕES DAS PARTES
CONTRATADA:

Prestar os serviços com diligência e qualidade.
Garantir sistema com disponibilidade mínima de 95%.
Fornece relatórios mensais de desempenho.
Cumprir as diretrizes da LGPD.

CONTRATANTE:

Efetuar os pagamentos nos prazos acordados.
Fornecer informações e acessos necessários.
Responsabilizar-se pelos dados fornecidos e pelo backup das comunicações.
Avaliar e aprovar os relatórios em até 7 dias.

4. RESCISÃO
Ambas as partes podem rescindir com aviso prévio de 30 dias.
Se a CONTRATANTE rescindir após 90 dias do início, será devida multa de 3x o maior faturamento mensal dos últimos 12 meses.
A rescisão imediata é permitida em caso de inadimplência, falência ou força maior.

5. LIMITAÇÃO DE RESPONSABILIDADE
A CONTRATADA não é responsável por:

Serviços prestados pela CONTRATANTE a seus clientes;
Dados incorretos fornecidos;
Ações de terceiros, falhas na plataforma WhatsApp ou em sistemas do cliente;
Danos indiretos, lucros cessantes ou falhas oriundas da CONTRATANTE.

6. PROPRIEDADE INTELECTUAL
A CONTRATANTE não adquire qualquer direito sobre os sistemas da CONTRATADA.

É autorizada a divulgação do nome da CONTRATANTE em portfólios e materiais da CONTRATADA.

7. CONFIDENCIALIDADE
Ambas as partes se comprometem a manter sigilo sobre informações trocadas durante e após a vigência deste termo, por até 5 anos (ou indefinidamente, no caso de dados sensíveis e propriedade intelectual).

8. LGPD E IA
A CONTRATANTE é a controladora dos dados, e a CONTRATADA, a operadora, conforme LGPD.

A CONTRATANTE autoriza o uso de IA, inclusive para aprendizado e melhoria contínua.

9. FORO E LEGISLAÇÃO
Este contrato é regido pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo/SP para dirimir eventuais questões.
`;
  }, [state.company?.nomeEmpresa, state.company?.cnpj]);

  return (
    <section className="container py-12">
      <article className="rounded-3xl border p-6 md:p-8">
        <h2 className="text-xl font-semibold mb-4">
          Contrato de Prestação de Serviços *
        </h2>
        <div className="rounded-xl border p-4 h-64 overflow-y-auto text-sm bg-background/40">
          <pre className="whitespace-pre-wrap font-sans text-foreground/90">
            {contractText}
          </pre>
        </div>
        <div className="flex items-start gap-3 mt-4">
          <Checkbox
            id="aceite"
            checked={state.contratoAceito}
            onCheckedChange={(v) => dispatch(setContratoAceito(Boolean(v)))}
          />
          <Label htmlFor="aceite" className="leading-6">
            Li e concordo com todos os termos do Contrato de Prestação de
            Serviços acima. Declaro estar ciente das condições de pagamento,
            prazo de vigência, obrigações das partes e demais cláusulas
            contratuais. Ao marcar esta opção, confirmo minha concordância
            integral com os termos apresentados.
          </Label>
        </div>
        {(!state.contratoAceito ||
          validationErrors.some((error) =>
            error.includes("aceite do contrato")
          )) && (
          <p className="text-xs text-destructive mt-2">
            É obrigatório aceitar os termos do contrato para prosseguir
          </p>
        )}
      </article>
    </section>
  );
};

export default ContractSection;
