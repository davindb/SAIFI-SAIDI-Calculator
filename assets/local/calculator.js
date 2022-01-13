const saluranJSON = {
  "Kabel Saluran (KS)": 113,
  L1: 157,
  L2: 250,
  L3: 924,
  L4: 50,
  L5: 58,
  L6: 318,
  L7: 217,
  L8: 112,
  L9: 212,
  L10: 284,
  L11: 494,
  L12: 1590,
  L13: 518,
  L14: 582,
  L15: 1360,
  L16: 239,
  L17: 320,
  L18: 40,
  L19: 310,
  L20: 233,
  L21: 602,
  L22: 410,
  L23: 113,
  L24: 2575,
  L25: 560,
  L26: 2586,
  L27: 108,
  L28: 249,
  L29: 225,
  L30: 940,
  L31: 36,
  L32: 2578,
  L33: 2321,
  L34: 359,
  L35: 98,
  L36: 2555,
  L37: 146,
  L38: 33,
  L39: 154,
  L40: 400,
  L41: 798,
  L42: 2512,
  L43: 143,
  L44: 330,
  L45: 868,
  L46: 825,
  L47: 1830,
  L48: 235,
  L49: 269,
  L50: 114,
  L51: 1599,
  L52: 125,
  L53: 576,
  L54: 75,
  L55: 259,
  L56: 179,
  L57: 94,
  L58: 176,
  L59: 502,
};

const failureRate = [
  {
    id: "L",
    name: "Saluran Udara (L)",
    failure: 0.2,
    repairTime: 3,
  },
  {
    id: "KS",
    name: "Kabel Saluran (KS)",
    failure: 0.007,
    repairTime: 10,
  },
  {
    id: "CB",
    name: "Circuit Breaker (CB)",
    failure: 0.004,
    repairTime: 10,
  },
  {
    id: "LBS",
    name: "Sakelar Beban (LBS)",
    failure: 0.003,
    repairTime: 10,
  },
  {
    id: "T",
    name: "Trafo Distribusi (T)",
    failure: 0.005,
    repairTime: 10,
  },
];

const peralatan = [
  failureRate[2].name,
  failureRate[3].name,
  failureRate[4].name,
  ...Object.keys(saluranJSON),
];

let currentSection = 1;
let countTB = 1;
let countPeralatan = 1;
let htmlSection = [];
let htmlPeralatan = [];

const peralatanOption = peralatan.map((el) => {
  return `
    <option value="${el}">${el}</option>
  `;
});

const peralatanDefault = `
<div
  class="input-group-append mb-3"
  id="input_peralatan_1"
>
  <select id="P_1" class="form-control">
  ${peralatanOption.join("")}
  </select>
</div>
`;

$("#P_1").append(peralatanOption.join(""));

// ADD 3
$(document).on("click", "#add_more_3", function () {
  $(`#remove_peralatan_${countPeralatan}`).hide();
  countPeralatan++;
  htmlPeralatan.push(`
    <div class="input-group-append mb-3" id="input_peralatan_${countPeralatan}">
    <select id="P_${countPeralatan}" class="form-control">
      ${peralatanOption.join("")}
    </select>
      <button id="remove_peralatan_${countPeralatan}" onclick="removePeralatan()" type="button" class="btn btn-danger">
        Remove
      </button>
    </div>`);
  $("#body_form_3").append(htmlPeralatan.join(""));

  htmlPeralatan = [];
});

// REMOVE 3
function removePeralatan() {
  $(`#input_peralatan_${countPeralatan}`).remove();
  countPeralatan--;
  $(`#remove_peralatan_${countPeralatan}`).show();
}

function allComponents() {
  let hasDuplication = false;
  const peralatan = [];
  for (let i = 1; i <= countPeralatan; i++) {
    const item = $(`#P_${i}`).val();
    if (
      peralatan.includes(item) &&
      item !== "Sakelar Beban (LBS)" &&
      item !== "Trafo Distribusi (T)"
    ) {
      peralatan.push($(`#P_${i}`).val());
      hasDuplication = true;
      break;
    }
    peralatan.push($(`#P_${i}`).val());
  }

  if (hasDuplication) {
    alert(
      `Peralatan ${peralatan[peralatan.length - 1]} cannot be more than 1 item.`
    );
    return;
  }

  localStorage.setItem(`peralatan_${currentSection}`, peralatan);
  console.log(window.localStorage[`peralatan_${currentSection}`].split(","));
  currentSection++;
  $("#modal_3").modal("hide");

  if (currentSection > Number(window.localStorage.totalSection)) {
    finishCalc();
  } else {
    setTimeout(function () {
      $("#modal_2_title").text(currentSection);
      $("#modal_2").modal("show");
    }, 500);
  }
}

