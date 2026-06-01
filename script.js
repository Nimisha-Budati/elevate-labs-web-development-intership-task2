const taskInput=document.getElementById("taskInput");
const addBtn=document.getElementById("addBtn");
const pendingList=document.getElementById("pendingList");
const completedList=document.getElementById("completedList");
const taskStats=document.getElementById("taskStats");
const clearBtn=document.getElementById("clearBtn");
const searchInput=document.getElementById("searchInput");
const currentDate=document.getElementById("currentDate");
const emptyMsg=document.getElementById("emptyMsg");
if(taskInput){
    displayDate();
    loadTasks();
    addBtn.addEventListener("click",addTask);
    taskInput.addEventListener("keypress",(e)=>{
        if(e.key==="Enter"){
            addTask();
        }
    });
    clearBtn.addEventListener("click",()=>{
        if(confirm("Clear all tasks?")){
            pendingList.innerHTML="";
            completedList.innerHTML="";
            updateStats();
            saveTasks();
        }
    });
    searchInput.addEventListener("keyup",searchTasks);
    function addTask(){
        const text=taskInput.value.trim();
        if(!text){
            alert("Enter a task!");
            return;
        }
        createTask(text,false);
        taskInput.value="";
        updateStats();
        saveTasks();
    }
    function createTask(text,done){
        const li=document.createElement("li");
        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.checked=done;
        const span=document.createElement("span");
        span.textContent=text;
        span.className=done?"completed":"pending";
        const btns=document.createElement("div");
        btns.className="button-group";
        const edit=document.createElement("button");
        edit.textContent="Edit";
        edit.className="edit-btn";
        const del=document.createElement("button");
        del.textContent="Delete";
        del.className="delete-btn";
        edit.onclick=()=>{
            const val=prompt("Edit task",span.textContent);
            if(val&&val.trim()!==""){
                span.textContent=val.trim();
                saveTasks();
            }
        };
        del.onclick=()=>{
            li.remove();
            updateStats();
            saveTasks();
        };
        checkbox.onchange=()=>{
            if(checkbox.checked){
                span.classList.replace("pending","completed");
                completedList.appendChild(li);
            }else{
                span.classList.replace("completed","pending");
                pendingList.appendChild(li);
            }
            updateStats();
            saveTasks();
        };
        btns.append(edit,del);
        li.append(checkbox,span,btns);
        if(done){
            completedList.appendChild(li);
        }else{
            pendingList.appendChild(li);
        }
    }
    function updateStats(){
        const pendingCount=pendingList.children.length;
        const completedCount=completedList.children.length;
        taskStats.textContent=`Pending: ${pendingCount} | Completed: ${completedCount}`;
        if(emptyMsg){
            if(pendingCount+completedCount===0){
                emptyMsg.style.display="block";
            }else{
                emptyMsg.style.display="none";
            }
        }
    }
    function searchTasks(){
        const value=searchInput.value.toLowerCase();
        document.querySelectorAll("li").forEach((li)=>{
            const text=li.querySelector("span").textContent.toLowerCase();
            li.style.display=text.includes(value)?"flex":"none";
        });
    }
    function displayDate(){
        const date=new Date();
        currentDate.textContent=date.toDateString();
    }
    function saveTasks(){
        const tasks=[];
        document.querySelectorAll("#pendingList li span").forEach((span)=>{
            tasks.push({
                text:span.textContent,
                done:false
            });
        });
        document.querySelectorAll("#completedList li span").forEach((span)=>{
            tasks.push({
                text:span.textContent,
                done:true
            });
        });
        localStorage.setItem("taskflow",JSON.stringify(tasks));
    }
    function loadTasks(){
        const data=JSON.parse(localStorage.getItem("taskflow"))||[];
        data.forEach((task)=>{
            createTask(task.text,task.done);
        });
        updateStats();
    }
}