# 5. Tests

## Tests automatisés

Les tests frontend vérifient notamment les appels HTTP du service de formations : catalogue, détail, inscription et validation d'un module.

Commande :

```bash
cd frontend
npm test -- --watch=false
```

## Vérifications fonctionnelles

- inscription avec un nouveau compte ;
- connexion puis déconnexion ;
- accès refusé au tableau de bord sans session ;
- recherche par titre et formateur ;
- filtres langue et niveau ;
- inscription à une formation ;
- accès au lecteur ;
- changement de piste audio ;
- validation d'un module ;
- passage au module suivant ;
- progression visible dans la bibliothèque ;
- accès public sans médias ;
- accès aux médias après inscription.
