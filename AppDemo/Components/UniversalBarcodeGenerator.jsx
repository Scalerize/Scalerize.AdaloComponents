import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import bwipjs from '@bwip-js/react-native';

const BARCODE_MAP = {
  'EAN-8': 'ean8',
  'EAN-13': 'ean13',
  'UPC-A': 'upca',
  'UPC-E': 'upce',
  'Code 128': 'code128',
  'Code 128A': 'code128',
  'Code 128B': 'code128',
  'Code 128C': 'code128',
  'Code 93': 'code93',
  'Code 32': 'code32',
  Codabar: 'codabar',
  Code39: 'code39',
  'Code 39 Extended': 'code39ext',
  ISBN: 'isbn',
  'QR Code': 'qrcode',
  'Data Matrix': 'datamatrix',
};

const UniversalBarcodeGenerator = props => {
  const [barcode, setBarcode] = useState(null);

  const bcid = BARCODE_MAP[props.barcodeType] || 'code128';
  useEffect(() => {
    try {
      bwipjs
        .toDataURL({
          bcid: bcid,
          text: props.barcodeValue || '',
          scale: 1,
          backgroundcolor: (props.backgroundColor || '#FFFFFF').replace(
            '#',
            '',
          ),
          barcolor: (props.foregroundColor || '#000000').replace('#', ''),
          includetext: !!props.showText,
          textcolor: (props.foregroundColor || '#000000').replace('#', ''),
          includetext: false,
          guardwhitespace: true,
          height: props.height || 100,
          width: props.width || 100,
        })
        .then(barcode => {
          setBarcode(barcode);
        });
    } catch (error) {
      console.error('Exception in barcode generation:', error);
      setBarcode(null);
    }
  }, [
    bcid,
    props.barcodeValue,
    props.backgroundColor,
    props.foregroundColor,
    props.showText,
    props.extraMargin,
    props.height,
    props.width,
  ]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.backgroundColor,
          width: props.width,
          height: props.height,
        },
      ]}>
      {barcode && (
        <Image
          source={{uri: barcode.uri}}
          style={[styles.barcodeImage]}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  barcodeImage: {
    width: '100%',
    height: '100%',
  }
});

export default UniversalBarcodeGenerator;
