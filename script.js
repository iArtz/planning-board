let jobs = [];
let columns = [
  { id: "wait", name: "Wait" },
  { id: "urgent", name: "Urgent" },
  { id: "done", name: "Done" },
];

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

function addColumn() {
  const columnName = document.getElementById("column-name").value;
  if (columnName) {
    const columnId = columnName.toLowerCase().replace(/\s+/g, "-");
    columns.push({ id: columnId, name: columnName });
    renderColumns();
    document.getElementById("column-name").value = "";
  } else {
    alert("Please enter a column name");
  }
}

function renderColumns() {
  const kanbanBoard = document.getElementById("kanban-board");
  kanbanBoard.innerHTML = "";

  columns.forEach((column) => {
    const columnDiv = document.createElement("div");
    columnDiv.className = "kanban-column";
    columnDiv.id = column.id;
    columnDiv.ondrop = (e) => drop(e, column.id);
    columnDiv.ondragover = (e) => allowDrop(e);

    columnDiv.innerHTML = `
      <h2>${column.name}</h2>
      <div class="job-list" id="${column.id}-list"></div>
    `;

    kanbanBoard.appendChild(columnDiv);
  });

  createMockJobs();

  renderJobs();
}

function renderJobs() {
  columns.forEach((column) => {
    const jobList = document.getElementById(`${column.id}-list`);
    jobList.innerHTML = "";

    jobs
      .filter((job) => job.status === column.id)
      .forEach((job, index) => {
        const jobItem = document.createElement("div");
        jobItem.className = "job-item";
        jobItem.draggable = true;
        jobItem.ondragstart = (e) => dragStart(e, job.id);
        jobItem.ondragover = (e) => allowDrop(e);
        jobItem.ondragend = (e) => dragEnd(e);
        jobItem.ondrop = (e) => dropWithinColumn(e, index, column.id);

        jobItem.innerHTML = `
          <div>
            <h3>${job.title}</h3>
            <p>${job.description}</p>
          </div>
          <button onclick="editJob('${job.id}')">Edit</button>
        `;

        jobList.appendChild(jobItem);
      });
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

function dropWithinColumn(event, index, status) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text");
  const job = jobs.find((job) => job.id === id);
  const filteredJobs = jobs.filter((job) => job.status === status);

  if (job) {
    filteredJobs.splice(
      filteredJobs.findIndex((j) => j.id === job.id),
      1
    );
    filteredJobs.splice(index, 0, job);
    jobs = [...jobs.filter((job) => job.status !== status), ...filteredJobs];
    renderJobs();
  }
}

function createMockJobs() {
  mock = [
    {
      id: Date.now().toString(),
      title: "SQXX2406-0001",
      description: "Ex D",
      status: "wait",
    },
    {
      id: Date.now().toString(),
      title: "SQXX2406-0002",
      description: "3 Phase",
      status: "wait",
    },
  ];

  mock.map((job) => jobs.push(job));
}

document.addEventListener("DOMContentLoaded", renderColumns);
