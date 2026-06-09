// YSFC 회원 추적 (모든 페이지 공통)
(async function() {
  const nick = localStorage.getItem('ysfc_nick');
  if (!nick) return;

  try {
    const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js");
    const { getFirestore, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");

    const firebaseConfig = {
      apiKey: "AIzaSyABY7cdBTXJVbnNVVJmhuo9nXNLerbtVEo",
      authDomain: "ysfc-app-ff413.firebaseapp.com",
      projectId: "ysfc-app-ff413",
      storageBucket: "ysfc-app-ff413.firebasestorage.app",
      messagingSenderId: "791661747168",
      appId: "1:791661747168:web:3540aacb15306331afe985"
    };

    // 이미 초기화된 앱 재사용, 없으면 새로 생성
    const existingApps = getApps();
    const app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const safeId = nick.replace(/[\/\\#?.]/g, '_');
    const ref = doc(db, 'members', safeId);

    const now = new Date();
    await setDoc(ref, {
      nick,
      lastSeen: now,
      joinedAt: now
    }, { merge: true });

  } catch(e) {
    console.error('회원 기록 오류:', e);
  }
})();