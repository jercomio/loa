## Lunar Orbiter Algorithms (Loa)

Lunar Orbiter Algorithms (Loa) est une petite librairie TypeScript/JavaScript qui regroupe plusieurs algorithmes génériques :

- **Helpers de chaînes** : capitalisation, génération de slug, remplacement de patterns
- **Helper de dates** : conversion en timestamp pour comparaison
- **Helper de tableaux** : permutation contrôlée d’items à partir d’un motif numérique
- **Helper d’identifiants** : raccourcissement de UUID/ID avec préfixe optionnel
- **Helper mathématique** : nombre d’or et expression “arrondie” du nombre d’or
- **Helper de layout** : génération de style de rectangle de Fibonacci pour les composants UI
- **Helper HTML/Markdown** : extraction sécurisée de texte entre marqueurs avec encapsulation dans un tag HTML

Une **interface Playground** (React + Vite) est disponible dans le dossier `Loa-Interface` pour expérimenter les fonctions sans écrire de code.

---

## 1. Installation & usage de base

### 1.1. Librairie seule

Si tu utilises ce dépôt comme librairie dans un projet Node.js/TypeScript, workflow typique :

```bash
git clone https://github.com/jercom/lunar-orbiter-algorithms.git
cd lunar-orbiter-algorithms
npm install
npm run build
```

Ensuite, dans ton code TypeScript / JavaScript (en pointant soit vers le build, soit directement vers `src/loa.ts`) :

```ts
import loa from "lunar-orbiter-algorithms"; // ou depuis "./src/loa"

const title = loa.capitalize("hello world");
console.log(title); // "Hello world"
```

> **Remarque**  
> Le chemin exact d’import dépend de la manière dont tu intègres ce dépôt (package publié vs source locale).  
> En local, un simple `import loa from "./src/loa";` est parfaitement valide.

### 1.2. Librairie + interface Playground

Le projet racine contient les algos dans `src/loa.ts`.  
Le sous-dossier `Loa-Interface` contient une application React + Vite qui sert de **Playground** pour les algos.

Pour lancer le Playground :

```bash
cd Loa-Interface
npm install
npm run dev
```

Puis tu ouvres l’URL affichée par Vite (en général `http://localhost:5173`) dans le navigateur.  
Tu y trouveras des composants UI pour tester les principales fonctions de Loa (inputs, options, preview en live, warnings dans la console).

Pour builder le Playground en prod :

```bash
cd Loa-Interface
npm run build
```

---

## 2. API – interface `Loa`

Toutes les fonctions sont exposées via un seul objet qui implémente l’interface `Loa` :

```ts
export interface Loa {
  capitalize(str?: string): string | undefined;
  stringToSlug(str: string): string | undefined;
  dateToTimestamp(date: string | Date): number[] | undefined;
  permutation(a: string[], b: number[]): string[] | undefined;
  updateString(a: string, value: string | RegExp, b: string): string | undefined;
  splitUUIDAndPrefixed(uuid: string | number, prefix?: string): string | undefined;
  goldenRatioRound(): PhiObject;
  fibonacciRectDraw(
    width: number | string,
    borderStyle?: string,
    borderRadiusStyle?: string,
    bgStyle?: string,
    transformStyle?: string
  ): RectStyleObject | void;
  strBetweenSpecialChar(
    pattern: string,
    char: string,
    tagBoolean: boolean,
    tagName: string
  ): string | void;
}
```

L’export par défaut de `src/loa.ts` est l’objet `loa` qui implémente cette interface.

```ts
import loa from "./src/loa";
```

On passe ensuite fonction par fonction avec des exemples concrets.

---

## 3. Helpers de chaînes

### 3.1. `capitalize(str?: string): string | undefined`

**But** : renvoyer la chaîne avec son premier caractère en majuscule.  
Si `str` est `undefined` ou qu’une erreur survient, la fonction renvoie `undefined` et log un warning dans la console.

**Signature** :

- `str` – chaîne optionnelle
- **retour** – chaîne capitalisée ou `undefined`

