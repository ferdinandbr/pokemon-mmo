# Relatório de Conexão dos Mapas de Kanto & Áreas Faltantes

Este documento detalha o mapeamento completo dos arquivos importados de `C:\Users\fer\Desktop\Pokemon-Kanto-Tiled-Maps-main`, a topologia de conexões ativas no PokeMMO e o levantamento de todas as áreas, rotas, cavernas e interiores que faltam em relação ao jogo original (*Pokémon FireRed / LeafGreen* e *Red / Blue*).

---

## 1. Resumo Geral do Mapeamento

- **Total de Mapas Conectados**: 22 mapas externos (apenas conexões de cidades e rotas, sem interiores)
- **Cidades Canônicas Conectadas**: 11 (100% das cidades principais de Kanto)
- **Rotas Conectadas**: 11 rotas (Rotas 1 a 11)
- **Status da Rota 11**: Rascunho visual presente no pacote (apenas camadas de chão/montanha bruta).
- **Formato**: Tiled JSON compatível com Phaser 3 WebGL e repacotamento dinâmico de tileset seguro (GPU safe).

---

## 2. Mapa da Rede de Conexões Ativas (Topologia Canônica)

Todas as cidades e rotas presentes no projeto foram interligadas com portais bidirecionais calculados exatamente nas vias, estradas e aberturas de montanha:

```
                      [Indigo Plateau]
                             ▲
                             │ (Rota 22 / Victory Road)
                             ▼
[Pewter City] ◄===========► [Route 2] ◄===========► [Viridian City]
      ▲                                                    ▲
      │                                                    │ (Rota 1)
      ▼                                                    ▼
  [Route 3]                                          [Pallet Town]
      ▲ (Mt. Moon)                                         ▲
      ▼                                                    │ (Rota 21 Mar)
  [Route 4]                                                ▼
      ▲                                            [Cinnabar Island]
      ▼                                                    ▲
[Cerulean City] ◄═══► [Route 9] ◄═══► [Route 10]           │ (Rota 20/19 Mar)
      ▲                                     ▲              ▼
      │ (Rota 5)                            │ (Rota 10)  [Fuchsia City]
      ▼                                     ▼
[Saffron City] ◄════════════════════► [Lavender Town]
   ▲   ▲   ▲                                ▲
   │   │   └──────────────┐                 │ (Rota 8)
   │   │ (Rota 7)         │ (Rota 8)        │
   │   ▼                  ▼                 │
   │ [Celadon City]       └─────────────────┘
   │
   ▼ (Rota 6)
[Vermilion City] ◄════► [Route 11]
```

