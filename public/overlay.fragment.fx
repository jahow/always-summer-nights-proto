#ifdef GL_ES
  precision mediump float;
#endif

uniform sampler2D blurRender;

varying vec4 vColor;
varying vec2 vScreenUV;

void main(void) {
	gl_FragColor = vColor * texture2D(blurRender, vScreenUV);
}