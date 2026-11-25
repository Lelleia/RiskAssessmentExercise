const DEFAULT_SCENARIOS = [

    {
        title: "Equipment failure",

        description:
            "A critical piece of equipment unexpectedly breaks down during an important production activity. The failure could interrupt operations, delay delivery and create additional costs.",

        answer: {
            probability: 3,
            consequence: 3
        },

        explanation:
            "A critical equipment failure may be reasonably likely if the equipment is heavily used or maintenance is limited. The impact could be significant because production may be delayed and costs may increase. Review equipment condition, maintenance history and available backup arrangements.",

        probabilityReason:
            "The likelihood depends on how heavily the equipment is used, its condition and whether maintenance is effective.",

        consequenceReason:
            "A breakdown could interrupt production, delay delivery and create additional costs."
    },

    {
        title: "Workplace accident",

        description:
            "An employee slips on a wet floor in a busy working area. The incident could result in an injury, absence from work and disruption to the team.",

        answer: {
            probability: 2,
            consequence: 3
        },

        explanation:
            "The probability may be low where housekeeping and spill controls are effective, but it can increase in busy areas or where wet floors are common. The consequences could be serious if the fall causes an injury. Consider the frequency of the hazard, warning signs and cleaning routines.",

        probabilityReason:
            "The likelihood depends on how often floors become wet, how busy the area is and whether spills are cleaned up promptly.",

        consequenceReason:
            "A fall could cause an injury, absence from work and disruption to the team."
    },

    {
        title: "Cybersecurity incident",

        description:
            "An employee accidentally opens a malicious email attachment. This could expose confidential company information, disrupt systems or allow unauthorised access.",

        answer: {
            probability: 3,
            consequence: 4
        },

        explanation:
            "Phishing attempts are common, so the likelihood may be high even where awareness training is provided. The consequences could be very high if sensitive information or critical systems are compromised. Consider email filtering, multi-factor authentication, staff training and backups.",

        probabilityReason:
            "Phishing emails are common, and an employee may open a malicious attachment even when awareness training is provided.",

        consequenceReason:
            "A successful attack could expose confidential information, disrupt systems or allow unauthorised access."
    }

];


// ======================================
// RISK LEVEL CALCULATION
// ======================================

function getRiskLevel(probability, consequence) {

    const score = probability * consequence;

    if (score <= 3) {
        return {
            name: "Low",
            className: "low",
            score
        };
    }

    if (score <= 6) {
        return {
            name: "Medium",
            className: "medium",
            score
        };
    }

    if (score <= 11) {
        return {
            name: "High",
            className: "high",
            score
        };
    }

    return {
        name: "Critical",
        className: "critical",
        score
    };
}


// ======================================
// LEVEL LABELS
// ======================================

function getLevelLabel(value) {

    const labels = {
        1: "Very low",
        2: "Low",
        3: "High",
        4: "Very high"
    };

    return labels[value];
}


// ======================================
// GLOBAL VARIABLES
// ======================================

let scenarios = [];

let currentScenario = 0;

let selections = [];

let isDefaultExercise = false;


// ======================================
// PAGE ELEMENTS
// ======================================

const welcomePage =
    document.getElementById("welcome-page");

const builderPage =
    document.getElementById("builder-page");

const exercisePage =
    document.getElementById("exercise-page");

const customQuestionsList =
    document.getElementById("custom-questions-list");

const questionCounter =
    document.getElementById("question-counter");

const addQuestionButton =
    document.getElementById("add-question-button");

const builderError =
    document.getElementById("builder-error");

const startCustomButton =
    document.getElementById("start-custom-button");

const scenarioNumber =
    document.getElementById("scenario-number");

const scenarioTotal =
    document.getElementById("scenario-total");

const scenarioHeading =
    document.getElementById("scenario-heading");

const scenarioDescription =
    document.getElementById("scenario-description");

const progressLabel =
    document.getElementById("progress-label");

const progressFill =
    document.getElementById("progress-fill");

const matrixGrid =
    document.getElementById("matrix-grid");

const selectionStatus =
    document.getElementById("selection-status");

const nextButton =
    document.getElementById("next-button");

const clearButton =
    document.getElementById("clear-selection");

const selectionError =
    document.getElementById("selection-error");

const matrixSection =
    document.querySelector(".matrix-section");

const results =
    document.getElementById("results");

const resultsList =
    document.getElementById("results-list");