**Exemple** :

```ts
const a = loa.capitalize("hello world"); // "Hello world"
const b = loa.capitalize(); // undefined
```

---

### 3.2. `stringToSlug(str: string): string | undefined`

**But** : transformer une chaîne lisible en **slug** prêt à être utilisé dans une URL, avec :

- minuscule
- espaces remplacés par `-`
- suppression des accents et de certaines ponctuations (virgule, point)

**Signature** :

- `str` – chaîne d’entrée, obligatoire
- **retour** – slug ou `undefined` si erreur

**Algo (simplifié)** :

- mise en minuscule
- normalisation en NFD pour séparer les accents
- remplacement du caractère espace (U+0020) par `-`
- suppression des virgules, points et diacritiques combinés

**Exemple** :

```ts
const input = "Hôtel & Spa, all inclusive.";
const slug = loa.stringToSlug(input);
// "hotel-&-spa-all-inclusive"
```

Tu peux ensuite balancer ce slug dans un router, un ID, une URL, etc.

---

### 3.3. `updateString(a: string, value: string | RegExp, b: string): string | undefined`

**But** : remplacer la **première** occurrence de `value` dans la chaîne `a` par `b`.  
Si `value` est une `RegExp`, ça utilise les règles standard de `String.prototype.replace`.

**Signature** :

- `a` – chaîne d’origine
- `value` – chaîne ou `RegExp` servant de pattern
- `b` – chaîne de remplacement
- **retour** – nouvelle chaîne ou `undefined` en cas d’erreur

**Exemple** :

```ts
const s1 = loa.updateString("Hello World", "World", "Loa"); // "Hello Loa"

const s2 = loa.updateString("Foo_123_Bar_456", /\d+/g, "X");
// "Foo_X_Bar_456" (seulement le premier match)
```

> Pour du remplacement global, tu peux soit utiliser un autre pattern avec post‑traitement, soit rappeler `updateString` plusieurs fois selon ton besoin.

---

## 4. Helper de dates

### 4.1. `dateToTimestamp(date: string | Date): number[] | undefined`

**But** : convertir une `Date` ou une chaîne de date en **tableau contenant un seul timestamp** (ms depuis l’epoch).  
Le design est volontairement strict : si la date est invalide, la fonction log un warning **orange** et renvoie `undefined`.

**Signature** :

- `date` – `Date` ou chaîne compatible avec `new Date(...)`
- **retour** – `number[]` avec un élément (timestamp) ou `undefined`

**Exemple** :

```ts
const [createdTs] = loa.dateToTimestamp("2025-01-01T00:00:00Z") ?? [];
const [publishTs] = loa.dateToTimestamp(new Date()) ?? [];

if (createdTs !== undefined && publishTs !== undefined) {
  const isBefore = createdTs < publishTs;
  console.log("Created before publish?", isBefore);
}
```

Si la date est invalide :

- warning via le logger centralisé
- retour `undefined`

---

## 5. Helper de tableaux – permutation

### 5.1. `permutation(a: string[], b: number[]): string[] | undefined`

**But** : permuter les éléments du tableau `a` selon un **motif numérique** stocké dans `b`.  
Chaque entrée de `b` est interprétée pour calculer un index dans `a` avec la règle :

```ts
const index = parseInt(rawIndex.toString().substring(1), 10) - 1;
```

Donc :

- `rawIndex` est converti en string
- on **jette le premier caractère**
- on parse le reste en entier base 10
- on soustrait 1 pour obtenir un index 0‑based

Si l’index sort des bornes de `a`, un warning est loggué et l’élément est ignoré.

**Signature** :

- `a` – tableau de chaînes, base
- `b` – motif numérique
- **retour** – nouveau tableau permuté ou `undefined` si erreur

**Exemple** :

```ts
const a = ["item1", "item2", "item3", "item4"];
const b = [14, 23, 32, 41];

const result = loa.permutation(a, b);
// 14 -> "4"  -> 4 - 1 = 3 -> a[3] = "item4"
// 23 -> "3"  -> 3 - 1 = 2 -> a[2] = "item3"
// 32 -> "2"  -> 2 - 1 = 1 -> a[1] = "item2"
// 41 -> "1"  -> 1 - 1 = 0 -> a[0] = "item1"
// => ["item4", "item3", "item2", "item1"]
```

