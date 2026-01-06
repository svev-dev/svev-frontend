import { Flex, Text, effect, Checkbox, StringInput, UIElement } from 'svev-frontend';

export function createCheckboxTest(): UIElement {
  const header = new Text().text('Test of ' + Checkbox.name + ':').bold(true);
  const checkbox = new Checkbox().label('This is a checkbox');
  const settings = new Text().text('Settings: ');
  const isVisible = new Checkbox().label('Is visible?').isChecked(checkbox.isVisible());
  const isEnabled = new Checkbox().label('Is enabled?').isChecked(checkbox.isEnabled());
  const isChecked = new Checkbox().label('Is checked?').isChecked(checkbox.isChecked());
  const isIndeterminate = new Checkbox()
    .label('Is indeterminate?')
    .isChecked(checkbox.isIndeterminate());
  const isSwitch = new Checkbox().label('Is switch?').isChecked(checkbox.isSwitch());
  const label = new StringInput().placeholder('Label').value(checkbox.label());

  effect(() => {
    checkbox.isVisible(isVisible.isChecked());
    checkbox.isEnabled(isEnabled.isChecked());
    checkbox.isChecked(isChecked.isChecked());
    checkbox.isIndeterminate(isIndeterminate.isChecked());
    checkbox.isSwitch(isSwitch.isChecked());
    checkbox.label(label.value());

    isChecked.isEnabled(!checkbox.isIndeterminate());
  });

  effect(() => {
    // Update the other way around, if you check the main checkbox, then the option `isChecked` should reflect that.
    isChecked.isChecked(checkbox.isChecked());
  });

  const layout = new Flex([
    header,
    checkbox,
    settings,
    isVisible,
    isEnabled,
    isChecked,
    isIndeterminate,
    isSwitch,
    label,
  ])
    .direction('column')
    .gap('4px');
  return layout;
}
