'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function authenticateUser(email: string, passwordHash: string) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'Email or password is incorrect.' };
  if (user.passwordHash !== passwordHash) return { error: 'Email or password is incorrect.' };
  
  const cookieStore = await cookies();
  cookieStore.set('userId', user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
  return { user };
}

export async function registerNewUser(profile: any, passwordHash: string) {
  let user = await prisma.user.findUnique({ where: { email: profile.email } });
  if (user) return { error: 'An account with this email already exists.' };
  
  const isFirst = (await prisma.user.count()) === 0;
  
  user = await prisma.user.create({
    data: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      passwordHash,
      targetExam: profile.targetExam,
      examTracks: profile.examTracks || [],
      coachingBatch: profile.coachingBatch || '',
      role: isFirst ? 'admin' : 'user'
    }
  });
  
  const cookieStore = await cookies();
  cookieStore.set('userId', user.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
  return { user };
}

export async function logoutUserAction() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  cookieStore.delete('admin_session');
}

export async function pullAllData(userId: string) {
  const [
    progress,
    examScores,
    calendarEvents,
    timerSessions,
    personalExams,
    customExams,
    customChapters,
    studyDates
  ] = await Promise.all([
    prisma.taskProgress.findMany({ where: { userId } }),
    prisma.examScore.findMany({ where: { userId } }),
    prisma.calendarEvent.findMany({ where: { userId } }),
    prisma.timerSession.findMany({ where: { userId } }),
    prisma.personalExamRecord.findMany({ where: { userId } }),
    prisma.customCalendarExam.findMany({ where: { userId } }),
    prisma.customRevisionChapter.findMany({ where: { userId } }),
    prisma.studyDate.findMany({ where: { userId } })
  ]);
  
  return {
    progress,
    exam_scores: examScores,
    calendar_events: calendarEvents,
    timer_sessions: timerSessions,
    personal_exams: personalExams,
    custom_calendar_exams: customExams,
    custom_revision_chapters: customChapters,
    study_dates: studyDates.map(d => d.date)
  };
}

export async function pushData(userId: string, key: string, value: any) {
  // Validate that the request comes from the logged-in user
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get('userId')?.value;
  if (!sessionUserId || sessionUserId !== userId) return;

  try {
    switch (key) {
      case 'progress':
        await prisma.taskProgress.deleteMany({ where: { userId } });
        if (value.length > 0) {
          await prisma.taskProgress.createMany({
            data: value.map((v: any) => ({ ...v, userId, lastRevised: v.lastRevised ? new Date(v.lastRevised) : null, updatedAt: new Date(v.updatedAt) }))
          });
        }
        break;
      case 'exam_scores':
        await prisma.examScore.deleteMany({ where: { userId } });
        if (value.length > 0) {
          await prisma.examScore.createMany({
            data: value.map((v: any) => ({ ...v, userId, recordedAt: new Date(v.recordedAt) }))
          });
        }
        break;
      case 'calendar_events':
        await prisma.calendarEvent.deleteMany({ where: { userId } });
        if (value.length > 0) {
          await prisma.calendarEvent.createMany({
            data: value.map((v: any) => ({ ...v, userId }))
          });
        }
        break;
      case 'timer_sessions':
        await prisma.timerSession.deleteMany({ where: { userId } });
        if (value.length > 0) {
          await prisma.timerSession.createMany({
            data: value.map((v: any) => ({ ...v, userId, startedAt: new Date(v.startedAt), endedAt: new Date(v.endedAt) }))
          });
        }
        break;
      case 'personal_exams':
        await prisma.personalExamRecord.deleteMany({ where: { userId } });
        if (value.length > 0) {
          await prisma.personalExamRecord.createMany({
            data: value.map((v: any) => ({ ...v, userId, createdAt: new Date(v.createdAt) }))
          });
        }
        break;
      case 'custom_calendar_exams':
        await prisma.customCalendarExam.deleteMany({ where: { userId } });
        if (value.length > 0) {
          await prisma.customCalendarExam.createMany({
            data: value.map((v: any) => ({ ...v, userId, createdAt: new Date(v.createdAt) }))
          });
        }
        break;
      case 'custom_revision_chapters':
        await prisma.customRevisionChapter.deleteMany({ where: { userId } });
        if (value.length > 0) {
          await prisma.customRevisionChapter.createMany({
            data: value.map((v: any) => ({ ...v, userId, createdAt: new Date(v.createdAt) }))
          });
        }
        break;
      case 'study_dates':
        await prisma.studyDate.deleteMany({ where: { userId } });
        if (value.length > 0) {
          await prisma.studyDate.createMany({
            data: value.map((date: string) => ({ userId, date }))
          });
        }
        break;
      case 'user_profile':
        await prisma.user.update({
          where: { id: userId },
          data: {
            name: value.name,
            avatarUrl: value.avatarUrl,
            targetExam: value.targetExam,
            examTracks: value.examTracks || [],
            coachingBatch: value.coachingBatch || ''
          }
        });
        break;
    }
  } catch (error) {
    console.error(`Failed to push data for key ${key}:`, error);
  }
}

export async function fetchUsersForAdmin() {
  const users = await prisma.user.findMany();
  return users.map(u => ({ ...u, passwordHash: '' }));
}

export async function removeUserAction(targetId: string) {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get('admin_session')?.value;
  if (!sessionUserId) return { error: 'Not an admin' };
  
  if (sessionUserId === targetId) return { error: 'You cannot remove your own admin account.' };
  await prisma.user.delete({ where: { id: targetId } });
  return { success: true };
}

export async function adminLoginAction(passwordHash: string) {
  const users = await prisma.user.findMany({ where: { role: 'admin' } });
  if (users.length === 0) return { error: 'No admin found.' };
  
  const admin = users.find(u => u.passwordHash === passwordHash);
  if (!admin) return { error: 'Admin credentials are incorrect.' };
  
  const cookieStore = await cookies();
  cookieStore.set('admin_session', admin.id, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  
  return { success: true, adminId: admin.id };
}

export async function setupAdminAction(passwordHash: string, userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', userId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return { success: true };
}
