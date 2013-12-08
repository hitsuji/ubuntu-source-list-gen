#!/bin/bash

DEBUG=true

OUT=$( [ $DEBUG ] && echo "debug" || echo "release" )
SRC="src"

rm -rf "$OUT"
mkdir  "$OUT"

buildr "$SRC/index.html"     > "$OUT/index.html"
buildr "$SRC/sass/main.sass" > "$OUT/style.css"
buildr "$SRC/js/main.js"     > "$OUT/sources.js"
