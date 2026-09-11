# Diagnostic des cartes — fichiers sources et corrections

## Ce qui est confirmé

Le ZIP fourni contient **17 fichiers** : 4 PDF, 10 JSON SUMO, 1 classeur Excel, 1 portrait et 1 page HTML. L’HTML joint séparément et l’HTML du ZIP sont identiques. Chaque entrée du ZIP a été lue et son empreinte SHA-256 comparée aux copies de travail. Les quatre PDF ont été extraits ; le mémoire et ses annexes cartographiques ont été examinés pour comprendre la méthode. Les trois feuilles du classeur ont été parcourues, y compris leurs formules et leurs avertissements. Les dix exports JSON ont été analysés intégralement.

Ce contrôle n’est pas une validation scientifique intégrale des mémoires ni une vérification externe de chaque référence bibliographique.

## Rôle réel des fichiers

| Fichiers | Contenu vérifié | Conséquence pour le portfolio |
|---|---|---|
| `pfe Elghali sany .pdf` | Mémoire OOH/DOOH de Casablanca. Paramètres SUMO p. 36–38 ; articulation trafic/audience/coûts/réglementation p. 38–40 ; résultats des capteurs p. 48–66 ; comparaison financière p. 67–103 ; annexes p. 148–154. | Source de la carte. Corriger le lien qui renvoyait à l’autre étude. |
| `AI-MCDM Investment Scoring for Smart Cities.pdf` | Étude distincte : classement de projets d’infrastructure, XGBoost, DNPV, AROMAN, carbone et risque géoéconomique. | Ce PDF ne documente pas la heatmap ni les trajectoires de Casablanca. |
| Les deux CV PDF | CV anglais/français orientés alternance en France ; expérience, outils et PFE. | Documents conservés. Ils ne décrivent pas la formule des poids de la carte. |
| `reporting_demo_portfolio.xlsx` | Trois feuilles : Dashboard KPI, Segmentation, Historique. Données explicitement fictives et reconstituées. | Démonstration de reporting, sans données de trafic ou géométrie de panneaux publicitaires. |
| `profile-photo.png` | Portrait, identique dans les copies contrôlées. | Aucun rôle analytique dans la carte. |
| HTML original | Deux modes cartographiques avec replis `makeDemoHeatmap` et `makeDemoSimulation` si le JSON manque. | Ce mécanisme pouvait montrer des données synthétiques sur l’ancienne interface. Cela ne prouve pas que le site public actuel l’utilisait. Aucun repli synthétique n’existe dans la correction livrée. |
| Cinq `*_heatmap.json` | 12 000 triplets latitude/longitude/poids chacun. Poids observés : 0,10 ; 0,18 ; 0,26 ; 0,34 ; 0,42. Pas de formule des poids, de temps ni de vitesse attachés aux points. | Conserver les points et leurs poids. Ne pas appeler le résultat un taux de congestion calibré, un nombre de personnes ou un score de rentabilité. |
| Cinq `*_simulation_geo.json` | Identifiants, positions, vitesses, angles et horodatages. 450 images par zone, de 1 s à 3 593 s, séparées de 8 s. | Lecture des images archivées, sans inventer de trajectoires intermédiaires. |

Les JSON de la livraison sont identiques à ceux du ZIP original. Une ancienne copie intermédiaire de `ben_msick_simulation_geo.json` dans `worktree/portfolio-main` était tronquée et invalide ; ni le ZIP original ni le dossier livré ne présentent cette corruption.

## Défauts de l’interface précédente

1. **Interprétation non justifiée des poids.** L’intitulé « Congestion heatmap » affirmait davantage que ce que les fichiers documentent. L’association exacte poids/vitesse/congestion ne peut pas être reconstruite sans le script d’export.
2. **Colonnes 3D artificielles.** Le code échantillonnait un point sur 42 et transformait les poids en hauteurs de 12 à 125 m. Ces hauteurs ne proviennent pas du projet. Elles ont été supprimées. Les bâtiments 3D éventuels appartiennent uniquement au fond de carte.
3. **Rendu 2D différent.** Le repli 2D affichait environ 900 disques colorés au lieu d’une heatmap de tous les points. La correction utilise Leaflet.heat sur les 12 000 échantillons, avec leurs poids originaux. Les deux moteurs ont des algorithmes de lissage différents : leurs couleurs ne sont pas une échelle quantitative commune et dépendent du zoom.
4. **Lecture peu explicite.** Le passage à « Vehicle simulation » chargeait les données mais laissait la lecture en pause, avec les commandes tout en bas d’une grande carte. La nouvelle action demande explicitement de lire les véhicules ; les commandes sont en haut. L’animation automatique respecte la préférence système de réduction des mouvements.
5. **Vitesse de lecture trompeuse.** L’ancien « 1× » avançait de 8 secondes simulées toutes les 420 ms, soit environ 19×. Le nouveau 20× avance de 8 secondes toutes les 400 ms ; 1× conserve 8 secondes entre images. Il s’agit de la cadence programmée : un appareil saturé peut afficher plus lentement.
6. **Statistiques de périmètres différents.** Les moyennes stockées dans `kpis` ne correspondent pas toujours aux enregistrements du fichier réduit. La vitesse affichée est désormais la moyenne des véhicules de l’image visible. Le nombre de positions est recompté ; il ne représente pas des personnes ou des véhicules uniques.
7. **Chargements lourds et dépendance au CDN.** Les cinq fichiers de trajectoires pèsent chacun entre 10,4 et 17,1 Mo. Des copies gzip sans perte sont fournies et les moteurs 2D/heatmap sont installés localement.

