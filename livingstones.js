function calculate() {
    const K_6 = 7;
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
    var PreschoolBitstring = 0;
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
            PreschoolBitstring | 1;
            break;
    }
    switch (gradelevel1) {
        case 0:
            break;
        case K_6:
            howManyK_6 += numstudents1;
            break;
        default:
            howManyPreschool += numstudents1;
            PreschoolBitstring | 2;
            break;
    }
    switch (gradelevel2) {
        case 0:
            break;
        case K_6:
            howManyK_6 += numstudents2;
            break;
        default:
            howManyPreschool += numstudents2;
            PreschoolBitstring | 4;
            break;
    }
    switch (gradelevel3) {
        case 0:
            break;
        case K_6:
            howManyK_6 += numstudents3;
            break;
        default:
            howManyPreschool += numstudents3;
            PreschoolBitstring | 8;
            break;
    }
    var K_6Tuition = 0;
    if (howManyK_6 > 1) {
        K_6Tuition = k_6_multiple(agi, fig);
    } else if (howManyK_6 == 1) {
        K_6Tuition = k_6_single(agi, fig);
    }
    document.getElementById("K_6results").innerHTML = "Tuition: $" + K_6Tuition.toFixed(2);;
}


function k_6_single(agi, fig) {
    if (agi < fig) {
        return agi * .05;
    } else if (agi < fig * 1.4) {
        return agi * .06;
    } else if (agi < fig * 1.8) {
        return agi * .07;
    } else if (agi < fig * 2.2) {
        return agi * .08;    
    } else if (agi < fig * 2.6) {
        return agi * .09;   
    } else if (agi < fig * 3.0) {
        return agi * .10;
    } else {
        // 10% of 300% of FIG + 30% of AGI above FIG
        return fig * 0.3 + (agi - fig * 3.0) * 0.3;
    }
}


function k_6_multiple(agi, fig) {
    if (agi < fig) {
        return agi * .06;
    } else if (agi < fig * 1.4) {
        return agi * .07;
    } else if (agi < fig * 1.8) {
        return agi * .08;
    } else if (agi < fig * 2.2) {
        return agi * .09;    
    } else if (agi < fig * 2.6) {
        return agi * .10;   
    } else if (agi < fig * 3.0) {
        return agi * .11;
    } else {
        // 11% of 300% of FIG + 30% of AGI above FIG
        return fig * 0.33 + (agi - fig * 3.0) * 0.3;
    }
}