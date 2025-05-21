// 프로필 미리보기
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

// 초기 프로필 불러오기
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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

// 회원정보 수정
document.getElementById("userForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = document.getElementById("password");
  const password__re = document.getElementById("password__re");
  const hp = document.getElementById("hp");
  const fileInput = document.getElementById("profileInput");

  const expPwText = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&*]{8,20}$/;

  if (!password.value || !expPwText.test(password.value)) {
    alert("비밀번호는 8자 이상, 영문자+숫자+특수문자를 포함해야 합니다.");
    return;
  }

  if (password.value !== password__re.value) {
    alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    return;
  }

  if (!hp.value) {
    alert("휴대전화번호를 입력해주세요.");
    return;
  }

  const formData = new FormData();
  formData.append("password", password.value);
  formData.append("hp", hp.value);
  if (fileInput.files.length > 0) {
    formData.append("profile", fileInput.files[0]);
  }

  try {
    const res = await fetch("/auth/update", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      if (data.profile) {
        document.getElementById("profilePreview").src = data.profile;
      }
      alert("회원정보 수정 완료!");
      location.href = "/";
    } else {
      alert(data.message || "오류 발생");
    }
  } catch (err) {
    alert("서버 오류: " + err.message);
  }
});