const summaryText =
    document.getElementById("summary-text");

const instantFeedback =
    document.getElementById("instant-feedback");

const instantFeedbackText =
    document.getElementById("instant-feedback-text");


// ======================================
// PAGE NAVIGATION
// ======================================

function showPage(page) {

    welcomePage.classList.add("hidden");

    builderPage.classList.add("hidden");

    exercisePage.classList.add("hidden");

    page.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================
// WELCOME PAGE BUTTONS
// ======================================

document.getElementById("default-exercise-button")
    .addEventListener("click", function () {

        isDefaultExercise = true;

        scenarios = DEFAULT_SCENARIOS.map(
            scenario => ({ ...scenario })
        );

        startExercise();

    });


document.getElementById("custom-exercise-button")
    .addEventListener("click", function () {

        isDefaultExercise = false;

        openBuilder();

    });


document.getElementById("builder-back")
    .addEventListener("click", function () {

        showPage(welcomePage);

    });


document.getElementById("exercise-back")
    .addEventListener("click", function () {

        showPage(welcomePage);

    });


// ======================================
// CUSTOM QUESTION BUILDER
// ======================================

function openBuilder() {

    customQuestionsList.innerHTML = "";

    builderError.textContent = "";

    // Start with one empty question.

    addCustomQuestion();

    updateQuestionCounter();

    showPage(builderPage);

}


// ======================================
// CREATE A CUSTOM QUESTION
// ======================================

function addCustomQuestion() {

    const questionCount =
        customQuestionsList.children.length;

    if (questionCount >= 20) {

        builderError.textContent =
            "You can add a maximum of 20 questions.";

        return;

    }

    const questionNumber = questionCount + 1;

    const card = document.createElement("div");

    card.className = "question-card";

    card.dataset.question = questionNumber;


    // HEADER

    const header = document.createElement("div");

    header.className = "question-card-header";

    const heading = document.createElement("h3");

    heading.textContent =
        `Question ${questionNumber}`;

    const removeButton = document.createElement("button");

    removeButton.type = "button";

    removeButton.className = "remove-question";

    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", function () {

        card.remove();

        renumberQuestions();

        updateQuestionCounter();

        builderError.textContent = "";

    });

    header.append(heading, removeButton);

    card.appendChild(header);


    // TITLE

    card.appendChild(
        createField(
            "Scenario title",
            "title",
            "Enter a title for your scenario",
            "input"
        )
    );


    // DESCRIPTION

    card.appendChild(
        createField(
            "Scenario description",
            "description",
            "Describe the situation or potential risk...",
            "textarea"
        )
    );


    // ANSWER HEADING

    const answerHeading = document.createElement("p");

    answerHeading.className = "answer-heading";

    answerHeading.textContent =
        "Suggested assessment and feedback";

    card.appendChild(answerHeading);


    // PROBABILITY AND CONSEQUENCES

    const answerRow = document.createElement("div");

    answerRow.className = "form-row";

    answerRow.appendChild(
        createSelectField(
            "Suggested probability",
            "probability"
        )
    );

    answerRow.appendChild(
        createSelectField(
            "Suggested consequences",
            "consequence"
        )
    );

    card.appendChild(answerRow);


    // EXPLANATION

    card.appendChild(
        createField(
            "Explanation / feedback",
            "explanation",
            "Explain why this is the suggested assessment...",
            "textarea"
        )
    );


    customQuestionsList.appendChild(card);

    renumberQuestions();

    updateQuestionCounter();

    builderError.textContent = "";

    card.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


// ======================================
// CREATE INPUT FIELDS
// ======================================

function createField(labelText, name, placeholder, type) {

    const wrapper = document.createElement("div");

    wrapper.className = "form-field";

    const label = document.createElement("label");

    label.textContent = labelText;

    const input = document.createElement(
        type === "textarea" ? "textarea" : "input"
    );

    input.name = name;

    input.placeholder = placeholder;

    if (type === "input") {

        input.type = "text";

        input.maxLength = 120;

        input.required = true;

    } else {

        input.rows = 3;

        input.maxLength = 2000;

        input.required = true;

    }

    label.appendChild(input);

    wrapper.appendChild(label);

    return wrapper;

}


// ======================================
// CREATE PROBABILITY / CONSEQUENCE SELECT
// ======================================

