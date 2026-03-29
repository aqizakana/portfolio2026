# CLAUDE.md — Portfolio 2025 "Web City"

---

## 0. このドキュメントの目的

このファイルはClaude Codeへの開発指示書である。
実装判断に迷ったらここに戻ること。
返答は日本語で行なってください。

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
Tanstack Start + Vite
Three.js + EffectComposer
MDX（作品データソース）
TypeScript
```

### 禁止事項

- R3F（React Three Fiber）は使わない。素のThree.jsで書く
- 外部UIライブラリ（MUI, Chakra等）は使わない
- GLSLは直接書く。TSL変換は行わない

---

## 3. データフロー

```
MDX frontmatter → パース → 作品データ配列 → 3D空間に配置 → shader uniform反映
```

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

EffectComposerで以下3つのみ使用。追加禁止。

### 6.1 Bloom（注目）

```
対象: importance > 0.6 の建物のみ
強度: 夜間で1.5倍
threshold: 0.8
radius: 0.4
```

### 6.2 DOF — 被写界深度（意識）

```
焦点: カメラが向いている建物
遠景: ぼかす
```

### 6.3 Fog（記憶 / 忘却）

```
near: 10
far: 100
color: 昼→白系 / 夜→暗青系（uTimeに連動）
```

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

```
/works       → 3D都市ビュー
/works/list  → 2Dカード一覧（フォールバック）
/works/[slug] → MDX作品詳細
```

### UI補助

- 初回訪問時: 操作ガイドのオーバーレイ（3秒後に自動消去、スキップ可能）
- 画面端に常時表示: 色・光の意味を示す小さな凡例

---

## 11. ファイル構成（想定）

```
src/
├── app/
│   ├── works/
│   │   ├── page.tsx          # 3D都市ビュー
│   │   ├── list/page.tsx     # 2Dフォールバック
│   │   └── [slug]/page.tsx   # MDX作品詳細
├── components/
│   ├── city/
│   │   ├── CityScene.ts      # Three.jsシーン初期化
│   │   ├── Building.ts       # 建物クラス
│   │   ├── Sky.ts            # 空の描画
│   │   └── PostProcess.ts    # EffectComposer設定
│   └── ui/
│       ├── Guide.tsx         # 操作ガイド
│       └── Legend.tsx        # 色・光の凡例
├── shaders/
│   ├── building.vert
│   ├── building.frag
│   └── sky.frag
├── lib/
│   ├── parseWorks.ts         # MDX frontmatter → 作品データ配列
│   ├── layout.ts             # クラスタリング・配置計算
│   └── device.ts             # デバイス判定・パフォーマンス分岐
└── content/
    └── works/                # MDXファイル群
```

---

## 12. 実装の優先順位

Phase 1から順に進める。各Phaseが動作確認できてから次へ。

### Phase 1: 最小構成

- [ ] MDXパース → 作品データ配列
- [ ] BoxGeometryの建物をグリッド配置
- [ ] カメラ移動（WASD or スクロール）
- [ ] クリックでMDXページ遷移

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