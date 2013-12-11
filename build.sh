#!/bin/bash

clean() {
    rm -rf "debug"
    rm -rf "release"
}

build() {
    OUT=$( [[ "$1" == "release" ]] && echo "release" || echo "debug" )
    SRC="src"

    mkdir  "$OUT"

    buildr "file:$SRC/index.html"     $( [[ ! "$1" == "release" ]] && echo "compress" ) > "$OUT/index.html"
    buildr "file:$SRC/sass/main.sass" $( [[ ! "$1" == "release" ]] && echo "compress" ) > "$OUT/style.css"
    buildr "file:$SRC/js/main.js"     $( [[ ! "$1" == "release" ]] && echo "compress" ) > "$OUT/sources.js"

    mkdir "$OUT/font"
    cp "$SRC/woff/"* "$OUT/font/"

    [[ "$1" == "release" ]] && cp "$SRC/manifest/app.appcache" "$OUT/app.appcache"
}

main() {
    case "$1" in
        "clean")
            clean
            ;;

        "debug")
            clean
            build "debug"
            ;;

        "release")
            clean
            build "release"
            ;;

        "push")
            ;;
    esac
}

for i in ${1+"$@"}; do
    main "$i"
done


