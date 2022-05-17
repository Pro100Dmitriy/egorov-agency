AFRAME.registerComponent( 'dog', {
    schema: {
        target: { default: '', type: 'selector' }
    },

    init() {
        let data = this.data
        data.target.addEventListener( 'model-loaded', event => {
            this.model = event.detail.model
        } )
    },

    show( x, y ) {
        if( !this.el.getAttribute( 'visible' ) ) {
            this.model.position.y = 0.5
            this.el.setAttribute( 'position', `${x}, 0, ${y}` )
            this.el.setObject3D( 'mesh', this.model )
            this.el.setAttribute( 'visible', true )
            this.el.setAttribute( 'animation-mixer', 'clip: *' )

            console.log( this.model )

            this.x = 1
            this.levitation()
        }
    },

    levitation() {
        this.x += 0.1
        this.model.position.y += Math.sin( this.x ) * 0.01
        requestAnimationFrame( this.levitation.bind( this ) )
    },

    remove() {
        if( this.model ) this.el.removeObject3D( 'mesh' )
    },

    rotationAnimation( event ) {
        if( this.rotationEnable ) {
            let movementY = ( event.clientX - window.innerWidth ) / 100 * event.movementX

            this.model.rotation.y -= movementY * 0.0005
        }
    },

    events: {
        mousedown() {
            this.rotationEnable = true
            document.addEventListener( 'mousemove', event => this.rotationAnimation( event ) )
            document.addEventListener( 'mouseup', this.mouseup )
        },
        mouseup() {
            this.rotationEnable = false
            document.removeEventListener( 'mousemove', event => this.rotationAnimation ) 
        }
    }
} )








/**

AFRAME.registerComponent( 'dog-model', {
    schema: {
        src: { type: 'asset' },
        crossorigin: { default: '' }
    },

    init() {
        this.model = null
    },

    update() {
        const data = this.data
        if( !data.src ) return

        this.remove()
        const loader = new GLTFLoader()
        if( data.crossorigin ) loader.setCrossOrigin( data.crossorigin )
        loader.load( data.src, this.load.bind(this) )
    },

    load( model ) {
        console.log( 'load' )
        this.model = model
        this.el.setObject3D( 'mesh', model )
        this.el.emit( 'model-loaded', { format: 'gltf', model } )
    },

    remove() {
        if( this.model ) this.el.removeObject3D( 'mesh' )
    },
} )


/**
 *         var groupObject3D = document.querySelector('a-entity').object3D;
        console.log(groupObject3D.parent);
        console.log(groupObject3D.children);
        console.log( this.el.components )

              if( !this.el.hasAttribute( 'gltf-model' ) ) {
            this.el.setAttribute( 'position', `${x}, 0, ${z}}` )
            this.el.setAttribute( 'gltf-model', this.data.gltfUrl )
        }
 */