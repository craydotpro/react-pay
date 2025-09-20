import {
  Children,
  createContext,
  isValidElement,
  useEffect,
  useState,
} from "react";

export interface IStepData {
  step: number;
  data: any;
  stepsCount: number | null;
  next: Function;
  prev: Function;
  goTo: Function;
  setSteps: Function;
  setData: Function;
  hasNext: boolean;
  hasPrev: boolean;
  components: string[];
  setComponents: Function;
}
export const StepContext = createContext<IStepData>({
  step: 0,
  data: {},
  stepsCount: 0,
  next: () => {},
  prev: () => {},
  goTo: () => {},
  setSteps: () => {},
  setData: () => {},
  hasNext: false,
  hasPrev: false,
  components: [],
  setComponents: () => {},
});
export const useStepData = (data = {}): IStepData => {
  const [get, set] = useState({
    step: 0,
    data,
    stepsCount: null,
    components: [] as string[],
  });
  return {
    ...get,
    next: () => {
      set(state => ({ ...state, step: state.step + 1 }));
    },
    prev: () => {
      set(state => ({ ...state, step: state.step - 1 }));
    },
    goTo: (step: number | string) => {
      set(state => {
        if (typeof step === "number") {
          return { ...state, step };
        } else {
          const i = state.components.indexOf(step);
          return { ...state, step: i };
        }
      });
    },
    hasNext: get.stepsCount === null ? false : get.step < get.stepsCount - 1,
    hasPrev: get.step !== 0 && get.step !== null,
    setSteps: (n: any) => set(state => ({ ...state, stepsCount: n })),
    setData: (data: any) => set(state => ({ ...state, data })),
    components: get.components,
    setComponents: (components: string[]) => {
      set(state => ({ ...state, components }));
    },
  };
};
export const Stepper = ({
  children,
  stepData,
}: {
  children: React.ReactNode | React.ReactNode[];
  stepData: IStepData;
}) => {
  const STEPS: React.ReactNode[] = [];
  useEffect(() => {
    const components: string[] = [];
    stepData.setSteps(STEPS.length);
    Children.forEach(children, child => {
      if (!isValidElement(child)) return;
      if (child.type === Stepper.Step) {
        components.push(child.props.name);
      }
    });
    stepData.setComponents(components);
  }, []);
  Children.forEach(children, child => {
    if (!isValidElement(child)) return;
    if (child.type === Stepper.Step) {
      STEPS.push(child);
    }
  });
  return (
    <StepContext.Provider value={stepData}>
      {STEPS[stepData.step]}
    </StepContext.Provider>
  );
};

// @ts-ignore
Stepper.Step = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
  name?: string;
}) => {
  // name param is important don't remove
  return children;
};
