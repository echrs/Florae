import { Text as DefaultText, View as DefaultView, TouchableOpacity as DefaultTouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../constants/Constants';

export type TextProps = DefaultText['props'];
export type ViewProps = DefaultView['props'];
export type TouchableOpacityProps = DefaultTouchableOpacity['props'];

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

export function FormView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const customStyle = {
    paddingHorizontal: 40,
    width: '100%',
  };
  return <DefaultView style={[customStyle, style]} {...otherProps} />;
}

export function CustomButton(props: TouchableOpacityProps) {
  const { style, ...otherProps } = props;
  const customStyle = {
    backgroundColor: '#1D4D47',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 45
  };
  return <DefaultTouchableOpacity style={[customStyle, style]} {...otherProps} />;
}
