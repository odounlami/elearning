import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const courses = [
  { title: 'Les bases du développement web', domain: 'Développement web', instructor: 'Maya Koffi', language: 'Français', level: 'BEGINNER' as const, description: 'Comprendre le web moderne, les navigateurs et les bases HTML, CSS et JavaScript pour commencer à construire.', modules: [['Comprendre comment fonctionne le web', 1, 420], ['Construire une première page', 2, 540], ['Ajouter de l’interactivité', 3, 600]] },
  { title: 'JavaScript pour construire', domain: 'Programmation', instructor: 'Thomas Adom', language: 'Français', level: 'INTERMEDIATE' as const, description: 'Passez des bases aux concepts qui permettent d’écrire du JavaScript propre, lisible et réellement utile.', modules: [['Variables, fonctions et objets', 1, 510], ['Asynchrone et APIs', 2, 660], ['Structurer une application', 3, 720]] },
  { title: 'Angular en pratique', domain: 'Développement web', instructor: 'Nadia Houngbédji', language: 'Français', level: 'INTERMEDIATE' as const, description: 'Construisez une application Angular moderne avec composants standalone, routing, formulaires et services.', modules: [['Architecture d’une application Angular', 1, 600], ['Routing et composants', 2, 720], ['Services et données', 3, 780]] },
  { title: 'Concevoir une API REST', domain: 'Backend & API', instructor: 'Oscar M.', language: 'Français', level: 'ADVANCED' as const, description: 'Concevez une API claire et robuste avec authentification, persistance PostgreSQL et bonnes pratiques REST.', modules: [['Modéliser les données', 1, 600], ['Authentification et sécurité', 2, 720], ['Structurer les endpoints', 3, 840]] },
];

const VIDEO_URL = 'https://media.w3.org/2010/05/sintel/trailer.mp4';
const ENGLISH_AUDIO_URL = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/LL-Q1860%20%28eng%29-Vealhurl-reported%20speech.wav';
const FRENCH_AUDIO_URL = 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Fr-prononciation.ogg';

async function main() {
  if (await prisma.course.count()) {
    await prisma.module.updateMany({ data: { videoUrl: VIDEO_URL } });
    await prisma.audioTrack.updateMany({
      where: { language: 'English' },
      data: { url: ENGLISH_AUDIO_URL },
    });
    await prisma.audioTrack.updateMany({
      where: { language: { contains: 'Français' } },
      data: { language: 'Français', url: FRENCH_AUDIO_URL },
    });
    console.log('Seed updated: learning media restored.');
    return;
  }

  for (const course of courses) {
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
                { language: 'Français', url: FRENCH_AUDIO_URL },
              ],
            },
          })),
        },
      },
    });
  }
}

main().finally(() => prisma.$disconnect());
