#ifdef GL_ES
  precision mediump float;
#endif

uniform sampler2D glyphAtlas;
uniform float buffer;
uniform float gamma;

varying vec4 vColor;
varying vec2 vUV;


void main(void) {
  float dist = texture2D(glyphAtlas, vUV).r;
  float alpha = smoothstep(buffer - gamma, buffer + gamma, dist);
  gl_FragColor = vec4(vColor.rgb, alpha * vColor.a);
}