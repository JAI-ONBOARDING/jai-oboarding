import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setRobot, toggleRobotArrayField } from "@/store/onboardingSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const caracteristicas = [
  "Ágil",
  "Educado",
  "Assertivo",
  "Amigável",
  "Técnico",
  "Proativo",
];
const personalidades = ["Profissional", "Empático", "Amigável", "Consultivo"];
const tons = ["Formal", "Semiformal", "Informal"];

const RobotSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((s: RootState) => s.onboarding);

  return (
    <section className="container pb-6">
      <h2 className="text-xl font-semibold mb-4">Personalização do Robô JAI</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <Label htmlFor="nomeRobo">Nome do Robô</Label>
          <Input
            id="nomeRobo"
            value={state.robot.nome}
            onChange={(e) => dispatch(setRobot({ nome: e.target.value }))}
            placeholder="Ex.: Jota"
          />
        </div>

        {/* Características - Múltipla seleção */}
        <div>
          <div className="font-medium mb-2">Características</div>
          <div className="flex flex-wrap gap-2">
            {caracteristicas.map((c) => {
              const on = state.robot.caracteristicas.includes(c);
              return (
                <Button
                  key={c}
                  variant="outline"
                  size="sm"
                  className={on ? "ring-2 ring-primary" : ""}
                  onClick={() =>
                    dispatch(
                      toggleRobotArrayField({
                        field: "caracteristicas",
                        value: c,
                      })
                    )
                  }
                >
                  {c}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Personalidade - Múltipla seleção */}
        <div>
          <div className="font-medium mb-2">Personalidade</div>
          <div className="flex flex-wrap gap-2">
            {personalidades.map((c) => {
              const on = state.robot.personalidade.includes(c);
              return (
                <Button
                  key={c}
                  variant="outline"
                  size="sm"
                  className={on ? "ring-2 ring-primary" : ""}
                  onClick={() =>
                    dispatch(
                      toggleRobotArrayField({
                        field: "personalidade",
                        value: c,
                      })
                    )
                  }
                >
                  {c}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Tons de Escrita - Seleção única */}
        <div>
          <div className="font-medium mb-2">Tons de Escrita</div>
          <div className="flex flex-wrap gap-2">
            {tons.map((c) => {
              const on = state.robot.tons.includes(c);
              return (
                <Button
                  key={c}
                  variant="outline"
                  size="sm"
                  className={on ? "ring-2 ring-primary" : ""}
                  onClick={() =>
                    dispatch(
                      toggleRobotArrayField({
                        field: "tons",
                        value: c,
                      })
                    )
                  }
                >
                  {c}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RobotSection;
