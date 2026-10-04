import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const courses = [
  { title: 'Les bases du développement web', domain: 'Développement web', instructor: 'Maya Koffi', language: 'Français', level: 'BEGINNER' as const, description: 'Comprendre le web moderne, les navigateurs et les bases HTML, CSS et JavaScript pour commencer à construire.', modules: [['Comprendre comment fonctionne le web', 1, 420], ['Construire une première page', 2, 540], ['Ajouter de l’interactivité', 3, 600]] },
  { title: 'JavaScript pour construire', domain: 'Programmation', instructor: 'Thomas Adom', language: 'Français', level: 'INTERMEDIATE' as const, description: 'Passez des bases aux concepts qui permettent d’écrire du JavaScript propre, lisible et réellement utile.', modules: [['Variables, fonctions et objets', 1, 510], ['Asynchrone et APIs', 2, 660], ['Structurer une application', 3, 720]] },
  { title: 'Angular en pratique', domain: 'Développement web', instructor: 'Nadia Houngbédji', language: 'Français', level: 'INTERMEDIATE' as const, description: 'Construisez une application Angular moderne avec composants standalone, routing, formulaires et services.', modules: [['Architecture d’une application Angular', 1, 600], ['Routing et composants', 2, 720], ['Services et données', 3, 780]] },
  { title: 'Concevoir une API REST', domain: 'Backend & API', instructor: 'Oscar M.', language: 'Français', level: 'ADVANCED' as const, description: 'Concevez une API claire et robuste avec authentification, persistance PostgreSQL et bonnes pratiques REST.', modules: [['Modéliser les données', 1, 600], ['Authentification et sécurité', 2, 720], ['Structurer les endpoints', 3, 840]] },
  { title: 'TypeScript sans douleur', domain: 'Programmation', instructor: 'Aïcha Soglo', language: 'Français', level: 'BEGINNER' as const, description: 'Ajoutez des types utiles à vos projets JavaScript et gagnez en confiance sans complexifier votre code.', modules: [['Types et interfaces', 1, 480], ['Fonctions et generics', 2, 600], ['Organiser un projet', 3, 660]] },
  { title: 'PostgreSQL en pratique', domain: 'Données', instructor: 'Samuel Dossou', language: 'Français', level: 'INTERMEDIATE' as const, description: 'Apprenez à modéliser, interroger et faire évoluer une base PostgreSQL pour vos applications.', modules: [['Tables et relations', 1, 540], ['Requêtes SQL utiles', 2, 660], ['Index et performances', 3, 720]] },
  { title: 'UX pour développeurs', domain: 'Design produit', instructor: 'Mariam Agossou', language: 'Français', level: 'BEGINNER' as const, description: 'Comprenez les principes essentiels de l’expérience utilisateur pour concevoir des interfaces plus claires.', modules: [['Observer les utilisateurs', 1, 420], ['Hiérarchie et navigation', 2, 540], ['Prototyper une interface', 3, 600]] },
  { title: 'Git et travail en équipe', domain: 'Workflow', instructor: 'Kevin Hounkpatin', language: 'Français', level: 'BEGINNER' as const, description: 'Maîtrisez les bases de Git, des branches et des commits propres pour travailler sereinement en équipe.', modules: [['Comprendre Git', 1, 360], ['Branches et conflits', 2, 480], ['Commits et collaboration', 3, 540]] },
  { title: 'Déployer une application web', domain: 'Déploiement', instructor: 'Nicolas Houéto', language: 'Français', level: 'ADVANCED' as const, description: 'Préparez une application pour la production avec variables d’environnement, Docker et déploiement.', modules: [['Préparer la production', 1, 540], ['Conteneuriser avec Docker', 2, 660], ['Déployer et surveiller', 3, 720]] },
  { title: 'Créer des interfaces accessibles', domain: 'Frontend', instructor: 'Claire Ahouansou', language: 'Français', level: 'BEGINNER' as const, description: 'Construisez des interfaces web lisibles, accessibles et agréables à utiliser sur tous les écrans.', modules: [['HTML sémantique', 1, 420], ['Clavier et formulaires', 2, 540], ['Contrastes et lisibilité', 3, 600]] },
  { title: 'Node.js et Express', domain: 'Backend & API', instructor: 'David Zinsou', language: 'Français', level: 'INTERMEDIATE' as const, description: 'Créez un serveur Node.js structuré avec Express, des routes propres et une gestion claire des erreurs.', modules: [['Serveur et routes', 1, 480], ['Middleware et validation', 2, 600], ['Organiser une API', 3, 720]] },
  { title: 'Docker pour développeurs', domain: 'Déploiement', instructor: 'Éric Aïssi', language: 'Français', level: 'INTERMEDIATE' as const, description: 'Comprenez les conteneurs et utilisez Docker pour reproduire un environnement de développement fiable.', modules: [['Images et conteneurs', 1, 420], ['Docker Compose', 2, 540], ['Préparer une application', 3, 660]] },
  { title: 'Frontend Performance Essentials', domain: 'Web Development', instructor: 'Jordan Blake', language: 'English', level: 'INTERMEDIATE' as const, description: 'Learn practical techniques to make modern web interfaces faster, lighter and more responsive.', modules: [['Measure what matters', 1, 480], ['Optimize assets and loading', 2, 600], ['Improve runtime performance', 3, 660]] },
  { title: 'Modern CSS Layouts', domain: 'Frontend', instructor: 'Emma Carter', language: 'English', level: 'BEGINNER' as const, description: 'Build flexible interfaces with modern CSS techniques that adapt naturally to different screens.', modules: [['Flexbox fundamentals', 1, 420], ['Grid for real interfaces', 2, 540], ['Responsive layout patterns', 3, 600]] },
  { title: 'React for Angular Developers', domain: 'Frontend', instructor: 'Liam Brooks', language: 'English', level: 'INTERMEDIATE' as const, description: 'Discover React through concepts that experienced frontend developers can apply immediately.', modules: [['Components and JSX', 1, 480], ['State and effects', 2, 600], ['Build a small React feature', 3, 720]] },
  { title: 'API Security Fundamentals', domain: 'Backend & API', instructor: 'Noah Williams', language: 'English', level: 'ADVANCED' as const, description: 'Understand the essential security practices for protecting APIs, sessions and user data.', modules: [['Threats and attack surfaces', 1, 540], ['Authentication and authorization', 2, 660], ['Validate and protect endpoints', 3, 720]] },
  { title: 'Testing Web Applications', domain: 'Quality', instructor: 'Sophia Miller', language: 'English', level: 'INTERMEDIATE' as const, description: 'Learn how to build confidence in web applications with focused unit, integration and end-to-end tests.', modules: [['What makes a good test', 1, 420], ['Test services and APIs', 2, 600], ['Cover critical user flows', 3, 660]] },
  { title: 'Clean Code for Developers', domain: 'Programming', instructor: 'Ethan Davis', language: 'English', level: 'INTERMEDIATE' as const, description: 'Improve the readability and maintainability of your code with practical habits and refactoring techniques.', modules: [['Naming and structure', 1, 420], ['Reduce complexity', 2, 540], ['Refactor with confidence', 3, 660]] },
];

const VIDEO_URL = 'https://media.w3.org/2010/05/sintel/trailer.mp4';
const ENGLISH_AUDIO_URL = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/LL-Q1860%20%28eng%29-Vealhurl-reported%20speech.wav';
const FRENCH_AUDIO_URL = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/LL-Q150%20%28fra%29-Ben%20%28Mathsou%29-parle.wav';

async function main() {
  for (const course of courses) {
    const existing = await prisma.course.findFirst({ where: { title: course.title } });
    if (existing) continue;

    await prisma.course.create({
      data: {
        title: course.title,
        domain: course.domain,
        instructor: course.instructor,
        language: course.language,
        level: course.level,
        description: course.description,
        modules: {
          create: course.modules.map(([title, position, durationSeconds]) => ({
            title: title as string,
            position: position as number,
            durationSeconds: durationSeconds as number,
            videoUrl: VIDEO_URL,
            audioTracks: {
              create: [
                { language: 'English', url: ENGLISH_AUDIO_URL },
                { language: 'Français (simulation)', url: FRENCH_AUDIO_URL },
              ],
            },
          })),
        },
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