Pratique si tu veux encoder des permutations simples avec des **entiers “mn”**.

---

## 6. Helper d’identifiants – `splitUUIDAndPrefixed`

### 6.1. `splitUUIDAndPrefixed(uuid: string | number, prefix?: string): string | undefined`

**But** : produire un **ID court** à partir d’un UUID‑like ou d’un ID numérique/texte, avec préfixe optionnel.

Comportement :

1. Si `uuid` n’est pas une string, il est casté en string.
2. Si la string contient un `-`, on prend la partie **avant le premier tiret**.
3. S’il n’y a pas de `-` et que la longueur est **>= 8**, on prend les 8 premiers caractères.
4. Si la longueur est **< 8**, la fonction :
   - construit un tableau de nombres à partir de `Date.now()`
   - join en une string
   - complète l’ID d’origine pour atteindre 8 caractères
5. Si `prefix` non vide, le résultat final est `"<prefix>_<shortId>"`.

**Signature** :

- `uuid` – string ou nombre
- `prefix` – string optionnelle
- **retour** – identifiant court ou `undefined` en cas d’erreur

**Exemple** :

```ts
const uuid1 = "d3da48a57-18a805cb3dce-c9d52491401";
const uuid2 = 1234;
const uuid3 = "test";
const prefix = "jercom";

const s1 = loa.splitUUIDAndPrefixed(uuid1, prefix);
// "jercom_d3da48a57"

const s2 = loa.splitUUIDAndPrefixed(uuid2, prefix);
// "jercom_<8-char-dérivé-de-1234-et-du-temps>"

const s3 = loa.splitUUIDAndPrefixed(uuid3, prefix);
// "jercom_<8-char-dérivé-de-'test'-et-du-temps>"
```

Utile pour générer des IDs courts, lisibles, à exposer en UI, dans les URLs ou dans les logs.

---

## 7. Helper mathématique – nombre d’or

### 7.1. Types – `PhiEntry`, `PhiRoundEntry`, `PhiObject`

La fonction nombre d’or renvoie un objet typé :

```ts
interface PhiEntry {
  codeName: string;
  value: number;
}

interface PhiRoundEntry {
  codeName: string;
  value: number;
  constant: number;
  formula: string;
}

interface PhiObject {
  phi: PhiEntry[];
  phiRound: PhiRoundEntry[];
}
```

### 7.2. `goldenRatioRound(): PhiObject`

**But** : calculer et logger :

- le nombre d’or classique \( \phi = \frac{1 + \sqrt{5}}{2} \)
- une expression “arrondie” \( \phi(r) = \sqrt{2} \cdot \ln(\pi) \)
- une constante \( k = \max(\phi, \phi(r)) - \min(\phi, \phi(r)) \)
- un \(\phi\) “corrigé” via la relation \( \phi = \phi(r) - k \) encodée dans `phiRound[0].formula`

**Signature** :

- **retour** – `PhiObject` avec :
  - `phi[0]` – le nombre d’or usuel
  - `phiRound[0]` – l’expression arrondie avec constante `k` et la formule en clair

La fonction log aussi dans la console la formule et les valeurs numériques.

**Exemple** :

```ts
const phiObj = loa.goldenRatioRound();

console.log(phiObj.phi[0].codeName, phiObj.phi[0].value);
console.log(phiObj.phiRound[0].codeName, phiObj.phiRound[0].value);
console.log(phiObj.phiRound[0].formula);
```

Tu peux exploiter ces valeurs pour faire des visualisations autour de :

- \(\phi\)
- \(\sqrt{2}\)
- \(\pi\)
- \(\ln\)

et alimenter des démos dans le Playground.

---

## 8. Helper de layout – rectangle de Fibonacci

### 8.1. Type – `RectStyleObject`

