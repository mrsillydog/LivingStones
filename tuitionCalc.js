/*
 * livingstones.js contains the javascript methods for Living Stones Academy's tuition calculator.
 * Written by github.com/mrsillydog, Fall 2020
 */

/*
 * proceedCalc dynamically adds <select> html elements to the page based on the 
 * number of children at LSA entered by the user.
 * Triggered by clicking the <button> with ID proceed
 */
function proceedCalc() {
    var numStudents = document.getElementById("number-at-lsa").value;
    var table = document.getElementById("studentsTable");
    var tableInstructions = document.getElementById("tableInstructions");
    var calcButton = document.getElementById("calculateButton");
    tableInstructions.style.display = "block";
    table.style.display="block";
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

/*
 * resetProceedCalc essentially reverses the effects of proceedCalc
 * triggered whenever the user changes the value in the <select> element with ID number-at-lsa
 */
function resetProceedCalc() {
    var table = document.getElementById("studentsTable");
    var tableInstructions = document.getElementById("tableInstructions");
    var calcButton = document.getElementById("calculateButton");
    tableInstructions.style.display = "none";
    table.style.display = "none";
    calcButton.style.display = "none";
}

/*
 * calculateTuition displays full tuition, savings, adjusted tuition, monthly cost, and weekly cost based on user inputs.
 * Triggered by clicking the <button> with ID calculateButton
 */
function calculateTuition() {
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
        k_6Tuition = k_6Calc(agi, fig, 1);
    } else if (howManyK_6 == 1) {
        k_6Tuition = k_6Calc(agi, fig, 0);
    }

    // alter value based on minimum tuition value of $600
    if ( (howManyK_6 >= 1) && (k_6Tuition < 600)) k_6Tuition = 600;

    // actually calculate preschool tuition
    var preschoolTuition = 0;
    if (howManyPreschool > 1) {
        preschoolTuition = preschoolCalc(agi, fig, 1);
    } else if (howManyPreschool == 1) {
        preschoolTuition = preschoolCalc(agi, fig, 0);
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

    // calculate values to display
    var originalTotal = originalPreschool + originalK_6;
    var savingsTotal = originalTotal - totalTuition;
    var totalResults = document.getElementById("finalresults");

    // display
    totalResults.innerHTML = 
    `
    <th>Tuition Calculation Results</th>
    <tr>
        <td>Full Tuition</td>
        <td>$` + numberWithCommas(originalTotal.toFixed(2)) + `</td>
    </tr>
    <tr>
        <td>Estimated Tuition Assistance</td>
        <td>$` + numberWithCommas(savingsTotal.toFixed(2)) + `</td>
    </tr>
    <tr>
        <td>Your Estimated Tuition</td>
        <td>$` + numberWithCommas(totalTuition.toFixed(2)) + `</td>
    </tr>
    <tr>
        <td>Estimated Monthly Payment
            <span class="description">Based on a 10-month payment plan.</span>
        </td>
        <td>$` + numberWithCommas((totalTuition / 10).toFixed(2)) + `</td>
    </tr>
    <tr>
        <td>Estimated Weekly Payment
            <span class="description">Based on a 10-month payment plan, with 4 weeks per month.</span>
        </td>
        <td>$` + numberWithCommas((totalTuition / 40).toFixed(2)) + `</td>
    </tr>`;

    toggleCalc();
}

/*
 * Thanks to Elias Zamaria, @neu-rah, and T.J Crowder from 
 * https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * for this shamelessly copied utility method.
 * Converts a integer value to a formatted string through clever RegEx matching.
 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

/*
 * k_6Calc returns a family tuition value for K-6 tuition based on:
 *  - the family's adjusted gross income
 *  - federal income guidelines
 *  - whether they have multiple children attending K-6 at LSA (1 or 0)
 */
function k_6Calc(agi, fig, multiple) {
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

/*
 * k_6Calc returns a family tuition value for preschool tuition based on:
 *  - the family's adjusted gross income
 *  - federal income guidelines
 *  - whether they have multiple children attending preschool at LSA (1 or 0)
 */
function preschoolCalc(agi, fig, multiple) {
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

/*
 * toggleCalc toggles whether the calcDiv or resultsDiv is on display.
 * Triggered either directly by clicking the <button> with ID calcAgain,
 * or indirectly by clicking the <button> with ID calculateButton
 */
function toggleCalc() {
    document.getElementById("calcDiv").toggleAttribute("hidden");
    document.getElementById("resultsDiv").toggleAttribute("hidden");
}