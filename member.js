// YSFC 회원 추적 (모든 페이지 공통)
(async function() {
  const nick = localStorage.getItem('ysfc_nick');
  if (!nick) return; // 닉네임 없으면 기록 안 함

  try {
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

    // 이미 다른 곳에서 초기화됐을 수도 있으니 안전하게
    let app;
    try { app = initializeApp(firebaseConfig, 'memberApp'); }
    catch(e) { app = initializeApp(firebaseConfig); }
    const db = getFirestore(app);

    // 닉네임을 문서 ID로 사용 (특수문자 제거)
    const safeId = nick.replace(/[\/\\#?]/g, '_');
    const ref = doc(db, 'members', safeId);

    const now = new Date();
    let isNew = false;
    try {
      const snap = await getDoc(ref);
      isNew = !snap.exists();
    } catch(e) {}

    const data = { nick, lastSeen: now };
    if (isNew) data.joinedAt = now;

    await setDoc(ref, data, { merge: true });
  } catch(e) {
    console.error('회원 기록 오류:', e);
  }
})();