# Helios — Site vitrine

Site portfolio pour une agence de services drone (immobilier, événementiel,
inspection, cartographie). HTML/CSS/JS statique, sans dépendance ni build.

## Structure

```
index.html       page unique (hero, services, portfolio, à propos, contact)
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

## Déploiement (GitHub Pages, gratuit)

1. **Settings → Pages**
2. Source : `Deploy from a branch`
3. Branch : `main`, dossier `/ (root)`
4. Enregistrer — le site est en ligne sous `https://<user>.github.io/helios-drone-website/`

## Ajouter des vidéos/photos

Déposer les fichiers dans `assets/video/` ou `assets/img/`, puis :
- remplacer le fond du hero (`.hero-bg` dans `index.html`) par une balise `<video>`
- remplacer les vignettes `.gallery-item` du portfolio par de vraies miniatures/vidéos

## Formulaire de contact

Le formulaire est actuellement statique (confirmation locale, pas d'envoi réel).
Pour le rendre fonctionnel sans backend, brancher un service comme Formspree,
Web3Forms ou EmailJS sur l'attribut `action` du `<form>`.
