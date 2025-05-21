async function sendit(event) {
    event.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const checkbox = document.getElementById("checkbox");

    if (email.value === "") {
        alert("이메일을 입력해주세요.");
        email.focus();
        return false;
    }
    if (password.value === "") {
        alert("비밀번호를 입력해주세요.");
        password.focus();
        return false;
    }

    const loginData = {
        email: email.value,
        password: password.value
    };

    console.log("로그인 데이터:", loginData);

    try {
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();
        console.log("서버 응답:", data);

        if (response.ok) {
            alert("로그인 성공!");

            // ✅ sessionStorage는 항상 저장
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userid", data.userid);

            // ✅ 로그인 유지 체크 시 localStorage에도 저장
            if (checkbox.checked) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userid", data.userid);
            } else {
                // 혹시 이전에 저장된 localStorage 토큰이 있으면 제거
                localStorage.removeItem("token");
                localStorage.removeItem("userid");
            }

            window.location.href = "/";
        } else {
            alert(data.message || "로그인 실패");
        }
    } catch (error) {
        console.error("에러 발생:", error);
        alert("서버와 통신 중 문제가 발생했습니다.");
    }

    return false;
}
