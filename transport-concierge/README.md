# Onda Blu — Site vitrine

Site vitrine pour Onda Blu, un service de conciergerie de déplacements
(VTC, taxis, vans, transferts aéroport/gare, sur mesure) pour la clientèle
yacht de Méditerranée. Repris du même gabarit visuel que le site Helios
(dossier parent), mais reconstruit comme un site à part entière,
indépendant, dans son propre dossier — palette blanc/bleu marine, sobre
et élégante.

HTML/CSS/JS statique, sans dépendance ni build.

## Structure

```
index.html         page unique (hero, services, flotte, à propos, contact)
poster.html         petite affiche à imprimer (QR WhatsApp)
carte-visite.html   carte de visite recto/verso, format standard 85x55mm
prospectus.html     prospectus A5 (services, destinations, contact)
css/style.css       styles + animations (parallax, reveal au scroll)
js/i18n.js          dictionnaire de traduction (EN/FR/IT) + changement de langue
js/main.js          interactions (nav mobile, parallax, lightbox, formulaire)
assets/img/         photos (à ajouter)
assets/video/       vidéos (à ajouter)
```

## Langues (EN / FR / IT)

`index.html` est maintenant multilingue : **anglais par défaut**, avec un
sélecteur FR / IT dans le menu (en haut à droite, `EN · FR · IT`). Le
choix de langue est mémorisé (`localStorage`) d'une visite à l'autre.

Tout le texte traduisible porte un attribut `data-i18n="clé"` (ou
`data-i18n-placeholder` / `data-i18n-aria` / `data-i18n-label` pour les
attributs). Les traductions sont dans `js/i18n.js`, un objet
`translations = { en: {...}, fr: {...}, it: {...} }`. Pour changer un
texte, éditer la valeur correspondante dans les 3 langues (chercher la
même clé, ex. `"hero.sub"`) plutôt que le HTML directement — le HTML est
réécrit par le script au chargement.

Pour ajouter une langue : dupliquer un bloc de `translations` (ex. copier
`en`), ajouter un bouton `<button class="lang-btn" data-lang="es">ES</button>`
dans `index.html`, traduire toutes les clés.

## Section "Nos destinations"

La section `#destinations` combine :
- deux **cartes illustrées** (`.map-panel`) avec plusieurs points de prise
  en charge chacune — Saint-Tropez & le Golfe (port, plage de Pampelonne,
  Place des Lices, Ramatuelle) et la Costa Smeralda en Sardaigne (Porto
  Cervo, Porto Rotondo, Baia Sardinia, Poltu Quatu) — pour montrer qu'on a
  une liste de points précis plutôt qu'une seule adresse par ville ;
- des cartes plus courtes pour Monaco, Calvi, Portofino, un "Itinéraire
  personnalisé" (soirée multi-adresses) et "Et ailleurs".

Ce sont des illustrations dessinées à la main (pas une vraie carte
interactive type Google Maps/Leaflet) : plus sobre, cohérent avec le
reste du design, et ça fonctionne sans dépendance ni clé API. Les mêmes
points (Saint-Tropez Port, Pampelonne, Porto Cervo, etc.) alimentent aussi
les menus déroulants "point de départ / point d'arrivée" du formulaire de
contact, donc modifier une liste de points dans `js/i18n.js`
(clés `map.sttropez.pin1..4` / `map.sardinia.pin1..4`) les met à jour aux
deux endroits.

## Aperçu en local

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```
python3 -m http.server 8000
```

## Ajouter une vidéo dans le hero

Le hero est prêt à recevoir une vidéo (dégradé bleu marine en attendant) —
mais **je n'ai pas pu ajouter la vraie vidéo de yacht demandée** : l'environnement
où ce site est généré n'a pas d'accès réseau vers des sites de vidéos/photos
(Unsplash, banques de vidéos, etc. — toutes les tentatives échouent avec une
erreur 403), et je n'ai pas de fichier vidéo fourni dans le dépôt à réutiliser.

Pour l'ajouter toi-même : déposer le fichier vidéo dans `assets/video/`, puis
dans `index.html` remplacer le `<div class="hero-bg" id="hero-bg"></div>` par :

```html
<video class="hero-bg" id="hero-bg" autoplay muted loop playsinline poster="assets/img/hero-poster.jpg">
  <source src="assets/video/hero.mp4" type="video/mp4">
</video>
```

