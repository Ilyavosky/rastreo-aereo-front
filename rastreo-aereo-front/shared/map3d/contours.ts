import type { WebGLProgramParametersWithUniforms } from "three";

export function addContours(spacing: number) {
  return (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.contourSpacing = { value: spacing };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vElevation;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvElevation = position.y;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vElevation;\nuniform float contourSpacing;")
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float level = vElevation / contourSpacing;
        float distanceToLine = abs(fract(level - 0.5) - 0.5) / max(fwidth(level), 0.0001);
        float line = (1.0 - min(distanceToLine, 1.0)) * step(0.4, level);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.75, 0.82, 0.68), line * 0.45);`,
      );
  };
}
