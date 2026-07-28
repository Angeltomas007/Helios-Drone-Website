# Concierge — Site vitrine

Site vitrine pour un service de conciergerie de déplacements (VTC, taxis,
vans, transferts aéroport/gare, sur mesure). Repris du même gabarit visuel
que le site Helios (dossier parent), mais reconstruit comme un site à part
entière, indépendant, dans son propre dossier.

HTML/CSS/JS statique, sans dépendance ni build.

## Structure

```
index.html       page unique (hero, services, flotte, à propos, contact)
css/style.css    styles + animations (parallax, reveal au scroll)
js/main.js       interactions (nav mobile, parallax, lightbox, formulaire)
assets/img/      photos (à ajouter)
assets/video/    vidéos (à ajouter)
```

## Aperçu en local

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```
python3 -m http.server 8000
```

## Ajouter une vidéo dans le hero

Déposer le fichier vidéo dans `assets/video/`, puis dans `index.html`
remplacer le `<div class="hero-bg" id="hero-bg"></div>` par :

```html
<video class="hero-bg" id="hero-bg" autoplay muted loop playsinline poster="assets/img/hero-poster.jpg">
  <source src="assets/video/hero.mp4" type="video/mp4">
</video>
```

Le CSS (`.hero-bg`) s'applique déjà en `position: absolute; inset: 0`, donc
une vidéo prend directement la place du dégradé de fond — il suffit d'ajouter
`object-fit: cover; width: 100%; height: 100%;` à `.hero-bg` dans
`css/style.css` une fois la balise `<video>` en place.

## Ajouter des photos de la flotte

Déposer les fichiers dans `assets/img/`, puis remplacer les vignettes
`.gallery-item` de la section "Notre flotte" par de vraies photos de
véhicules (berline, van, etc.).

## Section "Nos destinations"

La section `#destinations` (Paris, Côte d'Azur, Corse, Sardaigne, "et
ailleurs") utilise pour l'instant des illustrations SVG dessinées à la main
(pas de vraies photos) : l'environnement de génération de ce site n'a pas
d'accès réseau vers des banques d'images (Unsplash, etc.), donc impossible
de télécharger de vraies photos libres de droit ici. Pour les remplacer par
de vraies photos de villes :

1. Télécharger des photos libres de droit (Unsplash, Pexels, Pixabay).
2. Les déposer dans `assets/img/` (ex. `paris.jpg`, `cote-azur.jpg`, etc.).
3. Dans `index.html`, remplacer le contenu de chaque `.destination-visual`
   par une balise `<img src="assets/img/paris.jpg" alt="Paris">` (ajouter
   `object-fit: cover; width: 100%; height: 100%;` à `.destination-visual`
   dans `css/style.css`, ou passer par un `background-image` en CSS).

## Transport héliporté

La carte "Transport héliporté" (section Services) est marquée
"Bientôt disponible" — c'est une offre à venir, pas encore réservable.
Quand le service sera prêt, retirer la classe `service-card-soon` et le
`<span class="badge-soon">` dans `index.html`.

## Formulaire de contact

Le formulaire est actuellement statique (confirmation locale, pas d'envoi
réel). Pour le rendre fonctionnel sans backend, brancher un service comme
Formspree, Web3Forms ou EmailJS sur l'attribut `action` du `<form>`.

## Déploiement séparé (site à part)

Ce dossier est volontairement autonome (ses propres `css/`, `js/`,
`assets/`) pour pouvoir être déployé indépendamment du site Helios :

- **GitHub Pages depuis ce dossier** : Settings → Pages → Source
  `Deploy from a branch`, branche `main`, dossier `/transport-concierge`.
- **Repo séparé** : copier ce dossier dans un nouveau dépôt Git si vous
  préférez un historique et une URL totalement distincts du site Helios.

## Personnalisation rapide

- **Nom de marque** : "CONCIERGE" est un nom provisoire — à remplacer dans
  `index.html` (logo, `<title>`) et éventuellement le nom de domaine.
- **Couleurs** : accent doré (`--accent` dans `css/style.css`) au lieu de
  l'orange Helios, pour différencier visuellement les deux sites tout en
  gardant la même mise en page.
- **Contact** : email et téléphone repris du site Helios — à mettre à jour
  si un numéro/adresse dédié à ce service doit être utilisé.
