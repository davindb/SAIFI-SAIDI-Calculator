function getJSON() {
  $("#result").hide();
  $("#result_btn").hide();
}

function calcBtn(e) {
  e.preventDefault();
  localStorage.clear();
  currentSection = 1;
  countTB = 1;
  countPeralatan = 1;
  htmlSection = [];
  htmlPeralatan = [];
  $("#modal_1").modal("show");
}

$(document).ready(function () {
  getJSON();
  const contributor = "By Davin Darmalaksana B.";
  const referensi = "./assets/workbook/Referensi Peralatan.xlsx";
  const footerText =
    "© Copyright 2021 Davin Darmalaksana B. - All Rights Reserved";
  $("#contributor").text(contributor);
  $("#download_referensi").attr("onclick", `window.open('${referensi}')`);
  $("#footer_text").text(footerText);
});
