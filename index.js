$(document).ready(function () {
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.replace(word[0], word[0].toUpperCase());
      })
      .join(" ");
  }

  $(".result").hide();
  $('input[type="text"]').val("22Q91A").trigger("input");

  $('input[type="text"]').on("input", function () {
    $(this).val($(this).val().toUpperCase());
  });

  fetch("results.json")
    .then((response) => response.json())
    .then((data) => {
      const results = data;
      $("form").submit(function (e) {
        e.preventDefault();

        var rollNumber = $('input[type="text"]').val();
        var password = $('input[type="password"]').val();

        if (rollNumber === password && rollNumber.length === 10) {
          const result = searchByRollNumber(rollNumber);
          console.log(result);
          console.log(typeof result);
          if (typeof result === "object") {
            $("main").hide();

            $(".result h1").text(toTitleCase(result.data.Details["NAME"]));
            $(".result h2").text(result.data.Details["Roll_No"]);
            $(".result").show();
            $.each(result.data.Results, function (semester, subjects) {
              var semesterDiv = $("<div>")
                .attr("id", semester)
                .appendTo("body");
              console.log(semester);
              if (semester == "Total") {
                $("<h1>").text("Current CGPA:").appendTo(semesterDiv);
              } else if (semester == "1-1") {
                $("<h1>").text("1st Year 1st Semister").appendTo(semesterDiv);
              } else if (semester == "1-2") {
                $("<h1>").text("1st Year 2nd Semister").appendTo(semesterDiv);
              }
              typeof subjects === "string" &&
                $("<h1>").text(subjects).appendTo(semesterDiv);
              var subjectDiv = $("<div>").appendTo(semesterDiv);

              semester["Total"] &&
                $("<h1>").text(semester["Total"]).appendTo(subjectDiv);
              semester != "Total" &&
                $("<h1>").text("Subject").appendTo(subjectDiv);
              semester != "Total" &&
                $("<h1>").text("Total").appendTo(subjectDiv);
              semester != "Total" &&
                $("<h1>").text("Grade").appendTo(subjectDiv);
              $.each(subjects, function (subjectId, subject) {
                var subjectDiv = $("<div>").appendTo(semesterDiv);

                subject.subject_name &&
                  $("<h3>")
                    .text(toTitleCase(subject.subject_name))
                    .appendTo(subjectDiv);
                subject.subject_total &&
                  $("<h3>")
                    .text(subject.subject_total + "%")
                    .appendTo(subjectDiv);
                subject.subject_grade &&
                  $("<h3>").text(subject.subject_grade).appendTo(subjectDiv);
                typeof subject === "number" &&
                  $("<h2>")
                    .text(toTitleCase(subjectId) + ": " + subject)
                    .appendTo(subjectDiv);
                subjectId == "CGPA" &&
                  $("<h2>")
                    .text("SGPA: " + subject)
                    .appendTo(subjectDiv);
              });
            });
          } else {
            $("p").text("Error: Student Not Found");
          }
        } else {
          $("p").text(
            "Error: Hall Ticket Number and Password do not match, or length is not 10."
          );
        }
      });

      function searchByRollNumber(rollNumberToFind) {
        const foundStudent = results.find(
          (student) => student.rollNumber === rollNumberToFind
        );
        return foundStudent ? foundStudent : "Student not found";
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
});