### Detalhes das Conexões:
1. **Pallet Town ↔ Rota 1**: Estrada ao norte de Pallet até a entrada sul da Rota 1.
2. **Rota 1 ↔ Viridian City**: Estrada ao norte da Rota 1 até a entrada sul de Viridian City.
3. **Viridian City ↔ Rota 2**: Estrada ao norte de Viridian até o início da Rota 2.
4. **Rota 2 ↔ Pewter City**: Rota 2 (mapa estendido de 2560px) conecta direto à entrada sul de Pewter City.
5. **Pewter City ↔ Rota 3**: Saída leste de Pewter até o início da Rota 3.
6. **Rota 3 ↔ Rota 4 (Monte Lua / Mt. Moon)**: A entrada da caverna ao norte da Rota 3 conecta diretamente à saída de montanha da Rota 4.
7. **Rota 4 ↔ Cerulean City**: Estrada leste da Rota 4 desembocando na entrada oeste de Cerulean City.
8. **Cerulean City ↔ Rota 5**: Saída sul de Cerulean até o início da Rota 5.
9. **Rota 5 ↔ Saffron City**: Saída sul da Rota 5 até o Portão Norte de Saffron City.
10. **Saffron City ↔ Rota 6**: Portão Sul de Saffron até o início da Rota 6.
11. **Rota 6 ↔ Vermilion City**: Estrada sul da Rota 6 até a entrada norte de Vermilion City.
12. **Vermilion City ↔ Rota 11**: Saída leste de Vermilion City até a Rota 11.
13. **Celadon City ↔ Rota 7**: Saída leste de Celadon até a Rota 7.
14. **Rota 7 ↔ Saffron City**: Saída leste da Rota 7 até o Portão Oeste de Saffron City.
15. **Saffron City ↔ Rota 8**: Portão Leste de Saffron City até a Rota 8.
16. **Rota 8 ↔ Lavender Town**: Estrada leste da Rota 8 até a entrada oeste de Lavender Town.
17. **Lavender Town ↔ Rota 10**: Saída norte de Lavender Town até o trecho sul da Rota 10.
18. **Rota 10 ↔ Rota 9**: Abertura rochosa a noroeste da Rota 10 até o início leste da Rota 9.
19. **Rota 9 ↔ Cerulean City**: Estrada oeste da Rota 9 até a entrada leste de Cerulean City.
20. **Pallet Town ↔ Cinnabar Island**: Conexão marítima ao sul de Pallet simulando a **Rota 21**.
21. **Cinnabar Island ↔ Fuchsia City**: Conexão marítima a leste de Cinnabar simulando as **Rotas 20 e 19**.
22. **Viridian City ↔ Indigo Plateau**: Saída oeste de Viridian simulando a **Rota 22 / Victory Road**.

---

## 3. Relatório Detalhado de Áreas que FALTAM

O pacote `Pokemon-Kanto-Tiled-Maps-main` não possui os seguintes mapas em relação ao jogo original:

