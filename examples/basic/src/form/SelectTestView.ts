import { Flex, Text, SelectInput } from 'svev-frontend';

export class SelectTestView extends Flex {
  public constructor() {
    super();
    this.#initialize();
  }

  #initialize(): void {
    const header = new Text().text('Test of ' + SelectInput.name + ':').bold(true);
    const carSelectInput = new SelectInput<string>()
      .placeholder('Select a car')
      .setOptions(['Audi', 'BMW', 'Mercedes']);

    const selectedCarText = new Text().text(
      () => `Selected car: ${carSelectInput.value() ?? 'No car selected'}`
    );

    const distanceSelectInput = new SelectInput<number>()
      .placeholder('Select a distance')
      .setOptions([1, 2, 3], (value) => `${value} km`)
      .value(2);
    const selectedDistanceText = new Text().text(
      () => `Selected distance: ${distanceSelectInput.requiredValue()}`
    );

    const sizeSelectInput = new SelectInput<string>()
      .placeholder('Select a size')
      .setOptions({ sm: 'Small', md: 'Medium', lg: 'Large' });
    const selectedSizeText = new Text().text(
      () => `Selected size: ${sizeSelectInput.value() ?? 'No size selected'}`
    );

    this.setChildren([
      header,
      carSelectInput,
      selectedCarText,
      distanceSelectInput,
      selectedDistanceText,
      sizeSelectInput,
      selectedSizeText,
    ])
      .direction('column')
      .gap('4px');
  }
}
