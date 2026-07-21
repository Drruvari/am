export const ImageTransitionVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ImageTransitionFragment = `
  uniform sampler2D u_texture1;
  uniform sampler2D u_texture2;
  uniform float u_progress;

  varying vec2 vUv;

  void main() {
    float eased = smoothstep(0.0, 1.0, u_progress);
    float curvedEdge = 1.0 - vUv.y + sin(vUv.x * 3.14159265) * 0.1;
    float sweep = eased * 1.4 - 0.2;
    float blend = smoothstep(sweep - 0.12, sweep + 0.12, curvedEdge);
    blend = 1.0 - blend;

    float fold = sin(blend * 3.14159265) * 0.075;
    vec2 fromUv = vUv;
    vec2 toUv = vUv;
    fromUv.x += fold * (0.5 - vUv.x) + eased * 0.025;
    fromUv.y -= fold * 0.35;
    toUv.x -= fold * (0.5 - vUv.x) + (1.0 - eased) * 0.025;
    toUv.y += fold * 0.35;
    vec4 fromColor = texture2D(u_texture1, fromUv);
    vec4 toColor = texture2D(u_texture2, toUv);

    float foldLight = fold * 1.8;
    vec3 color = mix(fromColor.rgb, toColor.rgb, blend);
    color += foldLight;

    gl_FragColor = vec4(color, mix(fromColor.a, toColor.a, blend));
  }
`;
