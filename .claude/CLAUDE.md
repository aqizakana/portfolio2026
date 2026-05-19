# CLAUDE.md — Portfolio 2025 "Web City"

---

## 0. このドキュメントの目的

このファイルはClaude Codeへの開発指示書である。
実装判断に迷ったらここに戻ること。

---

## 1. コンセプト（実装に必要な分だけ）

ポートフォリオを「作品一覧」ではなく「作品が存在する都市」として構築する。

### メタファー対応表

| 現実の概念 | 都市での表現 | 実装での意味 |
|---|---|---|
| 作品 | 建物 | 3Dオブジェクト（MDXから生成） |
| 感情 | 色 | shaderのhue |
| 重要度 | 光 | emissionStrength / bloom |
| 新しさ | 動きの速度 | animationSpeed |
| 実験性 | 歪み | distortion量 |
| 関連性 | 建物間の距離 | クラスタリング配置 |
| 時間帯 | 都市の空気 | 昼夜サイクル（uniform `time`） |

**実装ルール: このメタファーに該当しない装飾的表現は追加しない。**

---

## 2. 技術スタック

```
TanStack Start (フルスタックフレームワーク)
TanStack Router (ファイルベースルーティング)
Vite (ビルドツール)
Three.js + EffectComposer
MDX（作品データソース）
TypeScript
```

### Vite設定メモ

- GLSLファイルのimportには `vite-plugin-glsl` を使用
- MDXには `@mdx-js/rollup` を使用
- Three.jsはtree-shakingが効くようnamed importを徹底

### 禁止事項

- R3F（React Three Fiber）は使わない。素のThree.jsで書く
- 外部UIライブラリ（MUI, Chakra等）は使わない
- GLSLは直接書く。TSL変換は行わない
- Next.js由来のAPI（`next/image`, `next/link`等）は使わない

---

## 3. データフロー

```
MDX frontmatter → Viteビルド時にパース → loader経由で取得 → 3D空間に配置 → shader uniform反映
```

### データ取得パターン

- **作品一覧**: route loaderでビルド時にMDX frontmatterを全件取得
- **作品詳細**: `$slug` パラメータからMDXコンテンツを動的import

### MDX frontmatter 仕様

```yaml
title: string          # 作品名
slug: string           # URLパス
emotion: "positive" | "neutral" | "negative"
importance: 0.0 ~ 1.0  # bloom強度に直結
recency: 0.0 ~ 1.0     # 1.0が最新
experimental: 0.0 ~ 1.0 # distortion量に直結
tags: string[]          # クラスタリングに使用
thumbnail: string       # テクスチャパス
```

### uniform設計

```glsl
uniform float uTime;         // 昼夜サイクル [0, 1]
uniform float uEmotion;      // -1(negative) ~ 0(neutral) ~ 1(positive)
uniform float uImportance;   // 0 ~ 1
uniform float uRecency;      // 0 ~ 1
uniform float uDistortion;   // 0 ~ 1
uniform float uHover;        // 0 ~ 1（lerp補間）
```

---

## 4. シェーダールール

すべての視覚変化は意味を持つ。装飾目的のエフェクトは禁止。

### 4.1 色（emotion → hue）

```
positive (+1) → 青系 (hue ≈ 0.6)
neutral  ( 0) → グレー (saturation → 0)
negative (-1) → 赤系 (hue ≈ 0.0)
```

### 4.2 発光（importance → emission）

```
emissionStrength = uImportance * (nightFactor + 0.2)
```

重要度が低い作品は自発光しない。

### 4.3 動き（recency → animation speed）

```
speed = mix(0.1, 1.0, uRecency)
```

古い作品はほぼ静止。新しい作品は動く。

### 4.4 歪み（experimental → distortion）

```
distortion = uDistortion * 0.3  // 最大30%に制限
```

### 4.5 ホバー（uHover）

```
hover時: emission += 0.3, scale *= 1.05
lerpで0.15秒かけて遷移
```

---

## 5. 昼夜サイクル

`uTime ∈ [0, 1]` で1サイクル。ユーザーのスクロールまたは実時間に連動。

| uTime | 時間帯 | 空の表現 | 建物の表現 |
|---|---|---|---|
| 0.00 | 深夜 | 暗い、星 | emission主体、窓ランダム点灯 |
| 0.25 | 朝 | グラデーション遷移 | 質感が見え始める |
| 0.50 | 昼 | 高コントラスト | テクスチャ・形状が最も鮮明 |
| 0.75 | 夕方 | 暖色グラデーション | bloom強調、感情的 |