### 3.1 Rotas Faltantes (14 Rotas)
| Rota | Localização Canônica | Papel / Marcos Notáveis no Jogo Original |
| :--- | :--- | :--- |
| **Rota 12** | Sul de Lavender Town até Rota 13 | *Ponte do Silêncio* (*Silence Bridge*), 1º Snorlax adormecido, Casa do Guru da Pesca (*Super Rod*). |
| **Rota 13** | Entre Rota 12 e Rota 14 | Labirinto de cercas à beira-mar com treinadores. |
| **Rota 14** | Entre Rota 13 e Rota 15 | Trecho costeiro com grama alta e treinadores de pássaros (*Bird Keepers*). |
| **Rota 15** | Entre Rota 14 e Fuchsia City | Caminho arborizado com portão de entrada leste de Fuchsia City. |
| **Rota 16** | Oeste de Celadon City | 2º Snorlax adormecido, entrada secreta da casa do HM02 (*Fly*), portão da Cycling Road. |
| **Rota 17** | Entre Rota 16 e Rota 18 | *Cycling Road* (Pista de Ciclismo em declive com gangues de Bikers e Cue Balls). |
| **Rota 18** | Entre Rota 17 e Fuchsia City | Fim da pista de ciclismo e portão de entrada oeste de Fuchsia City. |
| **Rota 19** | Sul de Fuchsia City | Rota de mar e praia até as Ilhas das Espumas (*Seafoam Islands*). |
| **Rota 20** | Entre Seafoam Islands e Cinnabar | Rota de mar contornando as duas entradas de Seafoam Islands. |
| **Rota 21** | Sul de Pallet Town até Cinnabar | Rota de mar ligando Cinnabar Island de volta à praia de Pallet Town. |
| **Rota 22** | Oeste de Viridian City | Caminho com duas batalhas de Rival até o Portão de Verificação de Insígnias da Liga. |
| **Rota 23** | Entre o Portão de Insígnias e Victory Road | Estrada monumental com os 8 guardas de insígnias que antecedem a caverna da Liga. |
| **Rota 24** | Norte de Cerulean City | *Nugget Bridge* (Ponte da Pepita) com desafio de 5 treinadores + membro Rocket. |
| **Rota 25** | Continuação leste da Rota 24 | Caminho até a Casa do Mar do Bill (*Bill's Sea Cottage*) onde recebe o S.S. Ticket. |

---

### 3.2 Cavernas e Dungeons Faltantes (10 Locais)
| Dungeon / Caverna | Localização | Importância Canônica |
| :--- | :--- | :--- |
| **Viridian Forest** | Entre Viridian e Pewter (Rota 2) | Labirinto clássico de insetos (Caterpie, Weedle, Pikachu). |
| **Mt. Moon (Interiores)** | Entre Rota 3 e Rota 4 | Caverna de múltiplos andares (Fósseis Dome/Helix, Clefairy, Equipe Rocket). |
| **Diglett's Cave** | Liga Rota 11 (Vermilion) à Rota 2 | Túnel subterrâneo dos Diglett e Dugtrio. |
| **Rock Tunnel (Interiores)** | Entre Rota 10 e Lavender | Caverna escura que exige Flash (2 andares). |
| **Pokémon Tower** | Lavender Town | Torre memorial de 7 andares com fantasmas (Gastly, Haunter, Marowak). |
| **Seafoam Islands** | Entre Rota 19 e Rota 20 | Caverna com quebra-cabeças de pedras empurradas e lendário **Articuno**. |
| **Power Plant** | Rio da Rota 10 | Usina abandonada infestada de elétricos e lendário **Zapdos**. |
| **Victory Road** | Rota 23 até Indigo Plateau | Caverna final de 3 andares com quebra-cabeças de pedras e lendário **Moltres**. |
| **Cerulean Cave** | Noroeste de Cerulean City | Dungeon pós-jogo com Pokémon de nível alto e **Mewtwo**. |
| **Safari Zone** | Norte de Fuchsia City | Área aberta de captura especial (Áreas 1, 2, 3 e Casa Secreta com HM03 Surf). |

---

### 3.3 Edifícios e Interiores Faltantes
Embora a pasta `Tilesets/` possua imagens para interiores (`Gyms interior.tsx`, `Poke Centre interior.tsx`, `Mart interior.tsx`, `Department store interior.tsx`, etc.), **nenhum mapa TMX interno veio no pacote** (exceto os interiores de Pallet Town já criados no PokeMMO):
- **8 Ginásios de Kanto** (Pewter, Cerulean, Vermilion, Celadon, Fuchsia, Saffron, Cinnabar, Viridian).
- **Centros Pokémon e Poké Marts** de todas as cidades.
- **Silph Co.** (Prédio de 11 andares da Equipe Rocket em Saffron).
- **Rocket Game Corner / Esconderijo Rocket** (Cassino e 4 subsolos em Celadon).
- **Pokémon Mansion** (Mansão queimada de 4 andares em Cinnabar Island).
- **Museu de Ciências de Pewter**.
- **Loja de Departamentos de Celadon** (5 andares + terraço).
- **Clube dos Fãs de Pokémon** em Vermilion.
- **Casas dos moradores e checkpoints/gatehouses** de todas as rotas e cidades.
- **Navio S.S. Anne** (Cabines, cozinha, convés e sala do capitão).
- **Passagens Subterrâneas** (*Underground Paths*: Rota 5 ↔ Rota 6 e Rota 7 ↔ Rota 8).

---

### 3.4 Regiões Extras
- **Sevii Islands (Ilhas 1 a 7)**: Adicionadas em *FireRed / LeafGreen* (Knot Island, Boon Island, Kin Island, Chrono Island, Floe Island, Chrono Island, Quest Island). Não constam no repositório.

---

## 4. Como Executar a Sincronização de Mapas

Se você adicionar novos mapas `.tmx` no futuro:
1. Registre o mapa em `scripts/sync-tiled-maps.js` dentro do `MAP_REGISTRY`.
2. Execute o comando:
```bash
node scripts/sync-tiled-maps.js --all
```
3. Registre a nova sala e seus portais em:
   - `client/src/maps/roomData.js`
   - `server/src/rooms/roomManager.js`
   - `client/src/scenes/BootScene.js` (para pré-carregamento)
