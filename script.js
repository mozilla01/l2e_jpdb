const token = localStorage.getItem("connToken");
const baseURL = "http://api.login2explore.com:5577";
const dbName = "SCHOOL-DB";
const relName = "STUDENT-TABLE";

const resetForm = () => {
  document.querySelectorAll("input").forEach((input, index) => {
    if (index === 0) {
      input.disabled = false;
      input.focus();
    }
    if (input.type === "text" || input.type === "date") input.value = "";
    if (input.type === "button") input.disabled = true;
  });
};
const showFlash = (message) => {
  const flash = document.getElementById("flash");
  flash.innerHTML = message;
  flash.style.bottom = "10px";
  setTimeout(() => {
    flash.style.bottom = "-100px";
  }, 4000);
};
const getAndValidateFormData = () => {
  const rollNo = document.getElementById("rollNo").value;
  const fullName = document.getElementById("fullName").value;
  const studentClass = document.getElementById("class").value;
  const birthDate = document.getElementById("birthDate").value;
  const address = document.getElementById("address").value;
  const enrollDate = document.getElementById("enrollDate").value;

  if (rollNo === "") {
    showFlash("Roll number is required");
    document.getElementById("rollNo").focus();
    return "";
  } else if (fullName === "") {
    showFlash("Full name is required");
    document.getElementById("fullName").focus();
    return "";
  } else if (studentClass === "") {
    showFlash("Class is required");
    document.getElementById("class").focus();
    return "";
  } else if (birthDate === "") {
    showFlash("Birth date is required");
    document.getElementById("birthDate").focus();
    return "";
  } else if (address === "") {
    showFlash("Address is required");
    document.getElementById("address").focus();
    return "";
  } else if (enrollDate === "") {
    showFlash("Enroll date is required");
    document.getElementById("enrollDate").focus;
    return "";
  }

  return {
    roll: rollNo,
    fullName: fullName,
    class: studentClass,
    birthDate: birthDate,
    address: address,
    enrollDate: enrollDate,
  };
};
const getStudentDetails = async () => {
  const rollNo = document.getElementById("rollNo").value;

  const response = await fetch(`${baseURL}/api/irl`, {
    method: "POST",
    body: JSON.stringify({
      token: token,
      dbName: dbName,
      cmd: "GET_BY_KEY",
      rel: relName,
      jsonStr: {
        roll: rollNo,
      },
    }),
  });
  const data = await response.json();
  if (data.status == 400) {
    document.getElementById("save").disabled = false;
    document.getElementById("formReset").disabled = false;
    document.getElementById("change").disabled = true;
  } else {
    document.getElementById("rollNo").disabled = true;
    const studentDetails = JSON.parse(data.data);
    console.log(studentDetails);
    document.getElementById("fullName").value = studentDetails.record.fullName;
    document.getElementById("class").value = studentDetails.record.class;
    document.getElementById("birthDate").value =
      studentDetails.record.birthDate;
    document.getElementById("address").value = studentDetails.record.address;
    document.getElementById("enrollDate").value =
      studentDetails.record.enrollDate;
    document.getElementById("save").disabled = true;
    document.getElementById("change").disabled = false;
    document.getElementById("formReset").disabled = false;
    localStorage.setItem("recNo", studentDetails.rec_no);
    showFlash("Student details fetched successfully");
  }
};
const saveStudentDetails = async () => {
  const details = getAndValidateFormData();
  if (details === "") return;

  await fetch(`${baseURL}/api/iml`, {
    method: "POST",
    body: JSON.stringify({
      token: token,
      dbName: dbName,
      cmd: "PUT",
      rel: relName,
      colsAutoIndex: true,
      jsonStr: details,
    }),
  });
  resetForm();
  showFlash("Student details saved successfully");
};
const updateStudentDetails = async () => {
  const details = getAndValidateFormData();
  if (details === "") return;
  const recNo = localStorage.getItem("recNo");

  const jsonStr = {};
  jsonStr["" + recNo] = details;

  const response = await fetch(`${baseURL}/api/iml`, {
    method: "POST",
    body: JSON.stringify({
      token: token,
      dbName: dbName,
      cmd: "UPDATE",
      rel: relName,
      jsonStr: jsonStr,
    }),
  });
  resetForm();
  showFlash("Student details updated successfully");
};
