=============================
SERVICE DE MANAGEMENT DE BOTS
=============================


Emplacement : localhost:3001/



1. Description
--------------

Ce projet a pour but de pouvoir gérer un parc de bots : leur création, leur modification et leur suppression.
Un bot est un objet composé d'un ID, d'un nom, d'une date de création, de tags, d'un commentaire, de 2 flags
d'autorisation (pour discord et socket) ainsi que d'un chemin vers un cerveau. Ce cerveau lui permet de
communiquer en langage courant avec un utilisateur. Le cerveau est un fichier rivescript qui, à l'aide de la
bibliothèque RiveScript, lui permet de trouver des réponses à des messages qu'on lui soumet.



2. Fonctionnalités
------------------

Le présent site permet:

-> D'afficher tous les bots disponibles
-> De modifier ces bots en réécrivant leurs attributs et en cliquant sur "Accepter modification".
-> De supprimer ces bots en cliquant sur "Supprimer".
-> D'autoriser ou non ces bots sur Discord ou un socket en cliquant sur le bouton qu correspond (rouge pour non,
      vert pour oui)
-> De créer un bot en cliquant sur "AJOUTER".
         '-> Ceci peut être annulé par le bouton "Annuler".
         '-> On peut rentrer les caractéristiques du bot. Il existe des valeurs par défaut si l'utilisateur ne
               remplit pas correctement ou certains attributs.
-> De tester 2 cerveaux présents dans l'emplacement en bas : le cerveau de base et le cerveau secondaire.
         '-> On peut écrire des questions dans l'encart prévu et l'envoyant en appuyant sur "Ask".
-> De changer le cerveau en cours de test en appuyant sur le bouton en bleu (sous le titre d'essai de bots).

Il est également possible d'ajouter un cerveau en le placant dans les fichiers, dans le répertoire "brains".



3. Architecture
---------------

Ce projet est basé sur une architacture API RESTful : les endpoints utilisent les ID des objets à manipuler
afin de les trouver et les traiter.

index.html :
Contient l'affichage de la page. Il permet d'afficher une liste de bots et l'encart de tests, ainsi que le
menu de création d'un bot.
Le fichier contient de nombeuses fonctions ayant pour but d'envoyer des requêtes de différents usages (création,
modification, suppression de bots, requête de message à un bot...).

index.mjs :
C'est la partie qui traite les requêtes par endpoints. Chaque endpoint recoit un type de requête et la traite en
conséquence.

Les fichiers *.rive :
Ce sont les cerveaux : ils permettent d'associer des réponses à des messages utilisateurs.

Bot.mjs :
Il s'agit de la classe qui instancie les bots.

BotService_LowDbImpl.mjs :
C'est le fichier qui gère la base de données des bots. Plusieurs fonctions peuvent être utilisées pour accéder à
cette base de donnée et en tirer les informations nécessaires.


4. Installation et utilisation
------------------------------

Le GIT de ce projet contient normalement toutes les extensions requises.
Sinon, il faut installer npm, rivescript et nodejs depuis votre terminal par exemple.

Dans un terminal, se placer dans le répertoire ~/[le nom de votre répertoire pour ce projet]/BotServer/
Ensuite, utiliser la commande "npm run nodemon" permet de lancer le serveur.
Allez dans une page web à l'adresse http://localhost:3001/

La page est disponible.