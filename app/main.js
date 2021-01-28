const electron = require("electron");
const {
    ipcRenderer
} = electron;
const heyplay = {
    log () {
        console.log("[Hey-Play] ", ...arguments);
    },
    window: {
        operate (operationName){
            heyplay.log("窗口操作:", operationName);
            switch (operationName) {
                case "minimize":
                case "windowize":
                case "maximize":
                case "close":
                    ipcRenderer.send("windowOpeation", operationName);
                    break;
                default:
                    return;
                    break;
            };
        },
        onLoad (){
            heyplay.log("loaded");

            window.removeEventListener("load", heyplay.window.onLoad);
        },
        onDOMContentLoad () {
            ipcRenderer.on("windowState", function (event, arg) {
                heyplay.log("主进程传入窗口状态", arg);
                switch (arg) {
                    case "windowized":
                        document.getElementById("maximize").style.display = "";
                        document.getElementById("windowize").style.display = "none";
                        break;
                    case "maximized":
                        document.getElementById("maximize").style.display = "none";
                        document.getElementById("windowize").style.display = "";
                        break;
                    default:
                        break;
                }
            });
            document.getElementById("app-window-operations").addEventListener("click", function (event) {
                heyplay.log("窗口操作栏已点击", event.target.id);
                heyplay.window.operate(event.target.id);
            });

            heyplay.log("DOM loaded");
            window.removeEventListener("DOMContentLoaded", heyplay.window.onDOMContentLoad);
        }
    },
};
window.addEventListener("load", heyplay.window.onLoad);
window.addEventListener("DOMContentLoaded", heyplay.window.onDOMContentLoad);