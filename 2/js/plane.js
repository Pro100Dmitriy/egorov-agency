AFRAME.registerComponent( 'plane', {
    events: {
        click( event ) {
            const dog = document.querySelector( '[dog]' ).components.dog
            const { x, z } = event.detail.intersection.point
            dog.show( x, z )
        }
    }
} )