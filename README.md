# Ohjeet riippuvuuksien lataamiseen React Native -projektille 31.10.2024

Tässä tiedostossa on ohjeet tarvittavien riippuvuuksien asentamiseen React Native -projektiin, joka käyttää Expo-ympäristöä ja React Navigation -kirjastoa.

## 1. Alkuvalmistelut
Ennen kuin aloitat, varmista, että sinulla on asennettuna:
- Node.js (suositus: versio 16 tai uudempi)
- npm (tulee Node.js:n mukana)
- Expo CLI (asennettavissa komennolla `npm install -g expo-cli`)

## 2. Projekti
Varmista, että sinulla on luotu Expo-projekti. Voit luoda uuden projektin komennolla:
```
expo init food-diary
```

## 3. Riippuvuuksien asentaminen
Avaa projektin kansio ja asenna tarvittavat riippuvuudet seuraavilla komennoilla:

### 3.1. Yleiset riippuvuudet
```bash
npm install expo expo-status-bar
```

### 3.2. React Navigation -riippuvuudet
Asenna React Navigation -riippuvuudet:
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

### 3.3. React Native Reanimated
Asenna React Native Reanimated:
```bash
npm install react-native-reanimated
```

### 3.4. Riippuvuuksien ratkaiseminen
Jos kohtaat riippuvuuskonflikteja, yritä asentaa riippuvuudet seuraavilla komennoilla:
```bash
npm install --legacy-peer-deps
```

## 4. Käynnistä projekti
Kun kaikki riippuvuudet on asennettu, voit käynnistää projektin seuraavalla komennolla:
```bash
npx expo start
```

## 5. Huomautuksia
- Jos käytät Expo SDK:n versiota, varmista, että käytät yhteensopivia versioita React Native -kirjastosta.
- Tarkista projektin README-tiedosto tai virallinen dokumentaatio mahdollisten versio- ja asennusohjeiden vuoksi.
