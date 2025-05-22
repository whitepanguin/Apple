// ✅ 프로필 미리보기
document.getElementById("profileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profilePreview").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// ✅ 초기 프로필 불러오기
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const res = await fetch("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.ok && data.profile) {
      document.getElementById("profilePreview").src = data.profile;
    }
  } catch (err) {
    console.error("프로필 이미지 불러오기 실패:", err);
  }
});

// ✅ 프로필 사진 수정 처리
document.getElementById("profileForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById("profileInput");
  if (fileInput.files.length === 0) {
    alert("프로필 사진을 선택해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("profile", fileInput.files[0]);

  try {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    const res = await fetch("/auth/update/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("프로필 변경 완료!");
      if (data.profile) {
        document.getElementById("profilePreview").src = data.profile;
      }
    } else {
      alert(data.message || "프로필 변경 실패");
    }
  } catch (err) {
    alert("서버 오류: " + err.message);
  }
});

// ✅ 비밀번호 변경 처리
document.getElementById("pwForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.getElementById("password").value;
  const password__re = document.getElementById("password__re").value;

  const expPwText = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&*()]{8,20}$/;

  if (!expPwText.test(password)) {
    alert("비밀번호는 8자 이상, 영문자+숫자+특수문자를 포함해야 합니다.");
    return;
  }

  if (password !== password__re) {
    alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    return;
  }

  const body = JSON.stringify({ password });

  try {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    const res = await fetch("/auth/update/password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const data = await res.json();
    if (res.ok) {
      alert("비밀번호 변경 완료!");
      location.reload();
    } else {
      alert(data.message || "비밀번호 변경 실패");
    }
  } catch (err) {
    alert("서버 오류: " + err.message);
  }
});

// ✅ 휴대전화번호 변경 처리
document.getElementById("hpForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const hp = document.getElementById("hp").value.trim();
  const phoneRegex = /^01[016789][0-9]{7,8}$/;

  if (!phoneRegex.test(hp)) {
    alert("유효한 휴대전화번호를 입력해주세요. (예: 01012345678)");
    return;
  }

  const body = JSON.stringify({ hp });

  try {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    const res = await fetch("/auth/update/phone", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const data = await res.json();
    if (res.ok) {
      alert("휴대전화번호 변경 완료!");
      location.reload();
    } else {
      alert(data.message || "변경 실패");
    }
  } catch (err) {
    alert("서버 오류: " + err.message);
  }
});