function createSelectField(labelText, name) {

    const wrapper = document.createElement("div");

    wrapper.className = "form-field";

    const label = document.createElement("label");

    label.textContent = labelText;

    const select = document.createElement("select");

    select.name = name;

    select.required = true;

    const options = [
        ["", "Choose a level"],
        ["1", "Very low"],
        ["2", "Low"],
        ["3", "High"],
        ["4", "Very high"]
    ];

    options.forEach(function (optionData) {

        const option = document.createElement("option");

        option.value = optionData[0];

        option.textContent = optionData[1];

        select.appendChild(option);

    });

    label.appendChild(select);

    wrapper.appendChild(label);

    return wrapper;

}


// ======================================
// RENUMBER QUESTIONS
// ======================================

function renumberQuestions() {

    const cards =
        customQuestionsList.querySelectorAll(".question-card");

    cards.forEach(function (card, index) {

        card.dataset.question = index + 1;

        card.querySelector("h3").textContent =
            `Question ${index + 1}`;

    });

}


// ======================================
// UPDATE QUESTION COUNTER
// ======================================

function updateQuestionCounter() {

    const count =
        customQuestionsList.children.length;

    questionCounter.textContent =
        `${count} / 20`;

    addQuestionButton.disabled = count >= 20;

    if (count >= 20) {

        addQuestionButton.textContent =
            "Maximum of 20 questions reached";

    } else {

        addQuestionButton.textContent =
            "+ Add another question";

    }

}


// ADD QUESTION BUTTON

addQuestionButton.addEventListener(
    "click",
    addCustomQuestion
);


// ======================================
// START CUSTOM EXERCISE
// ======================================

startCustomButton.addEventListener("click", function () {

    const cards =
        customQuestionsList.querySelectorAll(".question-card");

    const count = cards.length;


    // Check number of questions

    if (count < 1 || count > 20) {

        builderError.textContent =
            "Please add between 1 and 20 questions.";

        return;

    }


    // Read and validate all questions

    const customScenarios = [];

    let valid = true;

    cards.forEach(function (card) {

        const title =
            card.querySelector('[name="title"]').value.trim();

        const description =
            card.querySelector('[name="description"]').value.trim();

        const probability =
            Number(card.querySelector('[name="probability"]').value);

        const consequence =
            Number(card.querySelector('[name="consequence"]').value);

        const explanation =
            card.querySelector('[name="explanation"]').value.trim();


        if (
            !title ||
            !description ||
            ![1, 2, 3, 4].includes(probability) ||
            ![1, 2, 3, 4].includes(consequence) ||
            !explanation
        ) {

            valid = false;

            return;

        }


        customScenarios.push({

            title: title,

            description: description,

            answer: {

                probability: probability,

                consequence: consequence

            },

            explanation: explanation

        });

    });


    if (!valid || customScenarios.length !== count) {

        builderError.textContent =
            "Please complete all fields and choose a probability and consequence for every question.";

        return;

    }


    // Save custom scenarios

    isDefaultExercise = false;

    scenarios = customScenarios;

    builderError.textContent = "";

    startExercise();

});


// ======================================
// START EXERCISE
// ======================================

function startExercise() {

    currentScenario = 0;

    selections = Array(scenarios.length).fill(null);

    results.classList.add("hidden");

    matrixSection.classList.remove("hidden");

    showPage(exercisePage);

    renderScenario();

}


// ======================================
// DISPLAY CURRENT SCENARIO
// ======================================

