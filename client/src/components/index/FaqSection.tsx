import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setFaqResposta } from "@/store/onboardingSlice";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileAttachment } from "@/components/shared";

interface FaqSectionProps {
  arquivosPorCampo: Record<string, File[]>;
  handleFilesChange: (campo: string, files: File[]) => void;
}

const FaqSection: React.FC<FaqSectionProps> = ({
  arquivosPorCampo,
  handleFilesChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.onboarding);

  return (
    <section className="container pb-10 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">FAQ Inteligente</h2>
      <p className="mb-8 font-semibold">
        Responda as perguntas sobre seu negócio
      </p>

      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Convênios</h3>

        <div className="mb-6">
          <Label htmlFor="conveniosPlanos" className="block mb-1 font-medium">
            Quais planos aceita (Wellhub, TotalPass, etc.)
          </Label>
          <Textarea
            id="conveniosPlanos"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.conveniosPlanos || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "conveniosPlanos",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["conveniosPlanos"] || []}
            onChange={(files) => handleFilesChange("conveniosPlanos", files)}
          />
        </div>

        <div>
          <Label htmlFor="conveniosInclusos" className="block mb-1 font-medium">
            O que está incluso em cada convênio
          </Label>
          <Textarea
            id="conveniosInclusos"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.conveniosInclusos || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "conveniosInclusos",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["conveniosInclusos"] || []}
            onChange={(files) => handleFilesChange("conveniosInclusos", files)}
          />
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">
          Infraestrutura & Serviços
        </h3>

        <div className="mb-6">
          <Label htmlFor="espacoKids" className="block mb-1 font-medium">
            Possui Espaço Kids?
          </Label>
          <Textarea
            id="espacoKids"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.espacoKids || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "espacoKids",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["espacoKids"] || []}
            onChange={(files) => handleFilesChange("espacoKids", files)}
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="menoresIdade" className="block mb-1 font-medium">
            Aceita menores de idade?
          </Label>
          <Textarea
            id="menoresIdade"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.menoresIdade || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "menoresIdade",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["menoresIdade"] || []}
            onChange={(files) => handleFilesChange("menoresIdade", files)}
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="estacionamento" className="block mb-1 font-medium">
            Tem estacionamento? Como validar o uso?
          </Label>
          <Textarea
            id="estacionamento"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.estacionamento || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "estacionamento",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["estacionamento"] || []}
            onChange={(files) => handleFilesChange("estacionamento", files)}
          />
        </div>

        <div>
          <Label htmlFor="objetosPerdidos" className="block mb-1 font-medium">
            Objetos perdidos – como proceder?
          </Label>
          <Textarea
            id="objetosPerdidos"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.objetosPerdidos || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "objetosPerdidos",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["objetosPerdidos"] || []}
            onChange={(files) => handleFilesChange("objetosPerdidos", files)}
          />
        </div>
      </section>

      {/* Cancelamento */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Cancelamento</h3>

        <Label
          htmlFor="cancelamentoProcesso"
          className="block mb-1 font-medium"
        >
          Qual o processo?
        </Label>
        <Textarea
          id="cancelamentoProcesso"
          rows={4}
          placeholder="Digite sua resposta aqui..."
          value={state.extendedFaq.cancelamentoProcesso || ""}
          onChange={(e) =>
            dispatch(
              setFaqResposta({
                key: "cancelamentoProcesso",
                resposta: e.target.value,
              })
            )
          }
        />
        <FileAttachment
          files={arquivosPorCampo["cancelamentoProcesso"] || []}
          onChange={(files) => handleFilesChange("cancelamentoProcesso", files)}
        />
      </section>

      {/* Planos e Contratação */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Planos e Contratação</h3>

        <div className="mb-6">
          <Label htmlFor="planosDiarias" className="block mb-1 font-medium">
            Diárias disponíveis e valores
          </Label>
          <Textarea
            id="planosDiarias"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.planosDiarias || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "planosDiarias",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["planosDiarias"] || []}
            onChange={(files) => handleFilesChange("planosDiarias", files)}
          />
        </div>

        <div>
          <Label htmlFor="planosAquaticos" className="block mb-1 font-medium">
            Planos aquáticos: Há troca de touca? Qual o tratamento da água? Qual
            o tamanho da piscina? Materiais obrigatórios
          </Label>
          <Textarea
            id="planosAquaticos"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.planosAquaticos || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "planosAquaticos",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["planosAquaticos"] || []}
            onChange={(files) => handleFilesChange("planosAquaticos", files)}
          />
        </div>
      </section>

      {/* Serviços Adicionais */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Serviços Adicionais</h3>

        <div className="mb-6">
          <Label htmlFor="personalTrainer" className="block mb-1 font-medium">
            Possui personal trainer? Quais os valores?
          </Label>
          <Textarea
            id="personalTrainer"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.personalTrainer || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "personalTrainer",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["personalTrainer"] || []}
            onChange={(files) => handleFilesChange("personalTrainer", files)}
          />
        </div>

        <div>
          <Label htmlFor="modalidadesExtras" className="block mb-1 font-medium">
            Modalidades extras disponíveis (Pilates, Spinning, Beach Tênis): São
            inclusas ou pagas à parte? O Pilates é solo ou com aparelhos?
          </Label>
          <Textarea
            id="modalidadesExtras"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.modalidadesExtras || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "modalidadesExtras",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["modalidadesExtras"] || []}
            onChange={(files) => handleFilesChange("modalidadesExtras", files)}
          />
        </div>
      </section>

      {/* Aulas */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Aulas</h3>

        <div className="mb-6">
          <Label htmlFor="gradeDescricao" className="block mb-1 font-medium">
            Grade com descrição
          </Label>
          <Textarea
            id="gradeDescricao"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.gradeDescricao || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "gradeDescricao",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["gradeDescricao"] || []}
            onChange={(files) => handleFilesChange("gradeDescricao", files)}
          />
        </div>

        <div>
          <Label
            htmlFor="politicaAcompanhante"
            className="block mb-1 font-medium"
          >
            Política de acompanhante
          </Label>
          <Textarea
            id="politicaAcompanhante"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.politicaAcompanhante || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "politicaAcompanhante",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["politicaAcompanhante"] || []}
            onChange={(files) =>
              handleFilesChange("politicaAcompanhante", files)
            }
          />
        </div>
      </section>

      {/* Agendamento */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Agendamento</h3>

        <div className="mb-6">
          <Label htmlFor="agendamentoApp" className="block mb-1 font-medium">
            Precisa agendar? Se sim, é pelo app?
          </Label>
          <Textarea
            id="agendamentoApp"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.agendamentoApp || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "agendamentoApp",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["agendamentoApp"] || []}
            onChange={(files) => handleFilesChange("agendamentoApp", files)}
          />
        </div>
      </section>

      {/* Equipamentos */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4">Equipamentos</h3>

        <Label htmlFor="equipamentosLista" className="block mb-1 font-medium">
          Lista de equipamentos disponíveis por unidade
        </Label>
        <Textarea
          id="equipamentosLista"
          rows={4}
          placeholder="Digite sua resposta aqui..."
          value={state.extendedFaq.equipamentosLista || ""}
          onChange={(e) =>
            dispatch(
              setFaqResposta({
                key: "equipamentosLista",
                resposta: e.target.value,
              })
            )
          }
        />
        <FileAttachment
          files={arquivosPorCampo["equipamentosLista"] || []}
          onChange={(files) => handleFilesChange("equipamentosLista", files)}
        />
      </section>

      {/* Cobrança */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Cobrança</h3>

        <div className="mb-6">
          <Label htmlFor="formasPagamento" className="block mb-1 font-medium">
            Quais formas de pagamento são aceitas? (Pix, cartão, boleto)
          </Label>
          <Textarea
            id="formasPagamento"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.formasPagamento || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "formasPagamento",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["formasPagamento"] || []}
            onChange={(files) => handleFilesChange("formasPagamento", files)}
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="chavePix" className="block mb-1 font-medium">
            Qual a chave Pix da unidade?
          </Label>
          <Textarea
            id="chavePix"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.chavePix || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "chavePix",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["chavePix"] || []}
            onChange={(files) => handleFilesChange("chavePix", files)}
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="parcelamento" className="block mb-1 font-medium">
            Há opção de parcelamento? A partir de qual valor e em quantas vezes?
          </Label>
          <Textarea
            id="parcelamento"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.parcelamento || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "parcelamento",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["parcelamento"] || []}
            onChange={(files) => handleFilesChange("parcelamento", files)}
          />
        </div>

        <div>
          <Label htmlFor="confirmacaoPix" className="block mb-1 font-medium">
            Como confirmar o recebimento do Pix? Quem faz essa verificação?
          </Label>
          <Textarea
            id="confirmacaoPix"
            rows={4}
            placeholder="Digite sua resposta aqui..."
            value={state.extendedFaq.confirmacaoPix || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "confirmacaoPix",
                  resposta: e.target.value,
                })
              )
            }
          />
          <FileAttachment
            files={arquivosPorCampo["confirmacaoPix"] || []}
            onChange={(files) => handleFilesChange("confirmacaoPix", files)}
          />
        </div>
      </section>

      {/* Perguntas Específicas */}
      <section className="container pb-10 max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold mb-4">
          Perguntas Específicas do Seu Negócio
        </h3>

        <div className="mb-6">
          <Label
            htmlFor="perguntasEspecificas"
            className="block mb-1 font-small"
          >
            Liste aqui perguntas específicas do seu negócio que o robô deve
            saber responder
          </Label>
          <Textarea
            id="perguntasEspecificas"
            rows={6}
            placeholder="Ex: Horários especiais, promoções atuais, políticas específicas, etc."
            value={state.extendedFaq.perguntasEspecificas || ""}
            onChange={(e) =>
              dispatch(
                setFaqResposta({
                  key: "perguntasEspecificas",
                  resposta: e.target.value,
                })
              )
            }
          />
        </div>
      </section>
    </section>
  );
};

export default FaqSection;
