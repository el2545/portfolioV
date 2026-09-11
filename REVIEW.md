# Portfolio — amélioration du 11 septembre 2026

## Parcours observé sur la version en ligne, avant modification

1. **Accueil et navigation — lisibilité à corriger.** Le portrait et la hiérarchie éditoriale donnent une identité cohérente. Les liens inactifs du menu se confondent avec le fond bleu nuit. Le correctif réduit la priorité du style global des liens pour laisser leurs couleurs propres aux composants.

   ![Accueil avant correction : liens de navigation sombres sur fond sombre](review/01-home-before.jpg)

2. **Recherche, simulation et pause — fonctionnels en mode 2D lors de ce contrôle.** Après chargement, la simulation de Maârif dispose de 450 étapes. La lecture avance et peut être interrompue ; la capture montre une pause à 18:09. Les petits libellés sont peu lisibles et la barre de légende ne suit pas l’ordre des couleurs de la simulation. Les corrections agrandissent les libellés et adaptent la légende au mode choisi.

   ![Simulation actuelle, indicateurs, légende et commandes de lecture](review/02-map-before.jpg)

Ces captures documentent uniquement le site public avant modification, pas un aperçu de la nouvelle version.

## Modifications supplémentaires issues de l’examen du code

- Menu indépendant du chargement cartographique, fermeture avec Échap et retour du focus.
- Cibles tactiles agrandies, menu tablette et ajustements de petite largeur.
- Portrait limité par son ratio CSS plutôt que sa hauteur HTML intrinsèque.
- Police arabe appliquée aux contrôles ; email et chronologie isolés pour la lecture bidirectionnelle.
- Changement de langue sans nouveau téléchargement, remise à zéro ni recentrage de la carte.
- Chargement signalé, réessai accessible, délais d’attente et réponses obsolètes ignorées.
- Initialisation 3D temporisée et bascule en 2D compatible en cas d’échec.
- Deux jeux de données au maximum conservés en cache pour limiter la mémoire sur mobile.
- Pause lorsque l’onglet devient masqué ; calcul des limites géographiques sans tableau intermédiaire de toutes les coordonnées.
- Contenu visible sans dépendre de l’initialisation des animations.

## Vérifications

`npm test` : **9 tests réussis**. Liens locaux et ancres, EN/FR/AR et CV, menu avant initialisation de la carte, maintien de la lecture lors des traductions, erreur/réessai, requêtes concurrentes, panne du moteur et réessai, pause en arrière-plan, validité des cinq exports de simulation.

Vérification syntaxique JavaScript et `git diff --check` réussies.

## Limites et vérification avant mise en ligne

Les tests de comportement utilisent un DOM simulé et un moteur cartographique factice. Ils ne prouvent pas le rendu CSS, les gestes tactiles, les tuiles réseau ni l’affichage WebGL de la version modifiée. Aucun test complet d’accessibilité ou de lecteur d’écran n’a été réalisé. La version modifiée reste à contrôler dans un navigateur aux largeurs 320, 768 et 1440 px, dans les trois langues et sur un appareil compatible 3D.

Les nouveaux libellés ont été harmonisés selon les principes de localisation : sens conservé, clés et liens inchangés, arabe standard et isolation des éléments latins. Les affirmations du CV n’ont pas été réévaluées. Le PDF du CV en arabe n’existe pas dans les fichiers fournis : cette langue conserve le PDF anglais.

**Aucune modification n’a été publiée sur GitHub Pages.**
