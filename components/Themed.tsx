import { Text as DefaultText, View as DefaultView } from 'react-native';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

export type TextProps = DefaultText['props'];
export type ViewProps = DefaultView['props'];

export function BoldText(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = Colors.text;
  const fontFamily = Fonts.bold;

  return <DefaultText style={[{ color, fontFamily }, style]} {...otherProps} />;
}

export function SemiBoldText(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = Colors.text;
  const fontFamily = Fonts.semibold;

  return <DefaultText style={[{ color, fontFamily }, style]} {...otherProps} />;
}

export function LightText(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = Colors.text;
  const fontFamily = Fonts.light;

  return <DefaultText style={[{ color, fontFamily }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = Colors.background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
