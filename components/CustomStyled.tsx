import { Text as DefaultText, View as DefaultView, TouchableOpacity as DefaultTouchableOpacity, TextInput as DefaultTextInput } from 'react-native';
import { Colors, Fonts } from '../constants/Constants';
import { SafeAreaView as DefaultSafeAreaView } from 'react-native-safe-area-context';

export type TextProps = DefaultText['props'];
export type ViewProps = DefaultView['props'];
export type TouchableOpacityProps = DefaultTouchableOpacity['props'];
export type TextInputProps = DefaultTextInput['props'];

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

export function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = Colors.text;
  const fontFamily = Fonts.regular;

  return <DefaultText style={[{ color, fontFamily }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const backgroundColor = Colors.background;

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TransparentView(props: ViewProps) {
  const { style, ...otherProps } = props;

  return <DefaultView style={[style]} {...otherProps} />;
}

export function SafeAreaView(props: any) {
  const { style, ...otherProps } = props;
  const backgroundColor = Colors.background;

  return <DefaultSafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function FormView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const customStyle = {
    paddingHorizontal: 40,
    width: '100%',
  };
  return <DefaultView style={[customStyle, style]} {...otherProps} />;
}

export function FieldWrapper(props: ViewProps) {
  const { style, ...otherProps } = props;
  const customStyle = {
    flexDirection: 'row',
    alignItems: 'center',
  };
  return <DefaultView style={[customStyle, style]} {...otherProps} />;
}

export function IconWrapper(props: ViewProps) {
  const { style, ...otherProps } = props;
  const customStyle = {
    position: 'absolute',
    zIndex: 1,
    left: 10,
    paddingTop: 16
  };
  return <DefaultView style={[customStyle, style]} {...otherProps} />;
}

export function SignInUpButton(props: TouchableOpacityProps) {
  const { style, ...otherProps } = props;
  const customStyle = {
    backgroundColor: Colors.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    height: 45,
  };
  return <DefaultTouchableOpacity style={[customStyle, style]} {...otherProps} />;
}

export function CustomButton(props: TouchableOpacityProps) {
  const { style, ...otherProps } = props;
  const customStyle = { flexDirection: 'row', justifyContent: 'space-between',  };
  return (
    <TransparentView pointerEvents='none'>
      <DefaultTouchableOpacity style={[customStyle, style]} {...otherProps} />
    </TransparentView>
  );
}

export function FormInput(props: TextInputProps) {
  const { style, ...otherProps } = props;
  const customStyle = {
    backgroundColor: 'white',
    width: '100%',
    height: 45,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 40,
    marginVertical: 5,
  };
  return <DefaultTextInput style={[customStyle, style]} {...otherProps} />;
}
