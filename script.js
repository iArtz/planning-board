let jobs = [];

function addJob() {
  const title = document.getElementById("job-title").value;
  const description = document.getElementById("job-description").value;

  if (title && description) {
    const job = {
      id: Date.now().toString(),
      title,
      description,
      status: "wait",
    };

    jobs.push(job);
    renderJobs();
    clearForm();
  } else {
    alert("Please fill in all fields");
  }
}

function clearForm() {
  document.getElementById("job-title").value = "";
  document.getElementById("job-description").value = "";
}

function renderJobs() {
  const waitList = document.getElementById("wait-list");
  const urgentList = document.getElementById("urgent-list");
  const doneList = document.getElementById("done-list");

  waitList.innerHTML = "";
  urgentList.innerHTML = "";
  doneList.innerHTML = "";

  jobs.forEach((job) => {
    const jobItem = document.createElement("div");
    jobItem.className = "job-item";
    jobItem.draggable = true;
    jobItem.ondragstart = (e) => dragStart(e, job.id);
    jobItem.ondragend = (e) => dragEnd(e);

    jobItem.innerHTML = `
      <div>
        <h3>${job.title}</h3>
        <p>${job.description}</p>
      </div>
      <button onclick="editJob('${job.id}')">Edit</button>
    `;

    if (job.status === "wait") {
      waitList.appendChild(jobItem);
    } else if (job.status === "urgent") {
      urgentList.appendChild(jobItem);
    } else if (job.status === "done") {
      doneList.appendChild(jobItem);
    }
  });
}

function editJob(id) {
  const job = jobs.find((job) => job.id === id);
  if (job) {
    const newTitle = prompt("Enter new job title", job.title);
    const newDescription = prompt("Enter new job description", job.description);

    if (newTitle && newDescription) {
      job.title = newTitle;
      job.description = newDescription;
      renderJobs();
    }
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function dragStart(event, id) {
  event.dataTransfer.setData("text/plain", id);
  setTimeout(() => {
    event.target.classList.add("dragging");
  }, 0);
}

function dragEnd(event) {
  event.target.classList.remove("dragging");
}

function drop(event, status) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text");
  const job = jobs.find((job) => job.id === id);
  if (job) {
    job.status = status;
    renderJobs();
  }
}

document.addEventListener("DOMContentLoaded", renderJobs);
