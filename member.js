// YSFC 회원 추적 (모든 페이지 공통)
(async function() {
  const nick = localStorage.getItem('ysfc_nick');
  if (!nick) return;

  try {
    // 독립적인 앱 인스턴스로 초기화 (충돌 방지)
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js");
    const { getFirestore, doc, setDoc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js");

    const firebaseConfig = {
      apiKey: "AIzaSyABY7cdBTXJVbnNVVJmhuo9nXNLerbtVEo",
      authDomain: "ysfc-app-ff413.firebaseapp.com",
      projectId: "ysfc-app-ff413",
      storageBucket: "ysfc-app-ff413.firebasestorage.app",
      messagingSenderId: "791661747168",
      appId: "1:791661747168:web:3540aacb15306331afe985"
    };

    // 항상 별도 이름으로 초기화 (충돌 완전 방지)
    let app;
    try {
      app = initializeApp(firebaseConfig, 'memberTracker');
    } catch(e) {
      const { getApp } = await import("https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js");
      app = getApp('memberTracker');
    }

    const db = getFirestore(app);
    const safeId = nick.replace(/[\/\\#?.[\]]/g, '_');
    const ref = doc(db, 'members', safeId);
    const now = new Date();

    // 기존 데이터 확인
    let joinedAt = now;
    try {
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().joinedAt) {
        joinedAt = snap.data().joinedAt;
      }
    } catch(e) {}

    // 저장 (joinedAt 유지, lastSeen 업데이트)
    await setDoc(ref, {
      nick,
      joinedAt,
      lastSeen: now
    });

  } catch(e) {
    console.error('회원 기록 오류:', e);
  }
})();