### 窓の点灯ロジック

```
夜間 (uTime < 0.2 || uTime > 0.8):
  各窓に乱数シードでON/OFF → 「活動している都市」の表現
```

---

## 6. ポストプロセス

Three.js 組み込みの EffectComposer（`three/addons/postprocessing/`）を使用する。
pmndrs/postprocessing ライブラリは使わない。

使用するパスは **RenderPass → UnrealBloomPass → BokehPass → カスタム FogPass → OutputPass** の5つ。
この順序は固定。追加のパスは禁止。

### 6.0 セットアップ — import と初期化

```ts
// PostProcess.ts
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
```

**IMPORTANT: パスの追加順序**

```ts
const composer = new EffectComposer(renderer);
composer.setPixelRatio(renderer.getPixelRatio());  // HiDPI対応 — 忘れるとぼやける
composer.setSize(width, height);

// 1. RenderPass — 必ず最初。シーンの素の描画結果を次のパスに渡す
composer.addPass(new RenderPass(scene, camera));

// 2. UnrealBloomPass — 重要な建物を光らせる
composer.addPass(bloomPass);

// 3. BokehPass — 被写界深度
composer.addPass(bokehPass);

// 4. カスタム FogPass — ShaderPassで実装
composer.addPass(fogPass);

// 5. OutputPass — 必ず最後。sRGB変換 + トーンマッピングを担当
composer.addPass(new OutputPass());
```

**OutputPass は必ずチェインの最後に置くこと。**
これがないと色空間がリニアのまま出力され、画面が白飛びする。

### 6.1 Bloom — UnrealBloomPass（注目）

```ts
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(width, height),  // resolution
  0.8,   // strength（初期値。夜間は動的に変更）
  0.4,   // radius [0, 1]
  0.85   // threshold — これ以上の輝度のピクセルだけ光る
);
composer.addPass(bloomPass);
```

**意味との対応:**
- 建物の ShaderMaterial で `emissive` を設定し、`uImportance > 0.6` の建物だけ threshold を超える輝度にする
- importance ≤ 0.6 の建物は emissive を低く保ち、Bloom の対象外にする
- 夜間（uTime < 0.2 || uTime > 0.8）は `bloomPass.strength` を 1.2 に動的変更

```ts
// アニメーションループ内
bloomPass.strength = isNight(uTime) ? 1.2 : 0.8;
```

**パラメータ調整の目安:**
- strength を上げすぎると画面全体が白く飛ぶ → 最大 1.5 を上限とする
- threshold を下げすぎると全オブジェクトが光る → 0.7 未満にしない
- radius を上げると光が広がる → 0.5 を超えるとぼんやりしすぎる

### 6.2 DOF — BokehPass（意識）

```ts
const bokehPass = new BokehPass(scene, camera, {
  focus: 50.0,      // 焦点距離（カメラからの距離）
  aperture: 0.002,  // 絞り（小さいほどボケが少ない）
  maxblur: 0.01     // 最大ブラー量
});
composer.addPass(bokehPass);
```

**意味との対応:**
- focus をカメラが向いている建物までの距離に動的更新 → 「見ているものだけ鮮明」
- Raycaster でホバー中の建物を検出し、その距離を focus に反映

```ts
// アニメーションループ内
if (hoveredBuilding) {
  const dist = camera.position.distanceTo(hoveredBuilding.position);
  bokehPass.uniforms['focus'].value = dist;
}
```

**パラメータ調整の目安:**
- aperture が大きすぎるとすべてがボケる → 0.005 を上限とする
- maxblur が大きすぎると描画が崩れる → 0.02 を上限とする
- focus をフレームごとに急変させるとちらつく → lerp で 0.1 秒かけて遷移

### 6.3 Fog — カスタム ShaderPass（記憶 / 忘却）

Three.js の `Scene.fog` ではなく、ShaderPass で実装する。
理由: Bloom 適用後の画像に対して Fog をかけたいため（Scene.fog だと Bloom 前に適用されてしまう）。

