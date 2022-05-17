AFRAME.registerComponent( 'dog-manipulator', {
    schema: {},

    init() {
        this.targetPlane = document.querySelector( '[plane]' ).components.plane
        this.el.addEventListener( 'mousedown', this.startDrag.bind( this ) )
    },

    startDrag( event ) {
        this.dragEnable = true
        this.raycaster = new THREE.Raycaster()
        this.camera = document.querySelector( '[camera]' ).components.camera
        this.intersected = null

        document.addEventListener( 'mousemove', this.draging.bind( this ) )
        document.addEventListener( 'mouseup', this.chanelDrag.bind( this ) )
    },

    draging( event ) {
        if( this.dragEnable ) {
            this.raycaster.setFromCamera( {
                x: (event.clientX / document.clientWidth) * 2 - 1,
                y: -(event.clientY / document.clientHeight) * 2 + 1
            }, this.camera.el.object3DMap.camera )

            const intersects = this.raycaster.intersectObjects( this.targetPlane.el.object3DMap.mesh, false )
    
            if( intersects.length ) {
                this.intersected = intersects[0].object
                console.log( this.intersected )
            } else {
                this.intersected = null
            }
        }
    },

    chanelDrag( event ) {
        // this.targetPlane.events.click( event )
    }
} )