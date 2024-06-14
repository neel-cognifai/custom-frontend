// checkboxUtils.ts

interface ICheckboxState {
  [key: string]: boolean;
}

export const handleAutoCheckboxChange = (
  checkboxes: ICheckboxState,
  setCheckboxes: React.Dispatch<React.SetStateAction<ICheckboxState>>,
  setAutoCheckbox: React.Dispatch<React.SetStateAction<boolean>>,
  newState: boolean
) => {
  if (Object.values(checkboxes).some((value) => value === true)) {
    setAutoCheckbox(false);
    const updatedCheckboxes = Object.keys(checkboxes).reduce(
      (acc: ICheckboxState, item: string) => {
        acc[item] = false;
        return acc;
      },
      {} as ICheckboxState
    );

    setCheckboxes(updatedCheckboxes);
  } else {
    setAutoCheckbox(newState);
    const updatedCheckboxes = Object.keys(checkboxes).reduce(
      (acc: ICheckboxState, item: string) => {
        acc[item] = newState;
        return acc;
      },
      {} as ICheckboxState
    );

    setCheckboxes(updatedCheckboxes);
  }
};

export const handleOtherCheckboxChange = (
  name: string,
  checked: boolean,
  setAutoCheckbox: React.Dispatch<React.SetStateAction<boolean>>,
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void
) => {
  if (checked) {
    setAutoCheckbox(true);
  } else {
    setAutoCheckbox(false);
  }
  handleCheckboxChange({
    target: { name, checked },
  } as React.ChangeEvent<HTMLInputElement>);
};

export const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    checkboxes: ICheckboxState,
    setCheckboxes: React.Dispatch<React.SetStateAction<ICheckboxState>>,
    formValues: any,
    setFormValues: React.Dispatch<React.SetStateAction<any>>,
    selectedCheckboxesKey: string
  ) => {
    const { name, checked } = e.target;
  
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
  
    setFormValues((prevFormValues: { [x: string]: any; }) => ({
      ...prevFormValues,
      [selectedCheckboxesKey]: {
        ...prevFormValues[selectedCheckboxesKey],
        [name]: checked,
      },
    }));
  };
