import Phaser from 'phaser';

const FRAG_SHADER = `
#define SHADER_NAME DAY_NIGHT_POST_FX
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uLightPos;      // (x, y) normalizado 0..1 no espaço de tela WebGL
uniform float uLightRadius;  // raio normalizado do halo de luz
uniform float uAspect;       // proporção largura/altura para manter o círculo perfeito
uniform float uNightDark;    // 0.0 (dia claro) até ~0.94 (noite escura)
uniform vec3 uAmbientColor;  // tonalidade das áreas não iluminadas (preto-azul ou laranja)
uniform vec3 uLightTint;     // tonalidade quente de tocha/lanterna na área iluminada
uniform float uFlicker;      // oscilação orgânica suave da chama/luz

varying vec2 outTexCoord;

void main ()
{
    vec4 sceneColor = texture2D(uMainSampler, outTexCoord);

    // Se estiver em dia pleno, passa a cor original intacta
    if (uNightDark <= 0.001) {
        gl_FragColor = sceneColor;
        return;
    }

    // Distância corrigida por aspecto para que o círculo de luz seja perfeitamente redondo
    vec2 diff = outTexCoord - uLightPos;
    diff.x *= uAspect;
    float dist = length(diff);

    // Raio com leve oscilação de chama
    float radius = uLightRadius * (1.0 + uFlicker);

    // Atenuação suave em curva cúbica (Hermite smoothstep) para transição orgânica idêntica a jogos 2D
    float att = clamp(1.0 - (dist / radius), 0.0, 1.0);
    float lightIntensity = att * att * (3.0 - 2.0 * att);

    // Ambiente noturno: escuridão profunda preto-azulada (ou laranja no entardecer)
    vec3 ambient = sceneColor.rgb * uAmbientColor;

    // Área iluminada: luz quente dourada que preserva e valoriza as cores dos pixels
    vec3 torchlight = sceneColor.rgb * uLightTint;

    // Transição da área escura para o centro aquecido da tocha/lanterna
    vec3 nightScene = mix(ambient, torchlight, lightIntensity);

    // Interpolação final entre dia pleno e o cenário noturno com base no horário
    vec3 finalRgb = mix(sceneColor.rgb, nightScene, uNightDark);

    gl_FragColor = vec4(finalRgb, sceneColor.a);
}
`;

export default class DayNightPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game) {
    super({
      game,
      name: 'DayNightPipeline',
      fragShader: FRAG_SHADER
    });

    this.lightX = 0.5;
    this.lightY = 0.5;
    this.lightRadius = 0.36;
    this.aspect = 16.0 / 9.0;
    this.nightDark = 0.0;
    this.ambientColor = [0.32, 0.38, 0.65];
    this.lightTint = [1.15, 1.08, 0.95]; // Iluminação tocha acolhedora
    this.flicker = 0.0;
  }

  onDraw(renderTarget) {
    this.set2f('uLightPos', this.lightX, this.lightY);
    this.set1f('uLightRadius', this.lightRadius);
    this.set1f('uAspect', this.aspect);
    this.set1f('uNightDark', this.nightDark);
    this.set3f('uAmbientColor', this.ambientColor[0], this.ambientColor[1], this.ambientColor[2]);
    this.set3f('uLightTint', this.lightTint[0], this.lightTint[1], this.lightTint[2]);
    this.set1f('uFlicker', this.flicker);

    this.bindAndDraw(renderTarget);
  }
}
