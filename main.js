const myApp = "https://script.google.com/macros/s/AKfycbxReyUtjtKLv1l3ycsex_ozJ--AphDLQbGmxw_8T_37m6AJX-16EXo00tR-bOlSiosLqA/exec"; // URL нашего приложения
const tasks = "1fbfPhUc3brlOMU_aaVwUsXnRItLlJO4emw6id4olG-Y"; // уникальный идентификатор нашей таблицы

$(document).ready(function () {
    loadTasks();
    $("#taskListForm").on("change", function (e) {
        loadTasks();
    });

    $("#commonModal").on("hidden.bs.modal", function (e) {
        $(".modal-title, .modal-body, .modal-footer, .alert-area").html("");
    });
});

function loadTasks() {
    const where = $("#onlyInLine").prop("checked") ? "WHERE C = 0" : "";
    googleQuery(tasks, "0", "A:C", `SELECT * ${where} ORDER BY A LIMIT 100`);
}

function googleQuery(sheet_id, sheet, range, query) {
    google.charts.load("45", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(queryTable);

    function queryTable() {
        const opts = { sendMethod: "auto" };
        const gquery = new google.visualization.Query(
            `https://docs.google.com/spreadsheets/d/${sheet_id}/gviz/tq?gid=${sheet}&range=${range}&headers=1&tq=${query}`,
            opts
        );
        gquery.send(callback);
    }

    function callback(e) {
        if (e.isError()) {
            console.log(`Error in query: ${e.getMessage()} ${e.getDetailedMessage()}`);
            return;
        }

        const data = e.getDataTable();
        tasksTable(data);
    }
}

function getTasks() {
    const action = "getTasks";
    const url = `${myApp}?action=${action}`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.response);
            tasksTable(data);
        }
    };
    try {
        xhr.send();
    } catch (err) {
        console.log(err);
    }
}

function tasksTable(data) {
    $("#tasksTableDiv").html(() => {
        const topic_name = [];
        const topic_id = [];

        for (let i = 0; i < data.Tf.length; i++) {
            if (!topic_name.includes(data.Tf[i].c[1].v)) {
                topic_name.push(data.Tf[i].c[1].v);
                topic_id.push(data.Tf[i].c[0].v);
            }
            console.log(topic_name);
            console.log(topic_id);
        }
	test = "test"
	x=''
		for ( i = 0; i < topic_name.length; i++  ) {
			body_lesson = ''
			for ( j = 0; j < data.Tf.length; j++ ) {
				if (data.Tf[j].c[1].v==topic_name[i]){
					body_lesson+=


					`<div class="col-xl-4">
				<div class="card text-center">
				  <div class="card-header">
					Featured
				  </div>
				  <div class="card-body">
					<h5 class="card-title">Special title treatment</h5>
					<p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
					<!-- Кнопка-триггер модального окна -->
	<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style="width: 100% !important;">
	${data.Tf[j].c[4]}
	</button>
	
	<!-- Модальное окно -->
	<div class="container-fluid" style="margin-top: 10px;">
	  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
		<div class="modal-dialog modal-fullscreen modal-dialog-centered modal-dialog-scrollable">
		  <div class="modal-content">
			<div class="modal-header">
			  <h1 class="modal-title fs-5" id="staticBackdropLabel">Заголовок модального окна</h1>
			  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
			</div>
			<div class="modal-body">
			  <div align="left">
				<pre style="margin-bottom: 0; width: auto;">
				  </pre>
				</div>
			</div>
			<div class="modal-footer">
			  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
			  <button type="button" class="btn btn-primary">Понял</button>
			</div>
		  </div>
		</div>
	  </div></div>
				  </div>
				  <div class="card-footer text-body-secondary">
					2 days ago
				  </div>
				</div>
			  </div>`





				}
			}



						x+= `
		
		<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#${topic_id[i]}" aria-expanded="false" aria-controls="collapseExample" style="width: 100%;">
        ${topic_name[i]}
      </button>
    </p>
    <div class="collapse" id="${topic_id[i]}">
      <div class="card card-body">
        <div class="row">${body_lesson}</div>
      </div>      
    </div>`
			
		
	
}

	return x;
	})
}

//${data.Tf[i].c[1].v}


gapi.load('client', () => {
  gapi.client.init({
    apiKey: 'API',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(() => {
    // указываем идентификатор
    const spreadsheetId = 'ID';

    // указываем диапазон ячеек
    const range = 'Sheet1!A1:C3';

    // загружаем данные из Google Таблицы
    gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    }).then((response) => {
      const data = response.result.values;

      // проходимся по каждому элементу массива и обновляем
      data.forEach((row) => {
        const fileName = row[0];
        const fileUrl = row[1];
        const fileVersion = row[2];

        fetch(fileUrl)
          .then((response) => response.text())
          .then((text) => {

            console.log(`File ${fileName} has been updated.`);
          })
          .catch((error) => {
            console.error(`Error updating file ${fileName}:`, error);
          });
      });
    });
  });
});







