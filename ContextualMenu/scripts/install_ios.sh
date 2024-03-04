#!/bin/bash
set -e
set -x

name=$PROJECT_NAME
podfile="ios/Podfile"
target=$name
infoPlist="ios/$name/Info.plist"
