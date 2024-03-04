#!/bin/bash
set -e
set -x

rootGradleFile="android/build.gradle"
appGradleFile="android/app/build.gradle"
nl=$'\n'
androidManifestFile="android/app/src/main/AndroidManifest.xml"


# Function to update append gradle font
append_gradleFont() {
    sed -i -e "$aapply from: file(\"../../node_modules/react-native-vector-icons/fonts.gradle\")" "$appGradleFile"
}


append_gradleFont

echo "gradle apply updated in $appGradleFile" 
