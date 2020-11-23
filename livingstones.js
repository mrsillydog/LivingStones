



function calculate() {
    const K_6 = -1;
    var agi = document.getElementById("tuition").value;
    var fig = document.getElementById("number-in-household").value;
    var gradelevel0 = parseInt(document.getElementById("gradelevel0").value);
    var gradelevel1 = parseInt(document.getElementById("gradelevel1").value);
    var gradelevel2 = parseInt(document.getElementById("gradelevel2").value);
    var gradelevel3 = parseInt(document.getElementById("gradelevel3").value);
    var numstudents0 = parseInt(document.getElementById("num-students0").value);
    var numstudents1 = parseInt(document.getElementById("num-students1").value);
    var numstudents2 = parseInt(document.getElementById("num-students2").value);
    var numstudents3 = parseInt(document.getElementById("num-students3").value);
    var preschoolBitstring = 0;
    var howManyK_6 = 0;
    var howManyPreschool = 0;
    switch (gradelevel0) {
        case 0:
            break;
        case K_6:
            howManyK_6 += numstudents0;
            break;
        default:
            howManyPreschool += numstudents0;
            preschoolBitstring = preschoolBitstring | 1;
    }
    switch (gradelevel1) {
        case 0:
            break;
        case K_6:
            howManyK_6 += numstudents1;
            break;
        default:
            howManyPreschool += numstudents1;
            preschoolBitstring = preschoolBitstring | 2;
    }
    switch (gradelevel2) {
        case 0:
            break;
        case K_6:
            howManyK_6 += numstudents2;
            break;
        default:
            howManyPreschool += numstudents2;
            preschoolBitstring = preschoolBitstring | 4;
    }
    switch (gradelevel3) {
        case 0:
            break;
        case K_6:
            howManyK_6 += numstudents3;
            break;
        default:
            howManyPreschool += numstudents3;
            preschoolBitstring = preschoolBitstring | 8;
    }
    var K_6Tuition = 0;
    if (howManyK_6 > 1) {
        K_6Tuition = k_6(agi, fig, 1);
    } else if (howManyK_6 == 1) {
        K_6Tuition = k_6(agi, fig, 0);
    }

    if ( (howManyK_6 >= 1) && (K_6Tuition < 600)) K_6Tuition = 600;

    originalK_6 = 7500 * howManyK_6;
    savingsK_6 = originalK_6 - K_6Tuition;
    document.getElementById("K_6results").innerHTML = 
        "K: Pre-Assistance Tuition: $" + originalK_6.toFixed(2) + 
        "\nFinancial Assistance: $" + savingsK_6.toFixed(2) +
        "\nYour Family's Yearly Tuition: $" + K_6Tuition.toFixed(2);

    var preschoolTuition = 0;
    if (howManyPreschool > 1) {
        preschoolTuition = preschool(agi, fig, 1);
    } else if (howManyPreschool == 1) {
        preschoolTuition = preschool(agi, fig, 0);
    }
    
    var originalPreschool = 0;
    
    if ( (preschoolBitstring & 1) == 1) {
        originalPreschool += gradelevel0 * numstudents0;
    }
    if ( (preschoolBitstring & 2) == 2) {
        originalPreschool += gradelevel1 * numstudents1;
    }
    if ( (preschoolBitstring & 4) == 4) {
        originalPreschool += gradelevel2 * numstudents2;
    }
    if ( (preschoolBitstring & 8) == 8) {
        originalPreschool += gradelevel3 * numstudents3;
    }

    if (preschoolTuition == -1) {
        preschoolTuition = originalPreschool;
    }

    if ((howManyPreschool >= 1) && (preschoolTuition < 600)) preschoolTuition = 600;


    var savingsPreschool = originalPreschool - preschoolTuition;

    document.getElementById("preschoolresults").innerHTML = 
    "P: Pre-Assistance Tuition: $" + originalPreschool.toFixed(2) + 
    "\nFinancial Assistance: $" + savingsPreschool.toFixed(2) +
    "\nYour Family's Yearly Tuition: $" + preschoolTuition.toFixed(2);
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