Le CSS (`.hero-bg`) s'applique déjà en `position: absolute; inset: 0`, donc
une vidéo prend directement la place du dégradé de fond — il suffit d'ajouter
`object-fit: cover; width: 100%; height: 100%;` à `.hero-bg` dans
`css/style.css` une fois la balise `<video>` en place. Le dégradé bleu marine
actuel de `.hero-bg`/`.hero-overlay` est calibré pour qu'un texte blanc reste
lisible par-dessus une vidéo sombre (mer, port, yacht au crépuscule) — garder
une vidéo plutôt sombre ou assombrie pour la lisibilité du texte.

## Ajouter des photos de la flotte

Déposer les fichiers dans `assets/img/`, puis remplacer les vignettes
`.gallery-item` de la section "Notre flotte" par de vraies photos de
véhicules (berline, van, etc.).

Le site reste volontairement concentré sur la Méditerranée pour l'instant
— d'autres zones pourront être ajoutées plus tard. Pas de vraies photos
pour l'instant non plus (voir plus bas pourquoi), seulement des
illustrations SVG dessinées à la main. Pour remplacer par de vraies
photos : téléchargez des photos libres de droit, déposez-les dans
`assets/img/`, puis remplacez le contenu de la `.map-panel-body` ou
`.destination-visual` concernée par une balise `<img>` (ajouter
`object-fit: cover; width: 100%; height: 100%;` en CSS).

## Transport héliporté

La carte "Transport héliporté" (section Services) est marquée
"Bientôt disponible" — c'est une offre à venir, pas encore réservable.
Quand le service sera prêt, retirer la classe `service-card-soon` et le
`<span class="badge-soon">` dans `index.html`.

## Contact : WhatsApp + carte à imprimer

Le site lui-même met en avant **WhatsApp** comme contact principal (plus
simple qu'un QR code en ligne) :
- un bouton flottant vert en bas à droite, visible sur toutes les pages ;
- un bouton "Discuter sur WhatsApp" dans la section Contact.

Les deux pointent vers `https://wa.me/33619450257` (adapter le numéro dans
`index.html` si besoin — chercher `wa.me/33619450257`, deux occurrences).

Le QR code n'est plus affiché sur le site : il vit uniquement dans
**`poster.html`**, une petite carte/affiche autonome à imprimer (logo Onda
Blu, QR code, coordonnées) que tu peux coller ou laisser au port. Le QR
(`assets/img/qr-contact.svg`) encode le même lien WhatsApp — le scanner
ouvre directement une conversation. Pour l'imprimer : ouvrir `poster.html`
dans un navigateur et faire Ctrl/Cmd+P (le CSS `@media print` retire l'ombre
et les marges superflues).

Pour régénérer le QR (changement de numéro, ou repasser sur un simple
appel avec `tel:+33XXXXXXXXX`) :

```bash
pip install qrcode
python3 -c "
import qrcode, qrcode.image.svg
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=2, image_factory=qrcode.image.svg.SvgPathImage)
qr.add_data('https://wa.me/33XXXXXXXXX')
qr.make(fit=True)
qr.make_image(fill_color='#000000', back_color='#ffffff').save('assets/img/qr-contact.svg')
"
```

## Carte de visite et prospectus

Deux autres documents imprimables, dans le même esprit que `poster.html` :

- **`carte-visite.html`** : une vraie carte de visite, format standard
  85 × 55 mm, recto (fond bleu marine, logo) et verso (fond blanc, nom,
  rôle, téléphone, email, QR WhatsApp). Le nom affiché ("Angel Tomas
  Ciavarella") vient de l'adresse email du contact — à corriger dans le
  fichier si ce n'est pas le nom/la présentation que tu veux afficher.
- **`prospectus.html`** : un flyer A5 (148 × 210 mm) plus complet, avec les
  4 services, la liste des destinations et le contact — à laisser dans un
  hôtel, une conciergerie, un club nautique, etc.

Les deux s'ouvrent dans un navigateur et s'impriment avec Ctrl/Cmd+P.
Penser à choisir "Taille réelle" / échelle 100% dans les options
d'impression pour que les dimensions (mm) restent exactes.

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

- **Nom de marque** : "Onda Blu" (logo, `<title>`, footer) — à ajuster si tu
  changes d'avis, et à répercuter sur le nom de domaine le cas échéant.
- **Couleurs** : palette blanc/bleu marine (`--bg`, `--text`, `--accent`
  dans `css/style.css`) — sobre et élégante façon yacht, à l'opposé du thème
  sombre du site Helios.
- **Contact** : email et téléphone repris du site Helios — à mettre à jour
  si un numéro/adresse dédié à ce service doit être utilisé (et à
  régénérer le QR code du contact si le numéro change, voir plus haut).