```ts
const fogShader = {
  uniforms: {
    tDiffuse: { value: null },       // 前のパスの出力（自動注入）
    tDepth: { value: depthTexture },  // 深度テクスチャ
    uFogColor: { value: new THREE.Color(0x0a0a1a) },
    uFogNear: { value: 10.0 },
    uFogFar: { value: 100.0 },
    uTime: { value: 0.0 }
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float depth = texture2D(tDepth, vUv).r;
      float fogFactor = smoothstep(uFogNear, uFogFar, depth);

      // 昼→白系 / 夜→暗青系
      vec3 dayFog = vec3(0.9, 0.9, 0.95);
      vec3 nightFog = vec3(0.04, 0.04, 0.1);
      vec3 currentFog = mix(nightFog, dayFog, smoothstep(0.2, 0.5, uTime));

      gl_FragColor = vec4(mix(color.rgb, currentFog, fogFactor), color.a);
    }
  `
};

const fogPass = new ShaderPass(fogShader);
composer.addPass(fogPass);
```

**アニメーションループ内で uTime を更新:**

```ts
fogPass.uniforms['uTime'].value = uTime;
```

### 6.4 リサイズ対応

**ウィンドウリサイズ時に composer と各パスのサイズを更新すること。**
これを忘れるとリサイズ後に描画がぼやける / ずれる。

```ts
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  composer.setSize(w, h);  // IMPORTANT: これを忘れない

  // UnrealBloomPass の resolution も更新
  bloomPass.resolution.set(w, h);
});
```

### 6.5 アニメーションループ

```ts
function animate() {
  requestAnimationFrame(animate);

  // renderer.render(scene, camera) は呼ばない
  // EffectComposer が内部で RenderPass 経由で render する
  composer.render();
}
```

**IMPORTANT: `renderer.render()` と `composer.render()` を両方呼ばない。**
二重描画になり FPS が半減する。

### 6.6 dispose

ページ遷移時にポストプロセスのリソースも解放する。

```ts
function disposePostProcess(composer: EffectComposer) {
  // EffectComposer.dispose() が各パスの dispose を呼ぶ
  composer.dispose();
}
```

### 6.7 モバイル分岐

```ts
import { isMobile } from '../lib/device';

