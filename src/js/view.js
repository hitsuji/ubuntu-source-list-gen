

function SourceView( model, node ) {
    $.View.call( this, model, node )

    this.on( 'change:output',  this.renderList )
}

$.ext( SourceView, $.View, {

    engine: {
        'output.release': function ( $target, evt, data ) {
            $target.find( 'input[value="' + data.value + '"]' )
                        .prop( 'checked', true )
        }
    },

    renderList: function( model, evt, data ) {
        var mirror  = model.get( 'output.mirror',  ''    ),
            release = model.get( 'output.release', ''    ),
            branch  = model.get( 'output.branch',  ''    ),
            source  = model.get( 'output.source',  false ),

            security  = model.get( 'output.security',  false ),
            backports = model.get( 'output.backports', false ),
            updates   = model.get( 'output.updates',   false ),
            proposed  = model.get( 'output.proposed',  false ),

            partner = model.get( 'output.partner', false ),
            extras  = model.get( 'output.extras',  false ),

            html     = [],
            line, text, url,
            deb    = '<span class="deb">deb</span> ',
            debsrc = '<span class="deb">deb-src</span> ',
//##   echo "h_line = '${/src/html/source-line.html}'"

        if ( branch === '' || release === '' ) {
            $( 'pre' ).html(   '' )
            model.set( 'text', '' )
            return
        }

        mirror = mirror === ''
               ? 'http://archive.ubuntu.com/ubuntu'
               : 'http://' + mirror + '.archive.ubuntu.com/ubuntu'


        html.push( '################################################################################' )
        html.push( '####           Ubuntu source.list generated at source.osullivan.cc          ####' )
        html.push( '################################################################################' )
        html.push( '' )

        // primary branches

        line = h_line.replace( '{{mirror}}',  mirror  )
                     .replace( '{{release}}', release )
                     .replace( '{{branch}}',  branch  )

        html.push( deb + line )
        source && html.push( debsrc + line )

        // updates

        if ( updates ) {
            html.push( '' )
            html.push( '## Ubuntu Updates' )

            line = h_line.replace( '{{mirror}}',  mirror               )
                         .replace( '{{release}}', release + '-updates' )
                         .replace( '{{branch}}',  branch               )

            html.push( deb + line )
            source && html.push( debsrc + line )
        }

        // security

        if ( security ) {
            html.push( '' )
            html.push( '## Ubuntu Security Updates')

            line = h_line.replace( '{{mirror}}',  mirror                )
                         .replace( '{{release}}', release + '-security' )
                         .replace( '{{branch}}',  branch                )

            html.push( deb + line )
            source && html.push( debsrc + line )
        }

        // backports

        if ( backports ) {
            html.push( '' )
            html.push( '## Ubuntu Backports' )

            line = h_line.replace( '{{mirror}}',  mirror                 )
                         .replace( '{{release}}', release + '-backports' )
                         .replace( '{{branch}}',  branch                 )

            html.push( deb + line )
            source && html.push( debsrc + line )
        }

        // proposed

        if ( proposed ) {
            html.push( '' )
            html.push( '## Ubuntu Testing' )

            line = h_line.replace( '{{mirror}}',  mirror                )
                         .replace( '{{release}}', release + '-proposed' )
                         .replace( '{{branch}}',  branch                )

            html.push( deb + line )
            source && html.push( debsrc + line )
        }

        // partner

        if ( partner ) {
            html.push( '' )
            html.push( '## Ubuntu Partner')

            line = h_line.replace( '{{mirror}}',  'http://archive.canonical.com/ubuntu' )
                         .replace( '{{release}}', release                               )
                         .replace( '{{branch}}',  'partner'                             )

            html.push( deb + line )
            source && html.push( debsrc + line )
        }

        // extras

        if ( extras ) {
            html.push( '' )
            html.push( '## Ubuntu Extras')

            line = h_line.replace( '{{mirror}}',  'http://extras.ubuntu.com/ubuntu' )
                         .replace( '{{release}}', release                           )
                         .replace( '{{branch}}',  'main'                            )

            html.push( deb + line )
            source && html.push( debsrc + line )
        }

        html.push( '' )

        html = html.join( '\n' )

        $( 'pre' ).html( html )

        text = $( '#output pre' ).text()
        text = new Blob( [ text ], { type: 'text/plain' } )
        url  = URL.createObjectURL( text )

        $( '#download a' ).attr( 'href', url )
    }

} )
