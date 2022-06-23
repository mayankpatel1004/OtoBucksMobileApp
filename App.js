import 'react-native-gesture-handler';

import * as AWS from '@aws-sdk/client-s3';

import { AWS_ACCESS_KEY, AWS_SECRET_KEY, REGION } from '@env';
import { Platform, StyleSheet, Text } from 'react-native'
import { persistor, store } from './src/modules/store';

import AppIn from './src';
import FlashMessage from "react-native-flash-message";
import Loader from './src/components/Loader';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import React from 'react';
import { Typography } from './src/styles';

const styles = StyleSheet.create({
  defaultFontFamily: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
  },
});

const customProps = { style: styles.defaultFontFamily };

function setDefaultFontFamily() {
  const TextRender = Text.render;
  const initialDefaultProps = Text.defaultProps || {};
  initialDefaultProps.allowFontScaling = false;
  Text.defaultProps = {
    ...initialDefaultProps,
    ...customProps,
  };
  Text.render = function render(props) {
    let oldProps = props;
    props = { ...props, style: [customProps.style, props.style] };
    try {
      return TextRender.apply(this, arguments);
    } finally {
      props = oldProps;
    }
  };
}

export const s3Client = new AWS.S3({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

const App = () => {

  if (Platform.OS === 'android') {
    setDefaultFontFamily();
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppIn />
        <Loader />
        <FlashMessage position="top" />
      </PersistGate>
    </Provider>
  );
};

export default App;
