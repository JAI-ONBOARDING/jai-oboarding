import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";

interface FinalSectionProps {
  onSubmit: () => void;
}

const FinalSection: React.FC<FinalSectionProps> = ({ onSubmit }) => {
  const state = useSelector((s: RootState) => s.onboarding);

  return (
    <section className="container pb-20">
      <h2 className="text-xl font-semibold mb-2">Finalizar Configuração</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Revise suas informações e envie para configurarmos sua integração JAI.
      </p>
      <Button
        variant="default"
        size="lg"
        onClick={onSubmit}
        disabled={!state.contratoAceito || state.submitting}
      >
        {state.submitting ? "Enviando..." : "Enviar Configuração"}
      </Button>
    </section>
  );
};

export default FinalSection;
