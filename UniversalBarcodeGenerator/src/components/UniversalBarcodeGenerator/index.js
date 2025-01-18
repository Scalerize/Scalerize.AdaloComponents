import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import BwipJS from 'bwip-js';
import { Buffer } from 'buffer';

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
  'Codabar': 'codabar',
  'Code39': 'code39',
  'Code 39 Extended': 'code39ext',
  'QR Code': 'qrcode',
  'Data Matrix': 'datamatrix'
};

const UniversalBarcodeGenerator = (props) => {
  const [barcodeUri, setBarcodeUri] = useState(null);

  const bcid = BARCODE_MAP[props.barcodeType] || 'code128';
  let scale = 3;

  useEffect(() => {
    try {
      BwipJS.toBuffer(
        {
          bcid: bcid,
          text: props.barcodeValue || '',
          scale: scale,
          backgroundcolor: props.backgroundColor.replace('#', ''), 
          barcolor: props.foregroundColor.replace('#', ''),
          includetext: !!props.showText,
          textcolor: props.foregroundColor.replace('#', ''),
          padding: props.extraMargin || 4
        },
        (err, png) => {
          if (err) {
            console.error('Barcode generation error:', err);
            setBarcodeUri(null);
          } else {
            // Convert from buffer to base64
            const base64 = Buffer.from(png).toString('base64');
            const uri = `data:image/png;base64,${base64}`;
            setBarcodeUri(uri);
          }
        }
      );
    } catch (error) {
      console.error('Exception in barcode generation:', error);
      setBarcodeUri(null);
    }
  }, [
    bcid,
    props.barcodeValue,
    props.backgroundColor,
    props.foregroundColor,
    props.showText,
    props.extraMargin,
    scale
  ]);

  if (!barcodeUri) {
    return (
      <View style={[styles.container, { backgroundColor: props.backgroundColor }]}>
        <Image
          style={styles.placeholder}
          source={require('./placeholder.png')} 
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: props.backgroundColor }]}>
      <Image
        source={{ uri: barcodeUri }}
        style={styles.barcodeImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  barcodeImage: {
    width: '100%',
    height: '100%'
  },
  placeholder: {
    width: '100%',
    height: '100%',
    tintColor: '#cccccc'
  }
});

export default UniversalBarcodeGenerator;
