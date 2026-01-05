import { Stack, Text, effect, UIElement, SelectInput } from 'svev-frontend';

export function createSelectTest(): UIElement {
  const header = new Text().text('Test of ' + SelectInput.name + ':').bold(true);
  const carSelectInput = new SelectInput<string>()
    .placeholder('Select a car')
    .setOptions(['Audi', 'BMW', 'Mercedes']);

  const selectedCarText = new Text();
  effect(() => {
    selectedCarText.text(`Selected car: ${carSelectInput.value() ?? 'No car selected'}`);
  });

  const distanceSelectInput = new SelectInput<number>()
    .placeholder('Select a distance')
    .setOptions([1, 2, 3], (value) => `${value} km`)
    .value(2);
  const selectedDistanceText = new Text();
  effect(() => {
    selectedDistanceText.text(`Selected distance: ${distanceSelectInput.requiredValue()}`);
  });

  const sizeSelectInput = new SelectInput<string>()
    .placeholder('Select a size')
    .setOptions({ sm: 'Small', md: 'Medium', lg: 'Large' });
  const selectedSizeText = new Text();
  effect(() => {
    selectedSizeText.text(`Selected size: ${sizeSelectInput.value() ?? 'No size selected'}`);
  });

  const layout = new Stack([
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

  return layout;
}
