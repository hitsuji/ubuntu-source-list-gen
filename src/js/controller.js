

function SourceController( model, node ) {
    $.Controller.call( this, model, node )

    model.on( 'change:branch',  this.generateBranchList )

}



$.ext( SourceController, $.Controller, {

    generateBranchList: function( model, evt, data ) {
        var list = []

        if ( model.get( 'branch.main',       false ) )
            list.push( 'main' )

        if ( model.get( 'branch.restricted', false ) )
            list.push( 'restricted' )

        if ( model.get( 'branch.universe',   false ) )
            list.push( 'universe' )

        if ( model.get( 'branch.multiverse', false ) )
            list.push( 'multiverse' )

        list = list.join( ' ' )
        model.set( 'output.branch', list )

    }

} )