```ts
interface RectStyleObject {
  width: string;
  height: string;
  border?: string;
  borderRadius?: string;
  background?: string;
  transform?: string;
}
```

### 8.2. `fibonacciRectDraw(width, borderStyle?, borderRadiusStyle?, bgStyle?, transformStyle?): RectStyleObject | void`

**But** : calculer un style de rectangle compatible avec des ratios de type Fibonacci / nombre d’or.  
La fonction prend une **largeur** avec ou sans unité, la normalise, et calcule la hauteur via une formule dérivée de :

- la formule de Binet pour les Fibonacci
- une construction géométrique avec vecteurs et une norme \( ||\eta|| \) liée à \( \pi \)

Points importants depuis la docstring :

- `width` est parsé en :
  - valeur numérique
  - unité dans `["px", "vw", "rem", "em", "vh", "%"]`
- la hauteur est calculée par :

  \[
  \text{height} = -\frac{\text{width} \cdot (1 - \sqrt{5})}{2}
  \]

- une longueur auxiliaire \( \eta \) est calculée :

  \[
  \eta = \sqrt{\text{width}^2 + \left(\frac{2 \cdot \text{width}}{1 + \sqrt{5}}\right)^2}
  \]

- puis `h_etha` est dérivée mais juste conservée pour éviter un warning TS

**Signature** :

- `width` – nombre ou string, ex : `300`, `"300px"`, `"50vw"`, `"100"` (sans unité)
- `borderStyle` – string optionnelle, défaut `1px solid #999`
- `borderRadiusStyle` – string optionnelle, défaut `0`
- `bgStyle` – string optionnelle, défaut `#999`
- `transformStyle` – string optionnelle, défaut `none`
- **retour** – `RectStyleObject` ou `void` si arguments invalides

**Logs console** :

- width en nombre brut : log **vert** pour confirmer la validité
- width string sans partie numérique ou sans unité : logs **orange** expliquant les valeurs par défaut utilisées
- unité non reconnue : log **orange** + fallback sur l’unité par défaut
- width `null`/`undefined` : log **rouge** avec erreur d’arguments

**Exemple (React / Next.js)** :

```tsx
import loa from "lunar-orbiter-algorithms";

export function GoldenRectDemo() {
  const style = loa.fibonacciRectDraw(300, "1px solid #999", "8px", "#f2f2f2");

  if (!style) return null;

  return <div style={style} />;
}
```

Dans le Playground, tu peux exposer :

- un slider de largeur + sélecteur d’unité
- des inputs pour border / radius / background / transform

et visualiser le rectangle en live.

---

## 9. Helper HTML/Markdown – `strBetweenSpecialChar`

### 9.1. Idée

`strBetweenSpecialChar` sert à transformer de manière **safe** des segments de texte délimités par un marqueur custom en balises HTML.  
Cas d’usage typique : alternative plus maîtrisée que du HTML brut dans du Markdown, ou mini‑markup inline.

**Exemple d’entrée** :

- pattern : `"##Hello## world"`
- marqueur : `"##"`
- tag cible : `"span"`
- option : `tagBoolean = true` (active le traitement)

Résultat : `"<span>Hello</span> world"`

### 9.2. Signature

```ts
strBetweenSpecialChar(
  pattern: string,
  char: string,
  tagBoolean: boolean,
  tagName: string
): string | void;
```

**Paramètres** :

- `pattern` – texte d’entrée, peut contenir 0 ou plusieurs segments marqués
- `char` – marqueur, ex : `"##"` ou `"**"`
- `tagBoolean` – si `true`, on active le traitement; sinon warning **rouge** et aucun changement
- `tagName` – nom de la balise HTML, ex : `"span"`, `"strong"`, `"em"`

**Retour** :

- si `tagBoolean` est `true` et que des marqueurs existent, renvoie la chaîne transformée
- logs + `void` si :
  - le marqueur n’est pas présent dans `pattern`
  - `tagBoolean` est `false`

### 9.3. Vue d’ensemble de l’algo

