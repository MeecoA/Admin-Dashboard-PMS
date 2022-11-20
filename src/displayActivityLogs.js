import * as fire from "./index";

async function displayActivityLogs(currentLoggedUserId) {
  const colRef = fire.myCollection(fire.db, "system-activity");
  const activityQuery = fire.doQuery(colRef, fire.doLimit(10));
  const docsSnap = await fire.myGetDocs(activityQuery);

  let index = 0;
  let activity = [];
  docsSnap.forEach(async (doc) => {
    index = index + 1;
    let activityInformation = { ...doc.data() };

    let objSize = Object.keys(activityInformation).length;
    Object.entries(activityInformation).map((element, index) => {
      if (objSize - 1 !== index) {
        element[1]["timestamp"] =
          element[1]["timestamp"] === ""
            ? ""
            : new Date(element[1]["timestamp"]).toLocaleString("en-GB", { timeZone: "UTC" });
        element[1]["id"] = index;
        activity.push(element[1]);
      }
    });

    // console.log('activityInformation', activityInformation);
    console.table(activity);
  });

  jQuery((e) => {
    $("#table_id_activity").DataTable({
      scrollX: true,
      pageLength: 10,
      data: activity,
      columns: [
        { data: "id" },
        { data: "uid" },
        { data: "user_level" },
        { data: "timestamp" },
        { data: "current_page" },
        { data: "context" },
      ],
      columnDefs: [
        {
          defaultContent: "-",
          targets: "_all",
        },
      ],
    });
  }); //jQuery
}

displayActivityLogs(currentLoggedUserId);
