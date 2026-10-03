import { Router, type Request } from 'express';
import { prisma } from '../lib/prisma.js';
import { verifyAccessToken } from '../auth/jwt.js';
import { requireAuth, type AuthenticatedRequest } from '../auth/middleware.js';

export const coursesRouter = Router();

function getOptionalUserId(req: Request): number | null {
  const authorization = req.header('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const payload = verifyAccessToken(authorization.slice('Bearer '.length).trim());
    return Number.isInteger(payload.userId) ? payload.userId : null;
  } catch {
    return null;
  }
}

coursesRouter.get('/courses', async (_req, res) => {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        orderBy: { position: 'asc' },
      },
    },
    orderBy: { id: 'asc' },
  });

  return res.json(courses.map(({ modules, ...course }) => ({
    ...course,
    modules: modules.map(({ videoUrl, audioTracks, ...module }) => module),
  })));
});

coursesRouter.get('/courses/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'INVALID_ID' });
  }

  const userId = getOptionalUserId(req);

  const enrollment = userId
    ? await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: id } },
        select: { userId: true },
      })
    : null;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { position: 'asc' },
        include: {
          audioTracks: true,
        },
      },
    },
  });

  if (!course) {
    return res.status(404).json({ error: 'COURSE_NOT_FOUND' });
  }

  if (!enrollment) {
    return res.json({
      ...course,
      modules: course.modules.map(({ videoUrl, audioTracks, ...module }) => module),
    });
  }

  return res.json(course);
});

coursesRouter.get('/me/courses', requireAuth, async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { position: 'asc' },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  const done = new Set(
    (
      await prisma.moduleCompletion.findMany({
        where: { userId },
        select: { moduleId: true },
      })
    ).map((item) => item.moduleId),
  );

  return res.json(
    enrollments.map(({ course }) => ({
      course,
      completedModuleIds: course.modules
        .filter((module) => done.has(module.id))
        .map((module) => module.id),
      progress: course.modules.length
        ? Math.round(
            (course.modules.filter((module) => done.has(module.id)).length /
              course.modules.length) *
              100,
          )
        : 0,
    })),
  );
});

coursesRouter.post('/courses/:id/enroll', requireAuth, async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;
  const courseId = Number(req.params.id);

  if (!Number.isInteger(courseId)) {
    return res.status(400).json({ error: 'INVALID_ID' });
  }

  if (!(await prisma.course.findUnique({ where: { id: courseId } }))) {
    return res.status(404).json({ error: 'COURSE_NOT_FOUND' });
  }

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId },
    update: {},
  });

  return res.status(201).json({ enrolled: true });
});

coursesRouter.post('/modules/:id/complete', requireAuth, async (req, res) => {
  const userId = (req as AuthenticatedRequest).userId;
  const moduleId = Number(req.params.id);

  if (!Number.isInteger(moduleId)) {
    return res.status(400).json({ error: 'INVALID_ID' });
  }

  const module = await prisma.module.findUnique({ where: { id: moduleId } });

  if (!module) {
    return res.status(404).json({ error: 'MODULE_NOT_FOUND' });
  }

  if (
    !(await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: module.courseId } },
    }))
  ) {
    return res.status(403).json({ error: 'NOT_ENROLLED' });
  }

  await prisma.moduleCompletion.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    create: { userId, moduleId },
    update: {},
  });

  return res.status(201).json({ completed: true });
});
