/* Project data — ALL TEXT BELOW IS PLACEHOLDER CONCEPT TEXT and the images are generic illustrations, not real product screenshots.
   To add real artwork, set image: "assets/images/your-file.jpg" (relative path, no leading slash).
   Leave image empty to show the generated placeholder. */
(function () {
  const tpl = (o) => Object.assign({
    image: "", imageAlt: "", gallery: ["", ""],
    overview: "Placeholder overview. Describe the project in two or three sentences.",
    problem: "Placeholder problem statement. What was hard, slow or confusing for users?",
    role: "Placeholder role. Describe what you personally did.",
    process: ["Research and discovery", "Workflow mapping", "Wireframes and prototype", "Review and iteration"],
    decisions: ["Placeholder decision one and why it was made", "Placeholder decision two and why it was made"],
    outcome: "Placeholder outcome. Add verified results only."
  }, o);
  window.PROJECTS = [
    tpl({ id: "wms-experience", title: "Warehouse Management System Experience", category: "Workflow & operational UX", year: "2025", accent: "#79C2B5", image: "assets/images/warehouse.svg", imageAlt: "Illustration of warehouse shelves with boxes", gallery: ["assets/images/laptop.svg", "assets/images/phone.svg"],
      summary: "Concept for simplifying picking, putaway and exception handling screens." }),
    tpl({ id: "integration-dashboard", title: "Supply Chain Integration Dashboard", category: "Systems & data visualisation", year: "2025", accent: "#BCA9EC", image: "assets/images/laptop.svg", imageAlt: "Illustration of a laptop showing an app interface", gallery: ["assets/images/dashboard.svg", "assets/images/sql.svg"],
      summary: "Concept for monitoring system-to-system integrations at a glance." }),
    tpl({ id: "problem-portal", title: "Problem Management Portal", category: "Incident investigation & workflow", year: "2025", accent: "#EFC25A", image: "assets/images/kanban.svg", imageAlt: "Illustration of a kanban board with sticky notes", gallery: ["assets/images/laptop.svg", "assets/images/flow.svg"],
      summary: "Concept for tracking incidents from report to root cause." }),
    tpl({ id: "procurement-flow", title: "Procurement Workflow Optimisation", category: "Process & user journey", year: "2024", accent: "#F08A6C", image: "assets/images/flow.svg", imageAlt: "Illustration of a process flowchart", gallery: ["assets/images/kanban.svg", "assets/images/phone.svg"],
      summary: "Concept for a clearer request, approval and order journey." }),
    tpl({ id: "analytics-dashboard", title: "Data Analytics Dashboard", category: "SQL-driven insights & KPIs", year: "2024", accent: "#79C2B5", image: "assets/images/dashboard.svg", imageAlt: "Illustration of a data dashboard with charts", gallery: ["assets/images/sql.svg", "assets/images/laptop.svg"],
      summary: "Concept for turning SQL results into readable KPI views." }),
    tpl({ id: "automation-experience", title: "Automation Workflow Experience", category: "Automation & efficiency", year: "2023", accent: "#BCA9EC", image: "assets/images/sql.svg", imageAlt: "Illustration of a SQL query and results", gallery: ["assets/images/flow.svg", "assets/images/dashboard.svg"],
      summary: "Concept for reducing manual steps with guided automation." })
  ];
})();
