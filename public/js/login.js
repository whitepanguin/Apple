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

            // 로그인 유지 여부에 따라 저장소 결정
            const storage = checkbox.checked ? localStorage : sessionStorage;

            storage.setItem("token", data.token);
            storage.setItem("userid", data.userid);

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