function renderScenario() {

    const scenario = scenarios[currentScenario];

    const selected = selections[currentScenario];

    scenarioNumber.textContent = currentScenario + 1;

    scenarioTotal.textContent = scenarios.length;

    scenarioHeading.textContent = scenario.title;

    scenarioDescription.textContent = scenario.description;


    // Progress

    const completed =
        selections.filter(Boolean).length;

    progressLabel.textContent =
        `${completed} of ${scenarios.length} completed`;

    progressFill.style.width =
        `${(completed / scenarios.length) * 100}%`;


    // Clear matrix

    matrixGrid.innerHTML = "";


    // Generate 4x4 matrix

    for (let probability = 4; probability >= 1; probability--) {

        for (let consequence = 1; consequence <= 4; consequence++) {

            const risk =
                getRiskLevel(probability, consequence);

            const button =
                document.createElement("button");

            const isSelected =
                selected &&
                selected.probability === probability &&
                selected.consequence === consequence;


            button.type = "button";

            button.className =
                `matrix-cell ${risk.className}`;

            button.setAttribute(
                "aria-pressed",
                String(Boolean(isSelected))
            );

            button.setAttribute(
                "aria-label",
                `Probability ${getLevelLabel(probability)}, consequences ${getLevelLabel(consequence)}, ${risk.name} risk`
            );

            button.innerHTML = `
                <span class="cell-level">
                    ${risk.name}
                </span>

                <span class="cell-coordinates">
                    P${probability} × C${consequence}
                </span>
            `;


            button.addEventListener("click", function () {

                selectCell(probability, consequence);

            });


            matrixGrid.appendChild(button);

        }

    }


    // Selection status

    if (selected) {

        selectionStatus.textContent =
            `Selected: ${getLevelLabel(selected.probability)} / ${getLevelLabel(selected.consequence)}`;

        selectionStatus.classList.add("selected");

    } else {

        selectionStatus.textContent =
            "No square selected";

        selectionStatus.classList.remove("selected");

    }


    // Button state

    nextButton.disabled = !selected;

    nextButton.textContent =
        currentScenario === scenarios.length - 1
            ? "Finish exercise"
            : "Next scenario";

    selectionError.textContent = "";

    renderInstantFeedback(scenario, selected);

}


// ======================================
// INSTANT FEEDBACK (DEFAULT EXERCISE ONLY)
// ======================================

function renderInstantFeedback(scenario, selected) {

    // Custom exercises remain unchanged.
    if (!isDefaultExercise || !selected) {
        instantFeedback.style.display = "none";
        instantFeedbackText.textContent = "";
        return;
    }

    function getDimensionFeedback(
        dimension,
        selectedValue,
        suggestedValue,
        reason
    ) {
        const selectedLabel = getLevelLabel(selectedValue);
        const suggestedLabel = getLevelLabel(suggestedValue);

        if (selectedValue === suggestedValue) {
            return `Good ${dimension} choice (${selectedLabel}). This matches the suggested assessment. Why: ${reason}`;
        }

        if (selectedValue < suggestedValue) {
            return `${dimension.charAt(0).toUpperCase() + dimension.slice(1)} may be too low (${selectedLabel}; suggested: ${suggestedLabel}). Why: ${reason}`;
        }

        return `${dimension.charAt(0).toUpperCase() + dimension.slice(1)} may be too high (${selectedLabel}; suggested: ${suggestedLabel}). Why: ${reason}`;
    }

    const probabilityFeedback = getDimensionFeedback(
        "probability",
        selected.probability,
        scenario.answer.probability,
        scenario.probabilityReason
    );

    const consequenceFeedback = getDimensionFeedback(
        "consequence",
        selected.consequence,
        scenario.answer.consequence,
        scenario.consequenceReason
    );

    instantFeedbackText.innerHTML = "";

    const probabilityParagraph = document.createElement("p");
    probabilityParagraph.textContent = probabilityFeedback;

    const consequenceParagraph = document.createElement("p");
    consequenceParagraph.textContent = consequenceFeedback;

    instantFeedbackText.append(
        probabilityParagraph,
        consequenceParagraph
    );

    instantFeedback.style.display = "block";
}


// ======================================
// SELECT MATRIX CELL
// ======================================

function selectCell(probability, consequence) {

    selections[currentScenario] = {

        probability: probability,

        consequence: consequence

    };

    renderScenario();

}


// ======================================
// CLEAR SELECTION
// ======================================

function clearSelection() {

    selections[currentScenario] = null;

    renderScenario();

}


// ======================================
// NEXT SCENARIO
// ======================================

function goToNextScenario() {

    if (!selections[currentScenario]) {

        selectionError.textContent =
            "Please select a square before continuing.";

        return;

    }


    if (currentScenario < scenarios.length - 1) {

        currentScenario++;

        renderScenario();

        document.querySelector(".scenario-panel")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    } else {

        showResults();

    }

}


// ======================================
// DISPLAY FINAL RESULTS
// ======================================

