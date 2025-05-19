async function updateUser(event) {
  event.preventDefault();

  const password = document.getElementById("password");
  const password__re = document.getElementById("password__re");
  const hp = document.getElementById("hp");

  const expPwText =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&])[A-Za-z\d!@#$%^&*]{8,20}$/;

  if (password.value === "") {
    alert("비밀번호를 입력해주세요.");
    password.focus();
    return false;
  }

  if (!expPwText.test(password.value)) {
    alert("비밀번호는 8자 이상, 영문자+숫자+특수문자를 포함해야 합니다.");
    password.focus();
    return false;
  }

  if (password__re.value === "") {
    alert("비밀번호 확인을 입력해주세요.");
    password__re.focus();
    return false;
  }

  if (password.value !== password__re.value) {
    alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    password__re.focus();
    return false;
  }

  if (hp.value === "") {
    alert("휴대전화 번호를 입력해주세요.");
    hp.focus();
    return false;
  }

  const updateData = {
    password: password.value,
    hp: hp.value,
  };

  try {
    console.log("보낼 데이터:", updateData);

    const response = await fetch("/auth/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("회원정보가 성공적으로 수정되었습니다.");
      window.location.href = "/";
    } else {
      alert(data.message || "회원정보 수정에 실패했습니다.");
    }
  } catch (error) {
    console.error("수정 중 오류:", error);
    alert("서버와 통신 중 문제가 발생했습니다.");
  }

  return false;
}