function finishCalc() {
  const totalSection = window.localStorage.totalSection;
  const lamda = [];
  const u = [];
  let lamdaTotal = 0;
  let uTotal = 0;
  let saifiTotal = 0;
  let saidiTotal = 0;

  for (let i = 1; i <= totalSection; i++) {
    console.log("============", "SECTION", i, "============");

    let failureLib;
    let lamdaSection = 0;
    let uSection = 0;
    let saifiSection = 0;
    let saidiSection = 0;

    const peralatan = window.localStorage[`peralatan_${i}`].split(",");

    peralatan.forEach((el) => {
      let lamdaRow, uRow;
      let panjangSaluran = 1;
      if (el[0] === "L") {
        panjangSaluran = saluranJSON[el] / 1000;
        failureLib = failureRate.find((mov) => mov.id === "L");
      } else if (el === "Kabel Saluran (KS)") {
        panjangSaluran = saluranJSON[el] / 1000;
        failureLib = failureRate.find((mov) => mov.name === el);
      } else {
        failureLib = failureRate.find((mov) => mov.name === el);
      }

      lamdaRow = failureLib.failure * panjangSaluran;
      uRow = lamdaRow * failureLib.repairTime;

      lamdaSection += lamdaRow;
      uSection += uRow;
    });

    console.log("============", "LAMDA & SECTION", i, "============");
    console.log(lamdaSection, uSection);

    lamda.push(lamdaSection);
    u.push(uSection);

    lamdaTotal += lamdaSection;
    uTotal += uSection;

    const totalTB = window.localStorage[`totalTB${i}`];
    let totalPelanggan = window.localStorage[`totalPelanggan_${i}`];

    //  REASSIGNING TOTALPELANGGAN
    totalPelanggan = 14047;

    for (let tb = 1; tb <= totalTB; tb++) {
      let saifiRow, saidiRow;
      const pelangganTB = window.localStorage[`TB${i}_${tb}`];

      saifiRow = (lamdaSection * pelangganTB) / totalPelanggan;
      saidiRow = (uSection * pelangganTB) / totalPelanggan;

      saifiSection += saifiRow;
      saidiSection += saidiRow;
    }

    saifiTotal += saifiSection;
    saidiTotal += saidiSection;

    console.log("============", "SAIFI & SAIDI SECTION", i, "============");
    console.log(saifiSection, saidiSection);
  }

  const SAIFI_RESULT = saifiTotal;
  const SAIDI_RESULT = saidiTotal;

  console.log("============", "SAIFI & SAIDI TOTAL", "============");
  console.log(SAIFI_RESULT, SAIDI_RESULT);

  addResults(SAIFI_RESULT, SAIDI_RESULT);
}

function totalSectionFunc() {
  const totalSection = $("#section").val();
  localStorage.setItem("totalSection", totalSection);
  $("#modal_1").modal("hide");
  setTimeout(function () {
    $("#modal_2_title").text(currentSection);
    $("#modal_2").modal("show");
  }, 500);
}

const defaultInput = `
  <div
    class="input-group-append mb-3 roomowners"
    id="input_form"
  >
    <label class="display-7"
      >Total Pelanggan on TB 1:</label
    >
    <input
      id="TB_1"
      type="number"
      min="1"
      class="form-control display-7"
      value="1"
    />
  </div>
  `;

// ADD 2
$(document).on("click", "#add_more_2", function () {
  $(`#remove_input_${countTB}`).hide();
  countTB++;
  htmlSection.push(`
    <div class="input-group-append mb-3" id="input_form_${countTB}">
    <label class="display-7"
      >Total Pelanggan on TB ${countTB}:</label
    >
      <input
        id="TB_${countTB}"
        type="number"
        min="1"
        class="form-control display-7"
        value="1"
      />
      <button id="remove_input_${countTB}" onclick="removeInput()" type="button" class="btn btn-danger">
        Remove
      </button>
    </div>`);
  $("#body_form_2").append(htmlSection.join(""));
  htmlSection = [];
});