function showResults() {

    matrixSection.classList.add("hidden");

    results.classList.remove("hidden");

    resultsList.innerHTML = "";

    let exactMatches = 0;


    scenarios.forEach(function (scenario, index) {

        const userChoice = selections[index];

        const suggested = scenario.answer;


        const userRisk = getRiskLevel(
            userChoice.probability,
            userChoice.consequence
        );

        const suggestedRisk = getRiskLevel(
            suggested.probability,
            suggested.consequence
        );


        // Check exact match

        const isMatch =
            userChoice.probability === suggested.probability &&
            userChoice.consequence === suggested.consequence;

        if (isMatch) {

            exactMatches++;

        }


        // Result card

        const article = document.createElement("article");

        article.className = "result-item";


        const heading = document.createElement("div");

        heading.className = "result-heading";


        const title = document.createElement("h3");

        title.textContent =
            `${index + 1}. ${scenario.title}`;


        const rating = document.createElement("span");

        rating.className =
            `result-rating ${userRisk.className}`;

        rating.textContent =
            `Your rating: ${userRisk.name}`;


        heading.append(title, rating);


        // User assessment

        const userText = document.createElement("p");

        userText.className = "result-choice";

        userText.textContent =
            `Your assessment: Probability – ${getLevelLabel(userChoice.probability)}; ` +
            `Consequences – ${getLevelLabel(userChoice.consequence)} ` +
            `(score ${userRisk.score}/16)`;


        // Suggested assessment

        const suggestedText = document.createElement("p");

        suggestedText.className = "result-choice";

        suggestedText.textContent =
            `Suggested assessment: Probability – ${getLevelLabel(suggested.probability)}; ` +
            `Consequences – ${getLevelLabel(suggested.consequence)} ` +
            `(${suggestedRisk.name}, score ${suggestedRisk.score}/16)`;


        // Explanation

        const explanation = document.createElement("p");

        explanation.className = "result-explanation";

        explanation.textContent = scenario.explanation;


        // Comparison

        const comparison = document.createElement("p");

        comparison.className = isMatch
            ? "result-comparison match"
            : "result-comparison different";

        comparison.textContent = isMatch
            ? "✓ Your assessment matches the suggested answer."
            : "↗ Your assessment differs from the suggested answer. Use the explanation as a starting point for discussion.";


        article.append(
            heading,
            userText,
            suggestedText,
            explanation,
            comparison
        );

        resultsList.appendChild(article);

    });


    // Summary

    summaryText.textContent =
        `You completed all ${scenarios.length} scenarios. Your assessment matched ${exactMatches} of ${scenarios.length} suggested answers exactly. The purpose is to practise structured judgement, not simply to get every answer right.`;


    results.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ======================================
// RESTART EXERCISE
// ======================================

function restartExercise() {

    currentScenario = 0;

    selections = Array(scenarios.length).fill(null);

    results.classList.add("hidden");

    matrixSection.classList.remove("hidden");

    renderScenario();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================
// EVENT LISTENERS
// ======================================

clearButton.addEventListener(
    "click",
    clearSelection
);

nextButton.addEventListener(
    "click",
    goToNextScenario
);

document.getElementById("restart-button")
    .addEventListener(
        "click",
        restartExercise
    );


// ======================================
// DOWNLOAD RESULTS BUTTON
// ======================================

const downloadResultsButton = document.createElement("button");
downloadResultsButton.type = "button";
downloadResultsButton.id = "download-results-button";
downloadResultsButton.className = "button primary";
downloadResultsButton.textContent = "Download Results";

const downloadResultsWrap = document.createElement("div");
downloadResultsWrap.className = "results-download-wrap";
downloadResultsWrap.appendChild(downloadResultsButton);
results.appendChild(downloadResultsWrap);

downloadResultsButton.addEventListener("click", downloadResultsAsPDF);

let jsPDFLoadPromise = null;

function loadJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) {
        return Promise.resolve(window.jspdf.jsPDF);
    }

    if (jsPDFLoadPromise) {
        return jsPDFLoadPromise;
    }

    jsPDFLoadPromise = new Promise(function (resolve, reject) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js";
        script.onload = function () {
            if (window.jspdf && window.jspdf.jsPDF) {
                resolve(window.jspdf.jsPDF);
            } else {
                reject(new Error("The PDF library did not load correctly."));
            }
        };
        script.onerror = function () {
            reject(new Error("The PDF library could not be loaded. Check your internet connection and try again."));
        };
        document.head.appendChild(script);
    });

    return jsPDFLoadPromise;
}

