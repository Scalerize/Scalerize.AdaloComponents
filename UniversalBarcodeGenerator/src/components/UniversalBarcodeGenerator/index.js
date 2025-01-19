import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import bwipjs from "@bwip-js/react-native";

const BARCODE_MAP = {
  // EAN/UPC
  "EAN-2": "ean2",
  "EAN-5": "ean5",
  "EAN-8": "ean8",
  "EAN-13": "ean13",
  "EAN-14": "ean14",
  "UPC-A": "upca",
  "UPC-E": "upce",
  "SSCC-18": "sscc18",
  ISBN: "isbn",
  ISMN: "ismn",
  ISSN: "issn",
  "ITF-14": "itf14",

  // Code 128/39/93
  "Code 128": "code128",
  "Code 128A": "code128",
  "Code 128B": "code128",
  "Code 128C": "code128",
  "GS1-128": "gs1-128",
  "Code 93": "code93",
  "Code 93 Extended": "code93ext",
  "Code 39": "code39",
  "Code 39 Extended": "code39ext",

  // 2D Codes
  "QR Code": "qrcode",
  "Micro QR": "microqrcode",
  "Data Matrix": "datamatrix",
  "Data Matrix Rectangular": "datamatrixrectangular",
  Aztec: "azteccode",
  "Compact Aztec": "azteccodecompact",
  PDF417: "pdf417",
  "Micro PDF417": "micropdf417",
  MaxiCode: "maxicode",
  DotCode: "dotcode",
  "Han Xin": "hanxin",
  Ultracode: "ultracode",

  // GS1 DataBar
  "GS1 DataBar Omni": "databaromni",
  "GS1 DataBar Limited": "databarlimited",
  "GS1 DataBar Expanded": "databarexpanded",
  "GS1 DataBar Stacked": "databarstacked",

  // Postal Codes
  "USPS Intelligent Mail": "onecode",
  "USPS POSTNET": "postnet",
  "USPS PLANET": "planet",
  "Royal Mail": "royalmail",
  "Australia Post": "auspost",
  "Japan Post": "japanpost",
  KIX: "kix",

  // Pharmacode
  "Code 32": "code32",
  PZN: "pzn",
  Pharmacode: "pharmacode",
  "Two-track Pharmacode": "pharmacode2",

  // Industrial
  Codabar: "codabar",
  "Code 11": "code11",
  "Code 2 of 5": "code2of5",
  "Industrial 2 of 5": "industrial2of5",
  "Interleaved 2 of 5": "interleaved2of5",
  "Matrix 2 of 5": "matrix2of5",
  "MSI Plessey": "msi",
  Plessey: "plessey",
  Telepen: "telepen",
  "Telepen Numeric": "telepennumeric",
};

const UniversalBarcodeGenerator = (props) => {
  const [barcode, setBarcode] = useState(null);

  const bcid = BARCODE_MAP[props.barcodeType] || "code128";

  const getDefaultBarcodeValue = (bcid) => {
    switch (bcid) {
      case "ean2":
        return "12";
      case "ean5":
        return "12345";
      case "ean8":
        return "1234567";
      case "ean13":
        return "123456789012";
      case "ean14":
        return "1234567890123";
      case "upca":
        return "12345678901";
      case "upce":
        return "1234567";
      case "sscc18":
        return "123456789012345678";
      case "isbn":
        return "9781234567890";
      case "ismn":
        return "9791234567890";
      case "issn":
        return "9771234567890";
      case "itf14":
        return "1234567890123";
      case "code128":
        return "123456789012";
      case "gs1-128":
        return "(01)12345678901234";
      case "code93":
        return "123456789012";
      case "code93ext":
        return "123456789012";
      case "code39":
        return "123456789012";
      case "code39ext":
        return "123456789012";
      case "qrcode":
        return "Hello World";
      case "microqrcode":
        return "Hello World";
      case "datamatrix":
        return "Hello World";
      case "datamatrixrectangular":
        return "Hello World";
      case "azteccode":
        return "Hello World";
      case "azteccodecompact":
        return "Hello World";
      case "pdf417":
        return "Hello World";
      case "micropdf417":
        return "Hello World";
      case "maxicode":
        return "Hello World";
      case "dotcode":
        return "Hello World";
      case "hanxin":
        return "Hello World";
      case "ultracode":
        return "Hello World";
      case "databaromni":
        return "123456789012345678";
      case "databarlimited":
        return "123456789012345678";
      case "databarexpanded":
        return "123456789012345678";
      case "databarstacked":
        return "123456789012345678";
      case "onecode":
        return "012345678912345678";
      case "postnet":
        return "0123456789";
      case "planet":
        return "0123456789";
      case "royalmail":
        return "AB123456789GB";
      case "auspost":
        return "12345678901234567890";
      case "japanpost":
        return "12345678901234567890";
      case "kix":
        return "KIX12345678901234567890";
      case "code32":
        return "12345678901234567890";
      case "pzn":
        return "1234567";
      case "pharmacode":
        return "123456";
      case "pharmacode2":
        return "123456";
      case "codabar":
        return "A1234567890A";
      case "code11":
        return "12345678901";
      case "code2of5":
        return "1234567890";
      case "industrial2of5":
        return "1234567890";
      case "interleaved2of5":
        return "1234567890";
      case "matrix2of5":
        return "1234567890";
      case "msi":
        return "1234567890";
      case "plessey":
        return "1234567890";
      case "telepen":
        return "1234567890";
      case "telepennumeric":
        return "1234567890";
      default:
        return "123456789012";
    }
  };

  useEffect(() => {
    bwipjs
      .toDataURL({
        bcid: bcid,
        text: !props.editor ? props.barcodeValue : getDefaultBarcodeValue(bcid),
        scale: 3,
        backgroundcolor: (props.backgroundColor || "#FFFFFF").replace("#", ""),
        barcolor: (props.foregroundColor || "#000000").replace("#", ""),
        includetext: !!props.showText,
        textcolor: (props.foregroundColor || "#000000").replace("#", ""),
        includetext: !bcid.includes("qrcode"),
        guardwhitespace: true,
      })
      .then((barcode) => {
        setBarcode(barcode);
      })
      .catch((error) => {
        console.error("Error in barcode generation:", error);
        setBarcode(null);
      });
  }, [bcid, props.barcodeValue, props.backgroundColor, props.foregroundColor]);

  console.log(props);
  return (
    <View
      style={{
        backgroundColor: props.backgroundColor,
        width: props._width,
        height: props._height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {barcode ? (
        <Image
          source={{ uri: barcode.uri }}
          style={{
            resizeMode: "contain",
            width: props._width,
            height: props._height,
          }}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>Invalid barcode</Text>
      )}
    </View>
  );
};

export default UniversalBarcodeGenerator;
