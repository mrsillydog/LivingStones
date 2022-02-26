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
    document.getElementById("tableInstructions").style.display = "block";
    document.getElementById("calculateButton").style="";
    table.style.display="block";
    var tableHTML = "";
    for (var i = 0; i < numStudents; i++){
        tableHTML +=  
        `<tr> 
        <td class="tdCalc">
            <select id="gradelevel${i}" class="selectCalc"> 
                <option value=0>Select a grade level</option>
                <option value=1810>Preschool: Tues/Thurs Mornings</option>
                <option value=3470>Preschool: Tues/Thurs All Day</option>
                <option value=2605>Preschool: Mon/Wed/Fri Mornings</option>
                <option value=4700>Preschool: Mon/Wed/Fri All Day</option>
                <option value=3900>Preschool: Mon-Fri Mornings</option>
                <option value=7900>Preschool: Mon-Fri All Day</option>
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
    document.getElementById("studentsTable").style.display = "none";
    document.getElementById("tableInstructions").style.display = "none";
    document.getElementById("calculateButton").style.display = "none";
}

/*
 * calculateTuition displays full tuition, savings, adjusted tuition, monthly cost, and weekly cost based on user inputs.
 * Triggered by clicking the <button> with ID calculateButton
 */
function calculateTuition() {
    // prep
    const K_6 = -1;
    const FULL_PRICE = 7900;
    const MINIMUM_TUITION = 600;
    var agi = parseFloat(document.getElementById("agi").value);
    var fig = parseInt(document.getElementById("number-in-household").value);
    var numStudents = parseInt(document.getElementById("number-at-lsa").value);
    var originalK_6 = 0;
    var originalPreschool = 0;
    // run through all students
    for (var i = 0; i < numStudents; i++) {
        var currentStudent = parseInt(document.getElementById(`gradelevel${i}`).value);
        switch (currentStudent) {
            case 0:
                break;
            case K_6:
                originalK_6 += FULL_PRICE;
                break;
            default:
                originalPreschool += currentStudent;
                break;
        }
    }

    // actually calculate K-6 tuition - or just tuition in general if there's more than one student
    var k_6Tuition = 0;
    if (originalK_6 > 0 || numStudents > 1) {
        k_6Tuition = k_6Calc(agi, fig, numStudents > 1 ? 1 : 0);
        
        // alter value based on minimum tuition value of $600
        if (k_6Tuition < MINIMUM_TUITION) {
            k_6Tuition = MINIMUM_TUITION;
        }

        // ensure full price is less than the quoted K-6 tuition value
        if (k_6Tuition > originalK_6 && originalK_6 != 0) {
            k_6Tuition = originalK_6;  
        }
    }

    // actually calculate preschool tuition - only if exactly one student is in preschool
    var preschoolTuition = 0;
    if (originalPreschool > 0 && numStudents == 1) {
        preschoolTuition = preschoolCalc(agi, fig);

        // ensure full price is less than the quoted preschool tuition value
        // check to see if agi is > 200% fig and adapt accordingly
        if (preschoolTuition > originalPreschool || preschoolTuition == -1) {
            preschoolTuition = originalPreschool;
        }

        // alter value based on minimum tuition value of $600
        if (preschoolTuition < MINIMUM_TUITION) {
            preschoolTuition = MINIMUM_TUITION;
        }
    }

    // in case we've used the multi-student guide but they were all preschoolers
    if (originalPreschool > 0 && originalK_6 == 0 && preschoolTuition == 0 && k_6Tuition > originalPreschool) {
        k_6Tuition = originalPreschool;
    }

    // adjust total tuition for families with both K-6 and preschool
    var totalTuition = 0;
    if (agi > fig * 2) {
        totalTuition = preschoolTuition + k_6Tuition;
    } else {
        totalTuition = preschoolTuition < k_6Tuition ? k_6Tuition : preschoolTuition;
    }

    // calculate values to display
    var originalTotal = originalPreschool + originalK_6;
    var savingsTotal = originalTotal - totalTuition;

    // display
    document.getElementById("fulltuition").innerHTML = `$${numberWithCommas(originalTotal.toFixed(2))}`;
    document.getElementById("savings").innerHTML = `$${numberWithCommas(savingsTotal.toFixed(2))}`;
    document.getElementById("tuitionestimate").innerHTML = `$${numberWithCommas(totalTuition.toFixed(2))}`; 
    document.getElementById("monthlypayment").innerHTML = `$${numberWithCommas((totalTuition / 10).toFixed(2))}`;
    document.getElementById("weeklypayment").innerHTML = `$${numberWithCommas((totalTuition / 40).toFixed(2))}`;

    toggleCalc();
}

/*
 * Thanks to Elias Zamaria, @neu-rah, and T.J Crowder from 
 * https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 * for this shamelessly copied utility method.
 * Converts a integer value to a formatted string through clever RegEx matching.
 * Note: we're not using their final answer because Safari somehow still doesn't support lookbehind in 2021. Very cool.
 */
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

/*
 * k_6Calc returns a family tuition value for K-6 tuition based on:
 *  - the family's adjusted gross income
 *  - federal income guidelines
 *  - whether they have multiple children attending K-6 at LSA (1 or 0)
 */
function k_6Calc(agi, fig, multiple) {
    var multiple_modifier = multiple * 0.01;
    if (agi <= fig) {
        return agi * (.05 + multiple_modifier);
    } else if (agi <= fig * 1.4) {
        return agi * (.06 + multiple_modifier);
    } else if (agi <= fig * 1.8) {
        return agi * (.07 + multiple_modifier);
    } else if (agi <= fig * 2.2) {
        return agi * (.08 + multiple_modifier);    
    } else if (agi <= fig * 2.6) {
        return agi * (.09 + multiple_modifier);   
    } else if (agi <= fig * 3.0) {
        return agi * (.10 + multiple_modifier);
    } else {
        // 10% of 300% of FIG + 30% of AGI above FIG
        return fig * 3.0 * (.10 + multiple_modifier) + (agi - fig * 3.0) * 0.3;
    }
}

/*
 * preschoolCalc returns a family tuition value for preschool tuition based on:
 *  - the family's adjusted gross income
 *  - federal income guidelines
 *  - whether they have multiple children attending preschool at LSA (1 or 0)
 */
function preschoolCalc(agi, fig) {
    if (agi <= fig) {
        return agi * .06;
    } else if (agi <= fig * 1.4) {
        return agi * .07;
    } else if (agi <= fig * 1.8) {
        return agi * .08;
    } else if (agi <= fig * 2.0) {
        return agi * .09;      
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