1. Vérification de cohérence basique :
   - si `pattern` ne contient pas `char`, log **rouge** et retour immédiat
2. Construction de plusieurs RegExp à partir d’une version échappée de `char` pour être compatible Next.js
3. Split de `pattern` en tableau de mots
4. Parcours :
   - si mot avec marqueur de début mais pas de fin : remplacement par `<tagName>` au début
   - si mot avec marqueur de fin mais pas de début : remplacement par `</tagName>` à la fin
   - si mot avec début + fin : encapsulation complète
5. Join du tableau en string et log **orange** avec le résultat

### 9.4. Exemples

#### 9.4.1. DOM classique

```ts
const display = document.getElementById("paragraph");
const result = loa.strBetweenSpecialChar(
  "##1## Au commencement...",
  "##",
  true,
  "span"
);

if (display && typeof result === "string") {
  display.innerHTML = result + ".";
}
```

#### 9.4.2. Plusieurs segments

```ts
const text =
  "Voici un ##texte## comprenant des ##mots en couleur##";

const result = loa.strBetweenSpecialChar(text, "##", true, "span");
// "Voici un <span>texte</span> comprenant des <span>mots en couleur</span>"
```

#### 9.4.3. Usage React avec `dangerouslySetInnerHTML`

```tsx
import loa from "lunar-orbiter-algorithms";

type Props = { text: string };

export function StyledText({ text }: Props) {
  const formatted = loa.strBetweenSpecialChar(text, "##", true, "span");

  if (typeof formatted !== "string") return null;

  return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
}
```

Ce pattern est exactement celui utilisé dans le Playground pour visualiser du texte marqué.

---

## 10. Playground – Loa-Interface

Le dossier `Loa-Interface` contient une appli **React + Vite** qui sert de Playground pour Loa.

### 10.1. Stack technique

- React 19
- TypeScript
- Vite 7
- Radix UI
- Tailwind CSS 4
- Vitest / Testing Library

Scripts (depuis `Loa-Interface/package.json`) :

- `npm run dev` – serveur de dev avec HMR
- `npm run build` – build TypeScript puis build Vite
- `npm run preview` – preview du build de prod
- `npm run test` – tests avec Vitest
- `npm run lint` – ESLint

### 10.2. Lancer le Playground

```bash
cd Loa-Interface
npm install
npm run dev
```

Ouvre ensuite l’URL (ex. `http://localhost:5173`) et explore :

- Panneaux pour chaque fonction de Loa
- Inputs pour les paramètres
- Résultats en live
- Warnings et infos dans la console

### 10.3. Patterns d’usage typiques

- **String utilities** : saisir une chaîne et regarder le comportement de `capitalize`, `stringToSlug`, `updateString`.
- **Dates** : comparer des dates via les timestamps retournés par `dateToTimestamp`.
- **Permutation** : configurer `a` et `b` pour comprendre comment le motif numérique réordonne le tableau.
- **Nombre d’or** : afficher \( \phi \), \( \phi(r) \), et \( k \), et relier ça aux layouts.
- **Rectangle de Fibonacci** : binder sliders / inputs sur `fibonacciRectDraw` pour voir le rectangle évoluer.
- **Marqueurs spéciaux** : taper du texte type Markdown avec `##...##` et voir le HTML résultant.

---

## 11. Logging & warnings

En interne, tous les warnings passent par un logger centralisé :

```ts
const WARNING_PREFIX =
  "%cWarning from Lunar Orbiter Algorithms [jercom.io]:";

const logLoaWarning = (color: WarningColor, ...messages: unknown[]): void => {
  console.log(WARNING_PREFIX, color, ...messages);
};
```

avec `WarningColor` dans :

- `"color:red"`
- `"color:orange"`
- `"color:green"`

Tu peux filtrer `"Lunar Orbiter Algorithms"` dans la console pour inspecter les cas limites.

---

## 12. Licence

Lunar Orbiter Algorithms est distribué sous licence **MIT**.

Voir l’en‑tête de `src/loa.ts` ou les fichiers de distribution pour le texte complet.

