import { StyleSheet, Text } from 'react-native';
import { BoldText, View } from '../components/CustomStyled';

export default function PlantsScreen() {
  return (
    <View style={styles.container}>
      <BoldText>Plant library</BoldText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
