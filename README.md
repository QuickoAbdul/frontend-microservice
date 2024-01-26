## Tutoriel Installation : 
- Pour lancer ce projet, créer un dossier [API3] 
- Ouvrer un IDE en vous plaçant sur ce dossier
- Puis executer 4 commandes :

```sh
git clone https://github.com/QuickoAbdul/frontend-microservice.git
git clone https://github.com/LQ-Wylp/Management_Planning_API.git
git clone https://github.com/LucieGPPE/attendance_management.git
git clone https://github.com/matvalcke/users_management.git
```
Vous êtes censez avoir ça : 

![image](https://github.com/QuickoAbdul/frontend-microservice/assets/90459692/fecd0aee-acca-4a04-bbfa-3dacc9237eb0)

Executer ensuite 4 terminal différent et renomer les pour éviter les confusion

![image](https://github.com/QuickoAbdul/frontend-microservice/assets/90459692/c08adcd8-3e13-4c32-b764-10f80cd01766)

### : Terminal VueJS
Executer les commandes 
```sh
cd .\frontend-microservice
```

```sh
npm install 
```

```sh
npm run dev 
```

Le frontEnd sera executer alors sur un premier port au hasard exemple :(localhost:1573)

## : Terminal Planning (Quentin & Julian) (Installer Php et Symfony avant)
- Déplacer vous dans le terminal Planning
- Executer les commandes  
```sh
cd .\Management_Planning_API\
```

```sh
composer install 
```

- Puis ouvrer votre gestionnaire de DATABASE (exmple: MySQl) et créer une base de données avec pour nom planning
- Configurer le .env par rapport à la votre
  
```sh
DATABASE_URL="mysql://root:@127.0.0.1:3306/planning"
```

- Executer dans le terminal la commande pour migrer les tables dans votre DB suivant : 

```sh
php bin/console d:m:m
```

Enfin executer le serveur 
```sh
symfony server:start --port=8001
```

Ce microservice sera alors executer sur le port (127.0.0.1:8001)

### : Terminal Users_management 
- Déplacer vous dans le terminal Users_management
- Executer les commandes (si besoin appliquer la commande 2 fois pour être bien placé)
```sh
cd .\users_management\
```

```sh
composer install 
```
Si vous rencontrer une erreur Php alors ouvrer le fichier php.ini sur votre machine et modifier la ligne : 

```sh
;extension=sodium
```
EN ->
```sh
extension=sodium
```
Le reste ne fonctionne pas impossible à lancer le microservice pour l'instant
Faire le reste du readme

