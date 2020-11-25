

function preparehtml() {
    var numStudents = document.getElementById("number-at-lsa").value;
    var table = document.getElementById("studentsTable");
    var tableInstructions = document.getElementById("tableInstructions");
    var calcButton = document.getElementById("calculateButton");
    table.removeAttribute("hidden");
    tableInstructions.style.display = "block";
    calcButton.style="";
    var tableHTML = "";
    for (var i = 0; i < numStudents; i++){
        var rowID = "gradelevel" + i;
        tableHTML +=  
        `<tr> 
        <td>
            <select id=` + rowID + `> 
                <option value=0>Select a grade level</option>
                <option value=1720>Preschool: Tues/Thurs Mornings</option>
                <option value=3300>Preschool: Tues/Thurs All Day</option>
                <option value=2475>Preschool: Mon/Wed/Fri Mornings</option>
                <option value=4475>Preschool: Mon/Wed/Fri All Day</option>
                <option value=3720>Preschool: Mon-Fri Mornings</option>
                <option value=7500>Preschool: Mon-Fri All Day</option>
                <option value=-1>K-6</option>
            </select>
        </td>
        </tr> `;
    }
    table.innerHTML = tableHTML;
}

function reset() {
    var table = document.getElementById("studentsTable");
    var tableInstructions = document.getElementById("tableInstructions");
    var calcButton = document.getElementById("calculateButton");
    var preschoolResults = document.getElementById("preschoolresults");
    var k_6Results = document.getElementById("K_6results");
    var overallResults = document.getElementById("finalresults");
    if (!table.hasAttribute("hidden")) {
        table.toggleAttribute("hidden");
    }
    if (!tableInstructions.hasAttribute("hidden")) {
        tableInstructions.toggleAttribute("hidden");
    }
    if (!calcButton.hasAttribute("hidden")) {
        calcButton.toggleAttribute("hidden");
    }
    if (!preschoolResults.hasAttribute("hidden")) {
        preschoolResults.toggleAttribute("hidden");
    }
    if (!k_6Results.hasAttribute("hidden")) {
        k_6Results.toggleAttribute("hidden");
    }
    if (!overallResults.hasAttribute("hidden")) {
        overallResults.toggleAttribute("hidden");
    }
}

function calculate() {
    // prep
    const K_6 = -1;
    var agi = document.getElementById("tuition").value;
    var fig = document.getElementById("number-in-household").value;
    var numStudents = document.getElementById("number-at-lsa").value;
    var howManyK_6 = 0;
    var howManyPreschool = 0;
    var originalPreschool = 0;
    // run through all students
    for (var i = 0; i < numStudents; i++) {
        var currentStudentID = "gradelevel" + i;
        var currentStudent = parseInt(document.getElementById(currentStudentID).value);
        switch (currentStudent) {
            case 0:
                break;
            case K_6:
                howManyK_6 += 1;
                break;
            default:
                howManyPreschool += 1;
                originalPreschool += currentStudent;
                break;
        }
    }

    // actually calculate K-6 tuition
    var k_6Tuition = 0;
    if (howManyK_6 > 1) {
        k_6Tuition = k_6(agi, fig, 1);
    } else if (howManyK_6 == 1) {
        k_6Tuition = k_6(agi, fig, 0);
    }

    // alter value based on minimum tuition value of $600
    if ( (howManyK_6 >= 1) && (k_6Tuition < 600)) k_6Tuition = 600;

    // actually calculate preschool tuition
    var preschoolTuition = 0;
    if (howManyPreschool > 1) {
        preschoolTuition = preschool(agi, fig, 1);
    } else if (howManyPreschool == 1) {
        preschoolTuition = preschool(agi, fig, 0);
    }
    
    // check to see if agi is > 200% fig and adapt accordingly
    if (preschoolTuition == -1) {
        preschoolTuition = originalPreschool;
    }

    // alter value based on minimum tuition value of $600
    if ((howManyPreschool >= 1) && (preschoolTuition < 600)) preschoolTuition = 600;

    // calculate K-6 savings and display results
    originalK_6 = 7500 * howManyK_6;
    savingsK_6 = originalK_6 - k_6Tuition;
    var savingsPreschool = originalPreschool - preschoolTuition;

    // adjust total tuition for families with both K-6 and preschool
    var totalTuition = 0;
    if (agi > fig * 2) {
        totalTuition = preschoolTuition + k_6Tuition;
    } else {
        if (preschoolTuition < k_6Tuition) {
            totalTuition = k_6Tuition;
        } else {
            totalTuition = preschoolTuition;
        }
    }
    var originalTotal = originalPreschool + originalK_6;
    var savingsTotal = originalTotal - totalTuition;
    var totalResults = document.getElementById("finalresults");

    totalResults.innerHTML = 
    `
    <th>Tuition Calculation Results</th>
    <tr>
        <td>Pre-aid Tuition</td>
        <td>` + originalTotal.toFixed(2) + `</td>
    </tr>
    <tr>
        <td>Estimated Financial Aid</td>
        <td>` + savingsTotal.toFixed(2) + `</td>
    </tr>
    <tr>
        <td>Estimated Net Cost</td>
        <td>` + totalTuition.toFixed(2) + `</td>
    </tr>
    <tr>
        <td>Estimated Monthly Payment
            <span class="description">Based on a 10-month payment plan.</span>
        </td>
        <td>` + (totalTuition / 10).toFixed(2) + `</td>
    </tr>
    <tr>
        <td>Estimated Weekly Payment
            <span class="description">Based on a 10-month payment plan, with 4 weeks per month.</span>
        </td>
        <td>` + (totalTuition / 40).toFixed(2) + `</td>
    </tr>`;

    toggle();
}


function k_6(agi, fig, multiple) {
    var multiple_modifier = multiple * 0.01;
    if (agi < fig) {
        return agi * (.05 + multiple_modifier);
    } else if (agi < fig * 1.4) {
        return agi * (.06 + multiple_modifier);
    } else if (agi < fig * 1.8) {
        return agi * (.07 + multiple_modifier);
    } else if (agi < fig * 2.2) {
        return agi * (.08 + multiple_modifier);    
    } else if (agi < fig * 2.6) {
        return agi * (.09 + multiple_modifier);   
    } else if (agi < fig * 3.0) {
        return agi * (.10 + multiple_modifier);
    } else {
        // 10% of 300% of FIG + 30% of AGI above FIG
        return fig * 3.0 * (.10 + multiple_modifier) + (agi - fig * 3.0) * 0.3;
    }
}

function preschool(agi, fig, multiple) {
    var multiple_modifier = multiple * 0.01;
    if (agi < fig) {
        return agi * (.06 + multiple_modifier);
    } else if (agi < fig * 1.4) {
        return agi * (.07 + multiple_modifier);
    } else if (agi < fig * 1.8) {
        return agi * (.08 + multiple_modifier);
    } else if (agi < fig * 2.0) {
        return agi * (.09 + multiple_modifier);      
    } else {
        // full tuition per student
        return -1;
    }
}

function toggle() {
    document.getElementById("calcDiv").toggleAttribute("hidden");
    document.getElementById("resultsDiv").toggleAttribute("hidden");
}