function createPostProcess(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  if (!isMobile()) {
    // デスクトップのみ: Bloom + DOF + Fog
    composer.addPass(bloomPass);
    composer.addPass(bokehPass);
    composer.addPass(fogPass);
  }
  // Scene.fog をフォールバックとして設定（モバイル用）
  if (isMobile()) {
    scene.fog = new THREE.Fog(0x0a0a1a, 10, 100);
  }

  composer.addPass(new OutputPass());
  return composer;
}
```

**モバイルでは Bloom, DOF, FogPass を全スキップ。**
代わりに Scene.fog（GPU負荷が低い）だけ適用する。

### 6.8 よくあるバグと対処

| 症状 | 原因 | 対処 |
|---|---|---|
| 画面が真っ白 | OutputPass がない / threshold が低すぎ | OutputPass を最後に追加。threshold ≥ 0.7 |
| 画面がぼやける | composer.setPixelRatio 未設定 | `composer.setPixelRatio(renderer.getPixelRatio())` |
| リサイズ後に崩れる | composer.setSize 未呼出 | resize イベントで composer.setSize を呼ぶ |
| FPS が極端に低い | renderer.render と composer.render を二重呼び | composer.render のみにする |
| Bloom が全体に広がる | emissive が全建物で高い | importance ≤ 0.6 の建物は emissive を threshold 以下に |
| DOF がちらつく | focus を毎フレーム急変 | lerp で補間（0.1秒） |
| Fog の色が変わらない | uTime 更新忘れ | ループ内で fogPass.uniforms.uTime.value を更新 |

---

## 7. インタラクション

| 操作 | 意味 | 実装 |
|---|---|---|
| ホバー | 意識が向く | emission増加 + scale微拡大 |
| クリック | 建物に入る | slug基準でMDXページへ遷移 |
| スクロール | 都市を歩く | カメラ移動 or uTime進行（要検討） |

---

## 8. 空間配置アルゴリズム

### 8.1 クラスタリング

- `tags` の類似度でグループ化（Jaccard距離）
- 同グループの建物は近くに配置

### 8.2 配置グリッド

```
基本: グリッド配置（間隔 = 8 units）
importance > 0.7: 中心寄りに配置
importance < 0.3: 外周に配置
```

### 8.3 建物の形状

```
基本: BoxGeometry（幅・高さをimportance, recencyから算出）
experimental > 0.5: 面の一部を削除 or 変形
```

---

## 9. パフォーマンス

**原則: UX > 表現。重くて離脱されるくらいなら削る。**

### 必須対応

- モバイル: ポストプロセス全OFF、shader簡略版に切り替え
- 遠距離オブジェクト: LODまたはshader簡略化
- 同一形状の建物: InstancedMeshを使用
- テクスチャ: 最大1024px、webp

### 計測基準

```
目標FPS: デスクトップ60fps / モバイル30fps
建物数上限: 50（それ以上はページネーション）
```

---

## 10. フォールバック

3Dが動作しない環境・ユーザー向けに2D一覧ページを必ず用意する。

### ルーティング（TanStack Router ファイルベース）

```
/works         → 3D都市ビュー (routes/works/index.tsx)
/works/list    → 2Dカード一覧・フォールバック (routes/works/list.tsx)
/works/$slug   → MDX作品詳細 (routes/works/$slug.tsx)
```

注意: TanStack Routerは `$param` 記法。Next.jsの `[param]` ではない。

### UI補助

- 初回訪問時: 操作ガイドのオーバーレイ（3秒後に自動消去、スキップ可能）
- 画面端に常時表示: 色・光の意味を示す小さな凡例

---

## 11. ファイル構成（想定）

```
app/
├── routes/
│   ├── __root.tsx            # ルートレイアウト
│   ├── index.tsx             # トップ（都市へのエントリー）
│   └── works/
│       ├── index.tsx         # 3D都市ビュー（loader で全作品取得）
│       ├── list.tsx          # 2Dフォールバック
│       └── $slug.tsx         # MDX作品詳細（loader で個別取得）
├── components/
│   ├── city/
│   │   ├── CityScene.ts     # Three.jsシーン初期化・破棄
│   │   ├── Building.ts      # 建物クラス
│   │   ├── Sky.ts           # 空の描画
│   │   └── PostProcess.ts   # EffectComposer設定
│   └── ui/
│       ├── Guide.tsx        # 操作ガイド
│       └── Legend.tsx        # 色・光の凡例
├── shaders/
│   ├── building.vert        # vite-plugin-glslでimport
│   ├── building.frag
│   └── sky.frag
├── lib/
│   ├── works.ts             # MDX frontmatter パース・全件取得
│   ├── layout.ts            # クラスタリング・配置計算
│   └── device.ts            # デバイス判定・パフォーマンス分岐
├── content/
│   └── works/               # MDXファイル群
├── app.config.ts             # TanStack Start設定
└── vite.config.ts            # Vite設定（glsl, mdxプラグイン）
```

### Three.jsのライフサイクル管理

TanStack Routerはクライアントサイドナビゲーション。
ページ遷移時にThree.jsシーンが破棄されない問題に注意。

```
対策:
- CityScene.tsにdispose()メソッドを必ず実装
- route離脱時（useEffect cleanup / onLeave）で確実に呼ぶ
- renderer, geometry, material, textureすべてdispose
```

---

## 12. 実装の優先順位

Phase 1から順に進める。各Phaseが動作確認できてから次へ。

### Phase 1: 最小構成

- [ ] TanStack Start + Viteプロジェクト初期化
- [ ] vite.config.ts に vite-plugin-glsl, @mdx-js/rollup を追加
- [ ] MDXパース → route loaderで作品データ配列を取得
- [ ] BoxGeometryの建物をグリッド配置
- [ ] カメラ移動（WASD or スクロール）
- [ ] クリック → `router.navigate({ to: '/works/$slug' })` で遷移

### Phase 2: 意味レイヤー

- [ ] shader uniform接続（emotion, importance, recency）
- [ ] ホバーインタラクション
- [ ] 昼夜サイクル（uTime）

### Phase 3: 空気感

- [ ] ポストプロセス（Bloom → DOF → Fog）
- [ ] 空の描画
- [ ] 窓の点灯ロジック

### Phase 4: 最適化

- [ ] InstancedMesh化
- [ ] モバイル分岐
- [ ] 2Dフォールバック
- [ ] 操作ガイド・凡例UI

---

## 13. 判断に迷ったときの原則

1. **意味のない装飾は追加しない** — すべての視覚要素はメタファー対応表（§1）に根拠を持つこと
2. **UX > 表現** — パフォーマンスが落ちるなら表現を削る
3. **段階的に積む** — Phase順を飛ばさない
4. **フォールバックを忘れない** — 3Dが動かない環境は必ず存在する