## Chiffres recalculés sur les exports fournis

| Zone | Images | Enregistrements de position | Maximum observé par image | Vitesse moyenne recalculée, m/s | Moyenne dans les métadonnées, m/s | JSON → gzip, Mo décimaux |
|---|---:|---:|---:|---:|---:|---:|
| Maârif | 450 | 189 811 | 450 | 4,3051 | 3,92 | 17,102 → 2,884 |
| Hay Hassani | 450 | 148 840 | 450 | 2,6996 | 2,54 | 13,372 → 1,892 |
| Ben M’Sick | 450 | 114 424 | 319 | 10,4386 | 10,44 | 10,382 → 1,577 |
| Sidi Maârouf | 450 | 171 896 | 450 | 4,1553 | 3,65 | 15,444 → 2,412 |
| Bd Mohammed V | 450 | 172 079 | 450 | 2,6586 | 2,50 | 15,410 → 2,361 |

Formule de la moyenne recalculée : somme de `vehicle.speed` / nombre d’enregistrements. Un véhicule présent dans plusieurs images est compté plusieurs fois. Les fichiers sont déjà réduits ; ces moyennes ne permettent pas de comparer le trafic total réel des quartiers.

Les métadonnées indiquent `stepInterval: 4`, mais les différences des horodatages sont toutes de 8 secondes. La lecture utilise les horodatages du fichier. Les poids élevés et les positions répétées ne suffisent pas à établir une formule de congestion ou un temps d’exposition publicitaire.

## Observation de la version publique

Dans la session de contrôle, Maârif a chargé en mode Leaflet 2D. Après un clic sur Play, le compteur est passé de 18:09 à 34:49 avant la pause. **Le blocage exact signalé sur l’appareil de l’utilisateur n’a pas été reproduit.** Il ne faut pas déduire de ce contrôle que la simulation fonctionne sur tous les appareils. Les modifications n’ont pas été publiées sur GitHub Pages.

## Point à vérifier dans le mémoire : unités des capteurs

La capture XML du capteur 1, p. 153, contient notamment `speed="22.21"`. Le tableau p. 48 reprend 22,21 sous une colonne « km/h ». La documentation SUMO définit pourtant `speed` des détecteurs E1 en **m/s**. La même ambiguïté existe pour le capteur 3. C’est une incohérence d’unité à vérifier à partir des XML originaux ; le PDF n’a pas été modifié. La carte conserve les vitesses des exports en m/s.

Sources techniques consultées : [sortie FCD SUMO](https://sumo.dlr.de/docs/Simulation/Output/FCDOutput.html), [détecteurs E1 SUMO](https://sumo.dlr.de/docs/Simulation/Output/Induction_Loops_Detectors_%28E1%29.html), [Leaflet 1.9.4](https://leafletjs.com/reference.html), [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat).

## Validation et limites

- `npm test` : 16 tests réussis, dont une lecture des positions réelles de Maârif jusqu’à l’interface du moteur, les statistiques de l’image, l’utilisation des 12 000 points et la décompression des dix fichiers identique aux sources.
- `git diff --check` et vérification syntaxique JavaScript : réussis.
- Les moteurs cartographiques sont simulés dans les tests DOM. La version modifiée n’a pas été validée visuellement sur téléphone ni en WebGL. Ces tests ne constituent pas une preuve du rendu graphique.
- Aucun point de panneau publicitaire, de capteur ou de score financier n’a été inventé.
- Les fichiers originaux `.net.xml`, `.rou.xml`, `.sumocfg`, les définitions/résultats de capteurs `.add.xml`/XML, le FCD complet et le script de génération des poids ne sont pas présents dans le ZIP. Ils sont nécessaires pour reconstruire et vérifier la simulation complète et une mesure de congestion documentée.

Reproduction des chiffres et des fichiers compressés : `python3 scripts/prepare-mobility.py`. Les tailles exactes et empreintes sont conservées dans `mobility-manifest.json` ; l’inventaire initial figure dans `source-inventory.json`.
