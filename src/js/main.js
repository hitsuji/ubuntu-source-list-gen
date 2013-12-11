/*##

begin_scope "window", "undefined"
use_strict

include "/lib/js/jquery/jquery-2.0.3.min.js"
include "/lib/js/jqmvc/jqmvc.0.0.1.js"

*/
    var countries,
        releases,
        branches,
        updates,
        others,

        defaults,

        model,
        view,
        controller,
        $ = window.$,

        URL = window.URL || window.webkitURL,

        lastMirrorValue = ''

    // no need to expose any of the framework globally

    delete window.$
    delete window.jQuery


/*##

include "data/countries.json"
include "data/releases.json"
include "data/branches.json"
include "data/updates.json"
include "data/others.json"

include "data/defaults.json"

include "view.js"
include "controller.js"

*/


$( document ).ready( function () {

    if ( !URL )
        $( '#download' ).remove()

    // To disable auto completion on FF we need to use a form. In order to
    // prevent the page from reloading on a submit event we need this
    $( 'form' ).on( 'submit', function ( e ) { e.preventDefault() } )

    var $node = $( '#source-gen' ),
        i, item, ul, li,
    //## echo "relstr = '${/src/html/release-line.html}',"
    //## echo "brastr = '${/src/html/branch-line.html}',"
    //## echo "updstr = '${/src/html/updates-line.html}',"
    //## echo "othstr = '${/src/html/others-line.html}'"

    ul = $node.find( '#release ul' )

    for ( i = 0; item = releases[i++]; ) {

        li = relstr.replace( /\{\{title\}\}/g, item.title )
                   .replace( /\{\{code\}\}/g,  item.code  )
                   .toNode()

        ul.append( li )
    }

    ul = $node.find( '#branch ul' )

    for ( i = 0; item = branches[i++]; ) {

        li = brastr.replace( /\{\{name\}\}/g,  item.name  )
                   .replace( /\{\{title\}\}/g, item.title )
                   .replace( /\{\{tip\}\}/g,   item.tip   )
                   .toNode()

        ul.append( li )
    }

    ul = $node.find( '#updates ul' )

    for ( i = 0; item = updates[i++]; ) {

        li = updstr.replace( /\{\{name\}\}/g,  item.name  )
                   .replace( /\{\{title\}\}/g, item.title )
                   .replace( /\{\{tip\}\}/g,   item.tip   )
                   .toNode()

        ul.append( li )
    }

    ul = $node.find( '#others ul' )

    for ( i = 0; item = others[i++]; ) {

        li = othstr.replace( /\{\{name\}\}/g,  item.name  )
                   .replace( /\{\{title\}\}/g, item.title )
                   .replace( /\{\{tip\}\}/g,   item.tip   )
                   .toNode()

        ul.append( li )
    }

    model      = new $.Model()
    view       = new SourceView(       model, $node )
    controller = new SourceController( model, $node )


    controller.loadState( defaults )
    view.on( 'change', view.saveState )


    $node.find( '#mirror .search input' )
            .on( 'keyup',   onMirrorKeyUp   )
            .on( 'keydown', onMirrorKeyDown )
            .on( 'blur',    onMirrorBlur    )

    $node.find( 'label' )
            .focusin(  function ( e ) { $(this).addClass(    'focus' ) } )
            .focusout( function ( e ) { $(this).removeClass( 'focus' ) } )

    // TODO: set default by localstorage/json
    $node.find( '#release li' ).first().trigger( 'click' ) // set fist item as default
} )




    // NOTE: jQuery is too slow here
function onMirrorKeyUp ( e ) {
    var pattern = this.value.toLowerCase(),
        code    = e.which,
        i       = 0,
        list, item, ul, li, c


    // we're only interested in inacting on this if the value changed
    if ( this.value == lastMirrorValue )
        return

    lastMirrorValue = this.value



    if ( pattern.length === 0 ) {
        $( '#country-list' ).empty()
        model.set( 'output.mirror', '' )
        return
    }



    list = countries.filter( function ( e, i, a ) {
        return e[0].fuzzy( pattern ) || e[1].fuzzy( pattern )
    } )

    // prioritise by Mirror codes if there's 2 chars an it matches the pattern
    list.sort( function ( a, b ) {

        // if the Mirror code is a match

        if ( pattern.length == 2 ) {

            if ( a[1] === pattern )
                return -1

            if ( b[1] === pattern )
                return 1
        }

        // if the Mirror starts with the pattern

        if ( ! a[0].toLowerCase().indexOf( pattern ) )
            return -1

        if ( ! b[0].toLowerCase().indexOf( pattern ) )
            return 1


        return 0
    } )


    ul = document.createElement( 'ul' )
    ul.setAttribute( 'id', 'country-list' )

    // we only want to show the top 10 results
    for (; ( item = list[i] ) && i < 10; i++ ) {
        li = document.createElement( 'li' )

        li.setAttribute( 'data-country', item[0] )
        li.setAttribute( 'data-code',    item[1] )
        li.className = 'item'

        li.addEventListener( 'mouseover', onMirrorHover )

        ul.appendChild( li )
    }

    li = ul.firstElementChild
    if ( !li )
        model.set( 'output.mirror', '' )

    else {
        li.className = 'item selected'
        model.set( 'output.mirror', li.getAttribute( 'data-code' ) )
    }



    // let the user know that there were more than 10 results
    if ( list.length > 10 ) {
        c = list.length - i
        li = document.createElement( 'li' )
        li.textContent = ' ... plus ' + c + ' more results ... '

        ul.appendChild( li )
    }

    $( '#country-list' ).replaceWith( ul )
}


function onMirrorKeyDown ( e ) {
    var code = e.which

    // 38 = up arrow, 40 = down arrow, 13 = return, 27 = esc
    if ( code !== 38 && code !== 40 && code !== 13 && code !== 27 )
        return

    e.preventDefault()

    var ul  = $( '#country-list'   ),
        sel = ul.find( '.selected' ),
        i

    if ( sel.length === 0 )
        return

    switch ( code ) {

        case 13:
        case 27:
            onMirrorBlur.call( this, e )
            break

        case 38:
            i = sel.prev( '.item' )

            if ( i.length === 0 )
                return

            sel.removeClass( 'selected' )
            i.addClass(      'selected' )
            model.set( 'output.mirror', i.data( 'code' ) )
            break

        case 40:
            i = sel.next( '.item' )

            if ( i.length === 0 )
                return

            sel.removeClass( 'selected' )
            i.addClass(      'selected' )
            model.set( 'output.mirror', i.data( 'code' ) )
            break

    }
}

function onMirrorBlur( e ) {
    var ul  = $( '#country-list' )

    ul.empty()
}

function onMirrorHover( e ) {
    var $t = $(e.target)
    $t.addClass('selected')
      .siblings()
        .removeClass('selected')

    model.set('output.mirror', $t.data('code'))
}

//## end_scope "window"

