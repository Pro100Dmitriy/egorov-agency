AFRAME.registerComponent( 'play-on-click', {
    init() {
      this.onClick = this.onClick.bind( this )
    },

    play() {
      window.addEventListener( 'click', this.onClick )
    },

    pause() {
      window.removeEventListener( 'click', this.onClick )
    },

    onClick() {
      var videoEl = this.el.getAttribute( 'material' ).src
      if( !videoEl ) return
      this.el.object3D.visible = true
      videoEl.play()
    }
} );