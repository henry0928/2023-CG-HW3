#version 330 core
layout(location = 0) out vec4 FragColor;

in VS_OUT {
  vec3 position;
  vec3 normal;
  flat vec3 viewPosition;
} fs_in;

uniform samplerCube skybox;

uniform float fresnelBias;
uniform float fresnelScale;
uniform float fresnelPower;

void main() {
  // Refractive index of R, G, and B respectively
  vec3 Eta = vec3(1/ 1.39, 1 / 1.44, 1 / 1.47);
  vec3 N = normalize(fs_in.normal) ; 

  // reflection
  vec3 I = normalize(fs_in.position - fs_in.viewPosition);
  vec3 R = reflect(I, N);
  vec4 reflect_color = vec4(texture(skybox, R).rgb, 1.0) ;

  // refraction
  vec3 refract_color_r = refract(I, normalize(fs_in.normal), Eta[0]);
  vec3 refract_color_g = refract(I, normalize(fs_in.normal), Eta[1]);
  vec3 refract_color_b = refract(I, normalize(fs_in.normal), Eta[2]);
  vec4 refractedColor;

  refractedColor.r = texture(skybox, refract_color_r).r;

  refractedColor.g = texture(skybox, refract_color_g).g;

  refractedColor.b = texture(skybox, refract_color_b).b;

  refractedColor.a = 1;

  // reflectionFactor 
  float reflectionFactor = clamp(fresnelBias + fresnelScale * pow(1 + dot(I, N), fresnelPower), 0.0, 1.0);
  // float temp_reflectionFactor = fresnelBias + fresnelScale * pow(1 + dot(I, N), fresnelPower);
  // float reflectionFactor = max(0, min(1, temp_reflectionFactor)) ;

  // Total color
  // FragColor = mix(reflect_color, refractedColor, reflectionFactor) ;
  FragColor = mix(refractedColor, reflect_color, reflectionFactor) ;
  // TODO2: fresnel reflection and refraction
  // Hint:
  //   1. You should query the texture for R, G, and B values respectively to create dispersion effect.
  //   2. You should use those uniform variables in the equation(1).
  // Note:
  //   1. The link 1 is not GLSL you just check the concept.
  //   2. We use the empirical approach of fresnel equation below.
  //      clamp(fresnelBias + fresnelScale * pow(1 + dot(I, N), fresnelPower), 0.0, 1.0); (1)
  // Reference:
  //   1. Overview: https://developer.download.nvidia.com/CgTutorial/cg_tutorial_chapter07.html
  //   2. Refract : https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/refract.xhtml
  //   3. Reflect : https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/reflect.xhtml
  //   3. Clamp   : https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/clamp.xhtml
  //   3. Mix     : https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mix.xhtml

  // FragColor = vec4(0);
}