async function downloadResultsAsPDF() {
    if (!scenarios.length || selections.length !== scenarios.length || selections.some(function (choice) { return !choice; })) {
        alert("Please complete every scenario before downloading your results.");
        return;
    }

    const originalLabel = downloadResultsButton.textContent;
    downloadResultsButton.disabled = true;
    downloadResultsButton.textContent = "Preparing PDF...";

    try {
        const jsPDF = await loadJsPDF();
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 18;
        const contentWidth = pageWidth - margin * 2;
        let y = 20;
        let exactMatches = 0;

        function ensureSpace(heightNeeded) {
            if (y + heightNeeded > pageHeight - 18) {
                doc.addPage();
                y = 20;
            }
        }

        function addWrappedText(label, value, options) {
            const settings = options || {};
            const labelSize = settings.labelSize || 10;
            const bodySize = settings.bodySize || 10;
            const gapAfter = settings.gapAfter === undefined ? 4 : settings.gapAfter;

            if (label) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(labelSize);
                const labelLines = doc.splitTextToSize(label, contentWidth);
                ensureSpace(labelLines.length * 5 + 2);
                doc.text(labelLines, margin, y);
                y += labelLines.length * 5 + 1;
            }

            if (value) {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(bodySize);
                const bodyLines = doc.splitTextToSize(String(value), contentWidth);
                const lineHeight = bodySize * 0.48;
                for (let i = 0; i < bodyLines.length; i++) {
                    ensureSpace(lineHeight + 1);
                    doc.text(bodyLines[i], margin, y);
                    y += lineHeight;
                }
            }
            y += gapAfter;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(19);
        doc.text("Risk Assessment Exercise Results", margin, y);
        y += 9;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Completed: " + new Date().toLocaleString(), margin, y);
        y += 9;

        scenarios.forEach(function (scenario, index) {
            const choice = selections[index];
            const suggested = scenario.answer;
            const userRisk = getRiskLevel(choice.probability, choice.consequence);
            const suggestedRisk = getRiskLevel(suggested.probability, suggested.consequence);
            const isMatch = choice.probability === suggested.probability && choice.consequence === suggested.consequence;
            if (isMatch) exactMatches++;

            ensureSpace(18);
            doc.setDrawColor(210, 218, 225);
            doc.line(margin, y, pageWidth - margin, y);
            y += 7;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            const titleLines = doc.splitTextToSize((index + 1) + ". " + scenario.title, contentWidth);
            ensureSpace(titleLines.length * 6);
            doc.text(titleLines, margin, y);
            y += titleLines.length * 6 + 2;

            addWrappedText("Scenario", scenario.description, { bodySize: 9, gapAfter: 3 });
            addWrappedText("Your assessment",
                "Probability: " + getLevelLabel(choice.probability) + " | Consequences: " + getLevelLabel(choice.consequence) + " | Risk level: " + userRisk.name + " | Score: " + userRisk.score + "/16",
                { bodySize: 9, gapAfter: 3 });
            addWrappedText("Suggested assessment",
                "Probability: " + getLevelLabel(suggested.probability) + " | Consequences: " + getLevelLabel(suggested.consequence) + " | Risk level: " + suggestedRisk.name + " | Score: " + suggestedRisk.score + "/16",
                { bodySize: 9, gapAfter: 3 });
            addWrappedText("Feedback", scenario.explanation || "No additional feedback provided.", { bodySize: 9, gapAfter: 3 });
            addWrappedText("Comparison", isMatch
                ? "Your assessment matches the suggested answer."
                : "Your assessment differs from the suggested answer. Use the feedback as a starting point for discussion.",
                { bodySize: 9, gapAfter: 6 });
        });

        ensureSpace(22);
        doc.setDrawColor(210, 218, 225);
        doc.line(margin, y, pageWidth - margin, y);
        y += 7;
        addWrappedText("Overall summary",
            "You completed all " + scenarios.length + " scenarios. Your assessment matched " + exactMatches + " of " + scenarios.length + " suggested answers exactly. The purpose is to practise structured judgement, not simply to get every answer right.",
            { bodySize: 10, gapAfter: 2 });

        const pageCount = doc.getNumberOfPages();
        for (let page = 1; page <= pageCount; page++) {
            doc.setPage(page);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.text("Page " + page + " of " + pageCount, pageWidth - margin, pageHeight - 9, { align: "right" });
        }

        const dateStamp = new Date().toISOString().slice(0, 10);
        doc.save("risk-assessment-results-" + dateStamp + ".pdf");
    } catch (error) {
        console.error(error);
        alert("The PDF could not be created. Please check your internet connection and try again.");
    } finally {
        downloadResultsButton.disabled = false;
        downloadResultsButton.textContent = originalLabel;
    }
}


// ======================================
// INITIAL PAGE
// ======================================

showPage(welcomePage);