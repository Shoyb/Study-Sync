import fs from 'fs';
import path from 'path';

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      if (fullPath.includes('storage.ts')) continue;
      
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Basic replacements for UI components
      content = content.replace(/setProgress\(getProgress\(\)\)/g, 'setProgress(await getProgress())');
      content = content.replace(/setProgress\(updateChapterProgress\((.*?)\)\)/g, 'setProgress(await updateChapterProgress($1))');
      content = content.replace(/setScores\(getExamScores\(\)\)/g, 'setScores(await getExamScores())');
      content = content.replace(/setPersonal\(getPersonalExams\(\)\)/g, 'setPersonal(await getPersonalExams())');
      content = content.replace(/setSessions\(getTimerSessions\(\)\)/g, 'setSessions(await getTimerSessions())');
      content = content.replace(/setCustomChapters\(getCustomRevisionChapters\(\)\)/g, 'setCustomChapters(await getCustomRevisionChapters())');
      content = content.replace(/setExams\(getCustomCalendarExams\(\)\)/g, 'setExams(await getCustomCalendarExams())');
      content = content.replace(/setAccounts\(getAccounts\(\)\)/g, 'setAccounts(await getAccounts())');
      content = content.replace(/setEvents\(getCalendarEvents\(\)\)/g, 'setEvents(await getCalendarEvents())');
      content = content.replace(/getStreak\(\)/g, 'await getStreak()');
      
      // Fix useEffect timers
      content = content.replace(/const timer = window.setTimeout\(\(\) => \{([\s\S]*?)\}, 0\);/g, 'const timer = window.setTimeout(async () => {$1}, 0);');
      
      // Make functions async if they use await
      content = content.replace(/const cycleStatus = \(chId: string\) => \{/g, 'const cycleStatus = async (chId: string) => {');
      content = content.replace(/const setConfidence = \(chId: string, level: number\) => \{/g, 'const setConfidence = async (chId: string, level: number) => {');
      content = content.replace(/const setNotes = \(chId: string, notes: string\) => \{/g, 'const setNotes = async (chId: string, notes: string) => {');
      content = content.replace(/const submit = \(event/g, 'const submit = async (event');
      content = content.replace(/onClick=\{e => \{ e\.stopPropagation\(\); cycleStatus\(ch\.id\); \}\}/g, 'onClick={async e => { e.stopPropagation(); await cycleStatus(ch.id); }}');
      
      // Profile usages
      content = content.replace(/const profile = getUserProfile\(\);/g, 'const profile = await getUserProfile();');
      // Some profile usages are in top level of components which isn't valid for async, wait:
      // In dashboard/page.tsx:
      // const [profile, setProfile] = useState(getUserProfile()); -> Needs to be inside useEffect.
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(path.join(process.cwd(), 'src/app'));