// REMOVE 2
function removeInput() {
  $(`#input_form_${countTB}`).remove();
  countTB--;
  $(`#remove_input_${countTB}`).show();
}

// begin:: RESET MODAL CLOSE MODAL
$("#modal_1").on("hidden.bs.modal", function () {
  $(this).find("form")[0].reset();
});

$("#modal_2").on("hidden.bs.modal", function () {
  countTB = 1;
  $(this).find("form")[0].reset();
  $("#body_form_2").html(defaultInput);
});

$("#modal_3").on("hidden.bs.modal", function () {
  countPeralatan = 1;
  $(this).find("form")[0].reset();
  $("#body_form_3").html(peralatanDefault);
});
// end:: RESET MODAL CLOSE MODAL

$(document).ready(function () {
  console.log("Calculator script is running.");
});

function totalTB() {
  localStorage.setItem(`totalTB${currentSection}`, countTB);
  let totalPelanggan = 0;
  for (let i = 1; i <= countTB; i++) {
    const pelanggan = Number($(`#TB_${i}`).val());
    totalPelanggan += pelanggan;
    localStorage.setItem(`TB${currentSection}_${i}`, pelanggan);
  }
  localStorage.setItem(`totalPelanggan_${currentSection}`, totalPelanggan);
  $("#modal_2").modal("hide");
  setTimeout(function () {
    if (currentSection === Number(window.localStorage.totalSection)) {
      $("#next_3").text("SUBMIT CALCULATION");
    }
    $("#modal_3_title").text(currentSection);
    $("#modal_3").modal("show");
  }, 500);
}

function addResults(saifi, saidi) {
  let desc = "Nilai SAIFI dan SAIDI berada pada interval nilai aman.";
  let color = "b3";
  let txtColor = "btn-primary";
  const time = new Date().toTimeString().slice(0, 5);
  if (saidi > 3 && saidi <= 12) {
    desc =
      "Nilai SAIFI berada diatas interval nilai aman, perlu ditinjau lebih lanjut.";
    color = "b1";
    txtColor = "btn-warning";
  } else if (saidi <= 3 && saidi > 12) {
    desc =
      "Nilai SAIDI berada diatas interval nilai aman, perlu ditinjau lebih lanjut.";
    color = "b1";
    txtColor = "btn-warning";
  } else if (saidi > 3 && saidi > 12) {
    desc =
      "Nilai SAIFI dan SAIDI berada diatas interval nilai aman, perlu ditinjau lebih lanjut.";
    color = "b1";
    txtColor = "btn-warning";
  }

  saifi = saifi.toFixed(4);
  saidi = saidi.toFixed(4);

  const html = `
    <div class="card col-12" id="result_item">
        <div class="card-wrapper mb-5">
          <div>
            <div
              class="
                info
                ${color}
                rounded-circle
                text-center text-white
                d-flex
                align-items-center
              "
            >
              <h5 class="mbr-text mbr-fonts-style m-auto p-2 display-4">
               ${time}
              </h5>
            </div>
          </div>

          <div class="top-line mb-4">
            <h4 class="card-title mbr-fonts-style display-5">
              SAIFI: ${saifi} <br />
              SAIDI: ${saidi}
            </h4>
          </div>
          <div class="bottom-line row">
            <div class="col-12 col-lg-5 mb-5 mb-lg-0">
              <p class="mbr-text mbr-fonts-style m-0 display-7">
                ${desc}
              </p>
            </div>
            <div class="col-12 col-lg-7">
              <div class="mbr-section-btn text-center">
                <button id="delete_result" class="btn ${txtColor} display-4">
                  Delete Result
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

  $("#result_card").prepend(html);
  $("#result").show();
  $("#result_btn").show();
  document.location = "./index.html#result";
}

$(document).on("click", "#delete_result", function () {
  $(this).closest("#result_item").remove();
  const resultCard = $("#result_card").html().replaceAll(/\s/g, "");
  if (!resultCard) {
    document.location = "./index.html#home";
    $("#result").hide();
    $("#result_btn").hide();
  }
});
