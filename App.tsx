import React, {FC} from 'react';
import {View, StyleSheet} from 'react-native';

import Child from './Child';

const App: FC = () => {
  return (
    <View style={styles.container}>
      <Child number={1}>コンポーネント</Child>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
