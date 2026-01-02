import { Stack, Text, effect, Checkbox, StringInput, UIElement } from "svev-frontend";

export function createCheckboxTest() : UIElement {
  const header = new Text();
  header.text("Test of " + Checkbox.name + ":");
  header.bold(true);

  const checkbox = new Checkbox();
  checkbox.label("This is a checkbox");

  const settings = new Text();
  settings.text("Settings: ");

  const isEnabled = new Checkbox();
  isEnabled.label("Is enabled?");
  isEnabled.isChecked(checkbox.isEnabled());

  const isChecked = new Checkbox();
  isChecked.label("Is checked?");
  isChecked.isChecked(checkbox.isChecked());

  const isIndeterminate = new Checkbox();
  isIndeterminate.label("Is indeterminate?");
  isIndeterminate.isChecked(checkbox.isIndeterminate());

  const isSwitch = new Checkbox();
  isSwitch.label("Is switch?");
  isSwitch.isChecked(checkbox.isSwitch());

  const label = new StringInput();
  label.placeholder("Label");
  label.value(checkbox.label());

  effect(() => {
    checkbox.isEnabled(isEnabled.isChecked());
    checkbox.isChecked(isChecked.isChecked());
    checkbox.isIndeterminate(isIndeterminate.isChecked());
    checkbox.isSwitch(isSwitch.isChecked());
    checkbox.label(label.value());

    isChecked.isEnabled(!checkbox.isIndeterminate());
  });

  const layout = new Stack([
    header,
    checkbox,
    settings,
    isEnabled,
    isChecked,
    isIndeterminate,
    isSwitch,
    label,
  ]);
  layout.direction("column");
  layout.gap("16px");
  return layout;
}
