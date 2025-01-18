import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';
import bwipjs from '@bwip-js/react-native';

const BARCODE_MAP = {
  // EAN/UPC
  'EAN-2': 'ean2',
  'EAN-5': 'ean5', 
  'EAN-8': 'ean8',
  'EAN-13': 'ean13',
  'EAN-14': 'ean14',
  'UPC-A': 'upca',
  'UPC-E': 'upce',
  'SSCC-18': 'sscc18',
  'ISBN': 'isbn',
  'ISMN': 'ismn',
  'ISSN': 'issn',
  'ITF-14': 'itf14',

  // Code 128/39/93
  'Code 128': 'code128',
  'Code 128A': 'code128',
  'Code 128B': 'code128',
  'Code 128C': 'code128',
  'GS1-128': 'gs1-128',
  'Code 93': 'code93',
  'Code 93 Extended': 'code93ext',
  'Code 39': 'code39',
  'Code 39 Extended': 'code39ext',
  
  // 2D Codes
  'QR Code': 'qrcode',
  'Micro QR': 'microqrcode',
  'Data Matrix': 'datamatrix',
  'Data Matrix Rectangular': 'datamatrixrectangular',
  'Aztec': 'azteccode',
  'Compact Aztec': 'azteccodecompact',
  'PDF417': 'pdf417',
  'Micro PDF417': 'micropdf417',
  'MaxiCode': 'maxicode',
  'DotCode': 'dotcode',
  'Han Xin': 'hanxin',
  'Ultracode': 'ultracode',

  // GS1 DataBar
  'GS1 DataBar Omni': 'databaromni',
  'GS1 DataBar Limited': 'databarlimited',
  'GS1 DataBar Expanded': 'databarexpanded',
  'GS1 DataBar Stacked': 'databarstacked',
  
  // Postal Codes
  'USPS Intelligent Mail': 'onecode',
  'USPS POSTNET': 'postnet',
  'USPS PLANET': 'planet',
  'Royal Mail': 'royalmail',
  'Australia Post': 'auspost',
  'Japan Post': 'japanpost',
  'KIX': 'kix',

  // Pharmacode
  'Code 32': 'code32',
  'PZN': 'pzn',
  'Pharmacode': 'pharmacode',
  'Two-track Pharmacode': 'pharmacode2',

  // Industrial
  'Codabar': 'codabar',
  'Code 11': 'code11',
  'Code 2 of 5': 'code2of5',
  'Industrial 2 of 5': 'industrial2of5',
  'Interleaved 2 of 5': 'interleaved2of5',
  'Matrix 2 of 5': 'matrix2of5',
  'MSI Plessey': 'msi',
  'Plessey': 'plessey',
  'Telepen': 'telepen',
  'Telepen Numeric': 'telepennumeric'
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
